import Piece from '../Piece';
import Cell from '../Cell';

export default class Rod extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.init();
  }

  init() {
    this.cells = [
      new Cell('R', this.midPoint, -4),
      new Cell('R', this.midPoint, -3),
      new Cell('R', this.midPoint, -2),
      new Cell('R', this.midPoint, -1)
    ];
  }

  getChangeFns() {
    let x, y, changeInX, changeInY;

    if (this.cells[0].x === this.cells[1].x) {
      // turn on side
      x = this.cells[0].x;
      y = this.cells[2].y;
      changeInX = i => x + i - 2;
      changeInY = i => y;
      // });
    } else {
      // make vertical
      x = this.cells[2].x;
      y = this.cells[0].y;
      changeInX = i => x;
      changeInY = i => y + i - 2;
    }
    
    return { changeInX, changeInY };
  }

}