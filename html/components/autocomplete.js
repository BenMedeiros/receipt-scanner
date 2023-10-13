'use strict';

// only one autocomplete component needs to exist for entire page

let autocompleteEl = null;

document.addEventListener('click', () => {
  console.log('click');
  closeAutocomplete();
})

export function bindAutocomplete(inputType, onclickCb) {
//  document.activeElement
  inputType.element.addEventListener('input', (e) => {
    console.log(e.target.value);
    rebuildAutoComplete(inputType, onclickCb);
  });
}

function rebuildAutoComplete(inputType, onclickCb) {
  console.log('reubilduatocomepte');
  if (autocompleteEl) autocompleteEl.remove();

  autocompleteEl = document.createElement('ul');
  autocompleteEl.id = 'autocomplete';
  autocompleteEl.style.left = inputType.element.getBoundingClientRect().left + 'px';
  autocompleteEl.style.top = inputType.element.getBoundingClientRect().bottom + 'px';

  let currentValue = inputType.getValue();
  if(currentValue) currentValue = currentValue.toUpperCase().trim();

  for (const value of Object.values(inputType.autocomplete)) {
    const li = document.createElement('li');
    //highlight autocomplete option with matches
    const matchIndex = value.toUpperCase().indexOf(currentValue);
    console.log(value, currentValue, matchIndex);
    if (matchIndex === -1) {
      li.innerText = String(value);
    } else {
      li.classList.add('matched');
      //break word into before match, match, and after match
      const span0 = document.createElement('span');
      span0.innerText = value.substr(0, matchIndex);
      li.appendChild(span0);
      const span1 = document.createElement('strong');
      span1.innerText = value.substr(matchIndex, currentValue.length);
      li.appendChild(span1);
      const span2 = document.createElement('span');
      span2.innerText = value.substr(matchIndex + currentValue.length);
      li.appendChild(span2);
    }

    li.onclick = () => autocompleteClicked(value, onclickCb);
    autocompleteEl.appendChild(li);
  }

  document.getElementById('main').appendChild(autocompleteEl);
}

function autocompleteClicked(value, onclickCb) {
  console.log('clicked', value);
  onclickCb(value);
  closeAutocomplete();
}

function closeAutocomplete() {
  //remove and close the autocomplete
  if (autocompleteEl) {
    autocompleteEl.remove();
    autocompleteEl = null;
  }
}
