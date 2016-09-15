
export default class Board {
  constructor(width, height, $node) {
    this.width = width;
    this.height = height;
    this.$node = $node;
    this.baseGrid = initGrid(width, height);

    // remove to a fn that updates board
    this.copyBaseGrid();
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