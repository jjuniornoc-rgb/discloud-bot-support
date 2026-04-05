import { createHash } from 'crypto';
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { log } from '../utils/logger';

export type Interaction = {
    id: string;
    timestamp: string;
    userHash: string;
    channelId: string;
    guildId: string;
    userMessage: string;
    detectedLanguage: string;
    detectedIntent: boolean;
    relevantDocsFound: string[];
    botResponse: string;
    responseTimeMs: number;
    feedback: 'positive' | 'negative' | 'none';
    feedbackTimestamp?: string;
    modelUsed?: string;
};

const SALT = 'discloud-ai-bot-v1';
const LOG_DIR = join(process.cwd(), 'training', 'logs');

function hashUserId(userId: string): string {
    return createHash('sha256').update(userId + SALT).digest('hex').substring(0, 16);
}

function getLogFilePath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return join(LOG_DIR, `${year}-${month}.jsonl`);
}

function ensureLogDir(): void {
    if (!existsSync(LOG_DIR)) {
        mkdirSync(LOG_DIR, { recursive: true });
    }
}

let interactionCounter = 0;

function generateId(): string {
    interactionCounter++;
    const ts = Date.now().toString(36);
    const counter = interactionCounter.toString(36).padStart(4, '0');
    return `int-${ts}-${counter}`;
}

export function logInteraction(params: {
    userId: string;
    channelId: string;
    guildId: string;
    userMessage: string;
    detectedLanguage: string;
    relevantDocsFound: string[];
    botResponse: string;
    responseTimeMs: number;
    modelUsed?: string;
}): string {
    const id = generateId();

    const interaction: Interaction = {
        id,
        timestamp: new Date().toISOString(),
        userHash: hashUserId(params.userId),
        channelId: params.channelId,
        guildId: params.guildId,
        userMessage: params.userMessage,
        detectedLanguage: params.detectedLanguage,
        detectedIntent: true,
        relevantDocsFound: params.relevantDocsFound,
        botResponse: params.botResponse,
        responseTimeMs: params.responseTimeMs,
        feedback: 'none',
    };

    if (params.modelUsed) {
        interaction.modelUsed = params.modelUsed;
    }

    try {
        ensureLogDir();
        const filePath = getLogFilePath();
        appendFileSync(filePath, JSON.stringify(interaction) + '\n', 'utf-8');
        log('INFO', `[Training] Interação ${id} logada`);
    } catch (err) {
        log('ERROR', `[Training] Falha ao salvar interação: ${err instanceof Error ? err.message : String(err)}`);
    }

    return id;
}

export function updateFeedback(interactionId: string, feedback: 'positive' | 'negative'): void {
    const feedbackEntry = {
        interactionId,
        feedback,
        timestamp: new Date().toISOString(),
    };

    try {
        ensureLogDir();
        const filePath = join(LOG_DIR, 'feedback.jsonl');
        appendFileSync(filePath, JSON.stringify(feedbackEntry) + '\n', 'utf-8');
        log('INFO', `[Training] Feedback ${feedback} registrado para ${interactionId}`);
    } catch (err) {
        log('ERROR', `[Training] Falha ao salvar feedback: ${err instanceof Error ? err.message : String(err)}`);
    }
}
