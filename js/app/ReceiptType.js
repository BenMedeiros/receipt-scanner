'use strict';

import {LabelInputType} from "../../html/tinyComponents/LabelInputType.js";
import {ButtonType} from "../../html/tinyComponents/ButtonType.js";
import {createGenericForm} from "./form.js";
import {TableType} from "../../html/components/TableType.js";

let receipts = localStorage.getItem('receipts');
if (receipts) receipts = JSON.parse(receipts);
if (!receipts || typeof receipts !== 'object' || !Array.isArray(receipts)) {
  receipts = [];
  localStorage.setItem('receipts', JSON.stringify(receipts));
}

export const ReceiptStruct = {
  store: String,
  date: Date,
  total: Number,
  lines: [{
    item: String,
    price: Number,
    discount: Number,
    quantity: Number
  }]
}

export class ReceiptType {
  constructor(receiptId) {
    if (receiptId >= 0) {
      if (!receipts[receiptId]) {
        throw new Error('Receipt id not found: ' + receiptId);
      }
      this.id = receiptId;

    } else {
      //  new receipt
      this.id = receipts.push({
        store: null,
        date: null,
        total: null,
        lines: []
      }) - 1;
    }
  }

  createForm() {
    console.log(this.id, receipts[this.id]);
    this.idInput = new LabelInputType('id', 'string', 'id', null, this.id, true);
    this.storeInput = new LabelInputType('store', 'string', 'Store', receipts[this.id].store);
    this.dateInput = new LabelInputType('date', 'date', 'Date', receipts[this.id].date);
    this.totalInput = new LabelInputType('total', 'currency', 'Total $', receipts[this.id].total);

    this.tableInput = new TableType('Lines', ['item', 'price', 'discount', 'quantity'],
      () => {
        this.addItemLine();
      });
    this.lineInputs = [];

    this.submitInput = new ButtonType('createReceipt', 'Create Receipt', () => {
      this.readForm()
    });
    this.deleteInput = new ButtonType('deleteReceipt', 'Delete Receipt', () => {
      this.readForm()
    });

    this.form = createGenericForm('New Receipt', [
      this.idInput,
      this.storeInput,
      this.dateInput,
      this.totalInput,
      this.tableInput,
      this.submitInput,
      this.deleteInput
    ]);

    //start with a blank row
    this.addItemLine();

    document.getElementById("main").appendChild(this.form);
  }

  addItemLine() {
    const newLine = {
      item: new LabelInputType('item', 'string'),
      price: new LabelInputType('price', 'currency'),
      discount: new LabelInputType('discount', 'currency'),
      quantity: new LabelInputType('quantity', 'integer')
    };
    this.lineInputs.push(newLine);
    this.tableInput.addRowValues(Object.values(newLine));
    return newLine;
  }

  readForm() {
    receipts[this.id].store = this.storeInput.getValue();
    receipts[this.id].date = this.dateInput.getValue();
    receipts[this.id].total = this.totalInput.getValue();
    receipts[this.id].lines.length = 0;

    for (const lineInput of this.lineInputs) {
      const lineObj = {};
      let isBlank = true;
      for (const [key, inputType] of Object.entries(lineInput)) {
        lineObj[key] = inputType.getValue();
        if (isBlank && lineObj[key] !== null) isBlank = false;
      }

      if (!isBlank) receipts[this.id].lines.push(lineObj);
    }

    localStorage.setItem('receipts', JSON.stringify(receipts));
    setTimeout(() => this.destroy(), 100);
  }

  destroy() {
    if (this.form) this.form.remove();
  }
}
