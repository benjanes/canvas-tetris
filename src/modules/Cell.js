import { lightenDarkenColor } from '../helpers';

export default class Cell {
  constructor(fill, stroke, x, y, staticX, staticY) {
    this.fill = fill;
    this.x = x;
    this.y = y;
    this.stroke = stroke;
    this.staticX = staticX;
    this.staticY = staticY;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

}