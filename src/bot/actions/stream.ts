import Timer = NodeJS.Timer;
import api from '../../api';
import {channel as data_channel} from '../globals';
import { isMod } from '../util';

let interval: Timer;
let broadcasting = false;
let start_time: number|undefined;

export const startStream = (userstate: DirtyUser) => {
    if (isMod(userstate)) {
        broadcasting = true;
        start_time = Date.now();
        interval = setInterval(() => {
            if (broadcasting) {
                api.actions.distributeCurrency();
                bot.action(data_channel, 'Shame tokens have been deposited! (+20)');
            }
        }, 1000 * 60 * 20);
        return 'Here goes!';
    }
};

export const endStream = (userstate: DirtyUser): string|void => {
    if (isMod(userstate)) {
        broadcasting = false;
        start_time = undefined;
        clearInterval(interval);
        return 'Gooooooooooobie!';
    }
};
