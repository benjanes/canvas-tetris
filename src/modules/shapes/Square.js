import Piece from '../Piece';
import Cell from '../Cell';

export default class Square extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.init();
  }

  init() {
    this.cells = [
      new Cell('#0000FF', this.midPoint, -2),
      new Cell('#0000FF', this.midPoint + 1, -2),
      new Cell('#0000FF', this.midPoint, -1),
      new Cell('#0000FF', this.midPoint + 1, -1)
    ];
  }

  rotate() {
    return;
  }
}