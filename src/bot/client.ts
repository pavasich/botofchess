// @ts-ignore
import TwitchJs from 'twitch-js';
import 'isomorphic-fetch';
import { options } from './globals';

const client = new TwitchJs.Client(options);

export default client;
