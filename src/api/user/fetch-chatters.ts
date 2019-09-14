import { channel } from '../../bot/globals';
import { t } from '../../bot/util';

interface ChattersResponse {
    chatters: {
        admins: string[];
        broadcaster: string[];
        global_mods: string[];
        moderators: string[];
        staff: string[];
        viewers: string[];
        vips: string[];
    };
}

let memo: string[] = [];
let last = 0;

export async function fetchChatters(noCache: boolean = false) {
    const now = Date.now();
    if (noCache || (now - last) > t.second30) {
        console.log('fetching chatters...');
        const response = await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`, { method: 'GET' });
        if (response.ok) {
            last = now;

            const json = await response.json() as ChattersResponse;
            console.log('got chatters:', json);

            const {
                chatters: {
                    admins,
                    broadcaster,
                    global_mods,
                    moderators,
                    staff,
                    viewers,
                    vips,
                },
            } = json;

            memo = [
                ...admins,
                ...broadcaster,
                ...global_mods,
                ...moderators,
                ...staff,
                ...viewers,
                ...vips,
            ];
        }
    } else {
        console.log(`reusing cached response (${(now - last) / 1000} seconds old)`);
    }

    return memo;
}
