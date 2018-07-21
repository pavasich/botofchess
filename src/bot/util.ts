import {channel as data_channel} from "./globals";

export const isMod = ({ mod, username }: DirtyUser): boolean => {
    const b = mod || username === data_channel || username === 'birdofchess';
    console.log(mod, username, '=', b);
    return b;
};
