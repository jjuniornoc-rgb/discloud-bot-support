import { Message } from 'discord.js';
import { config } from '../config';

export function isBot(message: Message): boolean {
    return message.author.bot;
}

export function isAllowedChannel(message: Message): boolean {
    if (config.ALLOWED_CHANNEL_IDS.length === 0) return true;
    return config.ALLOWED_CHANNEL_IDS.includes(message.channelId);
}

export function isAllowedGuild(message: Message): boolean {
    if (config.ALLOWED_GUILD_IDS.length === 0) return true;
    if (!message.guildId) return false;
    return config.ALLOWED_GUILD_IDS.includes(message.guildId);
}
