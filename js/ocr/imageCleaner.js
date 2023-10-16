'use strict';

import {getCurrentImageData, putNewImageNewCanvas} from "./fileHandler.js";


export function deblurColor() {
  console.log('deblurColor');
  const imageData = getCurrentImageData();

  if (!imageData) {
    console.log('No image exists');
    return;
  }
  const imageDataCopy = new Uint8ClampedArray(imageData.data);
  imageDataCopy.set(imageData.data);

  let i = 0;
  for (let y = 1; y < imageData.height - 1 - 1; y++) {
    for (let x = 1; x < imageData.width - 1 - 1; x++) {
      i = 4 * (y * imageData.width + x);
      // normalizeLine(imageData.data, i);
      deblurColor(imageData.data, i, imageData.width, imageDataCopy);
      deblurColor(imageData.data, i + 1, imageData.width, imageDataCopy);
      deblurColor(imageData.data, i + 2, imageData.width, imageDataCopy);
      // clampBlackAndWhite(imageData.data, i);
    }
  }

  putNewImageNewCanvas(imageData);
}

export function whiteBlackByNeighbors() {
  const imageData = getCurrentImageData();

  if (!imageData) {
    console.log('No image exists');
    return;
  }
  const imageDataCopy = new Uint8ClampedArray(imageData.data);
  imageDataCopy.set(imageData.data);

  let i = 0;
  for (let y = 100; y < imageData.height - 1 - 50; y++) {
    for (let x = 250; x < imageData.width - 1 - 50; x++) {
      i = 4 * (y * imageData.width + x);
      readNeighbors(imageData.data, i, imageData.width, imageDataCopy);
      // break;
    }
    // break;
  }

  putNewImageNewCanvas(imageData);
}


// subtract out adjacent pixel colors in case they were blurred into this pixel
function deblurColor(data, i, width, imageDataCopy) {
  data[i] = Math.max(0, Math.min(255,
    (5 * imageDataCopy[i])
    - imageDataCopy[i + 4]
    - imageDataCopy[i - 4]
    - imageDataCopy[i + (4 * width)]
    - imageDataCopy[i - (4 * width)]));
}


// expected min of each color to be roughly white hue
// ex 90 / Math.hypot(90,100,110) ~ .52
const whiteThreshold = .5;

function isWhite(r, g, b) {
  const mag = Math.hypot(r, g, b);
  if (r / mag < whiteThreshold) return false;
  if (g / mag < whiteThreshold) return false;
  if (b / mag < whiteThreshold) return false;
  return true;
}

