
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

  moveLeft(currGrid) {
    if (!this.isAtBoundary(currGrid, 'left')) this.cells.forEach(cell => cell.x -= 1); 
  }

  moveRight(currGrid) {
    if (!this.isAtBoundary(currGrid, 'right')) this.cells.forEach(cell => cell.x += 1);
  }

  isAtBoundary(grid, direction) {
    let dir = direction === 'left' ? -1 : 1;
    return this.cells.reduce((isAtEdge, cell) => {
      if (isAtEdge) return true;
      if (cell.y >= 0) return grid[cell.y][cell.x + dir] !== ' ';
      return false;
    }, false);
  }

  hasImpacted(maxYPerCol) {
    return this.cells.reduce((hasImpacted, cell) => {
      if (hasImpacted) return true;
      return cell.y ===  maxYPerCol[cell.x] - 1;
    }, false);
  }
}
