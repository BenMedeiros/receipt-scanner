'use strict';

let formSectionEl = null;
let forms = {};

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
  if (!formSectionEl) createFormSection();
  formSectionEl.appendChild(inputForm);

  forms[id] = inputForm;
  return inputForm;
}

export function createFormSection() {
  formSectionEl = document.createElement('div');
  formSectionEl.id = 'formSection';
  document.getElementById("main").appendChild(formSectionEl);
}

export function scrollCarouselToForm(id) {
  if (!forms[id]) throw new Error('Form ' + id + ' not loaded.');
  document.getElementById('inputForm-' + id).scrollIntoView({behavior: 'smooth', inline: 'center'});
}
