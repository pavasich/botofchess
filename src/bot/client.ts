import TwitchJs from 'twitch-js';
import { ApiClient } from 'twitch';
import { StaticAuthProvider } from 'twitch-auth';
import { PubSubClient } from 'twitch-pubsub-client';
// import { ChatClient } from 'twitch-chat-client';
import 'isomorphic-fetch';

import { client_id, access_token } from './secrets';
import { options } from './globals';
// import handleRedeem from '../api/channel-points/on-redeem';
// import giveEntry from '../api/channel-points/give-entry';

// const authProvider = new StaticAuthProvider(client_id, access_token);
// export const apiClient = new ApiClient({ authProvider });
// export const pubSubClient = new PubSubClient();
// export const chatClient = new ChatClient(authProvider, { channels: ['birdofchess'] });


// (async function go() {
//     await Promise.all([
//         chatClient.connect(),
//         pubSubClient.registerUserListener(apiClient, 142204178),
//     ]);
//     chatClient.onMessage(giveEntry);
//     pubSubClient.onRedemption(142204178, handleRedeem);
// }());


const client = new TwitchJs.Client(options);
export default client;
