import { getCurrencies } from './api.js';
import { setCurrency } from './converter.js';
import { CURRENCY_FLAGS, getFlagPath, formatAmount } from './utils.js';

// --- DOM Elements ---
const pickerOverlay = document.getElementById('picker-overlay');
const pickerSearch = document.getElementById('picker-search');
const pickerBody = document.getElementById('picker-body');
const pickerClose = document.getElementById('picker-close');

// --- State ---
let allCurrencies = [];
let pickerFor = null; // 'send' or 'receive'

// --- Helpers ---
// Build one currency row as HTML
// Build one currency row as HTML
const createCurrencyItem = (currency) => {
  return `
    <div class="picker__item" data-code="${currency.iso_code}">
      <img src="${getFlagPath(currency.iso_code)}" alt="" class="picker__item-flag">
      <span class="picker__item-code">${currency.iso_code}</span>
      <span class="picker__item-name">${currency.name}</span>
    </div>
  `;
};

// Filter and render the currency list based on search query
const POPULAR = ['USD', 'EUR', 'GBP'];

const renderList = (query = '') => {
  const q = query.toLowerCase();
  const filtered = allCurrencies.filter(c =>
    c.iso_code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
  );

  const popular = filtered.filter(c => POPULAR.includes(c.iso_code));
  const others = filtered.filter(c => !POPULAR.includes(c.iso_code));

  let html = '';
  if (!q) {
    html += `<p class="picker__group-label">Popular <span>${popular.length}</span></p>`;
    html += popular.map(c => createCurrencyItem(c)).join('');
    html += `<p class="picker__group-label">Other currencies <span>${others.length}</span></p>`;
    html += others.map(c => createCurrencyItem(c)).join('');
  } else {
    html += filtered.map(c => createCurrencyItem(c)).join('');
  }

  pickerBody.innerHTML = html;

  pickerBody.querySelectorAll('.picker__item').forEach(item => {
    item.addEventListener('click', () => {
      setCurrency(pickerFor, item.dataset.code);
      closePicker();
    });
  });
};
// --- Open / Close ---
// Open the picker and set which currency it is for


export const openPicker = (forWhich, buttonEl) => {
  pickerFor = forWhich;
  pickerSearch.value = '';
  renderList();
  
  // Position picker below the button that was clicked
  const rect = buttonEl.getBoundingClientRect();
  pickerOverlay.hidden = false;
  
  const picker = document.querySelector('.picker');
  picker.style.position = 'fixed';
  picker.style.top = `${rect.bottom + 8}px`;
  picker.style.left = `${rect.left}px`;
  picker.style.width = '320px';
  
  pickerSearch.focus();
};

// Close the picker
const closePicker = () => {
  pickerOverlay.hidden = true;
  pickerFor = null;
};

// --- Events ---
pickerClose.addEventListener('click', closePicker);
pickerOverlay.addEventListener('click', (e) => {
  if (e.target === pickerOverlay) closePicker();
});
pickerSearch.addEventListener('input', () => renderList(pickerSearch.value));

// --- Init ---
// Fetch all currencies once and store them
export const initPicker = async () => {
  const data = await getCurrencies();
  allCurrencies = Object.entries(data).map(([code, name]) => ({
    iso_code: code,
    name: name,
  }));
};