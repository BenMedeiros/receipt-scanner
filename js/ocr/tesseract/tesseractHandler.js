'use strict';
import {getCurrentCanvas} from "../fileHandler.js";

Tesseract.setLogging(true);

export default {
  processImageUrl,
  processImageFromCanvas
}

async function work(worker, exampleImage) {
  let result = await worker.detect(exampleImage);
  console.log(result.data);

  result = await worker.recognize(exampleImage);
  console.log(result.data);

  await worker.terminate();
}

function processImageUrl(url) {
  const workerPromise = Tesseract.createWorker("eng", 1, {
    legacyCore: true,
    legacyLang: true,
    logger: m => console.log(m)
  });

  workerPromise.then(worker => work(worker, url));
}

function processImageFromCanvas(){
  const canvas = getCurrentCanvas();
  processImageUrl(canvas);
}
