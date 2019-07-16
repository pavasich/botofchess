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
import { setState, state } from './state';
import { fetchChatters } from '../api/user/fetch-chatters';

async function getChatters() {
    const chatters = await fetchChatters();
    setState({
        chatters,
    });
}

getChatters();

setState({
    chatterInterval: setInterval(getChatters, t.minute5)
});


/** start & end stream */
function startStream(userstate: DirtyUser) {
    if (isMod(userstate)) {
        if (state.chatterInterval !== null) {
            clearInterval(state.chatterInterval as NodeJS.Timer);
            setState({
                chatterInterval: null,
            });
        }

        setState({
            chatterInterval: setInterval(fetchChatters, t.minute5),
            broadcasting: true,
            startTime: Date.now(),
        });

        if (state.enableEvent) {
            setState({
                eventInterval: setInterval(() => {
                    api.actions.distributeCurrency(state.chatters, state.subsonly);
                    bot.action(
                        data_channel,
                        `Tokens have been distributed! (+${20 * api.actions.getCurrencyMultiplier()})`,
                    );
                }, t.minute20)
            });
        }
        bot.action(data_channel, 'Hamlo >D');
    }
}

function endStream(userstate: DirtyUser) {
    if (isMod(userstate)) {
        setState({
            broadcasting: false,
            startTime: undefined,
        });

        if (state.eventInterval !== null) {
            clearInterval(state.eventInterval);
            setState({
                eventInterval: null,
            })
        }

        if (state.chatterInterval !== null) {
            clearInterval(state.chatterInterval);
            setState({
                chatterInterval: null,
            });
        }

        bot.action(data_channel, 'Gooooooooooooobie!');
    }
}


function logAction(userstate: DirtyUser, string: string) {
    if (state.enableLogging) {
        api.log(`INFO::${userstate['display-name']}::${string}::${(new Date()).toJSON()}`);
    }
}


/** S E T U P */
console.log('running!');
const say_bounced = debounce((s) => { bot.action(data_channel, s) }, t.second2);


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
    return bot.action(data_channel, string);
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


/** on connect */
bot.on('connected', function() {
    say('I\'m alive!!');
});


/**
 * goHome
 * @param {string} name
 */
function goHome(name: string) {
    if (name === 'serbosaurus' || name === data_channel) {
        bot.action(data_channel, 'no, im not ready to go...');
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


async function commands(channel: string, userstate: DirtyUser, message: string, self: boolean) {
    if (self) return;
    api.user.dirty.upsert(userstate);

    if (state.broadcasting && state.tricking) {
        api.events.halloween.handleMessage(userstate);
    }

    if (state.enableLogging) {
        api.word.saveWords(userstate, message);
    }

    if (state.usernameSet !== undefined) {
        state.usernameSet.add(userstate.username);
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
        if (state.rateLimit.enforce(userstate, car)) {
            if (state.enableLogging) {
                logAction(userstate, `SKIPPED::${message}`);
            }
            return;
        }
    }

    let writeLog = true;

    switch (car) {
        /** game list url */
        case 'games':
        case 'gameslist':
            say('https://bit.ly/2GqYEfS');
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

        /** discord url */
        case 'discord':
            bot.action(channel, api.messages.discord.url);
            break;

        /** ls commands */
        case 'help':
        case 'commands':
            bot.action(channel, api.messages.help);
            break;

        /** imanerd */
        case 'imanerd':
            bot.action(channel, api.messages.imanerd);
            break;

        /** stream; uptime */
        case 'stream':
        case 'uptime':
            bot.action(channel, actions.uptime(state.startTime));
            break;

        /** steam url */
        case 'steam':
            say(api.messages.steam);
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
            bot.action(channel, result);
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
                        bot.action(channel, api.messages.broadcast.alreadyStreaming);
                    }
                } else if (cdr[0] === 'end') {
                    if (state.broadcasting) {
                        endStream(userstate);
                    } else {
                        bot.action(channel, api.messages.broadcast.notStreaming);
                    }
                } else {
                    bot.action(channel, api.messages.broadcast.syntax);
                }
            }
            break;

        /** description of the current event */
        case 'event':
            say(`Nothing for now!`);
            break;

        /** display user's current ticket & token balance */
        case 'balance':
        case 'spicybalance':
            bot.action(channel, actions.balance(userstate));
            break;

        /** spend tokens on tickets */
        case 'purchase':
            const response = actions.purchase(userstate, cdr[0], cdr[1]);
            if (response !== undefined) {
                bot.action(channel, response);
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

        /** ls final fantasy 14 characters */
        case 'ffxiv':
            say(api.messages.ffxiv.character_0);
            break;

        /** ls guild wars 1 characters */
        case 'gw1':
            say(api.messages.gw1.character);
            break;

        /** ls guild wars 2 characters */
        case 'gw2':
            say(api.messages.gw2.character);
            break;

        /** battle.net user identity */
        case 'battlenet':
        case 'bnet':
        case 'ow':
        case 'overwatch':
        case 'btag':
        case 'battletag':
            say(api.messages.battlenet.battletag);
            break;

        /** ls elder scrolls online characters */
        case 'eso':
            say(api.messages.eso.character);
            break;

        /** ls warframe characters */
        case 'warframe':
            say(api.messages.warframe.character);
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
                await api.actions.distributeCurrency(state.chatters, state.subsonly);
                bot.action(channel, 'ok!');
            } else {
                bot.action(channel, 'lol nty');
            }
            break;


        /** raffle off a prize via user tickets */
        case 'raffle':
            if (isMod(userstate)) {
                raffle();
            }
            break;

        /** team true garbage */
        case 'teamtrue':
            bot.action(channel, api.messages.teamTrueAbout);
            break;

        /** together to the top garbage */
        case 'tttt':
            bot.action(channel, api.messages.ttttAbout);
            break;

        /** give away something to chatters */
        case 'giveaway':
            if (isMod(userstate)) {
                if (typeof cdr[0] === 'string' && cdr[0].length > 0) {
                    const item = cdr.join(' ');
                    if (item.replace(' ', '').length > 0) {
                        bot.action(channel, `Starting the ${item} giveaway! Say "!enter" in chat to be eligible! You have 30 seconds!`);
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

        /** enter a giveaway */
        case 'enter':
            api.events.giveaway.enter(userstate);
            break;

        /** stream gifts url */
        case 'streamgifts':
            bot.action(channel, api.messages.streamGifts);
            break;

        /** change token distribution multiplier */
        case 'multiplier':
            if (typeof cdr[0] === 'string' && cdr[0].length > 0) {
                if (isMod(userstate)) {
                    const result = api.actions.setCurrencyMultiplier(cdr[0]);
                    if (result) {
                        bot.action(channel, `updated :: payout = ${20 * result}`);
                    }
                }
            } else {
                bot.action(channel, `Current multiplier: ${api.actions.getCurrencyMultiplier()}`);
            }
            break;

        /** old promotional material */
        case 'skyforge':
            bot.action(channel, `Sponsored: Skyforge, a beautiful, MMORPG game with awesome grinding and battles. Think it looks fun? Check it out here: https://wehy.pe/3/birdofchess`);
            break;

        /** shoutout a twitch streamer */
        case 'shoutout':
        case 'so': {
            if (isMod(userstate)) {
                if ((typeof cdr[0] === 'string') && (cdr[0].length > 0)) {
                    const shoutout = await api.messages.shoutout(cdr[0]);
                    if (typeof shoutout === 'string') {
                        bot.action(channel, shoutout);
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
                    bot.action(channel, result);
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
                    bot.action(channel, result);
                }
            }
            break;
        }

        /** destroy all tickets */
        case '__danger__purge__wallets__': {
            if (userstate.username === 'bebop_bebop' && isMod(userstate)) {
                const result = api.__danger.__purge__wallets__();
                bot.action(channel, result);
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



bot.on('chat', commands);

bot.on('disconnected', function() {
    process.exit(0);
});

bot.connect();

export default bot;
