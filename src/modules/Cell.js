
export default class Cell {
  constructor(shape, x, y) {
    this.shape = shape;
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