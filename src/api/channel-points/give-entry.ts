import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage';

import { apiClient } from '../../bot/client';
import rewardNames, { ChannelPointReward } from '../../bot/rewards';
import updateChannelPointRewardBalance from './update-channel-point-reward-balance';
import client from '../../bot/client';

const rewards = Object.keys(rewardNames) as ChannelPointReward[];

function getRewardID(shorthand: string) {
    for (let i = 0, n = rewards.length; i < n; i++) {
        if (rewards[i].startsWith(shorthand)) {
            return rewards[i];
        }
    }
}

export default async function giveEntry(channel: string, user: string, message: string, msg: TwitchPrivateMessage) {
    if (message.startsWith('!give')) {
        if (!msg.userInfo.isMod) {
            client.say('Nice try, dork');
            return;
        }
        const [, amount, of, to] = message.split(' ');
        console.log(`amount: ${amount}; of: ${of}; to: ${to}`);

        /** validate amount */
        const n = parseInt(amount, 10);
        if (n !== n) {
            client.say('birdofchess', 'That is not a number I can work with.');
            return;
        }

        /** validate reward ID */
        const rewardID = getRewardID(of);
        if (rewardID === undefined) {
            client.say('birdofchess', "I couldn't find any rewards like that.");
            return;
        }

        /** validate user */
        const username = to.replace('@', '');
        const user = await apiClient.kraken.users.getUserByName(username);
        if (user === null) {
            client.say('birdofchess', `Couldn't find someone named ${username} :/`);
            return;
        }

        /** good to go; update */
        client.say('birdofchess', 'Okay!');
        updateChannelPointRewardBalance(user, rewardID, n);
    }
}
