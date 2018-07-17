import TwitchJS from 'twitch-js';
import { OPTIONS } from './globals';

const client = new TwitchJS.client(OPTIONS);

client.connect();

export default client;
