import { fetchChatters } from '../user/fetch-chatters';

export async function shoutout(dirtyUsername: string = '') {
    const username = dirtyUsername.replace('@', '');
    const chatters = await fetchChatters();

    for (let i = 0, n = chatters.length; i < n; i++) {
        const user = chatters[i];
        if (user === username) {
            console.log(`performing shoutout for ${user}`);
            return `Check out @${user} at https://twitch.tv/${user} !`
        }
    }

    return;
}
