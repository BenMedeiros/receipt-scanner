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


export function setColor(data, i, r, g, b) {
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
}

export function addColor(data, i, r, g, b) {
  data[i] = Math.hypot(data[i], r) / 1.414;
  data[i + 1] = Math.hypot(data[i + 1], g) / 1.414;
  data[i + 2] = Math.hypot(data[i + 2], b) / 1.414;
}

export function addColorToChunk(imageData, chunkSize, chunkX, chunkY, r, g, b) {
  let i = 0;
  for (let y = chunkY; y < chunkY + chunkSize && y < imageData.height - 1; y++) {
    for (let x = chunkX; x < chunkX + chunkSize && x < imageData.width - 1; x++) {
      i = 4 * (y * imageData.width + x);
      addColor(imageData.data, i, r, g, b);
    }
  }
}


