'use strict';

import {loadAllReceipts, ReceiptType} from "./app/ReceiptType.js";
import {ButtonType} from "../html/tinyComponents/ButtonType.js";
import {hideFormSection, showFormSection} from "./app/form.js";
import {createFileUploadBtn, deleteLastCanvas} from "./ocr/fileHandler.js";
import {deblurColor, whiteBlackByNeighbors} from "./ocr/imageCleaner.js";

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


new ButtonType('deblurColor', 'deblurColor', () => {
  deblurColor();
}, null, null, navBarEl);

new ButtonType('deleteLastCanvas', 'deleteLastCanvas', () => {
  deleteLastCanvas();
}, null, null, navBarEl);

new ButtonType('deletewhiteBlackByNeighborsLastCanvas', 'whiteBlackByNeighbors', () => {
  whiteBlackByNeighbors();
}, null, null, navBarEl);


