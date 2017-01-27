const tmi = require('tmi.js');
const debounce = require('./debounce');
const fs = require('fs');
const async = require('./async');

/*   G L O B A L S        */
/**************************/
const GLOBALS = require('./globals');
const { OPTIONS, START_TIME, COIN_SIDES } = GLOBALS;

const data = require('./data.json');
let { shames, suggestions, quotes } = data;

/**************************/
/**************************/

/*   S E T U P            */
/**************************/
var bot = new tmi.client(OPTIONS);
bot.connect();
console.log('running!');

const say_bounced = debounce((s) => { bot.action('birdofchess', s) }, 2000);

const say = (s) => say_bounced(s);

const save = () => {
  console.log('saving data...');
  fs.writeFileSync('data.json', JSON.stringify({
    shames,
    suggestions,
    quotes,
  }));
};

bot.on('connected', function(address, port) {
  say('I\'m alive!!');
  setInterval(save, 300000);
});

/*   F U N C T I O N S    */
/**************************/
const shame = (s) => {
  shames += 1;
  say(`Before there is victory, there is always shame. (${shames} total)`);
};

const hug = (name, target) => {
  if (name === target) {
    say(`@${name} is wrapped up in a self-hug. Weird.`);
  } else {
    async({
      host: 'tmi.twitch.tv',
      path: 'group/user/birdofchess/chatters',
      callback: ({ chatters: { moderators, viewers } }) => {
        if (moderators.includes(target) || viewers.includes(target)) {
          say(`@${name} hugs @${target}   :3`);
        } else {
          say(`@${name} hugs ${target}.`);
        }
      },
    });
  }
};

const goHome = (name) => {
  if (name === 'serbosaurus' || name === 'birdofchess') {
    bot.action('birdofchess', 'no, im not ready to go...');
    bot.disconnect();
  } else {
    say('bitch you can\'t tell me what to do');
  }
};

const flipCoin = (name) => {
  bot.action('birdofchess', `${name} flips a coin...`);
  const result = COIN_SIDES[Math.floor(Math.random() * 2)];
  setTimeout(() => {
    bot.action('birdofchess', `   ${result} !`);
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
      bot.action('birdofchess', `${name} rolls a d${roll}...`);
      setTimeout(() => {
        bot.action('birdofchess', `   ${res} !`);
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

const commands = (channel, userstate, message, self) => {
  if (self) return;

  if (message.toLowerCase().includes('ayy')) {
    let ayy = 'ayy';
    for (let i = 0; i < 30; i++) {
      if (Math.random() > .5) { ayy += 'y'; }
    }
    say(ayy);
    return;
  }

  if (message[0] !== '!') {
    return;
  }

  console.log('checking out a message', userstate, message);

  const cmd = message.replace('!', '').toLowerCase();

  const tokens = cmd.split(' ');

  switch (cmd) {
    /*
        S H A M E
    */
    case 'shame':
    case 'shametoken':
      shame();
      return;

    /*
        G O   H O M E
    */
    case 'go home, you\'re drunk':
      goHome(userstate.username);
      return;

    /*
        F L I P   C O I N
    */
    case 'flip':
      flipCoin(userstate.username);
      return;

    /*
        M O S T   W A N T E D
    */
    case 'mostwanted':
    case 'mostWanted':
    case 'most wanted':
      mostWanted();
      return;

    /*
        H E L P
    */
    case 'help':
      say('!shame , !flip , !roll (number) , !suggest (string) , !mostwanted , !stream , and !imanerd for bot specs.');
      return;

    /*
        I ' M   A   N E R D
    */
    case 'imanerd':
      say('Made in JavaScript, using the tmi.js package. Shame tokens & game suggestions are saved as JSON to serbosaurus\' PC. More details will be available as the bot gains functionality :3');
      return;

    /*
        U P T I M E
    */
    case 'stream':
      uptime();
      return;

    /*
        Q U O T E
    */
    case 'quote':
      sayQuote();
      return;
  }

  /*
      H U G
  */
  if (tokens[0] === 'hug') {
    hug(userstate.username, tokens[1]);
    return;
  }

  /*
      R O L L   D I E
  */
  if (tokens[0] === 'roll') {
    rollDie(cmd, userstate.username);
    return;
  }

  /*
      S U G G E S T   G A M E
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
