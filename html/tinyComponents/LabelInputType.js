'use strict';

const supportedTypes = ['number', 'integer', 'currency', 'string', 'checkbox', 'date'];

export class LabelInputType {
  element = null;
  parentsElements = [];

  constructor(name, type, labelText, initialValue, placeholder, readOnly) {
    this.id = name;
    this.name = name;
    //wrapped the type for common scenarios
    if (type === 'number') {
      this.step = 'any';
      this.type = 'number';
    } else if (type === 'integer') {
      this.step = '1';
      this.type = 'number';
    } else if (type === 'currency') {
      this.step = '.01'
      this.type = 'number';
    } else {
      this.type = type;
    }

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

    this.element = document.createElement("input");
    this.element.type = this.type;
    this.element.id = this.id;
    this.element.name = this.name;

    if (this.initialValue !== undefined) {
      if (this.type === 'checkbox') {
        this.element.checked = this.initialValue;
      } else {
        this.element.initialValue = this.initialValue;
      }
    }

    if (this.step !== undefined) this.element.step = this.step;
    if (this.readOnly) this.element.readOnly = true;

    if (this.placeholder !== undefined) {
      if (this.initialValue !== null && this.initialValue !== undefined) {
        throw new Error('read only fields use placeholder');
      }
      this.element.placeholder = this.placeholder;
    }

    //if no label, just create the input (ex. tables)
    if (this.labelText) {
      const divEl = document.createElement("div");

      const labelEl = document.createElement("label");
      labelEl.htmlFor = this.name;
      labelEl.innerText = this.labelText;

      divEl.appendChild(labelEl);
      divEl.appendChild(this.element);
      parentEl.appendChild(divEl);
    } else {
      parentEl.appendChild(this.element);
    }

    this.parentsElements.push(parentEl);
    return this.element;
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

  destory() {
    if (this.element) this.element.remove();
  }
}
