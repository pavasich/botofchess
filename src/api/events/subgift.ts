export default function subgiftHandler(client: any, hooks?: any[]) {
    return function handleSubgift(
        channel: string,
        username: string,
        recipient: string,
        method: any,
        userstate: DirtyUser,
    ) {
        client.me(channel, `${username} just gifted a sub to ${recipient}! Thank you so much! SCREAM TO THE SKY!!`);
        if (hooks !== undefined) {
            for (let i = 0, n = hooks.length; i < n; i++) {
                hooks[i](channel, username, recipient, method, userstate);
            }
        }
    }
}
