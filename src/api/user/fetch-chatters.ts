import { channel } from '../../bot/globals';

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

export async function fetchChatters() {
    console.log('fetching chatters...');
    const response = await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`, { method: 'GET' });
    if (response.ok) {
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

       return [
            ...admins,
            ...broadcaster,
            ...global_mods,
            ...moderators,
            ...staff,
            ...viewers,
            ...vips,
        ];
    }
    return [];
}
