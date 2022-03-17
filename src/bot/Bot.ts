import debounce from 'lodash/debounce';

import api from '../api';
import raffle from '../api/currency/raffle';
import { BalanceAction } from '../api/currency/update-balance';
import Monologue from '../models/Monologue/index';
import emotes from '../util/emotes';

import actions from './actions';
import bot from './client';
import { channel as data_channel } from './globals';
import limits from './limits';
import { isMod, t } from './util';
import { setState, getState } from './state';
import run from '../api/events/halloween/run';
import { minute } from '../util/time-expand';
import draw from '../api/channel-points/draw';
import { ChannelPointReward } from './rewards';
import message_bank, { synonyms } from './message-bank';


async function distribute() {
    await api.actions.distributeCurrency(getState().subsonly);
    bot.me(
        CHANNEL,
        `Tokens have been distributed! (+${20 * api.actions.getCurrencyMultiplier()})`,
    );
}

const CHANNEL = `#${data_channel}`


/** start & end stream */
function startStream(userstate: DirtyUser) {
    if (isMod(userstate)) {
        setState({
            broadcasting: true,
            startTime: Date.now(),
        });

        const eventInterval = setInterval(() => run(CHANNEL, bot, speak), minute(12));
        setState({
            eventInterval,
        });
        bot.me(CHANNEL, 'Hamlo >D');
    }
}

function endStream(userstate: DirtyUser) {
    if (isMod(userstate)) {
        setState({
            broadcasting: false,
            startTime: undefined,
        });

        if (getState().eventInterval !== null) {
            clearInterval(getState().eventInterval as NodeJS.Timer);
            setState({
                eventInterval: null,
            })
        }

        bot.me(CHANNEL, 'Gooooooooooooobie!');
    }
}


function logAction(userstate: DirtyUser, string: string) {
    if (getState().enableLogging) {
        api.log(`INFO::${userstate['display-name']}::${string}::${(new Date()).toJSON()}`);
    }
}


/** S E T U P */
console.log('running!');
const say_bounced = debounce((s) => { bot.me(CHANNEL, s) }, t.second2);


/**
 * say
 * @param {string} s
 */
function say(s: string) {
    return say_bounced(s);
}


/**
 * dangerSay
 * @param {string} string
 */
function dangerSay(string: string) {
    return bot.me(CHANNEL, string);
}


/**
 * speak
 * @param {Monologue} monologue
 */
function speak(monologue: Monologue) {
    function recur(lines: Array<Line>) {
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
    }
    recur(monologue.lines);
}


/**
 * goHome
 * @param {string} name
 */
function goHome(name: string) {
    if (name === 'bebop_bebop' || name === data_channel) {
        bot.me(CHANNEL, 'no, im not ready to go...');
        bot.disconnect();
    } else {
        say('bitch you can\'t tell me what to do');
    }
}


function getWinner() {
    const result = api.subs.requests.pickWinner();
    console.log(result);
    setTimeout(() => {
        dangerSay(`${result[0]}, requesting ${result[1]}!`);
        dangerSay('Okay?');
    }, t.second4);
}

interface Message {
    channel: string;
    username: string;
    message: string;
    isSelf: boolean;
    tags: DirtyUser;
}

async function commands({ channel, username, message, isSelf, tags: userstate }: Message) {
    if (isSelf) return;
    api.user.dirty.upsert(userstate);
    const state = getState();
    if (state.broadcasting && state.tricking) {
        api.events.halloween.handleMessage(userstate);
    }

    if (state.enableLogging) {
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
        bot.me(channel, sillything.join(' '));
    }

    if (message[0] !== '!') {
        return;
    }

    console.log('checking out a message', username, message);
    const [car, ...cdr] = message.replace('!', '').toLowerCase().split(' ');
    if (limits[car] !== undefined) {
        if (state.rateLimit.enforce(userstate, car)) {
            if (state.enableLogging) {
                logAction(userstate, `SKIPPED::${message}`);
            }
            return;
        }
    }

    let writeLog = true;

    if (message_bank[car] !== undefined) {
        bot.me(channel, message_bank[car]);
        return;
    }

    const synonym = synonyms[car];
    if (synonym !== undefined) {
        bot.me(channel, message_bank[synonym]);
        return;
    }

    switch (car) {
        case 'draw':
            draw(cdr[0] as ChannelPointReward, parseInt(cdr[1], 10));
            break;

        /** shame */
        case 'shame':
        case 'shametoken':
            say(api.actions.shame());
            break;

        /** gohomeyousdrunk */
        case 'gohomeyousdrunk':
            goHome(userstate.username);
            break;

        /** coin flip ([0, 1] mod .5) */
        case 'flip':
        case 'flipcoin':
        case 'coinflip':
        case 'cointoss':
            speak(api.messages.flipCoin(userstate.username));
            break;

        case 'support': {
            speak(api.messages.support());
            break;
        }

        case 'set-reminder': {
            if (isMod(userstate)) {
                const notification = api.actions.setReminder(message, (s: string) => {
                    bot.me(channel, s);
                });
                bot.me(channel, notification);
            }
            break;
        }

        case 'pronouns': {
            speak(
                new Monologue()
                    .add("The birdfam is an LGBTQIA+ friendly space! If you'd like to set your pronouns in chat, download the extension for your browser of choice: ")
                    .add('Chrome: https://chrome.google.com/webstore/detail/twitch-chat-pronouns/agnfbjmjkdncblnkpkgoefbpogemfcii', 300)
                    .add('Firefox: https://addons.mozilla.org/en-US/firefox/addon/twitch-chat-pronouns/', 300)
                    .add('Once you have the addon installed, set it up at https://pronouns.alejo.io/', 300)
            );
            break;
        }

        case 'clear-reminder': {
            if (isMod(userstate)) {
                api.actions.clearReminder();
            }
            break;
        }

        /** stream; uptime */
        case 'stream':
        case 'uptime':
            bot.me(channel, actions.uptime(state.startTime));
            break;

        /** quote */
        case 'quote':
            speak(api.actions.getQuote());
            break;


        case 'donorquote':
            speak(api.actions.getQuote(true));
            break;

        /** start requests */
        case 'startrequests':
            api.subs.requests.clear();
            dangerSay(api.messages.startRequests[0]);
            dangerSay(api.messages.startRequests[1]);
            setTimeout(() => {
                dangerSay(api.messages.startRequests[2]);
                getWinner();
            }, t.second30);
            break;

        /** try again, sub request was bad */
        case 'tryagain':
            if (isMod(userstate)) {
                getWinner();
            }
            break;

        /** request game during sub request */
        case 'request':
            if (userstate.subscriber) {
                api.subs.requests.takeRequest(userstate.username, cdr.join(' '));
            }
            break;

        /** hug another user */
        case 'hug':
            const result = await actions.hug(userstate, cdr[0]);
            bot.me(channel, result);
            break;

        /** dice roll */
        case 'roll':
        case 'rolldice':
        case 'dice':
            const monologue = api.messages.rollDie(userstate.username, cdr[0]);
            if (monologue !== undefined) {
                speak(monologue);
            }
            break;

        /** start or end stream */
        case 'broadcast':
            if (isMod(userstate)) {
                if (cdr[0] === 'start') {
                    if (!state.broadcasting) {
                        startStream(userstate);
                    } else {
                        bot.me(channel, api.messages.broadcast.alreadyStreaming);
                    }
                } else if (cdr[0] === 'end') {
                    if (state.broadcasting) {
                        endStream(userstate);
                    } else {
                        bot.me(channel, api.messages.broadcast.notStreaming);
                    }
                } else {
                    bot.me(channel, api.messages.broadcast.syntax);
                }
            }
            break;

        /** display user's current ticket & token balance */
        case 'balance':
        case 'spicybalance':
            bot.me(channel, actions.balance(userstate));
            break;

        /** spend tokens on tickets */
        case 'purchase':
            const response = actions.purchase(userstate, cdr[0], cdr[1]);
            if (response !== undefined) {
                bot.me(channel, response);
            }
            break;

        /** enable logging - disabled by default */
        case 'enablelogging':
            if (isMod(userstate)) {
                setState({
                    enableLogging: true,
                });
            }
            break;

        /** disable logging */
        case 'disableLogging':
            if (isMod(userstate)) {
                setState({
                    enableLogging: false
                });
            }
            break;

        /** toggle subs-only mode */
        case 'subscribers':
            if (isMod(userstate)) {
                if (cdr[0] === 'on' && state.subsonly !== true) {
                    setState({
                        subsonly: true
                    });
                    bot.say(channel, 'subs only, activate!');
                } else if (cdr[0] === 'off' && state.subsonly !== false) {
                    bot.say(channel, 'subs only, deactivate!');
                    setState({
                        subsonly: false
                    });
                } else {
                    bot.say(channel, `subs only=${state.subsonly}`)
                }
            }
            break;

        /** give everyone tokens for stuff */
        case 'givememoney':
            if (userstate.username === 'bebop_bebop') {
                await api.actions.distributeCurrency(state.subsonly);
                bot.me(channel, 'ok!');
            } else {
                bot.me(channel, 'lol nty');
            }
            break;

        /** raffle off a prize via user tickets */
        case 'raffle':
            if (isMod(userstate)) {
                raffle();
            }
            break;

        /** give away something to chatters */
        case 'giveaway':
            if (isMod(userstate)) {
                if (typeof cdr[0] === 'string' && cdr[0].length > 0) {
                    const item = cdr.join(' ');
                    if (item.replace(' ', '').length > 0) {
                        bot.me(channel, `Starting the ${item} giveaway! Say "!enter" in chat to be eligible! You have 30 seconds!`);
                        api.events.giveaway.start((winnerName) => {
                            const reveal = new Monologue();
                            reveal
                                .add(`Time's up for the ${item} giveaway!`)
                                .add('The winner is...', 1000)
                                .add(`${winnerName}! Congratulations!`, 2000);
                            speak(reveal);
                        });
                    }
                }
            }
            break;

        /** give away something spooky to chatters */
        case 'treat':
            if (isMod(userstate)) {
                run(CHANNEL, bot, speak, true);
            }
            break;

        /** enter a giveaway */
        case 'enter':
            api.events.giveaway.enter(userstate);
            break;

        /** change token distribution multiplier */
        case 'multiplier':
            if (typeof cdr[0] === 'string' && cdr[0].length > 0) {
                if (isMod(userstate)) {
                    const result = api.actions.setCurrencyMultiplier(cdr[0]);
                    if (result) {
                        bot.me(channel, `updated :: payout = ${20 * result}`);
                    }
                }
            } else {
                bot.me(channel, `Current multiplier: ${api.actions.getCurrencyMultiplier()}`);
            }
            break;

        /** shoutout a twitch streamer */
        case 'shoutout':
        case 'so': {
            if (isMod(userstate)) {
                if ((typeof cdr[0] === 'string') && (cdr[0].length > 0)) {
                    const shoutout = api.messages.shoutout(cdr[0]);
                    if (shoutout !== undefined) {
                        bot.me(channel, shoutout);
                    }
                }
            }
            break;
        }

        /** manually update user's token balance */
        case 'update-balance': {
            if (isMod(userstate)) {
                const [username, action, amount] = cdr;
                if (
                    action === BalanceAction.inc
                    || action === BalanceAction.dec
                    || action === BalanceAction.set
                ) {
                    const result = api.currency.updateBalance(username, action, parseInt(amount, 10));
                    bot.me(channel, result);
                }
            }
            break;
        }

        /** manually update a user's ticket balance */
        case 'update-wallet': {
            if (isMod(userstate)) {
                const [username, action, type, amount] = cdr;
                if ((
                    action === BalanceAction.inc
                    || action === BalanceAction.dec
                    || action === BalanceAction.set
                ) && (
                    type === 'gw2'
                    || type === 'ffxiv'
                )) {
                    const result = api.currency.updateWallet(username, action, type, parseInt(amount, 10));
                    bot.me(channel, result);
                }
            }
            break;
        }

        /** destroy all tickets */
        case '__danger__purge__wallets__': {
            if (userstate.username === 'bebop_bebop' && isMod(userstate)) {
                const result = api.__danger.__purge__wallets__();
                bot.me(channel, result);
            }
            break;
        }

        default:
            writeLog = false;
            break;
    }

    if (writeLog && state.enableLogging) {
        logAction(userstate, message);
    }
}



bot.on('PRIVMSG', commands);

bot.on('disconnected', function() {
    process.exit(0);
});

(async function () {
    await bot.connect();
    await bot.join('rookuri');
    bot.say(CHANNEL, 'I\'m alive!!');
})();

export default bot;
