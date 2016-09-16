import Square from './Square';

export default class Board {
  constructor(width, height, $node) {
    this.width = width;
    this.height = height;
    this.$node = $node;
    this.currPiece = null;

    // make a get y per row method that loops through the grid, makes an array of the min row occupied per col
    this.minYperRow = [];

    this.baseGrid = initGrid(width, height);
    this.copyBaseGrid();

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
  }

  updatePositions() {
    if (!this.currPiece || this.currPiece.hasImpacted()) {
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

}

function initGrid(width, height) {
  let grid = [];
  for (let h = 0; h < height; h++) {
    grid.push([]);
    for (let w = 0; w < width; w++) {
      grid[h].push(' ');
    }
  }
  return grid;
}

function drawBorder(width) {
  if (!width) return '--';
  return '-' + drawBorder(width - 1);
}