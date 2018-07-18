import TwitchJs from 'twitch-js';
import { options } from './globals';

const client = new TwitchJs.Client(options);

export default client;
