import { channel_id } from "../../bot/globals";

const getSubscribersURI = `https://api.twitch.tv/kraken/channel/${channel_id}/subscriptions?limit=100`;

export default async (): Promise<Array<TwitchSubscribersSubscriberUser>> => {
    const response = await fetch(getSubscribersURI, {method: 'GET'});
    if (response.ok) {
        const json: TwitchSubscribersResponse = await(response.json());
        return json.subscribers.map((sub: TwitchSubscribersSubscriber): TwitchSubscribersSubscriberUser =>
            sub.user
        );
    }
    return [];
};
