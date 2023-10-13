'use strict';

export class ButtonType {
    element = null;
    parentsElements = [];

    constructor(name, text, onclick, disabled, iconMdiText) {
        this.name = name;
        this.text = text;
        this.disabled = disabled;
        this.onclick = onclick;
        this.iconMdiText = iconMdiText
    }

    createElementIn(parentEl) {
        if (this.parentsElements.indexOf(parentEl) !== -1) {
            console.error('Already exists in this element', this);
        }

        const btnEl = document.createElement("button");
        btnEl.id = this.name;
        btnEl.name = this.name;
        if (this.disabled) btnEl.disabled = this.disabled;

        if (this.onclick) {
            if (typeof this.onclick === 'string') {
                btnEl.onclick = () => document.dispatchEvent(new Event(this.onclick));
            } else if (typeof this.onclick === 'function') {
                btnEl.onclick = this.onclick;
            } else {
                throw new Error('Unknown onclick type.');
            }
        }

        if (this.iconMdiText) {
            const i = document.createElement("i");
            // i.classList.add('material-icons');
            i.innerText = 'undo';
            btnEl.appendChild(i);
        }

        if (this.text) {
            const span = document.createElement("span");
            span.innerText = this.text;
            btnEl.appendChild(span);
        }

        parentEl.appendChild(btnEl);
        this.element = btnEl;
        this.parentsElements.push(parentEl);
        return btnEl;
    }

    disable(){
      this.disabled = true;
      this.element.disabled = true;
    }

    enable(){
      this.disabled = false;
      this.element.disabled = false;
    }

}
