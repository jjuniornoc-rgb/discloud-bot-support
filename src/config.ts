import 'dotenv/config';

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`[Config] Variável de ambiente obrigatória não definida: ${key}`);
    }
    return value;
}

export const config = {
    DISCORD_TOKEN: requireEnv('DISCORD_TOKEN'),
    DISCORD_CLIENT_ID: requireEnv('DISCORD_CLIENT_ID'),
    ALLOWED_CHANNEL_IDS: process.env.ALLOWED_CHANNEL_IDS?.split(',').map(s => s.trim()).filter(Boolean) ?? [],
    ALLOWED_GUILD_IDS: process.env.ALLOWED_GUILD_IDS?.split(',').map(s => s.trim()).filter(Boolean) ?? [],
    OPENROUTER_API_KEY: requireEnv('OPENROUTER_API_KEY'),
    COOLDOWN_SECONDS: Number(process.env.COOLDOWN_SECONDS ?? 30),
    MAX_HISTORY_MESSAGES: Number(process.env.MAX_HISTORY_MESSAGES ?? 10),
    STAFF_USER_ID: process.env.STAFF_USER_ID ?? '',
};
