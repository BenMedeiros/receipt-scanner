'use strict';

export function createGenericForm(title, inputTypes) {
  const inputForm = document.createElement("form");
  inputForm.id = 'inputForm';
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

  return inputForm;
}
