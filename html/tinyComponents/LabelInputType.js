'use strict';

const supportedTypes = ['number', 'string', 'checkbox', 'date'];

export class LabelInputType {
  element = null;
  parentsElements = [];

  constructor(name, type, labelText, initialValue, placeholder, readOnly) {
    this.name = name;
    this.type = type;
    this.labelText = labelText;
    this.initialValue = initialValue;
    this.placeholder = placeholder;
    this.readOnly = readOnly;

    if (supportedTypes.indexOf(type) === -1) {
      throw new Error('Only supported types are: ' + supportedTypes.join(', '));
    }
  }

  createElementIn(parentEl) {
    if (this.parentsElements.indexOf(parentEl) !== -1) {
      console.error('Already exists in this element', this);
    }

    const divEl = document.createElement("div");

    const labelEl = document.createElement("label");
    labelEl.htmlFor = this.name;
    labelEl.innerText = this.labelText;
    divEl.appendChild(labelEl);

    const inputEl = document.createElement("input");
    inputEl.type = this.type;
    inputEl.id = this.name;
    inputEl.name = this.name;

    if (this.initialValue !== undefined) {
      if (this.type === 'checkbox') {
        inputEl.checked = this.initialValue;
      } else {
        inputEl.initialValue = this.initialValue;
      }
    }

    if(this.type === 'number') inputEl.step = '.01';

    if (this.placeholder !== undefined) inputEl.placeholder = this.placeholder;
    if (this.readOnly) inputEl.readOnly = true;
    divEl.appendChild(inputEl);
    this.element = inputEl;

    parentEl.appendChild(divEl);
    this.parentsElements.push(parentEl);
  }

  getValue() {
    if (this.type === 'number') {
      return this.element.value === '' ? this.placeholder : Number(this.element.value);
    } else if (this.type === 'string') {
      return String(this.element.value);
    } else if (this.type === 'checkbox') {
      return this.element.checked;
    } else if (this.type === 'date') {
      return new Date(this.element.value);
    } else {
      return this.element.value;
    }
  }
}
