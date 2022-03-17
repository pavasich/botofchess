export default function subscriptionHandler(client: any, hooks?: any[]) {
    return function handleSubscription(
        channel: string,
        username: string,
        method: number,
        message: string,
        userstate: DirtyUser,
    ) {
        client.me(channel, `${username} just subscribed! Thank you so much! SCREAM TO THE SKY!!`);
        if (hooks !== undefined) {
            for (let i = 0, n = hooks.length; i < n; i++) {
                hooks[i](channel, username, method, message, userstate);
            }
        }
    };
}


