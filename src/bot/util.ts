import { channel as data_channel } from "./globals";
import { minute, second } from '../util/time-expand';

export const isMod = ({ mod, username }: DirtyUser): boolean => {
    const b = mod || username === data_channel || username === 'birdofchess';
    console.log(mod, username, '=', b);
    return b;
};

export const t = {
    second1: second(1),
    second2: second(2),
    second4: second(4),
    second30: second(30),
    minute5: minute(5),
    minute20: minute(20),
};
