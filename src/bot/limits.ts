import { second, minute } from '../util/time-expand';

const minute5 = minute(5);
const minute1 = minute(1);
const second5 = second(5);
const second10 = second(10);
const second30 = second(30);

type SNMap = {
    [key: string]: number
}
const limits: SNMap = {
    aha: second10,
    balance: minute5,
    battlenet: minute1,
    battletag: minute1,
    bnet: minute1,
    btag: minute1,
    coinflip: second30,
    cointoss: second30,
    commands: minute1,
    discord: second30,
    donate: second10,
    donorquote: second5,
    eso: minute1,
    ffxiv: minute1,
    flip: second30,
    flipcoin: second30,
    games: minute5,
    gameslist: minute5,
    gw1: minute1,
    gw2: minute1,
    help: minute1,
    hug: second10,
    imanerd: minute5,
    overwatch: minute1,
    ow: minute1,
    pronouns: minute1,
    quote: second5,
    roll: second10,
    shame: second30,
    shametoken: second30,
    steam: minute5,
    stream: minute1,
    streamgifts: second5,
    teamtrue: minute1,
    truetuesday: minute1,
    tttt: minute1,
    uptime: minute1,
    warframe: minute1,
    youtube: second10,
};

export default limits;
