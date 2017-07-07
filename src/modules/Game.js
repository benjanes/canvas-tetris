import Square from './shapes/Square';
import Rod from './shapes/Rod';
import Elle from './shapes/Elle';
import Tee from './shapes/Tee';
import SquiggleA from './shapes/SquiggleA';
import SquiggleB from './shapes/SquiggleB';
import { initGrid, makeRow, drawBorder, getRandomShape, drawTriangle, drawCell } from '../helpers';

export default class Game {
  constructor(width, height, cellSize, $nodes) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.ctx = $nodes.canvas.getContext('2d');

    // DOM nodes
    this.$wrapper = $nodes.wrapper;
    this.$startBtn = $nodes.start;
    this.$pauseBtn = $nodes.pause;
    
    // vars for drawing board
    this.topMargin = 80;
    this.boardBorder = 3;
    this.boardHeight = (this.height * cellSize) + this.topMargin + (2 * this.boardBorder);
    this.boardWidth = (this.width * cellSize) + (cellSize * 6) + (this.boardBorder * 3);
    $nodes.canvas.height = this.boardHeight + 2;
    $nodes.canvas.width = this.boardWidth;
    this.pattern = this.initPattern();

    // game pieces
    this.currPiece = null;
    this.shapes = [Square, Rod, Elle, Tee, SquiggleA, SquiggleB];
    this.nextPiece = new (getRandomShape.call(this))(this.width, this.height);

    // hard bind core functions
    this.tick = this.tick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.startGame = this.startGame.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.initNewGame = this.initNewGame.bind(this);

    // add listeners to buttons in DOM
    this.$startBtn.addEventListener('click', this.startGame);
    this.$pauseBtn.addEventListener('click', this.pauseGame);
    
    // prep a game
    this.initNewGame(width, height);
    // draw board once
    this.drawBoard();
  }

  startGame() {
    this.$startBtn.setAttribute('disabled', true);
    this.$pauseBtn.removeAttribute('disabled');

    if (this.gameStatus === 'GAME OVER') {
      this.initNewGame(this.width, this.height);
    }

    document.addEventListener('keydown', this.handleKeydown);
    this.tick();
  }

  initNewGame(width, height) {
    this.score = 0;
    this.level = 0;
    this.levelProgress = 0; // need to score a certain amount w/in a level to advance
    this.rate = 500;
    this.gameStatus = `LEVEL ${this.level}`;

    this.baseGrid = initGrid(width, height);
    this.copyBaseGrid();

    this.maxYPerCol = [];
    this.getMaxYPerCol();
  }

  pauseGame() {
    this.$startBtn.removeAttribute('disabled');
    this.$pauseBtn.setAttribute('disabled', true);

    document.removeEventListener('keydown', this.handleKeydown);
    clearTimeout(this.timer);
  }

  drawBoard() {
    // clear canvas
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
    
    // draw the bg pattern onto the board
    this.ctx.fillStyle = this.pattern;    
    this.ctx.translate((this.cellSize / 2) - 1, -1);
    this.ctx.fillRect(this.boardBorder - 3, this.topMargin + 2, (this.cellSize * this.width) + (this.boardBorder * 2) - 4, (this.cellSize * this.height) + (this.boardBorder * 2) - 2);
    this.ctx.translate(-1 * (this.cellSize / 2) + 1, 1);

    // draw board border
    this.ctx.strokeStyle = '#aaa';
    this.ctx.lineWidth = this.boardBorder; 
    this.ctx.strokeRect(this.boardBorder + 1, this.topMargin + 1, (this.cellSize * this.width) + (this.boardBorder * 2) - 3, (this.cellSize * this.height) + (this.boardBorder * 2) - 3);

    // reset the line width before drawing next piece shown in upper right
    this.ctx.lineWidth = 1;
    this.drawNextPiece();

    // write out the game status (level or "game over") and current score
    this.ctx.font = '20px Geostar Fill';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(this.gameStatus, 0, 30);
    this.ctx.fillText(`SCORE: ${this.score}`, 0, 60);

    // draw the pieces onto the board
    this.currGrid.forEach(this.drawRow, this);
  }

  drawRow(row, rowIdx) {
    row.forEach((cell, colIdx) => {
      let x, y;

      // if cell is empty, don't draw anything
      if (cell !== 'X' && !cell.fill) return;

      // find the x and y coords from which to orient the cell
      x = colIdx * this.cellSize + (this.boardBorder * 2) - 1;
      y = rowIdx * this.cellSize + this.topMargin + (this.boardBorder);

      // if 'X', means the game is over -- draw cell for the "game over" animation
      if (cell === 'X') {
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.fillStyle = 'rgba(255,0,0,0.2)';
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
      } else {
        drawCell(this.ctx, x, y, cell.fill, this.cellSize);
      }
    });
  }

  drawNextPiece() {
    const boxX = (this.boardBorder * 2) + (this.width * this.cellSize) + this.cellSize;
    const boxY = this.topMargin;
    const dimension = this.cellSize * 5;

    // draw the box
    this.ctx.fillStyle = '#888';
    this.ctx.fillRect(boxX, boxY, dimension, dimension + this.cellSize);
    this.ctx.strokeStyle = '#fff';
    this.ctx.strokeRect(boxX, boxY, dimension, dimension + this.cellSize);
    
    // then draw the piece
    this.nextPiece.cells.forEach(cell => {
      let x, y;
      x = boxX  + this.cellSize+ (cell.staticX * this.cellSize);
      y = boxY + this.cellSize + (cell.staticY * this.cellSize);
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
      return this.killGame();
    }

    this.updatePositions(this.currPiece.moveDown.bind(this.currPiece));
    this.timer = setTimeout(this.tick, this.rate);
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
    this.$startBtn.removeAttribute('disabled');
    this.$pauseBtn.setAttribute('disabled', true);

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
