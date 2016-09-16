

export default class Piece {
  constructor(maxX, maxY) {
    this.maxX = maxX;
    this.maxY = maxY;
    this.midPoint = Math.floor(maxX / 2);
    this.cells = [null, null, null, null];
  }

  moveDown() {
    this.cells.forEach(cell => cell.y += 1);
  }

  moveLeft() {
    if (!this.isAtBoundary(0)) this.cells.forEach(cell => cell.x -= 1); 
  }

  moveRight(maxWidth) {
    if (!this.isAtBoundary(this.maxX - 1)) this.cells.forEach(cell => cell.x += 1);
  }

  isAtBoundary(x) {
    return this.cells.reduce((isAtEdge, cell) => {
      if (isAtEdge) return true;
      return cell.x === x;
    }, false);
  }

  // this can take an obj or list of the currently occupied coords
  hasImpacted() {
    return this.cells.reduce((hasImpacted, cell) => {
      if (hasImpacted) return true;
      return cell.y === this.maxY - 1;
    }, false);
  }
}
