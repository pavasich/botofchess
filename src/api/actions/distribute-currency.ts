import { channel } from '../../bot/globals';
import db, { MODELS } from '../../db';
import getSubscribers from '../twitch/get-subscribers-to-channel';

const users = `https://tmi.twitch.tv/group/user/${channel}/chatters`;
export default async (subsonly: boolean) => {
    console.log('get', users);
    const chatters = await fetch(users, { method: 'GET' });
    if (chatters.ok) {
        const { chatters: { moderators, viewers } } = await chatters.json();
        console.log('viewers', viewers);
        console.log('moderators', moderators);
        let all = [...viewers, ...moderators];
        if (subsonly) {
            const subscribers: Array<TwitchSubscribersSubscriberUser> = await(getSubscribers());
            const subNames = new Set();
            for (let i = 0, n = subscribers.length; i < n; i++) {
                const sub: TwitchSubscribersSubscriberUser = subscribers[i];
                subNames.add(sub.name);
                subNames.add(sub.display_name);
            }
            all = all.filter((username) => subNames.has(username));
        }
        for (let i = 0, n = all.length; i < n; i++) {
            let val = db.get(MODELS.CURRENCY).get(all[i]).value();
            if (val === undefined) val = 0;
            db.get(MODELS.CURRENCY).set(all[i], val + 20).write();
            console.log(all[i], val);
        }
    }
}
