import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage';

import rewardNames, { ChannelPointReward } from '../../bot/rewards';
import client from '../../bot/client';
import { Model } from '../../db/db-constants';
import db from '../../db';

const rewards = Object.keys(rewardNames) as ChannelPointReward[];

function getRewardID(shorthand: string) {
    for (let i = 0, n = rewards.length; i < n; i++) {
        if (rewards[i].startsWith(shorthand)) {
            return rewards[i];
        }
    }
}

export default async function giveEntry(channel: string, user: string, message: string, msg: TwitchPrivateMessage) {
    if (message.split(' ')[0] === '!give') {
        if (!msg.userInfo.isMod) {
            client.say('rookuri', 'Nice try, dork');
            return;
        }
        const [, amount, of, to] = message.split(' ');
        console.log(`amount: ${amount}; of: ${of}; to: ${to}`);

        /** validate amount */
        const n = parseInt(amount, 10);
        if (n !== n) {
            client.say('rookuri', 'That is not a number I can work with.');
            return;
        }

        /** validate reward ID */
        const rewardID = getRewardID(of);
        if (rewardID === undefined) {
            client.say('rookuri', "I couldn't find any rewards like that.");
            return;
        }

        /** validate user */
        const all = db.get(Model.Channel_Points).value();
        const keys = Object.keys(all);
        const username = to.replace('@', '').toLowerCase();

        let id;
        for (let i = 0, q = keys.length; i < q; i++) {
            const recordedUser = all[keys[i]].userName.toLowerCase();
            if (recordedUser === username) {
                id = keys[i];
                break;
            }
        }

        if (id === undefined) {
            client.say('rookuri', `Couldn't find someone named ${username} :/`);
            return;
        }

        /** good to go; update */
        client.say('rookuri', 'Okay!');

        db.update([Model.Channel_Points, id, 'rewards', rewardID], (value) => {
            if (value === undefined) {
                return n;
            }
            return parseInt(value, 10) + n;
        }).write();
    }
}
