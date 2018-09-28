export function msToHms(ms: number) {
    const h = Math.floor(ms / 3600000);
    const m = ('0' + Math.floor(ms / 60000) % 60).slice(-2);
    const s = ('0' + Math.floor(ms / 1000) % 60).slice(-2);
    return  h + ':' + m + ':' + s;
}

export function isMod({ mod, username }: DirtyUser) {
    const b = mod || username === 'birdofchess';
    console.log(mod, username, '=', b);
    return b;
}
