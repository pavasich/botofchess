const RARE = 'RARE';
const NORMAL = 'NORMAL';

const ACTIVE_SET = new Set([RARE, NORMAL]);

function Treat(p, message, once) {
  this.p = p;
  this.message = message;
  this.once = once;
}


const TREATS = [
  new Treat(NORMAL, 'Special spooky-bird discord icon/title'),
  new Treat(NORMAL, 'If you aren\'t a sub, you can request a game at the next sub request stream! If you are, you can double-request!'),
  new Treat(RARE, 'A birdofchess mug and bag of local coffee!'),
  new Treat(NORMAL, 'A George & Senka Halloween photoshoot, just for you!'),
  new Treat(RARE, 'Character sheet commission by @StolenVirginsWings! (fullbody, fully colored, plus weapons/accessories)', true),
  new Treat(NORMAL, 'Bebop will develop and program a botofchess function based on your suggestion!'),
  new Treat(NORMAL, 'Character sketch commission! (bust, half-body, or full-body totalling a $25 value)'),
  new Treat(NORMAL, 'Halloween Cards Against Humanity with Rook and players of your choice off-stream!'),
  new Treat(RARE, 'A birdofchess emote designed by you, drawn by @StolenVirginsWings, and approved by Rook to be added to the Discord server!', true),
  new Treat(RARE, 'A game from your Steam wishlist! ($30 or less)', true),
  new Treat(NORMAL, 'You and Rook will have a private gaming night off-stream!'),
  new Treat(RARE, 'Rook will record an audio-only cover of a song of your choice and send it to you!', true),
  new Treat(RARE, 'Rook has to switch one pre-scheduled non-holiday stream to a game of your choice.'),
  new Treat(NORMAL, 'Rook will bake and send you cookies! Let her know about allergies, etc!'),
  new Treat(RARE, 'Rook will host a special stream for you! You choose the game(s) and the playlist!'),
  new Treat(NORMAL, 'If you\'re not a sub, you can sign up for the next monthly sub event along with base-tier subs! If you are already subbed (we love you), you can sign up one tier sooner! If you\'re a BIRB OF LEGEND (you beautiful bastard), you can request a monthly event and it will be held in your honor!'),
  new Treat(NORMAL, 'Overwatch! @StolenVirginsWings will draw your portrait as your favorite character and pin it to the Overwatch channel in Discord!'),
];



const getTreat = () => {
  const rareP = .1;
  let normalP;
  let normalCount = 0;
  const treats = TREATS.filter((treat) => {
    if (!treat) return false
    
    if (treat.p === NORMAL) {
      normalCount++;
    }

    return true;
  });
  
  normalP = 1 / normalCount;
  
  const p = Math.random();
  let sigma = 0;
  
  for (let i = 0; i < treats.length; i++) {
    if (treats[i].p === NORMAL) {
      sigma += normalP;
    } else {
      sigma += rareP;
    }
    if (sigma > p) {
      const message = treats[i].message.slice();
      if (treats[i].once) {
        for (let j = 0; j < TREATS.length; j++) {
          if (TREATS[j]) {
            if (TREATS[j].message === message) {
              delete TREATS[j];
              break;
            }
          }
        }
      }
      return message;
    }
  }
};


module.exports = getTreat;
