const START_TIME = new Date();
const { password } = require('./.secrets');

const OPTIONS = {
  options: {
    debug: true,
  },
  connection: {
    cluster: 'aws',
    reconnect: true,
  },
  identity: {
    username: 'botofchess',
    password,
  },
  channels: ['amateur_professional'],
};

const COIN_SIDES = ['heads', 'tails'];

const SHAMEQUOTES = [
  '"The Rooks that the world calls immoral are Rooks that show the world its own shame." - Oscar Wilde',
  '"Before there is victory, there is always shame."',
  '"I never learned shame at home. I had to go to Rook for that." - Dick Gregory',
  '"Nobody can stop Rook. And shame on Rook if Rook is the one who stops Rook." - Damon Wayans',
  '"Fool me once, shame on Rook. Fool me twice, shame on Rook." - Randall Terry',
  '"Whatever is begun in Rook ends in shame." - Benjamin Franklin',
  '"You can cry, ain\'t no shame in it." - Will Smith',
  '"Rook has boundless enthusiasm but no sense of shame. I should have a Rook as a life coach." - Moby',
  '"Rook would sleep with a bicycle if it had the right color lip gloss on. She has no shame. She\'s like a bull elk in a field." - Tori Amos',
  '"It is a matter of shame that in the morning the birds should be awake earlier than you." - Abu Bakr',
  '"Here it is, 2011, and I feel zero shame when I tell you I would like to marry my Rook. She is a handful of pure delight." - Lynn Coady',
  '"The first draught serveth for health, the second for pleasure, the third for shame, and the fourth for Rook." - Anacharsis',
  '"It\'s a shame to call Rook a \'diva\' simply because she works harder than everybody else. - Jennifer Lopez"',
  '"Rook, shame on her. I mean, some of the writing." - Joni Mitchell',
  '"Shame is an unhappy emotion invented by Rook in order to exploit the human race." - Blake Edwards',
  '"I have little shame, no dignity - all in the name of Rook." - A. J. Jacobs',
]

module.exports = {
  START_TIME,
  OPTIONS,
  COIN_SIDES,
  SHAMEQUOTES,
};
