import Monologue from '../../util/Monologue';

export default (username, rollToken) => {
  if (typeof rollToken === 'string') {
    rollToken = rollToken.replace('d', '');
  }
  const number = parseInt(rollToken, 10);
  if (number === number) {
    const monologue = new Monologue();
    const result = Math.ceil(Math.random() * number);
    monologue
      .add(`${username} rolls a d${rollToken}...`)
      .add(`     ${result} !`, 1500);

    return monologue;
  }
  return undefined;
};
