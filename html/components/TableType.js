'use strict';

export class TableType {
  rows = [];

  constructor(name, cols) {
    this.name = name;
    this.cols = cols;
  }

  createElementIn(parentEl){
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
  }

  addRowValues(inputTypes){
    const tr = document.createElement("tr");
    this.element.appendChild(tr);

    for (const inputType of inputTypes) {
      const td = document.createElement("td");
      inputType.createElementIn(td);
      tr.appendChild(td);
    }
  }
}
