'use strict';

import {getCurrentCanvas, getCurrentImageData, putNewImageNewCanvas} from "../canvas/fileHandler.js";
import {cheapLineFit, sumOp} from "../common/dirtyMath.js";
import {drawLine, drawRect, setColor, addColor} from "../canvas/draw.js";

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
  const chunkObject = {
    chunkSize, chunkArray,
    imageData: {
      height: imageData.height,
      width: imageData.width
    }
  };

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

  putNewImageNewCanvas(imageData);
  findTrimDimensions(chunkObject);
  console.log(chunkObject);

  const canvas = getCurrentCanvas();
  drawLine(canvas, 'rgba(255,0,0,0.75)', 5,
    chunkObject.startLine.x0, chunkObject.startLine.y0, chunkObject.startLine.x1, chunkObject.startLine.y1);
  drawLine(canvas, 'rgba(255,0,0,0.75)', 5,
    chunkObject.endLine.x0, chunkObject.endLine.y0, chunkObject.endLine.x1, chunkObject.endLine.y1);

  findVerticalChunkSections(chunkObject);

  for (let i = 0; i < chunkObject.rowMetrics.length; i++) {
    let metric = chunkObject.rowMetrics[i];
    if (metric.startX === null) continue;

    let startPixel = metric.startX * chunkSize;
    let endPixel = metric.endX * chunkSize;

    // draw chunk row lines
    drawLine(canvas, 'rgba(0,0,255,0.75)', 1,
      startPixel, i * chunkSize, endPixel, i * chunkSize);

    //  draw a color patch to left of start edge as vertical chunk label
    drawRect(canvas, `hsl(0, 0%, ${metric.rowSum * 100 / (metric.endX - metric.startX)}%)`,
      startPixel - 5*chunkSize, i * chunkSize, chunkSize * 5, chunkSize);
  }
}

//look at the chunks and trim from outside if no whites
function findTrimDimensions(chunkObject) {
  const chunkArray = chunkObject.chunkArray;
  const rowMetrics = new Array(chunkArray.length);
  chunkObject.rowMetrics = rowMetrics;

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

  const endLine = cheapLineFit(rowMetrics.map(el => el.endX));
  const startLine = cheapLineFit(rowMetrics.map(el => el.startX));

  chunkObject.endLine = {
    m: endLine.m,
    b: endLine.b,
    x0: endLine.b * chunkObject.chunkSize,
    y0: 0,
    x1: (endLine.m * chunkObject.imageData.height) + (endLine.b * chunkObject.chunkSize),
    y1: chunkObject.imageData.height - 1
  }

  chunkObject.startLine = {
    m: startLine.m,
    b: startLine.b,
    x0: startLine.b * chunkObject.chunkSize,
    y0: 0,
    x1: (startLine.m * chunkObject.imageData.height) + (startLine.b * chunkObject.chunkSize),
    y1: chunkObject.imageData.height - 1
  }
}

// within the receipt border, scan down to find white space areas
function findVerticalChunkSections({chunkArray, rowMetrics}) {
  for (let i = 0; i < chunkArray.length; i++) {
    if (rowMetrics[i].startX === null) continue;
    let rowSum = chunkArray[i].slice(rowMetrics[i].startX, rowMetrics[i].endX).reduce(sumOp);
    // per chunk, a 1 means 100% isWhite
    rowMetrics[i].rowSum = Math.round(rowSum * 10) / 10;
  }

  // how do row levels change per chunk
  for (let i = 0; i < rowMetrics.length - 1; i++) {
    rowMetrics[i].nextRowDiff = rowMetrics[i + 1].rowSum - rowMetrics[i].rowSum;
  }
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
