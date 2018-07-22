import db, { MODELS } from '../../db';
import { searchEveryoneForUser } from "../../models/User";

export default async (chatters: Array<string>, subsonly: boolean) => {
    let all = [];
    if (subsonly) {
        const everyone = db.get(MODELS.USER).values().value();
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
        let val = db.get(MODELS.CURRENCY).get(all[i]).value();
        if (val === undefined) val = 0;
        db.get(MODELS.CURRENCY).set(all[i], val + 20).write();
        console.log(all[i], val);
    }
}
