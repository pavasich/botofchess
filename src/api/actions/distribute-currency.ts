import { channel } from '../../globals';
import db from '../../db';
import { MODELS } from '../../db/db-constants';

const users = `https://tmi.twitch.tv/group/user/${channel}/chatters`;
export default async () => {
    console.log('get', users);
    const chatters = await fetch(users, { method: 'GET' });
    if (chatters.ok) {
        const { chatters: { viewers } } = await chatters.json();
        console.log('viewers', viewers);
        for (let i = 0, n = viewers.length; i < n; i++) {
            let val = db.get(MODELS.CURRENCY).get(viewers[i]).value();
            if (val === undefined) val = 0;
            db.get(MODELS.CURRENCY).set(viewers[i], val + 20).write();
            console.log(viewers[i], val);
        }
    }
}
