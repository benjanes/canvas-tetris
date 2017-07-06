import Piece from '../Piece';
import Cell from '../Cell';

export default class Square extends Piece {
  constructor(maxX, maxY) {
    super(maxX, maxY);
    this.init();
  }

  init() {
    this.cells = [
      new Cell('#00BFFF', this.midPoint, -2, 0.5, 1),
      new Cell('#00BFFF', this.midPoint + 1, -2, 1.5, 1),
      new Cell('#00BFFF', this.midPoint, -1, 0.5, 2),
      new Cell('#00BFFF', this.midPoint + 1, -1, 1.5, 2)
    ];
  }

  rotate() {
    return;
  }
}