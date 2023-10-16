'use strict';

import {getCurrentImageData, putNewImageNewCanvas} from "./fileHandler.js";
import {cheapLineFit} from "../common/dirtyMath.js";

// highlight each pixel based on if it's white per threshold
export function isWhitePixelLevel() {
  const imageData = getCurrentImageData();
  const dataCopy = new Uint8ClampedArray(imageData.data);
  dataCopy.set(imageData.data);

  let i = 0;
  for (let y = 0; y < imageData.height - 1; y++) {
    for (let x = 0; x < imageData.width - 1; x++) {
      i = 4 * (y * imageData.width + x);
      if (isWhite(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2])) {
        setColor(imageData.data, i, 0, 255, 0);
      }
    }
  }

  putNewImageNewCanvas(imageData);

}

// look at a chunk of pixels are see if its white or not, basically blends
export function isWhiteChunkLevel() {
  const imageData = getCurrentImageData();
  const dataCopy = new Uint8ClampedArray(imageData.data);
  dataCopy.set(imageData.data);

  const chunkSize = 20;
  const chunkArray = [];

  let i = 0;
  for (let y = 0; y < imageData.height - 1; y += chunkSize) {
    //x by y array with counts
    if (chunkArray[Math.floor(y / chunkSize)] === undefined) {
      chunkArray[Math.floor(y / chunkSize)] = [];
    }
    for (let x = 0; x < imageData.width - 1; x += chunkSize) {
      i = 4 * (y * imageData.width + x);
      chunkArray[Math.floor(y / chunkSize)][Math.floor(x / chunkSize)] = isChunkWhite(chunkSize, x, y, imageData);
    }
  }

  // putNewImageNewCanvas(imageData);
  console.log(chunkArray);

  const trimLines = findTrimDimensions(chunkArray);
  console.log(trimLines);
  drawTrimLine(trimLines.endLine, imageData, chunkSize);
  drawTrimLine(trimLines.startLine, imageData, chunkSize);

  putNewImageNewCanvas(imageData);
}

function drawTrimLine(trimLineObj, imageData, chunkSize) {
  // draw the trim lines
  let i = 0;
  let x = Math.round(trimLineObj.b * chunkSize);
  for (let y = 0; y < imageData.height; y++) {
    x = (trimLineObj.m * y) + (trimLineObj.b * chunkSize);
    i = 4 * (y * imageData.width + Math.round(x));
    // set 5 px wide
    setColor(imageData.data, i - 8, 255, 0, 0);
    setColor(imageData.data, i - 4, 255, 0, 0);
    setColor(imageData.data, i, 255, 0, 0);
    setColor(imageData.data, i + 4, 255, 0, 0);
    setColor(imageData.data, i + 8, 255, 0, 0);
  }
}

//look at the chunks and trim from outside if no whites
function findTrimDimensions(chunkArray) {
  const rowMetrics = new Array(chunkArray.length);
  for (let i = 0; i < chunkArray.length; i++) {
    rowMetrics[i] = {startX: null, endX: null};
    for (let j = 0; j < chunkArray[i].length; j++) {
      // if next 2 chunks are above threshold
      if (rowMetrics[i].startX === null && chunkArray[i][j] > .4 && chunkArray[i][j + 1] > .4) {
        rowMetrics[i].startX = j;
      }
      // if last 2 chunks are above threshold
      if (chunkArray[i][j] > .4 && chunkArray[i][j - 1] > .4) {
        rowMetrics[i].endX = j;
      }
    }
  }
  console.log(rowMetrics);

  const endLine = cheapLineFit(rowMetrics.map(el => el.endX).filter(el => el !== null));
  const startLine = cheapLineFit(rowMetrics.map(el => el.startX).filter(el => el !== null));

  return {startLine, endLine};
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

  const whiteRatio = count / chunkSize / chunkSize;

  // mostly not white
  if (count < chunkSize * chunkSize / 4) return whiteRatio;

  //same loop of chunk, just coloring since these have decent white
  for (let y = chunkY; y < chunkY + chunkSize && y < imageData.height - 1; y++) {
    for (let x = chunkX; x < chunkX + chunkSize && x < imageData.width - 1; x++) {
      i = 4 * (y * imageData.width + x);
      addColor(imageData.data, i, 0, 255 * whiteRatio, 0);
    }
  }

  return whiteRatio;
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

function addColor(data, i, r, g, b) {
  data[i] = Math.hypot(data[i], r) / 1.414;
  data[i + 1] = Math.hypot(data[i + 1], g) / 1.414;
  data[i + 2] = Math.hypot(data[i + 2], b) / 1.414;
}
