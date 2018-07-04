import Line from './Line';

export default class Monologue {
  lines = [];
  size = 0;
  add = (string, delay) => {
    this.lines[this.size] = new Line(string, delay);
    this.size++;
    return this;
  };
}
