'use strict';

import {ButtonType} from "../../html/tinyComponents/ButtonType.js";

let formSectionEl = null;
let formSectionNavEl = null;
let formSectionBodyEl = null;
let forms = {
  // navEl : null,
  // formEl : null
};

let observer = null;

export function createGenericForm(id, title, inputTypes) {
  if (forms[id]) throw new Error('Form ' + id + ' already loaded');

  const inputForm = document.createElement("form");
  inputForm.id = 'inputForm-' + id;
  inputForm.classList.add('inputForm');
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
      console.log(entry.target.id, entry.isIntersecting, formId);
      forms[formId].formEl.classList.toggle('visible', entry.isIntersecting);
      forms[formId].navEl.classList.toggle('visible', entry.isIntersecting);
    });
  }, {
    root: formSectionBodyEl,   // default is the viewport
    delay: 0, // delay to group cb within
    rootMargin: '5px', // margin to exclude visibility
    threshold: .7 // percentage of target's visible area. Triggers "onIntersection"
  });
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
  console.log(forms[id]);
}

