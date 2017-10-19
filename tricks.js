const RARE = 'RARE';
const NORMAL = 'NORMAL';

const ACTIVE_SET = new Set([RARE, NORMAL]);

const TRICKS = [
    {
        p: .0,
        effect: 'bot of chess announces your entrance',
    },
    {
        p: NORMAL,
        effect: 'You will have you Discord name changed for the month of October',
    },
    {
        p: NORMAL,
        effect: 'Rook drinks.',
    },
    {
        p: NORMAL,
        effect: 'Rook has to make a pun, RIGHT now!',
    },
    {
        p: RARE,
        effect: 'Rook writes you a fanfic',
    },
    {
        p: NORMAL,
        effect: 'Story Time! Rook will read aloud a bit of a terrible halloween story at the next break'
    },
    {
        p: NORMAL,
        effect: 'Story Time! Rook will read aloud a spoopy halloween story at the next break',
    },
    {
        p: NORMAL,
        effect: 'Brace yourself for a terrible joke',
    },
    {
        p: NORMAL,
        effect: 'meme time. Rook watches & reacts to a video of your choice. Nothing gross, mebebees.',
    },
    {
        p: NORMAL,
        effect: 'LIGHTS OUT. ROOK GAMES IN THE DARK WITH ONLY A FLASHLIGHT FOR 5 MINUTES',
    },
    {
        p: NORMAL,
        effect: 'Good Egg. You get the Good Egg title on Discord',
    },
    {
        p: NORMAL,
        effect: 'Song request! Choose the next song.',
    },
    {
        p: NORMAL,
        effect: 'Catch phrase! Rook has to say a catch phrase of your choice in reaction to events in-game for the duration of stream.'
    },
    {
        p: NORMAL,
        effect: 'Rook sings a line from a song of your choice!'
    },
    {
        p: RARE,
        effect: 'Rook will draw you a character of your choice.',
    },
    {
        p: NORMAL,
        effect: 'PAINT TIME',
    },
    {
        p: RARE,
        effect: 'BLIND. ROOK HAS TO PUT ON A BLINDFOLD FOR 1 MINUTE',
    },
    {
        p: NORMAL,
        effect: 'You get to create a !shame quote',
    },
    {
        p: RARE,
        effect: 'Pick a snack/food/beverage for Rook to prepare and bring on the next stream. Rook has to try it, no matter what it is!',
    },
    {
        p: NORMAL,
        effect: 'Wild Trick! Pick any non-rare trick that has already triggered and we\'ll do it again!',
    },
    {
        p: NORMAL,
        effect: 'Cat time! Senka is put on display.',
    },
    {
        p: NORMAL,
        effect: 'Cat time! George is put on display.',
    },
    {
        p: NORMAL,
        effect: '50/50: Cute Animals/Screaming',
    },
    {
        p: 0,
        effect: 'Overwatch! Rook, or some willing sacrifice that is not @madmanmax, must voice-act their character this round.',
    },
    {
        p: 0,
        effect: 'Overwatch! Choose a character for Rook or another player of your choice to switch to right now.',
    },
    {
        p: NORMAL,
        effect: 'In-game! Rook must announce herself to each party using a phrase of your choosing.',
    },
    {
        p: .0,
        effect: 'FFXIV! UGLY GLAM, ACTIVATE',
    },
    {
        p: .00,
        effect: '.......TREAT!',
    },
];

let rareCount = 0;
let normalCount;
const nuggies = TRICKS.filter(({ p }) => {
    if (p === RARE) rareCount++;
    return ACTIVE_SET.has(p);
});

normalCount = nuggies.length - rareCount;

// calculate probabilities
const rareP = .01;
let normalP = 1 - (rareCount * rareP);
normalP /= normalCount;

// assign probabilities
for (let i = 0; i < nuggies.length; i++) {
  const { p } = nuggies[i];
  if (p === RARE) {
    nuggies[i].p = rareP;
  } else {
    nuggies[i].p = normalP;
  }
}

const getTrick = () => {
  const p = Math.random();
  let sigma = 0;
  for (let i = 0; i < nuggies.length; i++) {
    const nug = nuggies[i];
    sigma += nug.p;
    if (sigma > p) {
      return nug.effect;
    }
  }
}

module.exports = getTrick;
