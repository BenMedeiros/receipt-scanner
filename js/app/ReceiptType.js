'use strict';

import {LabelInputType} from "../../html/tinyComponents/LabelInputType.js";
import {ButtonType} from "../../html/tinyComponents/ButtonType.js";
import {createGenericForm} from "./form.js";

let receipts = localStorage.getItem('receipts');
if (!receipts || typeof receipts !== 'object' || Array.isArray(receipts)) {
  receipts = {};
  localStorage.setItem('receipts', JSON.stringify(receipts));
}

export const ReceiptStruct = {
  store: String,
  date: Date,
  total: Number
}

export class ReceiptType {
  constructor() {
    this.id = crypto.randomUUID();
    console.log(this.id);
  }

  createForm() {
    this.idInput = new LabelInputType('id', 'string', 'id', null, this.id, true);
    this.storeInput = new LabelInputType('store', 'string', 'Store');
    this.dateInput = new LabelInputType('date', 'date', 'Date');
    this.totalInput = new LabelInputType('total', 'number', 'Total');
    this.submitInput = new ButtonType('submit', 'New Game', () => this.readForm());

    this.form = createGenericForm('New Receipt', [
      this.idInput, this.storeInput, this.dateInput, this.totalInput, this.submitInput
    ]);
  }

  readForm() {
    this.store = this.storeInput.getValue();
    this.date = this.dateInput.getValue();
    this.total = this.totalInput.getValue();
    console.log(this);
    receipts[this.id] = {
      store: this.store,
      date: this.date,
      total: this.total
    }

    setTimeout(() => this.destroy(), 100);
  }

  destroy() {
    if (this.form) this.form.remove();
  }
}
