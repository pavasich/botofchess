import fs from 'fs';
import path from 'path';
import data from '../data.json';
import debounce from './debounce';
import emotes from './emotes';
import { start_time, coin_sides, shame_quotes, channel } from './globals';
import bot from './client';
import async from './async';
import api from './api';

const datapath = path.resolve(__dirname, './data.json');

/**
 *   G L O B A L S
 */
let { shames } = data;

/**
 *   S E T U P
 */
console.log('running!');

const say_bounced = debounce((s) => { bot.action(channel, s) }, 2000);

/**
 * say
 * @param {string} s
 */
const say = (s) => say_bounced(s);

/**
 * dangerSay
 * @param {string} string
 */
const dangerSay = (string) => bot.action(channel, string);

/**
 * speak
 * @param {Monologue} monologue
 */
const speak = (monologue) => {
  const recur = (lines) => {
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
 * save
 */
const save = () => {
  console.log('saving data...');
  fs.writeFileSync(datapath, JSON.stringify({
    shames,
  }));
};

bot.on('connected', function() {
  say('I\'m alive!!');
  setInterval(save, 300000);
});

/**
 * shame
 */
const shame = () => {
  shames += 1;
  const i = Math.floor(Math.random() * shame_quotes.length);
  say(`${shame_quotes[i]} (${shames} total)`);
};


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
const goHome = (name) => {
  if (name === 'serbosaurus' || name === channel) {
    bot.action(channel, 'no, im not ready to go...');
    bot.disconnect();
  } else {
    say('bitch you can\'t tell me what to do');
  }
};

/**
 * flipCoin
 * @param {string} name
 */
const flipCoin = (name) => {
  bot.action(channel, `${name} flips a coin...`);
  const result = coin_sides[Math.floor(Math.random() * 2)];
  setTimeout(() => {
    bot.action(channel, `   ${result} !`);
  }, 1500);
};

/**
 * uptime
 */
const uptime = () => {
  let running = new Date() - start_time;
  running = parseInt(running / 1000);
  const hours = parseInt(running / (60 * 60));
  running %= (60 * 60);
  const minutes = parseInt(running / (60));
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

const getWinner = () => {
  const result = api.subs.requests.pickWinner();
  console.log(result);
  setTimeout(() => {
    dangerSay(`${result[0]}, requesting ${result[1]}!`);
    dangerSay('Okay?');
  }, 1000 * 4);
};


const commands = (channel, userstate, message, self) => {
  if (self) return;

  let sillything = '';

  let temp = message.split(' ');
  for (let i = temp.length - 1; i >= 0; i--) {
    if (emotes[temp[i]]) {
      sillything += temp[i] + ' ';
    }
  }


  if (message.toLowerCase().includes('ayy')) {
    let ayy = 'ayy';
    for (let i = 0; i < 30; i++) {
      if (Math.random() > .5) { ayy += 'y'; }
    }
    sillything += ayy;
  }

  if (sillything.length > 0) {
    bot.action(channel, sillything);
  }

  if (message[0] !== '!') {
    return;
  }

  console.log('checking out a message', userstate, message);
  const tokens = message.replace('!', '').toLowerCase().split(' ');
  const car = tokens[0];
  const cdr = tokens.slice(1);
  console.log('car', car, 'cdr', cdr);

  switch (car) {
    /**
     * games
     */
    case 'games':
    case 'gameslist':
      say('https://bit.ly/2GqYEfS');
      return;

    /**
     * shame
     */
    case 'shame':
    case 'shametoken':
      shame();
      return;

    /**
     * gohomeyousdrunk
     */
    case 'gohomeyousdrunk':
      goHome(userstate.username);
      return;

    /**
     * flip (coin)
     */
    case 'flip':
    case 'flipcoin':
    case 'coinflip':
    case 'cointoss':
      flipCoin(userstate.username);
      return;

    /**
     * discord
     */
    case 'discord':
      discord();
      return;

    /**
     * help
     */
    case 'help':
    case 'commands':
      say('!shame , !flip , !roll (number) , !quote , !hug , !stream [!uptime] , !discord , !steam , and !imanerd for bot specs.');
      return;

    /**
     * imanerd
     */
    case 'imanerd':
      say('Made in JavaScript, using the tmi.js package. Shames are saved as JSON to bebop\'s PC. More details will be available as the bot gains functionality :3');
      return;

    /**
     * stream; uptime
     */
    case 'stream':
    case 'uptime':
      uptime();
      return;

    /**
     * steam
     */
     case 'steam':
      say('steamcommunity.com/id/birdofchess');
      return;

    /**
     * quote
     */
    case 'quote':
      speak(api.actions.getQuote());
      return;

    case 'donorquote':
      speak(api.actions.getQuote(true));
      return;

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
      return;

    /**
     * tryagain
     */
    case 'tryagain':
      if (userstate.mod) {
        getWinner();
      }
      return;

    /**
     * request
     */
    case 'request':
      if (userstate.subscriber) {
        api.subs.requests.takeRequest(userstate.username, cdr.join(' '));
      }
      return;

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
              async({
                host: 'tmi.twitch.tv',
                path: 'group/user/birdofchess/chatters',
                callback: ({ chatters: { moderators, viewers } }) => {
                  if (moderators.includes(name2) || viewers.includes(name2)) {
                    bot.action(channel, `@${name1} hugs @${name2}   :3`);
                    return;
                  }

                  bot.action(channel, `@${name1} hugs ${name2}.`);
                },
              });
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
      return;

    /**
     * roll
     */
    case 'roll':
      const monologue = api.actions.rollDie(userstate.username, cdr[0]);
      if (monologue !== undefined) {
        speak(monologue);
      }
      return;

    default:
      return;
  }
}

bot.on('chat', commands);

bot.on('disconnected', function() {
  save();
});

export default bot;
