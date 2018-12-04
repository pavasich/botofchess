import debounce from 'lodash/debounce';
import Monologue from '../models/Monologue/index';
import emotes from '../util/emotes';
import { coin_sides, channel as data_channel } from './globals';
import bot from './client';
import api from '../api';
import { pickRand } from '../util/arrays';
import CommandLimiter from './CommandLimiter';
import limits from './limits';
import actions from './actions';
import { isMod } from './util';
import { minute, second } from '../util/time-expand';
import raffle from '../api/currency/raffle';

const second1 = second(1);
const second2 = second1 * 2;
const second4 = second2 * 2;
const second30 = second1 * 30;
const minute5 = minute(5);
const minute20 = minute(20);

const rateLimit = new CommandLimiter(limits);
let start_time: number|void;
let broadcasting = false;
let chatterInterval: NodeJS.Timer|null;
let eventInterval: NodeJS.Timer|null;
let subsonly = false;
let chatters: Array<string>;

export async function fetchChatters() {
    console.log('fetching chatters...');
    const response = await fetch(`https://tmi.twitch.tv/group/user/${data_channel}/chatters`, { method: 'GET' });
    if (response.ok) {
        const { chatters: { moderators, viewers } } = await response.json();
        chatters = [...viewers, ...moderators];
        console.log('got chatters:', chatters);
    }
}
fetchChatters();
chatterInterval = setInterval(fetchChatters, minute5);


const startStream = (userstate: DirtyUser, channel: string) => {
    if (isMod(userstate)) {
        chatterInterval = setInterval(fetchChatters, minute5);
        broadcasting = true;
        start_time = Date.now();
        eventInterval = setInterval(() => {
            api.actions.distributeCurrency(chatters, subsonly);
            bot.action(data_channel, 'Tokens have been distributed! (+20)');
        }, minute20);
        bot.action(data_channel, 'Hamlo >D');
    }
};

const endStream = (userstate: DirtyUser) => {
    if (isMod(userstate)) {
        clearInterval()
        broadcasting = false;
        start_time = undefined;
        if (eventInterval !== null) clearInterval(eventInterval);
        if (chatterInterval !== null) clearInterval(chatterInterval);
        bot.action(data_channel, 'Gooooooooooooobie!');
    }
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
const say_bounced = debounce((s) => { bot.action(data_channel, s) }, second2);

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
    }, second1);
};

const getWinner = () => {
    const result = api.subs.requests.pickWinner();
    console.log(result);
    setTimeout(() => {
        dangerSay(`${result[0]}, requesting ${result[1]}!`);
        dangerSay('Okay?');
    }, second4);
};

let tricking = false;


let usernameSet: Set<string> | undefined;

const commands = async (channel: string, userstate: DirtyUser, message: string, self: boolean) => {
    if (self) return;
    api.user.dirty.upsert(userstate);

    if (broadcasting && tricking) {
        api.events.halloween.handleMessage(userstate);
    }

    if (enableLogging) {
        api.word.saveWords(userstate, message);
    }

    if (usernameSet !== undefined) {
        usernameSet.add(userstate.username);
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
    const [car, ...cdr] = message.replace('!', '').toLowerCase().split(' ');
    if (limits[car] !== undefined) {
        if (rateLimit.enforce(userstate, car)) {
            if (enableLogging) {
                logAction(userstate, `SKIPPED::${message}`);
            }
            return;
        }
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
            bot.action(channel, actions.uptime(start_time));
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
            }, second30);
            break;

        // /**
        //  * tryagain
        //  */
        // case 'tryagain':
        //     if (isMod(userstate)) {
        //         getWinner();
        //     }
        //     break;

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
            const result = await actions.hug(userstate, cdr[0]);
            bot.action(channel, result);
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
                if (cdr[0] === 'start') {
                    if (!broadcasting) {
                        startStream(userstate, channel);
                    } else {
                        bot.action(channel, 'We\'re already broadcasting, silly');
                    }
                } else if (cdr[0] === 'end') {
                    if (broadcasting) {
                        endStream(userstate);
                    } else {
                        bot.action(channel, 'We aren\'t streaming, silly');
                    }
                } else {
                    bot.action(channel, 'invalid syntax - !broadcast [start|end]');
                }
            }
            break;

        /**
         * event|giveaway
         */
        case 'event':
        case 'giveaway':
            say(`From November 26th - 30th, it's the Birdsgiving giveaway! Details here: http://bit.ly/birdsgiving`);
            break;

        // case 'raffle':
        //     if (isMod(userstate) && usernameSet === undefined) {
        //         usernameSet = new Set();
        //         bot.action(channel, 'Giveaway starts now! Talk in chat to enter the raffle.');
        //         setTimeout(() => {
        //             if (usernameSet !== undefined) {
        //                 const names = [...usernameSet];
        //                 const i = parseInt(`${names.length * Math.random()}`, 10);
        //                 bot.action(channel, 'The winner is.........');
        //                 setTimeout(() => {
        //                     bot.action(channel, `${names[i]}!`);
        //                     bot.action(channel, 'Congratulations!');
        //                 }, second1);
        //
        //                 usernameSet = undefined;
        //             } else {
        //                 say('Get bebop, something went wrong :c');
        //             }
        //         }, second30);
        //     }
        //     break;

        /**
         * balance
         */
        case 'balance':
        case 'spicybalance':
            bot.action(channel, actions.balance(userstate));
            break;

        case 'purchase':
            const response = actions.purchase(userstate, cdr[0], cdr[1]);
            if (response !== undefined) {
                bot.action(channel, response);
            }
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

        case 'subscribers':
            if (isMod(userstate)) {
                if (cdr[0] === 'on' && subsonly !== true) {
                    subsonly = true;
                    bot.say(channel, 'subs only, activate!');
                } else if (cdr[0] === 'off' && subsonly !== false) {
                    bot.say(channel, 'subs only, deactivate!');
                    subsonly = false;
                } else {
                    bot.say(channel, `subs only=${subsonly}`)
                }
            }
            break;

        case 'givememoney':
            if (userstate.username === 'bebop_bebop') {
                console.log('ok');
                await api.actions.distributeCurrency(chatters, subsonly);
                bot.action(channel, 'ok!');
            } else {
                bot.action(channel, 'lol nty');
            }
            break;

        case 'raffle':
            if (isMod(userstate)) {
                raffle();
            }
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

bot.connect();

export default bot;
