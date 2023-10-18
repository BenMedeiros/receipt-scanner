'use strict';

import {addColorToChunk, drawRect} from "./draw.js";

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  // canvas.client might be scaled by css
  const x = (event.clientX - rect.left) * (canvas.width / canvas.clientWidth);
  const y = (event.clientY - rect.top) * (canvas.height / canvas.clientHeight);
  console.log("x: " + x + " y: " + y);
  return {x, y};
}

export function trackChunkClick(canvas, {chunkSize, highlightedChunks}) {
  canvas.addEventListener('mousedown', function (e) {
    const {x, y} = getCursorPosition(canvas, e);
    const xChunkIndex = Math.floor(x / chunkSize);
    const yChunkIndex = Math.floor(y / chunkSize);

    if (highlightedChunks.find(el => el.xi === xChunkIndex && el.yi === yChunkIndex)) {
      console.log('chunk already highlighted');
    } else {
      highlightedChunks.push({
        xi: xChunkIndex,
        yi: yChunkIndex,
        chunkX: xChunkIndex * chunkSize,
        chunkY: yChunkIndex * chunkSize
      });

      drawRect(canvas, 'rgba(0,0,255,.4)',
        xChunkIndex * chunkSize,
        yChunkIndex * chunkSize, chunkSize, chunkSize);
    }
  });
}

