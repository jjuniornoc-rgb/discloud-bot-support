import { MessageReaction, User, PartialMessageReaction, PartialUser } from 'discord.js';
import { updateFeedback } from './interactionLogger';
import { log } from '../utils/logger';
import { config } from '../config';
import client from '../bot/client';

const messageToInteraction = new Map<string, string>();

const MAX_ENTRIES = 5000;
const CLEANUP_INTERVAL = 30 * 60 * 1000;

setInterval(() => {
    if (messageToInteraction.size > MAX_ENTRIES) {
        const entries = Array.from(messageToInteraction.keys());
        const toDelete = entries.slice(0, entries.length - MAX_ENTRIES);
        for (const key of toDelete) {
            messageToInteraction.delete(key);
        }
        log('INFO', `[Feedback] Limpeza: removidas ${toDelete.length} entradas antigas`);
    }
}, CLEANUP_INTERVAL);

export function trackBotMessage(botMessageId: string, interactionId: string): void {
    messageToInteraction.set(botMessageId, interactionId);
}

export async function handleReactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
): Promise<void> {

    if (user.bot) return;

    const interactionId = messageToInteraction.get(reaction.message.id);
    if (!interactionId) return;

    const emoji = reaction.emoji.name;
    if (emoji !== '✅' && emoji !== '❌') return;

    const feedback = emoji === '✅' ? 'positive' : 'negative';
    updateFeedback(interactionId, feedback);

    if (feedback === 'negative' && config.STAFF_USER_ID) {
        await notifyStaff(interactionId, reaction);
    }
}

async function notifyStaff(
    interactionId: string,
    reaction: MessageReaction | PartialMessageReaction,
): Promise<void> {
    try {
        const staffUser = await client.users.fetch(config.STAFF_USER_ID);
        const originalMessage = reaction.message;

        let userQuestion = '(não encontrada)';
        try {
            if (originalMessage.reference?.messageId) {
                const refMsg = await originalMessage.channel.messages.fetch(originalMessage.reference.messageId);
                userQuestion = refMsg.content.substring(0, 200);
            }
        } catch {
            }

        const botResponse = (originalMessage.content ?? '').substring(0, 300);
        const channelName = (originalMessage.channel as { name?: string }).name ?? originalMessage.channelId;

        await staffUser.send(
            `⚠️ **Feedback negativo** no #${channelName}\n\n` +
            `**ID:** ${interactionId}\n` +
            `**Resposta do bot:**\n${botResponse}${botResponse.length >= 300 ? '...' : ''}\n\n` +
            `Analise a interação nos logs de treinamento.`
        );

        log('INFO', `[Feedback] Staff notificado sobre feedback negativo: ${interactionId}`);
    } catch (err) {
        log('WARN', `[Feedback] Falha ao notificar staff: ${err instanceof Error ? err.message : String(err)}`);
    }
}
