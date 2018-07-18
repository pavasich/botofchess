import Line from '../Line';

export default class Monologue {
  lines: Array<Line> = [];
  size: number = 0;
  add = (message: string, delay?: number) => {
    this.lines[this.size] = { message, delay };
    this.size++;
    return this;
  };
}
