'use strict';

import {LabelInputType} from "../../html/tinyComponents/LabelInputType.js";
import {ButtonType} from "../../html/tinyComponents/ButtonType.js";
import {createGenericForm} from "./form";

let items = localStorage.getItem('items');
if (!items) {
  items = [];
  localStorage.setItem('items', JSON.stringify(items));
}

export const ItemStruct = [
  new LabelInputType('store', 'string', 'Store'),
  new LabelInputType('date', 'date', 'Date'),
  new LabelInputType('total', 'number', 'Total')
];

export class ItemType {
  constructor() {
  }

  createForm() {
    this.storeInput = new LabelInputType('store', 'string', 'Store');
    this.dateInput = new LabelInputType('date', 'date', 'Date');
    this.totalInput = new LabelInputType('total', 'number', 'Total');
    this.submitInput = new ButtonType('submit', 'New Game', () => this.readForm());

    this.form = createGenericForm([this.storeInput, this.dateInput, this.totalInput, this.submitInput]);
  }

  readForm(){
    this.store = this.storeInput.getValue();
    this.date = this.dateInput.getValue();
    this.total = this.totalInput.getValue();
    console.log(this);

    setTimeout(() => this.destroy(), 100);
  }

  destroy(){
    if(this.form) this.form.remove();
  }
}
