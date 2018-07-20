import debounce from 'lodash/debounce';
import Monologue from '../models/Monologue/index';
import emotes from '../util/emotes';
import { coin_sides, channel as data_channel } from './globals';
import bot from './client';
import api from '../api';
import { pickRand } from '../util/arrays';
import CommandLimiter from './CommandLimiter';
import limits from './limits';

const rateLimit = new CommandLimiter(limits);

const chatters = 'tmi.twitch.tv/group/user/birdofchess/chatters';

let start_time: number|void;

const pluralize = (number: number) => (
    number === 1
    ? ''
    : 's'
);

const isMod = ({ mod, username }: DirtyUser): boolean => {
    const b = mod || username === data_channel || username === 'birdofchess';
    console.log(mod, username, '=', b);
    return b;
};

let enableLogging = false;
const logAction = (userstate: DirtyUser, string: string) => {
    if (enableLogging) {
        api.log(`INFO::${userstate['display-name']}::${string}::${(new Date()).toJSON()}`);
    }
};

/**
 *   S E T U P
 */
console.log('running!');
let broadcasting = false;
const say_bounced = debounce((s) => { bot.action(data_channel, s) }, 2000);

/**
 * say
 * @param {string} s
 */
const say = (s: string) => say_bounced(s);

/**
 * dangerSay
 * @param {string} string
 */
const dangerSay = (string: string) => bot.action(data_channel, string);

/**
 * speak
 * @param {Monologue} monologue
 */
const speak = (monologue: Monologue) => {
    const recur = (lines: Array<Line>) => {
        if (lines.length > 0) {
            const [line, ...rest] = lines;
            if (line.delay !== undefined) {
                setTimeout(() => {
                    dangerSay(line.message);
                    if (rest.length > 0) recur(rest);
                }, line.delay);
            } else {
                dangerSay(line.message);
                if (rest.length > 0) recur(rest);
            }
        }
    };
    recur(monologue.lines);
};

/**
 * on connect
 */
bot.on('connected', function() {
    say('I\'m alive!!');
});

/**
 * discord
 */
const discord = () => {
    say('https://discord.gg/K8mtM7s');
};

/**
 * goHome
 * @param {string} name
 */
const goHome = (name: string) => {
    if (name === 'serbosaurus' || name === data_channel) {
        bot.action(data_channel, 'no, im not ready to go...');
        bot.disconnect();
    } else {
        say('bitch you can\'t tell me what to do');
    }
};

/**
 * flipCoin
 * @param {string} name
 */
const flipCoin = (name: string) => {
    bot.action(data_channel, `${name} flips a coin...`);
    const result = pickRand(coin_sides);
    setTimeout(() => {
        bot.action(data_channel, `   ${result} !`);
    }, 1500);
};

/**
 * stream [uptime]
 */
const uptime = () => {
    if (start_time === undefined) {
        say('Stream is offline, try again later >D');
        return;
    }
    const now: number = Date.now();
    let running = (now - start_time);
    running = Math.floor(running / 1000);
    const hours = Math.floor(running / (60 * 60));
    running %= (60 * 60);
    const minutes = Math.floor(running / (60));
    const seconds = running % 60;

    const t = [];

    if (hours > 0) {
        if (hours > 1) {
            t.push(`${hours} hours`);
        } else {
            t.push('1 hour');
        }
    }

    if (minutes > 0) {
        if (minutes > 1) {
            t.push(`${minutes} minutes`);
        } else {
            t.push('1 minute');
        }
    }

    if (seconds > 0) {
        if (seconds > 1) {
            t.push(`${seconds} seconds`);
        } else {
            t.push('1 second');
        }
    }

    let s;
    if (t.length === 1) {
        s = t[0];
    } else if (t.length === 2) {
        s = `${t[0]} and ${t[1]}`;
    } else {
        s = `${t[0]}, ${t[1]}, and ${t[2]}`;
    }


    say(`birdofchess has been streaming for ${s}.`);
};

let interval: Timer;
const startStream = (userstate: DirtyUser) => {
    if (isMod(userstate)) {
        broadcasting = true;
        start_time = Date.now();
        interval = setInterval(() => {
            if (broadcasting) {
                api.actions.distributeCurrency();
                bot.action(data_channel, 'Shame tokens have been deposited! (+20)');
            }
        }, 1000 * 60 * 20);
        bot.action(data_channel, 'Here goes!');
    }
};

const endStream = (userstate: DirtyUser) => {
    if (isMod(userstate)) {
        broadcasting = false;
        start_time = undefined;
        clearInterval(interval);
        bot.action(data_channel, 'Gooooooooooobie!');
    }
};

const getWinner = () => {
    const result = api.subs.requests.pickWinner();
    console.log(result);
    setTimeout(() => {
        dangerSay(`${result[0]}, requesting ${result[1]}!`);
        dangerSay('Okay?');
    }, 1000 * 4);
};

const commands = async (channel: string, userstate: DirtyUser, message: string, self: boolean) => {
    if (self) return;
    api.user.dirty.upsert(userstate);

    if (enableLogging) {
        api.word.saveWords(userstate, message);
    }

    let sillything = [];
    let sillysize = 0;

    let temp: Array<string> = message.split(' ');
    for (let i = 0, n = temp.length; i < n; i++) {
        if (emotes[temp[i]] === 1) {
            sillything[sillysize++] = temp[i];
        } else if (/ball/.test(temp[i].toLowerCase()) && Math.random() >= .5) {
            sillything[sillysize++] = 'ball';
        }
    }

    if (message.toLowerCase().includes('ayy')) {
        let ayy = 'ayy';
        for (let i = 0; i < 30; i++) {
            if (Math.random() > .5) {
                ayy += 'y';
            }
        }
        sillything[sillysize++] = ayy;
    }

    if (sillysize > 0) {
        bot.action(channel, sillything.join(' '));
    }

    if (message[0] !== '!') {
        return;
    }
    console.log('checking out a message', userstate, message);
    const tokens = message.replace('!', '').toLowerCase().split(' ');
    const car = tokens[0];
    const cdr = tokens.slice(1);
    if (rateLimit.enforce(userstate, car)) {
        if (enableLogging) {
            logAction(userstate, `SKIPPED::${message}`);
        }
        return;
    }
    let writeLog = true;
    switch (car) {
        /**
         * games
         */
        case 'games':
        case 'gameslist':
            say('https://bit.ly/2GqYEfS');
            break;

        /**
         * shame
         */
        case 'shame':
        case 'shametoken':
            say(api.actions.shame());
            break;

        /**
         * gohomeyousdrunk
         */
        case 'gohomeyousdrunk':
            goHome(userstate.username);
            break;

        /**
         * flip (coin)
         */
        case 'flip':
        case 'flipcoin':
        case 'coinflip':
        case 'cointoss':
            flipCoin(userstate.username);
            break;

        /**
         * discord
         */
        case 'discord':
            discord();
            break;

        /**
         * help
         */
        case 'help':
        case 'commands':
            bot.action(channel, '!help [!commands] || !shame [!shametoken] || !flip [!flipcoin|!coinflip|!cointoss] || !games [!gameslist] || !roll (number) || !quote || !donorquote || !request (during sub requests) || !hug || !stream [!uptime] || !discord || !steam || !balance || !giveaway [!event] || !ffxiv || !gw2 || !battlenet [!bnet|!btag|!battletag|!ow|!overwatch] || !imanerd for bot specs.');
            break;

        /**
         * imanerd
         */
        case 'imanerd':
            bot.action(channel, 'Made in JavaScript, using the twitch-js package (RIP tmi.js). Shames are saved as JSON to bebop\'s PC. More details will be available as the bot gains functionality :3');
            break;

        /**
         * stream; uptime
         */
        case 'stream':
        case 'uptime':
            uptime();
            break;

        /**
         * steam
         */
        case 'steam':
            say('steamcommunity.com/id/birdofchess');
            break;

        /**
         * quote
         */
        case 'quote':
            speak(api.actions.getQuote());
            break;

        case 'donorquote':
            speak(api.actions.getQuote(true));
            break;

        /**
         * startRequests
         */
        case 'startrequests':
            api.subs.requests.clear();
            dangerSay('Taking sub requests for the next game!');
            dangerSay('You have 30 seconds!');
            setTimeout(() => {
                dangerSay('Times up! The winner is...');
                getWinner();
            }, 1000 * 30);
            break;

        /**
         * tryagain
         */
        case 'tryagain':
            if (isMod(userstate)) {
                getWinner();
            }
            break;

        /**
         * request
         */
        case 'request':
            if (userstate.subscriber) {
                api.subs.requests.takeRequest(userstate.username, cdr.join(' '));
            }
            break;

        /**
         * hug
         */
        case 'hug':
            if (tokens[1] && tokens[1] !== 'undefined') {
                try {
                    const name1 = userstate.username.replace('@', '').toLowerCase();
                    const name2 = tokens[1].replace('@', '').toLowerCase();

                    if (name1 === name2) {
                        bot.action(channel, `@${name1} is wrapped up in a self-hug. Weird.`);
                    } else if (name2 === 'botofchess') {
                        bot.action(channel, `@${name1} hugged me! *blush*`);
                    } else {
                        try {
                            const response = await fetch(chatters, { method: 'GET' });
                            if (response.ok) {
                                const {chatters: {moderators, viewers}} = await response.json();
                                if (moderators.includes(name2) || viewers.includes(name2)) {
                                    bot.action(channel, `@${name1} hugs @${name2}   :3`);
                                    break;
                                }
                                bot.action(channel, `@${name1} hugs ${name2}.`);
                            }
                        } catch (e) {
                            console.log('api error:', e);
                            bot.action(channel, `@${name1} hugs ${name2}.`);
                        }
                    }
                } catch (e) {
                    say('What are you trying to do to me?!');
                    console.log(e);
                }
            }
            break;

        /**
         * roll
         */
        case 'roll':
            const monologue = api.actions.rollDie(userstate.username, cdr[0]);
            if (monologue !== undefined) {
                speak(monologue);
            }
            break;

        /**
         * broadcast start|end
         */
        case 'broadcast':
            if (isMod(userstate)) {
                if (cdr[0] === 'start') startStream(userstate);
                else if (cdr[0] === 'end') endStream(userstate);
                else bot.action(channel, 'invalid syntax - !broadcast [start|end]')
            }
            break;

        case 'startstream':
            startStream(userstate);
            break;

        case 'endstream':
            endStream(userstate);
            break;

        /**
         * event|giveaway
         */
        case 'event':
        case 'giveaway':
            say(`It's the beach birds giveaway! Hang out, earn tokens while in chat, and exchange them for raffle tickets!  Prizes and details at: http://bit.ly/beach-birds #beach-birds`);
            break;

        /**
         * balance
         */
        case 'balance':
            const balance = api.currency.getBalanceForDirtyUser(userstate);
            const { gw2, ffxiv } = api.currency.getTicketsForDirtyUser(userstate);
            let s = '';
            const gw2Balance = gw2 > 0
                ? `${gw2} gw2 ticket${pluralize(gw2)}`
                : '';
            const ffxivBalance = ffxiv > 0
                ? `${ffxiv} ffxiv ticket${pluralize(ffxiv)}`
                : '';
            if (gw2 > 0 && ffxiv > 0) {
                s = `, ${gw2Balance}, and ${ffxivBalance}`;
            } else if (gw2 > 0) {
                s = ` and ${gw2Balance}`;
            } else if (ffxiv > 0) {
                s = ` and ${ffxivBalance}`;
            }

            bot.action(channel, `You have ${balance} token${pluralize(balance)}${s} in the bank.`);
            break;

        case 'purchase':
            const result = api.currency.purchase(userstate, parseInt(cdr[0], 10), cdr[1]);
            bot.action(channel, result);
            break;

        /**
         * enable logging - disabled by default
         */
        case 'enablelogging':
            if (isMod(userstate)) {
                enableLogging = true;
            }
            break;
        case 'disableLogging':
            if (isMod(userstate)) {
                enableLogging = false;
            }
            break;

        case 'ffxiv':
            say('[Arden Everleigh :: Aether - Zalera]');
            break;

        case 'gw2':
            say("[Rook.6302 :: Yak's Bend]");
            break;

        case 'battlenet':
        case 'bnet':
        case 'ow':
        case 'overwatch':
        case 'btag':
        case 'battletag':
            say("[Rook#11953 :: Main], [Rook#11992 :: Alternate]");
            break;

        default:
            writeLog = false;
            break;
    }
    if (writeLog && enableLogging) {
        logAction(userstate, message);
    }
};

bot.on('chat', commands);

bot.on('disconnected', function() {
    process.exit(0);
});

export default bot;
