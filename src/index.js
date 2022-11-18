import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const countryInput = document.querySelector('#search-box');
const cardsContainer = document.querySelector('.country-list');

countryInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  const name = evt.target.value.trim();
  if (!name) {
    return;
  }

  fetchCountries(name)
    .then(data => {
      console.log(data.length);
      if (data.length > 10) {
        cardsContainer.innerHTML = '';
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length <= 10 && data.length >= 2) {
        cardsContainer.innerHTML = '';
        markupCountries(data);
      } else {
        cardsContainer.innerHTML = '';
        markupContry(data);
      }
    })
    .catch(onFetchError);
}

function markupContry(data) {
  const contryItem = data
    .map(
      ({
        flags,
        name,
        capital,
        population,
        languages,
      }) => ` <li class='country__item'>
      <div class="country__container">
      <img src="${flags.svg}" alt="${name.official}" width=40px heigth=20px>
      <h2 class="country__title">${name.official}</h2>
      </div>
      <p class="country__capital"><b>capital:</b> ${capital}</p>
      <p class="country__population"><b>population:</b> ${population}</p>
      <p class="country__languages"><b>languages:</b> ${Object.values(
        languages
      )}</p>
    </li>`
    )
    .join('');
  cardsContainer.innerHTML = contryItem;
}

function markupCountries(data) {
  const contriesItem = data
    .map(
      ({ flags, name }) => ` <li class='countries__item'>
      <img src="${flags.svg}" alt="${name.official}" width=40px heigth=20px>
      <p class="countries__title">${name.official}</p>
    </li>`
    )
    .join('');
  cardsContainer.innerHTML = contriesItem;
}

function onFetchError() {
  cardsContainer.innerHTML = '';
  Notify.failure('Oops, there is no country with that name');
}
