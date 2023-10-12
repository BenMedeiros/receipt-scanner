'use strict';

import {LabelInputType} from "../../html/tinyComponents/LabelInputType.js";
import {ButtonType} from "../../html/tinyComponents/ButtonType.js";
import {createGenericForm, scrollCarouselToForm} from "./form.js";
import {TableType} from "../../html/components/TableType.js";

let receipts = localStorage.getItem('receipts');
if (receipts) receipts = JSON.parse(receipts);
if (!receipts || typeof receipts !== 'object' || !Array.isArray(receipts)) {
  receipts = [];
  localStorage.setItem('receipts', JSON.stringify(receipts));
}

export function loadAllReceipts(){
  for (let i = 0; i < receipts.length; i++) {
    new ReceiptType(i).createForm();
  }
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
        isNew: true,
        store: null,
        date: null,
        total: null,
        lines: []
      }) - 1;
    }
  }

  createForm() {
    console.log(this.id, receipts[this.id]);
    this.idInput = new LabelInputType('gid', 'string', 'id', null, this.id, true);
    this.storeInput = new LabelInputType('store', 'string', 'Store', receipts[this.id].store);
    this.dateInput = new LabelInputType('date', 'date', 'Date', receipts[this.id].date);
    this.totalInput = new LabelInputType('total', 'currency', 'Total $', receipts[this.id].total);

    this.tableInput = new TableType('Lines', ['item', 'price', 'discount', 'quantity'],
      () => {
        this.addItemLine();
      });
    this.lineInputs = [];

    this.submitInput = new ButtonType('createReceipt',
      receipts[this.id].isNew ? 'Create Receipt' : 'Save Changes', () => {
        this.readForm()
      });
    this.deleteInput = new ButtonType('deleteReceipt', 'Delete Receipt', () => {
      this.readForm()
    });

    this.form = createGenericForm(this.id,
      receipts[this.id].isNew ? 'New Receipt' : 'Edit ' + this.id, [
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
    //  goTo newly loaded form
    scrollCarouselToForm(this.id);
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
    receipts[this.id].isNew = false;

    for (const lineInput of this.lineInputs) {
      const lineObj = {};
      let isBlank = true;
      for (const [key, inputType] of Object.entries(lineInput)) {
        lineObj[key] = inputType.getValue();
        if (isBlank && lineObj[key] !== null) isBlank = false;
      }
      //only store line if the line isn't blank
      if (!isBlank) receipts[this.id].lines.push(lineObj);
    }


    localStorage.setItem('receipts', JSON.stringify(receipts));
    setTimeout(() => this.destroy(), 100);
  }

  destroy() {
    if (this.form) this.form.remove();
  }
}
