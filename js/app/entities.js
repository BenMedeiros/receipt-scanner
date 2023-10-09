'use strict';

import {LabelInputType} from "../../html/tinyComponents/LabelInputType.js";
import {ButtonType} from "../../html/tinyComponents/ButtonType.js";

let receipts = localStorage.getItem('receipts');
if (!receipts) {
  receipts = [];
  localStorage.setItem('receipts', JSON.stringify(receipts));
}

let items = localStorage.getItem('items');
if (!items) {
  items = [];
  localStorage.setItem('items', JSON.stringify(items));
}

export const ReceiptStruct = [
  new LabelInputType('store', 'string', 'Store'),
  new LabelInputType('date', 'date', 'Date'),
  new LabelInputType('total', 'number', 'Total')
];

export class ReceiptType {
  constructor() {
  }

  createForm() {
    this.storeInput = new LabelInputType('store', 'string', 'Store');
    this.dateInput = new LabelInputType('date', 'date', 'Date');
    this.totalInput = new LabelInputType('total', 'number', 'Total');
    this.submitInput = new ButtonType('submit', 'New Game', () => this.readForm());

    createForm([this.storeInput, this.dateInput, this.totalInput, this.submitInput]);
  }

  readForm(){
    this.store = this.storeInput.getValue();
    this.date = this.dateInput.getValue();
    this.total = this.totalInput.getValue();
    console.log(this);
  }
}

function createForm(inputTypes) {
  const inputForm = document.createElement("form");
  inputForm.id = 'inputForm';
  inputForm.onsubmit = () => false;
  //title
  const h3 = document.createElement("h3");
  inputForm.appendChild(h3);
  const span = document.createElement("span");
  span.innerText = 'New Receipt'
  h3.appendChild(span);
  //add label fields
  for (const inputType of inputTypes) {
    inputType.createElementIn(inputForm);
  }
  //finally add the form to main
  document.getElementById("main").appendChild(inputForm);
  return inputForm;
}
