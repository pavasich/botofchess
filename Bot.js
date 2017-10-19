require('babel-register');

const fs = require('fs');
const path = require('path');
const tmi = require('tmi.js');
const _ = require('lodash');
const async = require('./async');
const data = require('./data.json');
const debounce = require('./debounce');
const emotes = require('./emotes');
const GLOBALS = require('./globals');
const treatLink = 'https://docs.google.com/document/d/1AA3H6z1y1ERKxdnyq-ctZRR4jAy2tmMdkdt_ShfVGzk/edit?usp=sharing';
let quotes = require('./quotes.json');

const datapath = path.resolve(__dirname, './data.json');
const topics = require('./topics.js');

const getTrick = require('./tricks.js');

/**
 *   G L O B A L S
 */

const { OPTIONS, START_TIME, COIN_SIDES, SHAMEQUOTES } = GLOBALS;

const channel = OPTIONS.channels[0];

let { shames, suggestions } = data;

const requestsByUser = {};
const requestsByGame = {};

const TRICK_TIMEOUT = 1000 * 60 * 10;

/**
 *   S E T U P
 */
var bot = new tmi.client(OPTIONS);

console.log('running!');

const say_bounced = debounce((s) => { bot.action(channel, s) }, 2000);

const say = (s) => say_bounced(s);
const dangerSay = (string) => bot.action(channel, string);

const save = () => {
  console.log('saving data...');
  fs.writeFileSync(datapath, JSON.stringify({
    shames,
    suggestions,
    quotes,
  }));
};

bot.on('connected', function(address, port) {
  say('I\'m alive!!');
  setInterval(save, 300000);
});


const PAINT_TIME = [
  'Bebop (@serbosaurus) will draw you a character of your choice in MSPaint',
  '@StolenVirginsWings will draw you a character of your choice in MSPaint',
  '@Amateur_Professional will draw you a character of your choice in MSPaint',
  '@gravetch will draw you a character of your choice in MSPaint',
  '@neonphara will draw you a character of your choice in MSPaint',
];

let paintTime = _.shuffle(PAINT_TIME.slice());
let tricksters = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 3,
  g: 2,
};

const getWinner = (visitors) => {
  const keys = _.keys(visitors);
  const o = _.cloneDeep(visitors);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!_.has(tricksters, k)) {
      tricksters[k] = 1;
    }
    o[k] = tricksters[k];
  }

  const n = keys.length;
  let sigma = 0;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const t = 1 / o[k];
    o[k] = t;
    sigma += t;
  }

  sigma = 1 / sigma;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    o[k] *= sigma;
  }

  let p = Math.random();
  let sum = 0;
  let final = _.shuffle(keys);
  for (let i = 0; i < n; i++) {
    const k = final[i];
    sum += o[k];
    if (sum > p) {
      tricksters[k] += 1;
      return k;
    }
  }
}

console.log(getWinner({
  b: 1, e: 1, x: 1,
}))

//  S P O O P T O W N
let visitors = false;
const trickOrTrick = () => {
  visitors = {};
  dangerSay('Trick or treat! Who\'s at the door?');
  setTimeout(() => {
    visitors = Object.keys(visitors);
    if (visitors.length === 0) {
      dangerSay('Huh. No one\'s here.');
    } else {
      const winner = getWinner(visitors);

      dangerSay(`Ah, ${winner}!`);
      setTimeout(() => {
        let trick = getTrick();
        if (trick === 'PAINT TIME') {
          trick = paintTime.pop();
          if (!paintTime.length) {
            paintTime = _.shuffle(PAINT_TIME.slice());
          }
        }

        dangerSay(trick);
      }, 2000);
    }
    visitors = false;
  }, 1000 * 45);
  setTimeout(() => {
    dangerSay('Time is almost up! Type a message in chat to be eligible for a trick!');
  }, 1000 * 30);
};

setInterval(trickOrTrick, TRICK_TIMEOUT);


/**
 *   F U N C T I O N S
 */
const shame = (s) => {
  shames += 1;
  const i = Math.floor(Math.random() * SHAMEQUOTES.length);
  say(`${SHAMEQUOTES[i]} (${shames} total)`);
};



const discord = () => {
  say('https://discord.gg/K8mtM7s');
};

const goHome = (name) => {
  if (name === 'serbosaurus' || name === channel) {
    bot.action(channel, 'no, im not ready to go...');
    bot.disconnect();
  } else {
    say('bitch you can\'t tell me what to do');
  }
};

const flipCoin = (name) => {
  bot.action(channel, `${name} flips a coin...`);
  const result = COIN_SIDES[Math.floor(Math.random() * 2)];
  setTimeout(() => {
    bot.action(channel, `   ${result} !`);
  }, 1500);
};

const uptime = () => {
  let running = new Date() - START_TIME;
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

const sayQuote = () => {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  say(`   "${q.q}" - ${q.d}`);
};

const rollDie = (cmd, name) => {
  let roll = cmd.split(' ')[1];
  if (typeof roll === 'undefined') return;
  if (roll.length < 1) return;
  if (roll[0].toLowerCase() === 'd' && /^\d+$/.test(roll.slice(1))) {
    roll = roll.slice(1);
  }
  if (/^\d+$/.test(roll)) {
    roll = parseInt(roll);
    if (roll && roll > 0) {
      const res = Math.ceil(Math.random() * roll);
      bot.action(channel, `${name} rolls a d${roll}...`);
      setTimeout(() => {
        bot.action(channel, `   ${res} !`);
      }, 1500);
    }
  }
};

const suggestGame = (cmd, name) => {
  const sug = cmd.replace('suggest ', '').toLowerCase();
  console.log(sug);
  if (sug.length > 1) {
    if (typeof suggestions[sug] === 'undefined') {
      suggestions[sug] = { [name]: 1 }
    } else {
      suggestions[sug][name] = 1;
    }

    const users = Object.keys(suggestions[sug]);
    const s = users.length > 1 ?
      `Thanks! ${users.length} people have suggested "${sug}" so far.` :
      `Thanks! You are the first person to suggest "${sug}".`;

    say(s);
  }
};

const mostWanted = () => {
  const ls = Object.keys(suggestions)
  .map(s =>
    ({ title: s, count: Object.keys(suggestions[s]).length }))
  .sort((a, b) => b.count - a.count);
  say(`"${ls[0].title}" is the most requested game so far! (${ls[0].count})`)
}

const vote = () => {

}

const commands = (channel, userstate, message, self) => {
  if (self) return;

  if (visitors) {
    visitors[userstate.username] = 1;
  }

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
    return;
  }

  if (message[0] !== '!') {
    return;
  }

  console.log('checking out a message', userstate, message);

  const cmd = message.replace('!', '').toLowerCase();

  const tokens = cmd.split(' ');



  switch (cmd) {
    /**
     *   S H A M E
     */
    case 'shame':
    case 'shametoken':
      shame();
      return;

    /**
     *   G O   H O M E
     */
    case 'go home, you\'re drunk':
      goHome(userstate.username);
      return;

    /**
     *   F L I P   C O I N
     */
    case 'flip':
      flipCoin(userstate.username);
      return;

    /**
     *   M O S T   W A N T E D
     */
    case 'mostwanted':
    case 'mostWanted':
    case 'most wanted':
      mostWanted();
      return;

    /**
     *   D I S C O R D
     */
    case 'discord':
      discord();
      return;

    /**
     *   H E L P
     */
    case 'help':
      say('!shame , !flip , !roll (number) , !suggest (string) , !mostwanted , !stream , and !imanerd for bot specs.');
      return;

    /**
     *   I ' M   A   N E R D
     */
    case 'imanerd':
      say('Made in JavaScript, using the tmi.js package. Shame tokens & game suggestions are saved as JSON to serbosaurus\' PC. More details will be available as the bot gains functionality :3');
      return;

    /**
     *   U P T I M E
     */
    case 'stream':
    case 'uptime':
      uptime();
      return;

    /**
     *   S T E A M
     */
     case 'steam':
      say('steamcommunity.com/id/birdofchess');
      return;

    /**
     *   Q U O T E
     */
    case 'quote':
      sayQuote();
      return;
  }


  /**
   * H U G
   */
  if (tokens[0] === 'hug') {
    if (tokens[1] && tokens[1] !== 'undefined') {
      try {
        const name1 = userstate.username.replace('@', '').toLowerCase();
        const name2 = tokens[1].replace('@', '').toLowerCase();

        if (name1 === name2) {
          bot.action(channel, `@${name1} is wrapped up in a self-hug. Weird.`);
        } else if (name2 === 'botofchess') {
          bot.action(channel, `@${name1} hugged me! *blush*`);
        } else {
          async({
            host: 'tmi.twitch.tv',
            path: 'group/user/birdofchess/chatters',
            callback: ({ chatters: { moderators, viewers } }) => {
              if (moderators.includes(name2) || viewers.includes(name2)) {
                bot.action(channel, `@${name1} hugs @${target}   :3`);
                return;
              }

              bot.action(channel, `@${name1} hugs ${name2}.`);
            },
          });
        }
      } catch (e) {
        say('What are you trying to do to me?!');
        console.log(e);
      }
    }
    return;
  }

  /**
   *   R O L L   D I E
   */
  if (tokens[0] === 'roll') {
    rollDie(cmd, userstate.username);
    return;
  }

  /**
   *   S U G G E S T   G A M E
   */
  if (tokens[0] === 'suggest') {
    suggestGame(cmd, userstate.username);
    return;
  }

  if (tokens[0] === 'trick') {
    if (userstate.mod || userstate.username === 'birdofchess') {
      trickOrTrick();
    }
  }

  if (tokens[0] === 'treat' || tokens[0] === 'treats') {
    if (userstate.mod || userstate.username === 'birdofchess') {
      const treat = `Head on over to ${treatLink} to pick your prize!`;
      dangerSay(treat);
    }
  }

  if (tokens[0] === 'event') {
    dangerSay('When botofchess says Trick or Treat, talk in chat to be counted. After some time passes, she\'ll pick a winner. Donate $5 or more for a treat!');
  }
}

bot.on('chat', commands);

bot.on('disconnected', function(reason) {
  save();
});


getWinner();


module.exports = bot;
