import 'dotenv/config';
import { Events } from 'discord.js';
import client from './bot/client';
import { config } from './config';
import { log } from './utils/logger';
import { onMessageCreate } from './bot/events/messageCreate';
import { handleReactionAdd } from './training/feedbackHandler';

client.once(Events.ClientReady, readyClient => {
    log('INFO', `Bot online: ${readyClient.user.tag} (ID: ${readyClient.user.id})`);
});

client.on(Events.MessageCreate, onMessageCreate);
client.on(Events.MessageReactionAdd, handleReactionAdd);
