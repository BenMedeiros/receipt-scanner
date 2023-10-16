'use strict';

import {getCurrentImageData, putNewImageNewCanvas} from "./fileHandler.js";

function forEachXY(xIncr, yIncr, fn) {
  const imageData = getCurrentImageData();

  if (!imageData) {
    console.log('No image exists');
    return;
  }
  const dataCopy = new Uint8ClampedArray(imageData.data);
  dataCopy.set(imageData.data);

  let i = 0;
  for (let y = 0; y < imageData.height - 1; y += yIncr) {
    for (let x = 0; x < imageData.width - 1; x += xIncr) {
      i = 4 * (y * imageData.width + x);
      fn(imageData, x, y, i, dataCopy);
    }
  }

  putNewImageNewCanvas(imageData);
}

// highlight each pixel based on if it's white per threshold
export function isWhitePixelLevel() {
  forEachXY(1, 1, (imageData, x, y, i, dataCopy) => {
    if (isWhite(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2])) {
      setColor(imageData.data, i, 0, 255, 0);
    }
  });
}

// look at a chunk of pixels are see if its white or not, basically blends
export function isWhiteChunkLevel() {
  const chunkSize = 50;

  forEachXY(chunkSize, chunkSize, (imageData, x, y, i, dataCopy) => {
    isChunkWhite(chunkSize, x, y, imageData);
  });
}

/*
  Look at a block of pixels and check if majority are white or not
  That chunk will be marked as white/not.  Chunking should overlap to prevent
  boundary conditions issues.
 */
export function isChunkWhite(chunkSize, chunkX, chunkY, imageData) {
  let i = 0; // uint/color index
  let count = 0;

  // chunk going over the height/width are ignored
  for (let y = chunkY; y < chunkY + chunkSize && y < imageData.height - 1; y++) {
    for (let x = chunkX; x < chunkX + chunkSize && x < imageData.width - 1; x++) {
      i = 4 * (y * imageData.width + x);
      if (isWhite(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2])) {
        count++;
      }
    }
  }
  console.log(chunkX, chunkY, count);
}

function isWhite(r, g, b) {
// expected min of each color to be roughly white hue
// ex 90 / Math.hypot(90,100,110) ~ .52
  const whiteHueThreshold = .5;
  // black characters will have grey aliasing so count those are black
  /*
  the white vs black on magnitude depends on coloring on the receipt
  250-300 seems like a good range.
    300 sometimes flags darker parts of the receipt as not white (even though it is).
    250 sometimes flags grey text as white, but really is the text

  for now using 250 will remove some extra text, but thats fine for identifying
  receipt line heights
  */
  const whiteGrayMagThreshold = 250;

  const mag = Math.hypot(r, g, b);
  if (mag < whiteGrayMagThreshold) return false;
  if (r / mag < whiteHueThreshold) return false;
  if (g / mag < whiteHueThreshold) return false;
  if (b / mag < whiteHueThreshold) return false;
  return true;
}

function setColor(data, i, r, g, b) {
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
}
