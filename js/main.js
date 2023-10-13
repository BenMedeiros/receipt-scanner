'use strict';

import {loadAllReceipts, ReceiptStruct, ReceiptType} from "./app/ReceiptType.js";
import {ButtonType} from "../html/tinyComponents/ButtonType.js";
import {hideFormSection, showFormSection} from "./app/form.js";

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

showReceiptsBtn.createElementIn(document.getElementById("navigation-bar"));
createReceiptBtn.createElementIn(document.getElementById("navigation-bar"));

let receiptsShown = true;
loadAllReceipts();
toggleShowReceiptsState(); // hide to start
