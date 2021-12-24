import { password } from '../bot/secrets';

export const channel: string = 'rookuri';

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
