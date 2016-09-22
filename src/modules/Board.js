
import Square from './shapes/Square';
import Rod from './shapes/Rod';
import Elle from './shapes/Elle';
import Tee from './shapes/Tee';
import SquiggleA from './shapes/SquiggleA';
import SquiggleB from './shapes/SquiggleB';
import { initGrid, makeRow, drawBorder, getRandomShape } from '../helpers';

export default class Board {
  constructor(width, height, $node) {
    this.width = width;
    this.height = height;
    this.$node = $node;
    this.currPiece = null;
    this.shapes = [Square, Rod, Elle, Tee, SquiggleA, SquiggleB];

    this.score = 0;
    this.levelProgress = 0;
    this.rate = 500;
    this.level = 0;
    this.gameStatus = `LEVEL ${this.level}`;

    this.baseGrid = initGrid(width, height);
    this.copyBaseGrid();

    this.maxYPerCol = [];
    this.getMaxYPerCol();

    this.handleKeydown = this.handleKeydown.bind(this);
    document.addEventListener('keydown', this.handleKeydown);
    this.tick();
  }

  gridToString() {
    return this.currGrid.reduce((str, row) => {
      return str + row.reduce((rowStr, cell) => {
        return rowStr + cell;
      }, '|') + '|\n';
    }, `${drawBorder(this.width)}\n`) + `${drawBorder(this.width)}\nSCORE: ${this.score}\n${this.gameStatus}`;
  }

  drawBoard() {
    this.$node.innerText = this.gridToString();
  }

  copyBaseGrid() {
    this.currGrid = this.baseGrid.map(row => row.slice());
  }

  addPiece() {
    this.currPiece = new (getRandomShape.call(this))(this.width, this.height);
  }

  updateBaseGrid() {
    this.baseGrid = this.currGrid.map(row => row.slice());
  }

  handleCompletedRows() {
    for (let i = 0; i < this.baseGrid.length; i++) {
      if (!~this.baseGrid[i].indexOf(' ')) {
        this.baseGrid = makeRow(this.width).concat(this.baseGrid.slice(0, i)).concat(this.baseGrid.slice(i + 1));
        this.updatePlayerProgress();
        this.handleCompletedRows();
        return;
      }
    }
  }

  handleImpact() {
    if (!this.currPiece || this.currPiece.hasImpacted(this.maxYPerCol)) {
      this.updateBaseGrid();
      this.handleCompletedRows();
      this.getMaxYPerCol();
      this.addPiece();
    }
  }

  updatePlayerProgress() {
    this.score += 1;
    this.levelProgress += 1;
    if (this.levelProgress >= 5) {
      this.level += 1;
      this.gameStatus = `LEVEL ${this.level}`;
      this.levelProgress = 0;
      this.rate -= 50;
    }
  }

  updatePositions(movePieceFn) {
    this.copyBaseGrid();
    if (this.currPiece) {
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

    if (~this.maxYPerCol.indexOf(0)) {
      this.killGame();
      return;
    }

    this.updatePositions(this.currPiece.moveDown.bind(this.currPiece));
    setTimeout(this.tick.bind(this), this.rate);
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

  killGame() {
    var rowLength = this.width;
    this.gameStatus = 'GAME OVER';
    document.removeEventListener('keydown', this.handleKeydown);

    if (this.currGrid[this.height - 1][this.width - 1] !== 'X') {
      this.currGrid = this.currGrid.map(row => {
        var place = row.lastIndexOf('X');
        if (place !== -1 && place <= rowLength - 2) {
          row[place + 1] = 'X';
        }
        return row;
      });

      for (let i = 0; i < this.height; i++) {
        if (this.currGrid[i][0] !== 'X') {
          this.currGrid[i][0] = 'X';
          break;
        }
      }

      this.drawBoard();
      setTimeout(this.killGame.bind(this), 15);
    }
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

