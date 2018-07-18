import Monologue from '../../models/Monologue';

export default (username: string, rollToken: string|number): Monologue|void => {
  let number: number;
  if (typeof rollToken === 'string') {
    let strNumber: string = rollToken;
    if (strNumber[0] === 'd') {
      strNumber = strNumber.slice(0);
    }
    number = parseInt(strNumber, 10);
  } else {
    number = rollToken;
  }
  if (number === number) {
    const monologue = new Monologue();
    const result = Math.ceil(Math.random() * number);
    monologue
      .add(`${username} rolls a d${rollToken}...`)
      .add(`     ${result} !`, 1500);

    return monologue;
  }
  return void 0;
};
