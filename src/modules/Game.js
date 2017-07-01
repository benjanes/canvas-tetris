
import Square from './shapes/Square';
import Rod from './shapes/Rod';
import Elle from './shapes/Elle';
import Tee from './shapes/Tee';
import SquiggleA from './shapes/SquiggleA';
import SquiggleB from './shapes/SquiggleB';
import { initGrid, makeRow, drawBorder, getRandomShape, drawTriangle, drawCell } from '../helpers';

export default class Game {
  constructor(width, height, cellSize, canvas) {
    this.width = width;
    this.height = height;

    this.score = 0;
    this.levelProgress = 0;
    this.rate = 500;
    this.level = 0;
    this.gameStatus = `LEVEL ${this.level}`;

    this.cellSize = cellSize;
    this.topMargin = 40;
    this.boardBorder = 3;
    this.boardHeight = (this.height * cellSize) + 40 + (2 * this.boardBorder);
    this.boardWidth = (this.width * cellSize) + 100;
    canvas.height = this.boardHeight + 2;
    canvas.width = this.boardWidth;
    this.ctx = canvas.getContext('2d');
    this.pattern = this.initPattern();

    this.currPiece = null;
    this.shapes = [Square, Rod, Elle, Tee, SquiggleA, SquiggleB];
    this.nextPiece = new (getRandomShape.call(this))(this.width, this.height);

    this.baseGrid = initGrid(width, height);
    this.copyBaseGrid();

    this.maxYPerCol = [];
    this.getMaxYPerCol();

    this.handleKeydown = this.handleKeydown.bind(this);
    document.addEventListener('keydown', this.handleKeydown);
    this.tick();
  }

  drawBoard() {
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
    this.ctx.strokeStyle = '#aaa';
    this.ctx.lineWidth = this.boardBorder;
    
    this.ctx.fillStyle = this.pattern;
    
    this.ctx.translate((this.cellSize / 2) - 1, -5);
    this.ctx.fillRect(this.boardBorder - 3, this.topMargin + 6, (this.cellSize * this.width) + (this.boardBorder * 2) - 4, (this.cellSize * this.height) + (this.boardBorder * 2) - 2);
    this.ctx.translate(-1 * (this.cellSize / 2) + 1, 5);

    this.ctx.strokeRect(this.boardBorder + 1, this.topMargin + 1, (this.cellSize * this.width) + (this.boardBorder * 2) - 3, (this.cellSize * this.height) + (this.boardBorder * 2) - 3);

    this.ctx.lineWidth = 1;
    this.drawNextPiece();
    this.currGrid.forEach((row, rowIdx) => this.drawRow(row, rowIdx));
  }

  drawRow(row, rowIdx) {
    row.forEach((cell, colIdx) => {
      let x, y;

      if (!cell.fill) return;
      x = colIdx * this.cellSize + (this.boardBorder * 2) - 1;
      y = rowIdx * this.cellSize + this.topMargin + (this.boardBorder);

      drawCell(this.ctx, x, y, cell.fill, this.cellSize);
    });
  }

  drawNextPiece() {
    this.nextPiece.cells.forEach(cell => {
      let x, y;
      x = (this.cellSize * this.width) + (2 * this.boardBorder) + 20 + (cell.staticX * this.cellSize);
      y = 40 + (cell.staticY * this.cellSize);
      drawCell(this.ctx, x, y, cell.fill, this.cellSize);
    });
  }

  copyBaseGrid() {
    this.currGrid = this.baseGrid.map(row => row.slice());
  }

  addPiece() {
    this.currPiece = this.nextPiece;
    this.nextPiece = new (getRandomShape.call(this))(this.width, this.height);
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
          this.currGrid[cell.y][cell.x] = cell;
        }
      });
    }
    this.drawBoard();
  }

  initPattern() {
    const pattern = document.createElement('canvas');
    const ctx = pattern.getContext('2d');
    const x = this.cellSize;

    pattern.width = x;
    pattern.height = x;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, x, x);

    drawTriangle(ctx, [[0, x], [x, 0], [x, x]], 'rgba(200,200,200,0.6)');
    drawTriangle(ctx, [[0, x], [0, 0], [x, x]], 'rgba(160,160,160,0.6)');

    ctx.strokeStyle = '#ddd';
    ctx.strokeRect(0, 0, x - 1, x - 1);

    return ctx.createPattern(pattern, 'repeat');
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

