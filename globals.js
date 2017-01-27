const START_TIME = new Date();
import { secrets } from './.secrets';
const { password } = secrets;

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
  channels: ['birdofchess'],
};

const COIN_SIDES = ['heads', 'tails'];

module.exports = {
  START_TIME,
  OPTIONS,
  COIN_SIDES,
};
