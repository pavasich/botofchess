export const sanitizeDirtyUser = (dirtyUser: DirtyUser): User => {
    const { username, ['user-id']: userId, subscriber, mod } = dirtyUser;
    return {
        id: userId,
        name: username,
        subscriber,
        moderator: mod,
    };
};
