import { pick } from '../../util/arrays';

const winners = new Set();
const requesters = new Set();
interface Requests {
  [key: string]: string
}
const requests: Requests = {};

/**
 * takeRequest
 * @param {string} username
 * @param {string} requestedGame
 * @returns {boolean} - request was successful or not
 */
export const takeRequest = (username: string, requestedGame: string): boolean => {
  console.log(username, requestedGame);
  if (winners.has(username)) return false;
  if (requesters.has(username)) return false;

  requests[username] = requestedGame;
  requesters.add(username);
  console.log(requests);
  return true;
};

/**
 * pickWinner
 * @returns {string} - winner of the raffle | an error
 */
export const pickWinner = () => {
  console.log(winners);
  console.log(requesters);
  console.log(requests);
  try {
    const array = requesters.size > 0
      ? [...requesters]
      : [...winners];
    const winner = pick(array);
    console.log(winner);
    winners.add(winner);
    console.log(winner, requests[winner]);
    return [winner, requests[winner]];
  } catch (e) {
    return ['error!', 'error!'];
  }
};

/**
 * clear
 * @returns {boolean} - successfully cleared
 */
export const clear = () => {
  try {
    const keys = Object.keys(requests);
    for (let i = 0, n = keys.length; i < n; i++) {
      delete requests[keys[i]];
    }
    requesters.clear();
    return true;
  } catch (e) {
    return false;
  }
};

