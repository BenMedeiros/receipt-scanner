'use strict';

// <input type="file" id="img" name="img" accept="image/*" multiple>

export function createFileUploadBtn() {
  const btnWrapper = document.createElement('button');

  const el = document.createElement('input');
  el.id = 'imgUpload';
  el.type = 'file';
  el.accept = 'image/*';
  el.multiple = true;
  btnWrapper.appendChild(el);
  document.getElementById("navigation-bar").appendChild(btnWrapper);

  el.onload = (e) => {
    console.log('img loaded', e);
  };

  el.addEventListener('input', (e) => {
    deleteCanvases();

    for (const file of e.target.files) {
      loadLocalFileImage(file);
    }
  });
}

function loadLocalFileImage(file) {
  const fr = new FileReader();

  fr.onload = () => {
    const img = new Image();
    img.onload = () => createCanvasAndOutputForImg(img);
    img.src = fr.result;
  };

  fr.readAsDataURL(file);
}

function loadServerImage(src) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;

  img.onload = () => createCanvasAndOutputForImg(img);
}

function createCanvasAndOutputForImg(img) {
  //scale so that the width < 2^10, don't think i care about height though
  const maxResolutionPower = 10;
  let scale = Math.pow(2, Math.ceil(Math.log2(img.width) - maxResolutionPower));
  scale = Math.max(scale, 1);
  if (scale !== 1) console.log('Scaled image by ', scale);

  const canvas = document.createElement("canvas");
  canvas.width = img.width / scale;
  canvas.height = img.height / scale;

  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

  canvasWrapper.appendChild(canvas);
  openCanvases.push(canvas);
}

function deleteCanvases() {
  for (let i = 0; i < openCanvases.length; i++) {
    openCanvases[i].remove();
  }
  openCanvases.length = 0;
  currentImageData = null;
}

export function deleteLastCanvas() {
  if (openCanvases.length > 0) openCanvases.pop().remove();
  // removed the cached imageData since it needs to be reread from last canvas
  currentImageData = null;
}

// returns the imageData from canvas or last written canvas cache
export function getCurrentImageData() {
  if (!currentImageData) {
    const canvas = openCanvases[openCanvases.length - 1];
    if (!canvas) throw new Error('No image exists');

    currentImageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
  }
  return currentImageData;
}

export function putNewImageNewCanvas(imageData) {
  currentImageData = imageData;

  const canvas = document.createElement("canvas");
  canvas.height = imageData.height;
  canvas.width = imageData.width;
  canvasWrapper.appendChild(canvas);
  openCanvases.push(canvas);

  canvas.getContext("2d").putImageData(imageData, 0, 0)
}


const canvasWrapper = document.getElementById("main");
const openCanvases = []; //map of all canvas objects and outputs
let currentImageData = null;

// loadServerImage('/img/004.png');
// loadServerImage('/img/costco_high_quality.jpg');
