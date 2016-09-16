import Piece from './Piece';
import Cell from './Cell';

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

  rotate() {
    return;
  }
}