import Piece from '../Piece';
import Cell from '../Cell';

export default class SquiggleB extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.init();
  }

  init() {
    this.cells = [
      new Cell('#00FFFF', this.midPoint, -3),
      new Cell('#00FFFF', this.midPoint, -2),
      new Cell('#00FFFF', this.midPoint + 1, -2),
      new Cell('#00FFFF', this.midPoint + 1, -1)
    ];
  }

  getChangeFns() {
    let x, y, changeInX, changeInY;

    x = this.cells[1].x;
    y = this.cells[1].y;

    if (this.cells[0].y < this.cells[3].y && this.cells[0].x < this.cells[3].x) {
      changeInX = i => {
        if (!i) return x - 1;
        if (i === 1 || i === 2) return x;
        return x + 1
      };
      changeInY = i => {
        if (!i || i === 1) return y + 1;
        return y;
      };
    } else {
      changeInX = i => {
        if (!i || i === 1) return x;
        return x + 1;
      };
      changeInY = i => {
        if (!i) return y - 1;
        if (i === 1 || i === 2) return y;
        return y + 1;
      };
    }

    return { changeInX, changeInY };
  }
}