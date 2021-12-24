import db from '../../db';
import { Model } from '../../db/db-constants';
import { ChannelPointReward } from '../../bot/rewards';
import client from '../../bot/client';


export default function draw(reward: ChannelPointReward, winnerCount: number = 1) {
    const entries: string[] = [];
    const winners: string[] = [];
    const value = db.get(Model.Channel_Points).value();
    const keys = Object.keys(value);

    /** simulate an actual raffle drawing, for fun */
    for (let i = 0, n = keys.length; i < n; i++) {
        const key = keys[i];
        const entry = value[key];
        if (entry.rewards && entry.rewards[reward] !== undefined && entry.rewards[reward] > 0) {
            const times = entry.rewards[reward];
            for (let j = 0; j < times; j++) {
                entries.push(entry.userID);
            }
        }
    }

    if (winnerCount > 1) {
        client.say('rookuri', 'The winners are:');
    } else {
        client.say('rookuri', 'The winner is:');
    }
    console.log(entries);
    /** splice out winners to keep odds fair */
    for (let i = 0, n = winnerCount; i < n; i++) {
        const windex = Math.floor(Math.random() * entries.length);
        const [winner] = entries.splice(windex, 1);
        let pre = '';
        if (winnerCount > 1) {
            pre = `#${i + 1}: `;
        }

        const winningUserDisplayName = db
            .get(Model.Channel_Points)
            .get(winner)
            .get('userDisplayName')
            .value()

        const result = `${pre}@${winningUserDisplayName}!`;

        winners.push(result);

        setTimeout(() => {
            client.say(
                'rookuri',
                result,
            );
        }, 1000);

        if ((i + 1) === winnerCount) {
            setTimeout(() => {
                client.say('rookuri', 'Congratulations!');
            }, 1000);
        }
    }

    /** just in case */
    console.log(winners);
}
