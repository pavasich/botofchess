const winners = new Set();
const requesters = new Set();
const requests = {};

/**
 * takeRequest
 * @param {string} username 
 * @param {string} requestedGame 
 * @returns {boolean} - request was successful or not
 */
const takeRequest = (username, requestedGame) => {
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
const pickWinner = () => {
  console.log(winners);
  console.log(requesters);
  console.log(requests);
  try {
    const array = requesters.size > 0
      ? [...requesters]
      : [...winners];
    const winner = array[parseInt(Math.random() * array.length, 10)];
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
const clear = () => {
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

exports.takeRequest = takeRequest;
exports.pickWinner = pickWinner;
exports.clear = clear;
