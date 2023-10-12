'use strict';

export class TableType {
  rows = [];

  constructor(name, cols, rowInputsConstructor, initialValue) {
    this.name = name;
    this.cols = cols;
    this.rowInputsConstructor = rowInputsConstructor;
    this.initialValue = initialValue;
    console.log(initialValue);
  }

  createElementIn(parentEl) {
    this.element = document.createElement("table");
    const caption = document.createElement("caption");
    caption.innerText = this.name;
    this.element.appendChild(caption);

    const tr = document.createElement("tr");
    this.element.appendChild(tr);

    for (const col of this.cols) {
      const th = document.createElement("th");
      th.innerText = col;
      tr.appendChild(th);
    }

    parentEl.appendChild(this.element);

    //need to have this fn to be able to create new rows of data
    if (this.rowInputsConstructor) {
      //event handler
      addNewRowOnDataEntry(this);
      //create the initial rows passed from initialValue
      for (const obj of this.initialValue) {
        console.log('inpt const', obj)
        this.rowInputsConstructor(obj);
      }
    }
  }

  addRowValues(inputTypes) {
    const tr = document.createElement("tr");
    this.element.appendChild(tr);

    for (const inputType of inputTypes) {
      const td = document.createElement("td");
      if(inputType.name === 'item') console.log(inputType);
      inputType.createElementIn(td);
      tr.appendChild(td);
    }

    this.rows.push({tr, inputTypes});
  }

  destroy() {
    this.element.remove();
  }
}

function addNewRowOnDataEntry(table) {
  table.element.addEventListener('keydown', (e) => {
    const lastRow = table.rows[table.rows.length - 1];
    if (!lastRow) return;
    for (const inputType of lastRow.inputTypes) {
      //if any input in lastRow is not initial value, it's being used and we need a new one
      if (!inputType.isInitialValue()) {
        table.rowInputsConstructor();
        return;
      }
    }
    // if last 2 rows are empty, delete the last row
    const secondLastRow = table.rows[table.rows.length - 2];
    if (!secondLastRow) return;
    for (const inputType of secondLastRow.inputTypes) {
      if (!inputType.isInitialValue()) return;
    }
    //  all second row is initial value too so delete last row
    console.log('removing row', table.rows.length - 1);
    lastRow.tr.remove();
    table.rows.pop();
  });
}
