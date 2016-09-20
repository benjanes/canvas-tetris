import Piece from '../Piece';
import Cell from '../Cell';

export default class SquiggleB extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.init();
  }

  init() {
    this.cells = [
      new Cell('5', this.midPoint, -3),
      new Cell('5', this.midPoint, -2),
      new Cell('5', this.midPoint + 1, -2),
      new Cell('5', this.midPoint + 1, -1)
    ];
  }

  rotate() {
    return;
  }
}