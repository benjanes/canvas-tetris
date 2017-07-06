import Piece from '../Piece';
import Cell from '../Cell';

export default class Elle extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.init();
  }

  init() {
    this.cells = [
      new Cell('#FF0000', this.midPoint, -3, 0.5, 0.5),
      new Cell('#FF0000', this.midPoint, -2, 0.5, 1.5),
      new Cell('#FF0000', this.midPoint, -1, 0.5, 2.5),
      new Cell('#FF0000', this.midPoint + 1, -1, 1.5, 2.5)
    ];
  }

  getChangeFns() {
    let x, y, changeInX, changeInY;

    x = this.cells[1].x;
    y = this.cells[1].y;

    if (this.cells[0].y === this.cells[3].y - 1) {
      changeInX = i => {
        if (i === 3) return x - 1;
        return x;
      };
      changeInY = i => {
        if (i !== 3) return y + 1 - i;
        return y - 1;
      };
    } else if (this.cells[0].x === this.cells[3].x - 1) {
      changeInX = i => {
        if (i !== 3) return x + 1 - i;
        return x - 1;
      };
      changeInY = i => {
        if (i === 3) return y + 1;
        return y;
      };
    } else if (this.cells[0].y === this.cells[3].y + 1) {
      changeInX = i => {
        if (i === 3) return x + 1;
        return x;
      }
      changeInY = i => {
        if (i !== 3) return y - 1 + i;
        return y + 1;
      }
    } else if (this.cells[0].x === this.cells[3].x + 1) {
      changeInX = i => {
        if (i !== 3) return x - 1 + i;
        return x + 1;
      }
      changeInY = i => {
        if (i === 3) return y - 1;
        return y;
      }
    }

    return { changeInX, changeInY };
  }
}