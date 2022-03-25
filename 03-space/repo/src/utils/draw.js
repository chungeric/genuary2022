// draw polygon
export const drawPolygon = (x, y, size, sides) => {
  if (sides < 3) return;
  this.ctx.save();
  this.ctx.beginPath();
  let a = (Math.PI * 2) / sides;
  this.ctx.translate(x, y);
  this.ctx.moveTo(size, 0);
  for (var i = 1; i < sides; i++) {
    this.ctx.lineTo(size * Math.cos(a * i), size * Math.sin(a * i));
  }
  this.ctx.closePath();
  this.ctx.stroke();
  this.ctx.restore();
};

// draw circle
export const drawCircle = (ctx, x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
};

// draw grid
export const drawGrid = (ctx, numRows, numCols, alpha) => {
  ctx.globalAlpha = alpha;
  let w = ctx.canvas.clientWidth;
  let h = ctx.canvas.clientHeight;
  let cellWidth = w / numCols;
  let cellHeight = h / numRows;
  for (let row = 0; row < numRows; row++) {
    let y = row * cellHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let col = 0; col < numCols; col++) {
    let x = col * cellWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};
