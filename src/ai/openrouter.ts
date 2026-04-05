import { config } from '../config';
import { log } from '../utils/logger';

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

const MODEL_FALLBACK_CHAIN: string[] = [
    'qwen/qwen3.6-plus:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'nvidia/nemotron-3-super-120b-a12b:free',
    'stepfun/step-3.5-flash:free',
    'openrouter/auto',
];

const TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS_PER_MODEL = 2;

const BACKOFF = {
    RATE_LIMIT: [8_000, 20_000],
    SERVER_ERROR: [2_000, 5_000],
    GENERIC: [1_000, 2_000],
} as const;

type FailureKind = keyof typeof BACKOFF | 'SKIP_NOW';

const INCOMPATIBILITY_MARKERS = [
    'instruction is not enabled',
    'system role not supported',
    'is not a valid model',
    'model not found',
];

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function classifyError(status: number, body: string): FailureKind {
    if (status === 404 || status === 401 || status === 403) return 'SKIP_NOW';
    if (status === 400 && INCOMPATIBILITY_MARKERS.some(m => body.toLowerCase().includes(m))) return 'SKIP_NOW';
    if (status === 429) return 'RATE_LIMIT';
    if (status >= 500) return 'SERVER_ERROR';
    return 'GENERIC';
}

type ModelAttemptResult =
    | { ok: true; content: string }
    | { ok: false; rateLimited: boolean; error: string };

async function tryModel(
    model: string,
    messages: ChatMessage[],
): Promise<ModelAttemptResult> {
    let lastError = '';

    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
        log('INFO', `[OpenRouter] ${model} — tentativa ${attempt}/${MAX_ATTEMPTS_PER_MODEL}`);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://github.com/discloud/docs',
                    'X-Title': 'Discloud Support Bot',
                },
                body: JSON.stringify({
                    model,
                    messages,
                    max_tokens: 800,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const body = await response.text();
                const kind = classifyError(response.status, body);
                lastError = `HTTP ${response.status}: ${body}`;

                log('WARN', `[OpenRouter] ${model} falhou (${kind}): ${lastError}`);

                if (kind === 'SKIP_NOW') {
                    return { ok: false, rateLimited: false, error: lastError };
                }

                if (response.status === 429) {
                    return { ok: false, rateLimited: true, error: lastError };
                }

                if (attempt < MAX_ATTEMPTS_PER_MODEL) {
                    const delay = BACKOFF[kind][attempt - 1];
                    log('INFO', `[OpenRouter] Aguardando ${delay}ms antes de tentar novamente...`);
                    await sleep(delay);
                }

                continue;
            }

            const data = await response.json() as {
                choices: Array<{ message: { content: string } }>;
            };

            const content = data.choices?.[0]?.message?.content?.trim();
            if (!content) {
                lastError = 'Resposta vazia da API';
                log('WARN', `[OpenRouter] ${model} retornou conteúdo vazio`);
                continue;
            }

            log('INFO', `[OpenRouter] Resposta recebida via ${model} (${content.length} chars)`);
            return { ok: true, content };

        } catch (err) {
            const isTimeout = err instanceof Error && err.name === 'AbortError';
            lastError = isTimeout ? 'Timeout (30s)' : String(err);
            log('WARN', `[OpenRouter] ${model} erro inesperado: ${lastError}`);

            if (attempt < MAX_ATTEMPTS_PER_MODEL) {
                await sleep(BACKOFF.GENERIC[attempt - 1]);
            }
        }
    }

    return { ok: false, rateLimited: false, error: lastError };
}

export async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
    const attempted: string[] = [];

    for (const model of MODEL_FALLBACK_CHAIN) {
        attempted.push(model);
        const result = await tryModel(model, messages);

        if (result.ok) {
            if (attempted.length > 1) {
                log('INFO', `[OpenRouter] Fallback bem-sucedido: ${model} (após ${attempted.length - 1} falha(s))`);
            }
            return result.content;
        }

        if (result.rateLimited) {
            log('WARN', `[OpenRouter] ${model} rate-limited, tentando próximo modelo...`);
            await sleep(1_500);
            continue;
        }

        log('WARN', `[OpenRouter] ${model} falhou, tentando próximo...`);
        await sleep(1_000);
    }

    log('ERROR', `[OpenRouter] Todos os modelos falharam. Cadeia tentada: ${attempted.join(' → ')}`);
    throw new OpenRouterExhaustedError(attempted);
}

export class OpenRouterExhaustedError extends Error {
    public readonly modelsTried: string[];

    constructor(modelsTried: string[]) {
        super(`Todos os modelos da cadeia falharam: ${modelsTried.join(', ')}`);
        this.name = 'OpenRouterExhaustedError';
        this.modelsTried = modelsTried;
    }
}
