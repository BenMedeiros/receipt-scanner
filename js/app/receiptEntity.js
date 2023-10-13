'use strict';


let receipts = localStorage.getItem('receipts');
if (receipts) receipts = JSON.parse(receipts);
if (!receipts || typeof receipts !== 'object' || !Array.isArray(receipts)) {
  receipts = [];
  localStorage.setItem('receipts', JSON.stringify(receipts));
}

export function getReceipt(id) {
  return receipts[id];
}

export function getAllReceipts() {
  return receipts;
}

export function deleteReceipt(id) {
  if (!receipts[id]) throw new Error('Receipt not found' + id);
  receipts[id].isDeleted = true;
  localStorage.setItem('receipts', JSON.stringify(receipts));
}

export function newReceipt() {
  return receipts.push({
    isDeleted: false,
    isNew: true,
    store: null,
    date: null,
    total: null,
    lines: []
  }) - 1;
}

export function updateReceipt(id, store, date, total, lines) {
  console.log(lines);
  if (!receipts[id]) throw new Error('Receipt not found' + id);
  receipts[id].store = store;

  if (date instanceof Date) {
    receipts[id].date = date.valueOf();
  } else {
    receipts[id].date = date;
  }

  receipts[id].total = total;
  receipts[id].isNew = false;

  if (lines.length === 0) throw new Error('Must have lines to save.');
  receipts[id].lines.length = 0;
  receipts[id].lines.push(...lines);

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
