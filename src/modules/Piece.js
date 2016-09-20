
export default class Piece {
  constructor(maxX, maxY) {
    this.maxX = maxX;
    this.maxY = maxY;
    this.midPoint = Math.floor(maxX / 2);
    this.cells = [null, null, null, null];
  }

  moveDown() {
    this.cells.forEach(cell => cell.setY.call(cell, cell.y + 1));
  }

  moveLeft(currGrid) {
    if (!this.isAtBoundary(currGrid, 'left')) this.cells.forEach(cell => cell.setX.call(cell, cell.x - 1)); 
  }

  moveRight(currGrid) {
    if (!this.isAtBoundary(currGrid, 'right')) this.cells.forEach(cell => cell.setX.call(cell, cell.x + 1));
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

  hasIllegalValues() {
    return this.cells.reduce((hasIllegalVals, cell) => {
      if (hasIllegalVals) return hasIllegalVals;
      if (cell.x < 0) return 1;
      if (cell.x > this.maxX - 1) return -1;
      return false;
    }, false);
  }

  isImpactingAnotherPiece(grid, changeInX, changeInY) {
    return this.cells.reduce((isImpactingAnotherPiece, cell, cellIdx) => {
      if (isImpactingAnotherPiece) return true;
      if (!grid[changeInY(cellIdx)]) return false;
      if (!grid[changeInY(cellIdx)][changeInX(cellIdx)]) return false;
      return grid[changeInY(cellIdx)][changeInX(cellIdx)] !== ' ';
    }, false);
  }

  rotate(currGrid) {
    let d, illegals;

    d = this.getChangeFns();

    if (!this.isImpactingAnotherPiece(currGrid, d.changeInX, d.changeInY)) {
      this.cells.forEach((cell, i) => {
        cell.setX.call(cell, d.changeInX(i));
        cell.setY.call(cell, d.changeInY(i));
      });
    }

    illegals = this.hasIllegalValues();
    while (illegals) {
      this.cells.forEach(cell => cell.setX.call(cell, cell.x + illegals));
      illegals = this.hasIllegalValues();
    }
  }
}
