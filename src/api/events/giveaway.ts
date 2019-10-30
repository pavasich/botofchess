import { pick } from '../../util/arrays';
import { second } from '../../util/time-expand';

const users = new Set();
const delayTime = second(50);

export const start = (callback: (s: string) => void) => {
    users.clear();
    setTimeout(() => {
        callback(pick([...users]));
    }, delayTime);
};

export const enter = (userstate: DirtyUser) => {
    users.add(userstate.username);
};

