import fs from 'fs';
import path from 'path';
import data from '../data.json';
import debounce from './debounce';
import emotes from './emotes';
import { start_time, coin_sides, shame_quotes, quotes, channel } from './globals';
import bot from './client';
import async from './async';

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

const say = (s) => say_bounced(s);
const dangerSay = (string) => bot.action(channel, string);

const save = () => {
  console.log('saving data...');
  fs.writeFileSync(datapath, JSON.stringify({
    shames,
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
  const i = Math.floor(Math.random() * shame_quotes.length);
  say(`${shame_quotes[i]} (${shames} total)`);
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
  const result = coin_sides[Math.floor(Math.random() * 2)];
  setTimeout(() => {
    bot.action(channel, `   ${result} !`);
  }, 1500);
};

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

const sayQuote = () => {
  const [quote, user, date] = quotes[Math.floor(Math.random() * quotes.length)];
  say(`local   "${quote}" - ${user}, ${date}`);
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
     *   D I S C O R D
     */
    case 'discord':
      discord();
      return;

    /**
     *   H E L P
     */
    case 'help':
      say('!shame , !flip , !roll (number) , !mostwanted , !stream , and !imanerd for bot specs.');
      return;

    /**
     *   I ' M   A   N E R D
     */
    case 'imanerd':
      say('Made in JavaScript, using the tmi.js package. Shames are saved as JSON to bebop\'s PC. More details will be available as the bot gains functionality :3');
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
};

bot.on('chat', commands);

bot.on('disconnected', function(reason) {
  save();
});

export default bot;
