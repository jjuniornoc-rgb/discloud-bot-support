import { Message } from 'discord.js';
import { isBot, isAllowedChannel, isAllowedGuild } from '../filters';
import { log } from '../../utils/logger';
import { detectHelpIntent } from '../../utils/detectIntent';
import { isOnCooldown, setCooldown } from '../../utils/cooldown';
import { processHelpRequest } from '../../ai/agent';

export async function onMessageCreate(message: Message): Promise<void> {

    if (isBot(message)) return;
    if (!isAllowedGuild(message)) return;
    if (!isAllowedChannel(message)) return;

    const preview = message.content.substring(0, 60).replace(/\n/g, ' ');
    log('INFO', `[${message.guild?.name ?? 'DM'}] #${(message.channel as { name?: string }).name ?? message.channelId} | ${message.author.tag}: ${preview}`);

    if (!detectHelpIntent(message.content)) return;

    if (isOnCooldown(message.author.id)) {
        log('INFO', `[Cooldown] Ignorando ${message.author.tag} — em cooldown`);
        return;
    }

    setCooldown(message.author.id);

    try {
        await processHelpRequest(message, message.content);
    } catch (err) {
        log('ERROR', `[Agent] Falha ao processar pedido: ${err instanceof Error ? err.message : String(err)}`);
    }
}
