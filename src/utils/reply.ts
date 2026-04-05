import { Message, TextBasedChannel } from 'discord.js';

export function cleanResponse(text: string): string {
    return text
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*{3}(.+?)\*{3}/g, '$1')
        .replace(/^\*\*(.+?)\*\*\s*$/gm, '$1')
        .replace(/^[-*_]{3,}$/gm, '')
        .trim()
        .substring(0, 1800);
}

export function chunkMessage(text: string, maxLength = 1800): string[] {
    if (text.length <= maxLength) return [text];

    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > 0) {
        if (remaining.length <= maxLength) {
            chunks.push(remaining);
            break;
        }

        let splitAt = remaining.lastIndexOf('\n\n', maxLength);

        if (splitAt < maxLength * 0.5) {
            splitAt = remaining.lastIndexOf('\n', maxLength);
        }

        if (splitAt < maxLength * 0.5) {
            splitAt = remaining.lastIndexOf('. ', maxLength);
            if (splitAt !== -1) splitAt += 1;
        }

        if (splitAt < maxLength * 0.5) {
            splitAt = remaining.lastIndexOf(' ', maxLength);
        }

        if (splitAt <= 0) {
            splitAt = maxLength;
        }

        chunks.push(remaining.substring(0, splitAt).trim());
        remaining = remaining.substring(splitAt).trim();
    }

    return chunks.filter(c => c.length > 0);
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sendNaturalReply(message: Message, response: string): Promise<Message[]> {
    const channel = message.channel as TextBasedChannel;
    const sentMessages: Message[] = [];

    if (!channel.isSendable()) return sentMessages;

    const cleaned = cleanResponse(response);
    const chunks = chunkMessage(cleaned);

    await channel.sendTyping();

    const delay = Math.min(4000, cleaned.length * 20);
    await sleep(delay);

    for (let i = 0; i < chunks.length; i++) {
        const sent = await channel.send(chunks[i]);
        sentMessages.push(sent);
        if (i < chunks.length - 1) {
            await sleep(500);
        }
    }

    return sentMessages;
}
