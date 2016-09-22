import { lightenDarkenColor } from '../helpers';

export default class Cell {
  constructor(fill, x, y) {
    this.fill = fill;
    this.x = x;
    this.y = y;
    this.stroke = lightenDarkenColor(fill, -60);
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

}