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
    balance: minute5,
    battlenet: minute1,
    battletag: minute1,
    bnet: minute1,
    broadcast: 0,
    btag: minute1,
    coinflip: second30,
    cointoss: second30,
    commands: minute1,
    disableLogging: 0,
    discord: minute5,
    donorquote: second5,
    enablelogging: 0,
    endstream: 0,
    event: 0,
    ffxiv: minute1,
    flip: second30,
    flipcoin: second30,
    games: minute5,
    gameslist: minute5,
    giveaway: 0,
    gw2: minute1,
    help: minute1,
    hug: second10,
    imanerd: minute5,
    overwatch: minute1,
    ow: minute1,
    purchase: 0,
    quote: second5,
    raffle: 0,
    request: 0,
    roll: second10,
    shame: second30,
    shametoken: second30,
    shoutout: 0,
    spicybalance: 0,
    startrequests: 0,
    startstream: 0,
    steam: minute5,
    stream: minute1,
    streamgifts: second5,
    tryagain: 0,
    uptime: minute1,
    tttt: minute1,
    teamtrue: minute1,
    truetuesday: minute1,
    curiositystream: 0,
};

export default limits;
