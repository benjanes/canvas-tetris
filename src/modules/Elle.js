import Piece from './Piece';
import Cell from './Cell';

export default class Elle extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.init();
  }

  init() {
    this.cells = [
      new Cell('L', this.midPoint, -3),
      new Cell('L', this.midPoint, -2),
      new Cell('L', this.midPoint, -1),
      new Cell('L', this.midPoint + 1, -1)
    ];
  }

  rotate() {
    return;
  }
}