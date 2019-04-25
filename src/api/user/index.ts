import isFollower from './is-follower';
import create, { createFromDirtyUser } from './create';
import update, { updateFromDirtyUser } from './update';
import upsert, { upsertFromDirtyUser } from './upsert';
import { findUserByUserName } from './find-by-username';

export default {
    isFollower,
    create,
    update,
    upsert,
    findByUsername: findUserByUserName,
    dirty: {
        create: createFromDirtyUser,
        update: updateFromDirtyUser,
        upsert: upsertFromDirtyUser,
    },
};
