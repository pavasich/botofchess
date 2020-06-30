function tpl(s: string) {
    return `Check out @${s} at https://twitch.tv/${s} !`;
}

export default function shoutout(dirtyUsername: string = '') {
    const username = dirtyUsername.replace('@', '');
    if (username.length > 0) {
        return tpl(username);
    }
    return;
}
