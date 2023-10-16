'use strict';

import {getCurrentImageData, putNewImageNewCanvas} from "./fileHandler.js";

export function deburImage() {
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


// subtract out adjacent pixel colors in case they were blurred into this pixel
function deblurColor(data, i, width, imageDataCopy) {
  data[i] = Math.max(0, Math.min(255,
    (5 * imageDataCopy[i])
    - imageDataCopy[i + 4]
    - imageDataCopy[i - 4]
    - imageDataCopy[i + (4 * width)]
    - imageDataCopy[i - (4 * width)]));
}
