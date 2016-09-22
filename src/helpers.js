
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

export function makeRow(width) {
  let row = [];
  for (let w = 0; w < width; w++) {
    row.push(' ');
  }
  return [row];
}

export function drawBorder(width) {
  if (!width) return '--';
  return '-' + drawBorder(width - 1);
}

export function getRandomShape() {
  return this.shapes[Math.floor(Math.random() * this.shapes.length)];
}

export function lightenDarkenColor(col, amt) {
  col = col.slice(1);
  const num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  let b = ((num >> 8) & 0x00FF) + amt;
  let g = (num & 0x0000FF) + amt;
  r = correctColorComponent(r);
  b = correctColorComponent(b);
  g = correctColorComponent(g);
  return '#' + (g | (b << 8) | (r << 16)).toString(16);
}

function correctColorComponent(c) {
  if (c > 255) c = 255;
  if (c < 0) c = 0;
  return c;
}