import { channel } from '../../globals';
import db, { MODELS } from '../../db';

const users = `https://tmi.twitch.tv/group/user/${channel}/chatters`;
export default async () => {
    console.log('get', users);
    const chatters = await fetch(users, { method: 'GET' });
    if (chatters.ok) {
        const { chatters: { moderators, viewers } } = await chatters.json();
        console.log('viewers', viewers);
        console.log('moderators', moderators);
        const all = [...viewers, ...moderators];
        for (let i = 0, n = all.length; i < n; i++) {
            let val = db.get(MODELS.CURRENCY).get(all[i]).value();
            if (val === undefined) val = 0;
            db.get(MODELS.CURRENCY).set(all[i], val + 20).write();
            console.log(all[i], val);
        }
    }
}
