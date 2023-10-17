'use strict';

import {loadAllReceipts, ReceiptType} from "./app/ReceiptType.js";
import {ButtonType} from "../html/tinyComponents/ButtonType.js";
import {hideFormSection, showFormSection} from "./app/form.js";
import {createFileUploadBtn, deleteLastCanvas} from "./ocr/fileHandler.js";
import {isWhiteChunkLevel, isWhitePixelLevel} from "./ocr/imageCleaner.js";
import {deburImage} from "./ocr/deblur.js";
import tesseractHandler from "./ocr/tesseract/tesseractHandler.js";

const createReceiptBtn = new ButtonType('createReceipt', 'Create Receipt', () => {
  if (receiptsShown === false) toggleShowReceiptsState();
  const receiptPrompt = new ReceiptType();
  receiptPrompt.createForm();
})

const showReceiptsBtn = new ButtonType('toggleShowReceipts', 'Show Receipts', () => {
  toggleShowReceiptsState();
})

function toggleShowReceiptsState() {
  if (receiptsShown) {
    showReceiptsBtn.setValue('Show Receipts');
    receiptsShown = false;
    hideFormSection();
  } else {
    showReceiptsBtn.setValue('Hide Receipts');
    receiptsShown = true;
    showFormSection();
  }
}

const navBarEl = document.getElementById("navigation-bar");
showReceiptsBtn.createElementIn(navBarEl);
createReceiptBtn.createElementIn(navBarEl);

let receiptsShown = true;
loadAllReceipts();
toggleShowReceiptsState(); // hide to start

createFileUploadBtn();



function navBarBtn(fn){
  new ButtonType(fn.name, fn.name, () => {
    fn();
  }, null, null, navBarEl);
}

navBarBtn(deburImage);
navBarBtn(deleteLastCanvas);
navBarBtn(isWhitePixelLevel);
navBarBtn(isWhiteChunkLevel);
navBarBtn(tesseractHandler.processImageFromCanvas)
