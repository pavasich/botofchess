import isFollower from './is-follower';
import isSubscriber from './is-subscriber';
import create, { createFromDirtyUser } from './create';
import update, { updateFromDirtyUser } from './update';
import upsert, { upsertFromDirtyUser } from './upsert';

export default {
    isFollower,
    isSubscriber,
    create,
    update,
    upsert,
    dirty: {
        create: createFromDirtyUser,
        update: updateFromDirtyUser,
        upsert: upsertFromDirtyUser,
    },
};
