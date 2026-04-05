import { Message } from 'discord.js';
import { findRelevantDocs } from '../docs/knowledge';
import { callOpenRouter, OpenRouterExhaustedError, ChatMessage } from './openrouter';
import { buildSystemPrompt } from './prompts';
import { addMessage, getHistory } from './history';
import { detectLanguage } from '../utils/detectLanguage';
import { sendNaturalReply } from '../utils/reply';
import { logInteraction } from '../training/interactionLogger';
import { trackBotMessage } from '../training/feedbackHandler';
import { log } from '../utils/logger';

const UNAVAILABLE_MESSAGES: Record<string, string> = {
    pt: 'poxa, tô com problema pra acessar a IA agora. dá uma olhada direto na documentação: https://docs.discloud.com/ — provavelmente tem o que você precisa por lá',
    en: 'sorry, having trouble reaching the AI right now. check the docs directly: https://docs.discloud.com/ — you should find what you need there',
    es: 'perdón, estoy teniendo problemas para acceder a la IA ahora. mira la documentación directamente: https://docs.discloud.com/',
};

export async function processHelpRequest(
    message: Message,
    userText: string,
): Promise<void> {
    const startTime = Date.now();
    const channelId = message.channelId;
    const language = detectLanguage(userText);

    const relevantDocs = findRelevantDocs(userText);
    log('INFO', `[Agent] Docs relevantes encontrados: ${relevantDocs.map(d => d.id).join(', ') || 'nenhum'}`);

    const systemPrompt = buildSystemPrompt(language, relevantDocs, userText);
    const history = getHistory(channelId);

    const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: userText },
    ];

    try {
        const response = await callOpenRouter(messages);
        const responseTimeMs = Date.now() - startTime;

        addMessage(channelId, 'user', userText);
        addMessage(channelId, 'assistant', response);

        log('INFO', `[Agent] Resposta gerada (${response.length} chars, ${responseTimeMs}ms) para ${message.author.tag}`);

        const botMessages = await sendNaturalReply(message, response);

        const interactionId = logInteraction({
            userId: message.author.id,
            channelId,
            guildId: message.guildId ?? 'DM',
            userMessage: userText,
            detectedLanguage: language,
            relevantDocsFound: relevantDocs.map(d => d.id),
            botResponse: response,
            responseTimeMs,
        });

        if (botMessages.length > 0) {
            const lastBotMsg = botMessages[botMessages.length - 1];
            trackBotMessage(lastBotMsg.id, interactionId);

            try {
                await lastBotMsg.react('✅');
                await lastBotMsg.react('❌');
            } catch (err) {
                log('WARN', `[Feedback] Falha ao adicionar reações: ${err instanceof Error ? err.message : String(err)}`);
            }
        }
    } catch (err) {
        if (err instanceof OpenRouterExhaustedError) {
            const fallbackMsg = UNAVAILABLE_MESSAGES[language] ?? UNAVAILABLE_MESSAGES['en'];
            await sendNaturalReply(message, fallbackMsg);
        } else {
            throw err;
        }
    }
}
