import { password } from './secrets';

export const channel: string = 'birdofchess';
export const channel_id: number = 142204178;

export const options: object = {
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: 'botofchess',
    password,
  },
  channels: [`#${channel}`],
};

export const coin_sides: Array<string> = ['heads', 'tails'];
