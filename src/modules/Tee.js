import Piece from './Piece';
import Cell from './Cell';

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

  rotate() {
    return;
  }
}