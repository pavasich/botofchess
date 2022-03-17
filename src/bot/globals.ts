import fetchUtil from 'twitch-js/lib/utils/fetch'

import { access_token, refresh_token, client_id, client_secret } from './secrets';

export const channel: string = 'rookuri';
export const channel_id: number = 142204178;

export const options: object = {
  username: 'botofchess',
  token: access_token,
  onAuthenticationFailure: () =>
      fetchUtil('https://id.twitch.tv/oauth2/token', {
        method: 'post',
        search: {
          grant_type: 'refresh_token',
          refresh_token,
          client_id,
          client_secret,
        },
      }).then((response) => response.accessToken)
};

export const coin_sides: Array<string> = ['heads', 'tails'];
