import { ChatMessage } from './openrouter';
import { config } from '../config';

type ChannelHistory = {
    messages: ChatMessage[];
    lastActivity: number;
};

const historyMap = new Map<string, ChannelHistory>();
const INACTIVE_THRESHOLD_MS = 60 * 60 * 1000;

export function addMessage(channelId: string, role: ChatMessage['role'], content: string): void {
    const entry = historyMap.get(channelId) ?? { messages: [], lastActivity: Date.now() };
    entry.messages.push({ role, content });
    entry.lastActivity = Date.now();

    if (entry.messages.length > config.MAX_HISTORY_MESSAGES) {
        entry.messages = entry.messages.slice(-config.MAX_HISTORY_MESSAGES);
    }

    historyMap.set(channelId, entry);
}

export function getHistory(channelId: string): ChatMessage[] {
    return historyMap.get(channelId)?.messages ?? [];
}

function clearInactiveChannels(): void {
    const now = Date.now();
    for (const [channelId, entry] of historyMap.entries()) {
        if (now - entry.lastActivity > INACTIVE_THRESHOLD_MS) {
            historyMap.delete(channelId);
        }
    }
}

setInterval(clearInactiveChannels, INACTIVE_THRESHOLD_MS);