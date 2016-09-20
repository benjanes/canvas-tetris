import Square from './Square';
import Rod from './Rod';
import Elle from './Elle';
import Tee from './Tee';
import Squiggle from './Squiggle';
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

    this.tick();
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
    this.currPiece = new Elle(this.width, this.height);
  }

  updateBaseGrid() {
    this.baseGrid = this.currGrid.map(row => row.slice());
    this.getMaxYPerCol();
  }

  handleImpact() {
    if (!this.currPiece || this.currPiece.hasImpacted(this.maxYPerCol)) {
      this.updateBaseGrid();
      this.addPiece();
    }
  }

  updatePositions(movePieceFn) {
    this.copyBaseGrid();
    if (this.currPiece) {
      console.log(this.currPiece.cells);
      movePieceFn();
      this.currPiece.cells.forEach(cell => {
        if (cell.y >= 0 && cell.y < this.height) {
          this.currGrid[cell.y][cell.x] = cell.shape;
        }
      });
    }
    this.drawBoard();
  }

  tick() {
    this.handleImpact();
    this.updatePositions(this.currPiece.moveDown.bind(this.currPiece));
    setTimeout(this.tick.bind(this), 500);
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
    if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 40) {
      if (e.keyCode === 37) this.updatePositions(this.currPiece.moveLeft.bind(this.currPiece, this.baseGrid));
      if (e.keyCode === 39) this.updatePositions(this.currPiece.moveRight.bind(this.currPiece, this.baseGrid));
      if (e.keyCode === 38) this.updatePositions(this.currPiece.rotate.bind(this.currPiece, this.baseGrid));
      if (e.keyCode === 40) {
        this.handleImpact();
        this.updatePositions(this.currPiece.moveDown.bind(this.currPiece));
      }
    }
  }

}

