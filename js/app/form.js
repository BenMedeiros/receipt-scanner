'use strict';

export function createGenericForm(title, inputTypes) {
  const inputForm = document.createElement("form");
  inputForm.id = 'inputForm';
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
  //finally add the form to main
  document.getElementById("main").appendChild(inputForm);
  return inputForm;
}
