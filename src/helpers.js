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

export function drawCell(ctx, x, y, fill, d) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, d, d);
  drawTriangle(ctx, [[x, y], [x + d, y + d], [x, y + d]], 'rgba(100,100,100,0.25)');
  drawTriangle(ctx, [[x + d, y], [x, y + d], [x + d, y + d]], 'rgba(100,100,100,0.5)');
}

export function drawTriangle(ctx, vs, fill) {
  ctx.beginPath();
  ctx.moveTo(vs[0][0], vs[0][1]);
  ctx.lineTo(vs[1][0], vs[1][1]);
  ctx.lineTo(vs[2][0], vs[2][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function applyStyles($nodes, styles) {
  $nodes.forEach($node => {
    $node.style.backgroundColor = styles.backgroundColor;
    // $node.style.color = styles.color;
  });
}
