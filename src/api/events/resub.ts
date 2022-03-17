import ordinalSuffixOf from '../../util/ordinal-suffix-of';

export default function resubHandler(client: any, hooks?: any[]) {
    return function handleResub(
        channel: string,
        username: string,
        months: number,
        message: string,
        userstate: DirtyUser,
        methods: any,
    ) {
        client.me(channel, `${username} just re-subbed! Their ${months}${ordinalSuffixOf(months)} month in a row! SCREAM TO THE SKY!!`);
        if (hooks !== undefined) {
            for (let i = 0, n = hooks.length; i < n; i++) {
                hooks[i](channel, username, months, message, userstate, methods);
            }
        }
    };
}


