import DirtyUser from '../DirtyUser';

export default interface User {
    id: string
    name: string
    subscriber: boolean
    moderator: boolean
    isFollower?: string
    lastUpdated?: number
}

export const sanitizeDirtyUser = (dirtyUser: DirtyUser): User => {
    const { username, ['user-id']: userId, subscriber, mod } = dirtyUser;
    return {
        id: userId,
        name: username,
        subscriber,
        moderator: mod,
        lastUpdated: Date.now(),
    };
};
