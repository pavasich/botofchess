import fetch from 'whatwg-fetch';
import Message from '../message';
import exists from './exists';
import db from '../../db';
import isFresh from '../../db/is-fresh';
import { Status, Model } from '../../db/db-constants';
import { channel_id } from '../../bot/globals';

const verifyFollowerUrl = (userId: string|number) =>
    `https://api.twitch.tv/kraken/users/${userId}/follows/channels/${channel_id}`;

export default async (user: User): Promise<Message> => {
    if (exists(user)) {
        if (user.isFollower !== undefined) {
            const freshness: Message = isFresh(user);
            if (freshness.status === Status.Fresh) {
                return <Message>{
                    code: 200,
                    status: user.isFollower,
                };
            }
        }
        const response = await fetch(verifyFollowerUrl(user.id), {
            method: 'GET'
        });
        const isFollower = response.status === 404
            ? Status.Is_Follower
            : Status.Not_Follower;
        db
            .get(Model.User)
            .get(user.id)
            .set('isFollower', isFollower)
            .set('lastUpdated', Date.now())
            .write();
        return <Message>{
            code: 200,
            status: isFollower,
        };
    }
    return <Message>{
        code: 404,
    };
}
