import Square from './Square';
import { initGrid, drawBorder } from '../helpers';

export default class Board {
  constructor(width, height, $node) {
    this.width = width;
    this.height = height;
    this.$node = $node;
    this.currPiece = null;

    this.baseGrid = initGrid(width, height);
    this.copyBaseGrid();

    // make a get y per row method that loops through the grid, makes an array of the max row occupied per col
    this.maxYPerCol = [];
    this.getMaxYPerCol();

    this.updatePositions();
  }

  gridToString() {
    return this.currGrid.reduce((str, row) => {
      return str + row.reduce((rowStr, cell) => {
        return rowStr + cell;
      }, '|') + '|\n';
    }, drawBorder(this.width) + '\n') + drawBorder(this.width);
  }

  drawBoard() {
    this.$node.innerText = this.gridToString();
  }

  copyBaseGrid() {
    this.currGrid = this.baseGrid.map(row => row.slice());
  }

  addPiece() {
    // eventually, this will instantiate a random new piece
    this.currPiece = new Square(this.width, this.height);
  }

  updateBaseGrid() {
    this.baseGrid = this.currGrid.map(row => row.slice());
    this.getMaxYPerCol();
  }

  updatePositions() {
    if (!this.currPiece || this.currPiece.hasImpacted(this.maxYPerCol)) {
      this.updateBaseGrid();
      this.addPiece();
    }

    this.copyBaseGrid();
    
    this.currPiece.moveDown();
    this.currPiece.cells.forEach(cell => {
      if (cell.y >= 0) {
        this.currGrid[cell.y][cell.x] = cell.shape;
      }
    });

    this.drawBoard();
    setTimeout(this.updatePositions.bind(this), 500);
  }

  getMaxYPerCol() {
    let maxes = [];
    for (let i = 0; i < this.width; i++) maxes.push(this.height);
    this.maxYPerCol = this.baseGrid.reduceRight((maxes, row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell !== ' ') {
          maxes[colIdx] = rowIdx;
        }
      });
      return maxes;
    }, maxes);
  }

  handleKeydown(e) {
    if (e.keyCode === 37) this.currPiece.moveLeft(this.baseGrid);
    if (e.keyCode === 39) this.currPiece.moveRight(this.baseGrid);
  }

}

