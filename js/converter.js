import { getSingleRate } from './api.js';
import { addToLog } from './storage.js';
import { openPicker } from './picker.js';

// --- DOM Elements ---
const sendAmountEl = document.getElementById('send-amount');
const receiveAmountEl = document.getElementById('receive-amount');
const sendFlagEl = document.getElementById('send-flag');
const sendCodeEl = document.getElementById('send-code');
const receiveFlagEl = document.getElementById('receive-flag');
const receiveCodeEl = document.getElementById('receive-code');
const rateDisplayEl = document.getElementById('rate-display');

// --- State ---
let sendCurrency = 'USD';
let receiveCurrency = 'EUR';
let currentRate = 1;

// --- Flag map ---
const CURRENCY_FLAGS = {
  USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp',
  CHF: 'ch', CAD: 'ca', AUD: 'au', NZD: 'nz',
  CNY: 'cn', HKD: 'hk', SGD: 'sg', SEK: 'se',
  NOK: 'no', DKK: 'dk', MXN: 'mx', INR: 'in',
  BRL: 'br', ZAR: 'za', NGN: 'ng', KES: 'ke',
  KRW: 'kr', IDR: 'id', MYR: 'my', THB: 'th',
  PLN: 'pl', TRY: 'tr', SAR: 'sa', AED: 'ae',
};

// Get flag image path from currency code
const getFlagPath = (code) => {
  const country = CURRENCY_FLAGS[code];
  return country ? `./assets/images/flags/${country}.webp` : '';
};

// --- Helpers ---
// Format a number with commas e.g. 1000 → 1,000.00
const formatAmount = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// --- Core ---
// Fetch the live rate and update the receive amount and rate display
export const updateConverter = async () => {
  const data = await getSingleRate(sendCurrency, receiveCurrency);
  currentRate = data.rates[receiveCurrency];

  const sendAmount = parseFloat(sendAmountEl.value.replace(/,/g, '')) || 0;
  receiveAmountEl.textContent = formatAmount(sendAmount * currentRate);
  rateDisplayEl.textContent = `1 ${sendCurrency} = ${currentRate.toFixed(4)} ${receiveCurrency}`;

  // Update flags and codes
  sendFlagEl.innerHTML = `<img src="${getFlagPath(sendCurrency)}" alt="${sendCurrency} flag">`;
  receiveFlagEl.innerHTML = `<img src="${getFlagPath(receiveCurrency)}" alt="${receiveCurrency} flag">`;
  sendCodeEl.textContent = sendCurrency;
  receiveCodeEl.textContent = receiveCurrency;
};

// Recalculate receive amount when user types — no API call needed
const recalculate = () => {
  const sendAmount = parseFloat(sendAmountEl.value.replace(/,/g, '')) || 0;
  receiveAmountEl.textContent = formatAmount(sendAmount * currentRate);
};

// --- Events ---
sendAmountEl.addEventListener('input', recalculate);

// Open picker when currency buttons clicked
document.getElementById('send-currency-btn').addEventListener('click', () => openPicker('send'));
document.getElementById('receive-currency-btn').addEventListener('click', () => openPicker('receive'));

// Swap send and receive currencies
document.getElementById('swap-btn').addEventListener('click', () => {
  [sendCurrency, receiveCurrency] = [receiveCurrency, sendCurrency];
  updateConverter();
});

// Favorite toggle
document.getElementById('fav-btn').addEventListener('click', () => {
  const pairKey = `${sendCurrency}/${receiveCurrency}`;
  const favs = JSON.parse(localStorage.getItem('fx-favorites')) || [];
  const idx = favs.findIndex(f => f.pair === pairKey);
  
  if (idx === -1) {
    favs.push({ pair: pairKey, rate: currentRate });
    document.getElementById('fav-text').textContent = 'Favorited';
    document.getElementById('fav-btn').querySelector('img').src = './assets/images/icon-star-filled.svg';
  } else {
    favs.splice(idx, 1);
    document.getElementById('fav-text').textContent = 'Favorite';
    document.getElementById('fav-btn').querySelector('img').src = './assets/images/icon-star.svg';
  }
  
  localStorage.setItem('fx-favorites', JSON.stringify(favs));
});

// Log conversion button
document.getElementById('log-btn').addEventListener('click', () => {
  const sendAmount = parseFloat(sendAmountEl.value.replace(/,/g, '')) || 0;
  const receiveAmount = sendAmount * currentRate;

  addToLog({
    id: Date.now(),
    time: Date.now(),
    pair: `${sendCurrency}/${receiveCurrency}`,
    send: formatAmount(sendAmount),
    receive: formatAmount(receiveAmount),
  });

  import('./log.js').then(m => m.renderLog());
});

// --- Init ---

// Allow picker to update currencies
export const setCurrency = (forWhich, code) => {
  if (forWhich === 'send') sendCurrency = code;
  else receiveCurrency = code;
  updateConverter();
};

export const initConverter = async () => {
  await updateConverter();
};