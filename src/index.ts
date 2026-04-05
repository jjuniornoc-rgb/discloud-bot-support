import 'dotenv/config';
import { Events } from 'discord.js';
import client from './bot/client';
import { config } from './config';
import { log } from './utils/logger';
import { onMessageCreate } from './bot/events/messageCreate';
import { handleReactionAdd } from './training/feedbackHandler';

log('INFO', 'Iniciando bot...');

client.once(Events.ClientReady, readyClient => {
    log('INFO', `Bot online: ${readyClient.user.tag} (ID: ${readyClient.user.id})`);
});

client.on(Events.MessageCreate, onMessageCreate);
client.on(Events.MessageReactionAdd, handleReactionAdd);

client.login(config.DISCORD_TOKEN).catch(err => {
    log('ERROR', `Falha ao conectar ao Discord: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
});
