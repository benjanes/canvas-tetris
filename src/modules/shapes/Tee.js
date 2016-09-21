import Piece from '../Piece';
import Cell from '../Cell';

export default class Tee extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.init();
  }

  init() {
    this.cells = [
      new Cell('T', this.midPoint - 1, -1),
      new Cell('T', this.midPoint, -1),
      new Cell('T', this.midPoint + 1, -1),
      new Cell('T', this.midPoint, -2)
    ];
  }

  getChangeFns() {
    let x, y, changeInX, changeInY;

    x = this.cells[1].x;
    y = this.cells[1].y;

    if (this.cells[0].y > this.cells[3].y && this.cells[0].x < this.cells[3].x) {
      // upside-down T
      changeInX = i => {
        if (i === 3) return x + 1;
        return x;
      };
      changeInY = i => {
        if (i !== 3) return y - 1 + i;
        return y;
      };
    } else if (this.cells[0].y < this.cells[3].y && this.cells[0].x < this.cells[3].x) {
      // sideways pointing right
      changeInX = i => {
        if (i !== 3) return x + 1 - i;
        return x;
      };
      changeInY = i => {
        if (i === 3) return y + 1;
        return y;
      };
    } else if (this.cells[0].y < this.cells[3].y && this.cells[0].x > this.cells[3].x) {
      // T
      changeInX = i => {
        if (i === 3) return x - 1;
        return x;
      }
      changeInY = i => {
        if (i !== 3) return y + 1 - i;
        return y;
      }
    } else if (this.cells[0].y > this.cells[3].y && this.cells[0].x > this.cells[3].x) {
      // sideways pointing left
      changeInX = i => {
        if (i !== 3) return x - 1 + i;
        return x;
      }
      changeInY = i => {
        if (i === 3) return y - 1;
        return y;
      }
    }

    return { changeInX, changeInY };
  }
}