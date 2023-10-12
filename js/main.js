'use strict';

import {loadAllReceipts, ReceiptStruct, ReceiptType} from "./app/ReceiptType.js";
import {ButtonType} from "../html/tinyComponents/ButtonType.js";


const createReceiptBtn = new ButtonType('createReceipt', 'Create Receipt', () => {
  const receiptPrompt3 = new ReceiptType();
  receiptPrompt3.createForm();
})

createReceiptBtn.createElementIn(document.getElementById("navigation-bar"));


loadAllReceipts();
