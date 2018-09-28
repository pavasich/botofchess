import 'isomorphic-fetch';

import tjs from 'twitch-js';
import { options } from './globals';
const client = new tjs.Client(options);

export default client;
