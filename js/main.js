'use strict';

import {ReceiptStruct, ReceiptType} from "./app/ReceiptType.js";
import {ButtonType} from "../html/tinyComponents/ButtonType.js";


const createReceiptBtn = new ButtonType('createReceipt', 'Create Receipt', () => {
  const receiptPrompt = new ReceiptType();
  receiptPrompt.createForm();
})

createReceiptBtn.createElementIn(document.getElementById("navigation-bar"));
