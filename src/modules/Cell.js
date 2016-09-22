
export default class Cell {
  constructor(fill, x, y) {
    this.fill = fill;
    this.x = x;
    this.y = y;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }
}