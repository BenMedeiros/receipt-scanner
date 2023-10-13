'use strict';

import {ButtonType} from "../../html/tinyComponents/ButtonType.js";

let formSectionEl = null;
let formSectionNavEl = null;
let formSectionBodyEl = null;
let forms = {
  // isVisible = false,
  // navEl : null,
  // formEl : null
};

let observer = null;

export function createGenericForm(id, title, inputTypes) {
  if (forms[id]) throw new Error('Form ' + id + ' already loaded');

  const inputForm = document.createElement("form");
  inputForm.id = 'inputForm-' + id;
  inputForm.classList.add('inputForm');
  // use custom autocomplete component
  inputForm.autocomplete = 'off';
  // disable enter as submit
  inputForm.onkeydown = (event) => event.key !== 'Enter';
  // also disable enter as submit?
  inputForm.onsubmit = () => false;
  //title
  const h3 = document.createElement("h3");
  inputForm.appendChild(h3);
  const span = document.createElement("span");
  span.innerText = title;
  h3.appendChild(span);
  //add label fields
  for (const inputType of inputTypes) {
    inputType.createElementIn(inputForm);
  }

  //forms go into this div so that the carousel can be used
  if (!formSectionBodyEl) createFormSection();
  formSectionBodyEl.appendChild(inputForm);

  forms[id] = {formEl: inputForm};
  createGoToFormInNav(id);
  // Use the observer to observe an element
  observer.observe(inputForm)
  // To stop observing:
  // observer.unobserve(entry.target)
  return inputForm;
}

export function createFormSection() {
  formSectionEl = document.createElement('div');
  formSectionEl.id = 'formSection';
  formSectionNavEl = document.createElement('div');
  formSectionNavEl.id = 'form-section-nav';
  formSectionEl.appendChild(formSectionNavEl);
  formSectionBodyEl = document.createElement('div');
  formSectionBodyEl.id = 'form-section-body';
  formSectionEl.appendChild(formSectionBodyEl);

  document.getElementById("main").appendChild(formSectionEl);

  observer = new IntersectionObserver((entries, opts) => {
    entries.forEach(entry => {
      const formId = entry.target.id.substring('inputForm-'.length);
      forms[formId].isVisible = entry.isIntersecting;
      forms[formId].formEl.classList.toggle('visible', entry.isIntersecting);
      forms[formId].navEl.classList.toggle('visible', entry.isIntersecting);
    });
  }, {
    root: formSectionBodyEl,   // default is the viewport
    delay: 0, // delay to group cb within
    rootMargin: '5px', // margin to exclude visibility
    threshold: .9 // percentage of target's visible area. Triggers "onIntersection"
  });
}

// returns true is was hidden but not isn't
export function showFormSection() {
  if (!formSectionEl) {
    console.log('Form section not built yet.');
  }

  if (formSectionEl.style.visibility === 'hidden') {
    formSectionEl.style.visibility = 'initial';
    return true;
  }
  return false;
}

// returns true if wasn't hidden but now is
export function hideFormSection() {
  if (!formSectionEl) {
    console.log('Form section not built yet.');
  }

  console.log('hiding now');
  if (formSectionEl.style.visibility !== 'hidden') {
    formSectionEl.style.visibility = 'hidden';
    return true;
  }
  return false;
}


export function scrollCarouselToForm(id) {
  if (!forms[id]) throw new Error('Form ' + id + ' not loaded.');
  document.getElementById('inputForm-' + id).scrollIntoView({behavior: 'smooth', inline: 'center'});
}

export function createGoToFormInNav(id) {
  const goToBtn = new ButtonType('go-to-' + id, id + '', () => {
    scrollCarouselToForm(id);
  })

  const btnEl = goToBtn.createElementIn(formSectionNavEl);
  forms[id].navEl = btnEl;
}

export function deleteGoToFormInNav(id){
  forms[id].navEl.remove();
}

export function formMsg(formId, msg) {
  const p = document.createElement('p');
  p.innerText = msg;

  forms[formId].formEl.appendChild(p);
  setTimeout(() => p.remove(), 3000);
}
