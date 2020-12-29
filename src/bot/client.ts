import TwitchJs from 'twitch-js';
import { ApiClient } from 'twitch';
import { StaticAuthProvider } from 'twitch-auth';
import { PubSubClient, PubSubRedemptionMessage } from 'twitch-pubsub-client';
import 'isomorphic-fetch';

import { client_id, access_token } from './secrets';
import { options } from './globals';
import rewardNames from './rewards';
import handleRedeem from '../api/channel-points/on-redeem';

const authProvider = new StaticAuthProvider(client_id, access_token);
const apiClient = new ApiClient({ authProvider });
const pubSubClient = new PubSubClient();

async function go() {
    await pubSubClient.registerUserListener(apiClient, 142204178);
    await pubSubClient.onRedemption(142204178, (message: PubSubRedemptionMessage) => {
        console.log('REDEEMER::' + message.userId + '::' + message.userDisplayName);
        if (rewardNames[message.rewardId] === undefined) {
            return;
        }
        console.log('REWARD::' + message.rewardId + '::' + rewardNames[message.rewardId]);
        handleRedeem(message);
    });
}

go();

const client = new TwitchJs.Client(options);
export default client;
