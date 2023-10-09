'use strict';

const supportedTypes = ['number', 'string', 'checkbox'];

export class LabelInputType {
  element = null;
  parentsElements = [];

  constructor(name, type, labelText, value, placeholder, readOnly) {
    this.name = name;
    this.type = type;
    this.labelText = labelText;
    this.value = value;
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
    if (this.value !== undefined) {
      if (this.type === 'checkbox') {
        inputEl.checked = this.value;
      } else {
        inputEl.value = this.value;
      }
    }
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
    } else {
      return this.element.value;
    }
  }
}
