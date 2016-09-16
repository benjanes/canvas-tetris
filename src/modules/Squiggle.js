import Piece from './Piece';
import Cell from './Cell';

export default class Squiggle extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.init();
  }

  init() {
    this.cells = [
      new Cell('Z', this.midPoint + 1, -3),
      new Cell('Z', this.midPoint + 1, -2),
      new Cell('Z', this.midPoint, -2),
      new Cell('Z', this.midPoint, -1)
    ];
  }

  rotate() {
    return;
  }
}