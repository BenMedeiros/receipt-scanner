'use strict';

import {LabelInputType} from "../../html/tinyComponents/LabelInputType.js";
import {ButtonType} from "../../html/tinyComponents/ButtonType.js";
import {createGenericForm, scrollCarouselToForm, formMsg, deleteGoToFormInNav} from "./form.js";
import {TableType} from "../../html/components/TableType.js";
import {getAllReceipts, getReceipt, newReceipt, updateReceipt, deleteReceipt} from "./receiptEntity.js";

let receiptsLoaded = false;

export function loadAllReceipts() {
  if (receiptsLoaded) {
    console.log('Receipts already loaded');
    return;
  }

  for (const [i, receipt] of Object.entries(getAllReceipts())) {
    if (receipt.isDeleted) continue;
    new ReceiptType(i).createForm();
  }
  //
  // for (let i = 0; i < getAllReceipts().length; i++) {
  //   new ReceiptType(i).createForm();
  // }
  receiptsLoaded = true;
  console.log('receipts loaded');

}

export class ReceiptType {
  constructor(receiptId) {
    if (receiptId >= 0) {
      if (!getReceipt(receiptId)) {
        throw new Error('Receipt id not found: ' + receiptId);
      }
      this.id = receiptId;
    } else {
      this.id = newReceipt();
    }
  }

  createForm() {
    this.idInput = new LabelInputType('gid', 'string', 'id', null, this.id, true);
    this.storeInput = new LabelInputType('store', 'string', 'Store', getReceipt(this.id).store);
    this.dateInput = new LabelInputType('date', 'date', 'Date', new Date(getReceipt(this.id).date));
    this.totalInput = new LabelInputType('total', 'currency', 'Total $', getReceipt(this.id).total);

    this.tableInput = new TableType('Lines', ['item', 'price', 'discount', 'quantity'],
      (line) => {
        this.addItemLine(line);
      }, getReceipt(this.id).lines);
    this.lineInputs = [];

    this.submitInput = new ButtonType('createReceipt',
      getReceipt(this.id).isNew ? 'Create Receipt' : 'Save Changes', () => {
        this.readForm()
      }, true);

    this.deleteInput = new ButtonType('deleteReceipt', 'Delete Receipt', () => {
      try {
        deleteReceipt(this.id);
        deleteGoToFormInNav(this.id);
        this.destroy();
      } catch (e) {
        formMsg(this.id, e.message);
      }
    });

    this.form = createGenericForm(this.id,
      getReceipt(this.id).isNew ? 'New Receipt' : 'Edit ' + this.id, [
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
    //enable/disable submit button
    this.trackChangesForSubmitBtn(this.storeInput);
    this.trackChangesForSubmitBtn(this.dateInput);
    this.trackChangesForSubmitBtn(this.totalInput);

    this.storeInput.bindAutocomplete(['Twin', 'Boise', 'Atl']);
  }

  addItemLine(line) {
    const newLine = {
      item: new LabelInputType('item', 'string', null, line ? line.item : null),
      price: new LabelInputType('price', 'currency', null, line ? line.price : null),
      discount: new LabelInputType('discount', 'currency', null, line ? line.discount : null),
      quantity: new LabelInputType('quantity', 'integer', null, line ? line.quantity : null)
    };
    this.lineInputs.push(newLine);
    this.tableInput.addRowValues(Object.values(newLine));
    newLine.item.bindAutocomplete(['Hot Dog', 'Pizza', 'Soda']);

    for (const inputType of Object.values(newLine)) {
      this.trackChangesForSubmitBtn(inputType);
    }

    return newLine;
  }

  readForm() {
    const lines = [];
    for (const lineInput of this.lineInputs) {
      const lineObj = {};
      let isBlank = true;
      for (const [key, inputType] of Object.entries(lineInput)) {
        lineObj[key] = inputType.getValue();
        if (isBlank && lineObj[key] !== null) isBlank = false;
      }
      //only store line if the line isn't blank
      if (!isBlank) lines.push(lineObj);
    }

    try {
      updateReceipt(this.id,
        this.storeInput.getValue(),
        this.dateInput.getValue(),
        this.totalInput.getValue(),
        lines
      );

      formMsg(this.id, 'Receipt saved');

      this.storeInput.updateInitialValueToCurrent();
      this.dateInput.updateInitialValueToCurrent();
      this.totalInput.updateInitialValueToCurrent();

      for (const lineInput of this.lineInputs) {
        for (const labelInput of Object.values(lineInput)) {
          labelInput.updateInitialValueToCurrent();
        }
      }
    } catch (e) {
      console.error(e.message);
      formMsg(this.id, e.message);
    }
  }

  isInitialValue() {
    if (!this.storeInput.isInitialValue()) return false;
    if (!this.dateInput.isInitialValue()) return false;
    if (!this.totalInput.isInitialValue()) return false;
    //check for changes in table
    for (const lineInput of this.lineInputs) {
      for (const labelInput of Object.values(lineInput)) {
        if (!labelInput.isInitialValue()) return false;
      }
    }
    return true;
  }

  trackChangesForSubmitBtn(inputType) {
    inputType.onModified(() => {
      if (this.submitInput.disabled && !this.isInitialValue()) {
        this.submitInput.enable();
      }
    });
    inputType.onUnModified(() => {
      if (!this.submitInput.disabled && this.isInitialValue()) {
        this.submitInput.disable()
      }
    });
  }

  destroy() {
    setTimeout(() => {
      if (this.form) this.form.remove();
      delete this;
    }, 100);
  }
}
