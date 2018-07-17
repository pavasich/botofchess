import TwitchJS from 'twitch-js';
import { options } from './globals';

const client = new TwitchJS.client(options);

export default client;
