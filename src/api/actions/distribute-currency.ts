import db from '../../db';
import { Model } from '../../db/db-constants';
import { searchEveryoneForUser } from '../../models/User';
import { fetchChatters } from '../user/fetch-chatters';

let multiplier = 1;

export default async (subsonly: boolean = false) => {
    const chatters = await fetchChatters();
    let all = [];
    if (subsonly) {
        const everyone = db.get(Model.User).values().value();
        for (let i = 0, n = chatters.length; i < n; i++) {
            const user = searchEveryoneForUser(chatters[i].toLowerCase(), everyone);
            if (user !== undefined && user.subscriber) {
                all.push(user.name);
            }
        }
    } else {
        all = chatters;
    }
    for (let i = 0, n = all.length; i < n; i++) {
        let val = db.get(Model.Currency).get(all[i]).value();
        if (val === undefined) val = 0;
        db.get(Model.Currency).set(all[i], val + (20 * multiplier)).write();
        console.log(all[i], val);
    }
}

export function setCurrencyMultiplier(n: string) {
    const newMult = parseInt(n, 10);
    if (newMult === newMult && newMult > 0) {
        multiplier = newMult;
        return multiplier;
    }
    return false;
}

export function getCurrencyMultiplier() {
    return multiplier;
}
