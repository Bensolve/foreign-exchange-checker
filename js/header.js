import { getCurrencies } from './api.js';

// Grab the currency count element in the header
const currencyCountElement = document.getElementById('currency-count');

// Fetch all currencies and update the count in the header
export const updateCurrencyCount = async () => {
  const currencies = await getCurrencies();
  currencyCountElement.textContent = Object.keys(currencies).length;
}