export const sanitizeDirtyUser = (dirtyUser: DirtyUser): User => {
    const { username, ['user-id']: userId, subscriber, mod } = dirtyUser;
    return {
        id: userId,
        name: username,
        subscriber,
        moderator: mod,
    };
};

export const searchEveryoneForUser = (name: string, everyone: Array<User>): User|void => {
    for (let i = 0, n = everyone.length; i < n; i++) {
        if (everyone[i].name === name) {
            return everyone[i];
        }
    }
};
