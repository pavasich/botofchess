import db from '../../db';
import { Model } from '../../db/db-constants';
import { ChannelPointReward } from '../../bot/rewards';


export default function draw(reward: ChannelPointReward, winnerCount: number = 1) {
    const entries: string[] = [];
    const winners: string[] = [];
    const value = db.get(Model.Channel_Points).value();
    const keys = Object.keys(value);
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

    for (let i = 0, n = winnerCount; i < n; i++) {
        const windex = Math.floor(Math.random() * entries.length);
        const [winner] = entries.splice(windex, 1);
        winners.push(winner);
    }

    console.log(winners.map((winner) => db.get(Model.Channel_Points).get(winner).get('userDisplayName').value()));
}
