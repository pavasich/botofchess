import fs from 'fs';
import path from 'path';
import data from './data.json';
import debounce from './debounce';
import emotes from './emotes';
import GLOBALS from './globals';
import { default as bot } from './client';

const datapath = path.resolve(__dirname, './data.json');


/**
 *   G L O B A L S
 */

const { OPTIONS, START_TIME, COIN_SIDES, SHAME_QUOTES, QUOTES } = GLOBALS;

const channel = OPTIONS.channels[0];

let { shames, suggestions } = data;


/**
 *   S E T U P
 */
console.log('running!');

const say_bounced = debounce((s) => { bot.action(channel, s) }, 2000);

const say = (s) => say_bounced(s);
const dangerSay = (string) => bot.action(channel, string);

const save = () => {
  console.log('saving data...');
  fs.writeFileSync(datapath, JSON.stringify({
    shames,
    suggestions,
  }));
};

bot.on('connected', function(address, port) {
  say('I\'m alive!!');
  setInterval(save, 300000);
});

/**
 *   F U N C T I O N S
 */
const shame = () => {
  shames += 1;
  const i = Math.floor(Math.random() * SHAME_QUOTES.length);
  say(`${SHAME_QUOTES[i]} (${shames} total)`);
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
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
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
    case 'games':
    case 'gameslist':
      say('https://docs.google.com/document/d/1TkZEpv6Rqemw-5cezYN0CnRH64sR_h-Xsp_SCE6gd74/edit#heading=h.brs1odxkxlgf');
      return;
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
                bot.action(channel, `@${name1} hugs @${name2}   :3`);
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
}

bot.on('chat', commands);

bot.on('disconnected', function(reason) {
  save();
});

module.exports = bot;
