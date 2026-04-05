import { DocTopic } from '../docs/topics';
import { selectExamples } from '../training/examples';

export function buildSystemPrompt(language: string, relevantDocs: DocTopic[], userQuery?: string): string {
    const langMap: Record<string, string> = {
        pt: 'Português',
        en: 'English',
        es: 'Español',
        other: 'English',
    };

    const langLabel = langMap[language] ?? 'English';

    let prompt = `Você é um especialista na plataforma Discloud que ajuda usuários no Discord.

Regras obrigatórias:
- Responda de forma natural e direta, como um usuário experiente no servidor, não como um bot
- NÃO use headers markdown (##, ###) nem listas longas com bullet points
- NÃO mencione que é uma IA ou assistente a menos que seja explicitamente perguntado
- Se souber a URL da documentação relevante, inclua-a no final da mensagem de forma natural
- Responda em no máximo 1800 caracteres
- Responda SEMPRE em ${langLabel}`;

    if (relevantDocs.length > 0) {
        prompt += '\n\nDocumentação relevante para esta pergunta:\n';
        for (const doc of relevantDocs) {
            prompt += `\n${doc.title}: ${language === 'en' ? doc.summaryEn : doc.summary} — ${doc.url}`;
        }
    }

    // Few-shot: injetar exemplos de respostas ideais para guiar o tom e formato
    if (userQuery) {
        const examples = selectExamples(userQuery, language, 3);
        if (examples.length > 0) {
            prompt += '\n\nExemplos de como você deve responder (use como referência de tom e formato):\n';
            for (const ex of examples) {
                prompt += `\nPergunta: "${ex.question}"\nResposta: "${ex.idealResponse}"\n`;
            }
        }
    }

    return prompt;
}
