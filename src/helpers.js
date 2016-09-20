
export function initGrid(width, height) {
  let grid = [];
  for (let h = 0; h < height; h++) {
    grid.push([]);
    for (let w = 0; w < width; w++) {
      grid[h].push(' ');
    }
  }
  return grid;
}

export function drawBorder(width) {
  if (!width) return '--';
  return '-' + drawBorder(width - 1);
}

export function getRandomShape() {
  return this.shapes[Math.floor(Math.random() * this.shapes.length)];
}