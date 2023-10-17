'use strict';

export function drawLine(canvas, color, lineWidth, x0, y0, x1, y1) {
  const ctx = canvas.getContext("2d");

  ctx.beginPath(); // Start a new path
  ctx.moveTo(x0, y0); // Move the pen to (30, 50)
  ctx.lineTo(x1, y1); // Draw a line to (150, 100)
  if (lineWidth) ctx.lineWidth = lineWidth;
  if (color) ctx.strokeStyle = color;
  ctx.stroke(); // Render the path
}

export function drawRect(canvas, color, x, y, w, h) {
  const ctx = canvas.getContext("2d");

  if (color) ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
