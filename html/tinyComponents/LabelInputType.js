'use strict';

import {formatDate} from "../../js/common/dateUtils.js";

const supportedTypes = ['number', 'integer', 'currency', 'string', 'checkbox', 'date'];

export class LabelInputType {
  element = null;
  parentsElements = [];
  isModified = false;
  onModifiedCallbacks = [];
  onUnModifiedCallbacks = [];

  constructor(name, type, labelText, initialValue, placeholder, readOnly) {
    if (name === 'id') {
      throw new Error('id/name cannot be id because it messes up using el.id for some reason');
    }
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
      } else if (this.type === 'date') {
        this.element.value = formatDate(this.initialValue);
        console.log(this.initialValue, this.element.value);
      } else {
        this.element.value = this.initialValue;
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

    this.element.classList.toggle('modified', false);
    //use keyup because we are looking after the change has taken place
    this.element.addEventListener('keyup', (e) => {
      this.checkModified();
    });


    return this.element;
  }

  getValue() {
    if (this.type === 'number') {
      if (this.element.value === '') {
        return this.placeholder || null;
      }
      return Number(this.element.value);

    } else if (this.type === 'string') {
      if (this.element.value === '') return null;
      return String(this.element.value);

    } else if (this.type === 'checkbox') {
      return this.element.checked === true;

    } else if (this.type === 'date') {
      if (!this.element.value || this.element.value === '') return null;
      return new Date(this.element.value);

    } else {
      return this.element.value;
    }
  }

  isInitialValue() {
    if (this.type === 'checkbox') {
      if (this.initialValue === true) {
        return this.element.checked === true;
      } else {
        return this.element.checked !== true;
      }
    } else if (this.type === 'date') {
      if (!this.getValue() && !this.initialValue) return true;
      if (!this.getValue() || !this.initialValue) return false;
      return this.getValue().valueOf() === this.initialValue.valueOf();
    } else {
      return this.getValue() === this.initialValue;
    }
  }

  checkModified() {
    //isModified has changed
    if (this.isModified === this.isInitialValue()) {
      this.isModified = !this.isInitialValue();
      this.element.classList.toggle('modified', this.isModified);

      if (this.isModified) {
        this.onModifiedCallbacks.forEach(cb => cb());
      } else {
        this.onUnModifiedCallbacks.forEach(cb => cb());
      }
    }
  }

  //called once when modified
  onModified(cb) {
    this.onModifiedCallbacks.push(cb);
  }

  //called once when returned to no modified
  onUnModified(cb) {
    this.onUnModifiedCallbacks.push(cb)
  }

  destroy() {
    if (this.element) this.element.remove();
  }

  //used for monitoring text change status; using a function in case of logging
  updateInitialValueToCurrent() {
    this.initialValue = this.getValue();
    this.checkModified();
  }
}
