import Piece from '../Piece';
import Cell from '../Cell';

export default class SquiggleA extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.isUpright = true;
    this.init();
  }

  init() {
    this.cells = [
      new Cell('#FFFF00', '#111', this.midPoint + 1, -3, 1, 0),
      new Cell('#FFFF00', '#111', this.midPoint + 1, -2, 1, 1),
      new Cell('#FFFF00', '#111', this.midPoint, -2, 0, 1),
      new Cell('#FFFF00', '#111', this.midPoint, -1, 0, 2)
    ];
  }

  getChangeFns() {
    let x, y, changeInX, changeInY;

    x = this.cells[1].x;
    y = this.cells[1].y;

    if (this.cells[0].y < this.cells[3].y && this.cells[0].x > this.cells[3].x) {
      changeInX = i => {
        if (!i) return x + 1;
        if (i === 1 || i === 2) return x;
        return x - 1
      };
      changeInY = i => {
        if (!i || i === 1) return y;
        return y - 1;
      };
    } else {
      changeInX = i => {
        if (!i || i === 1) return x;
        return x - 1;
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