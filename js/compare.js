import { getLatestRates } from './api.js';

// --- DOM Elements ---
const compareList = document.getElementById('compare-list');
const compareMeta = document.getElementById('compare-meta');
const compareCount = document.getElementById('compare-count');
const compareEmpty = document.getElementById('compare-empty');

// --- Currencies to compare ---
const COMPARE_CURRENCIES = ['GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'INR', 'CNY', 'BDT'];

// --- Flag map ---
const CURRENCY_FLAGS = {
  GBP: 'gb', JPY: 'jp', CHF: 'ch', CAD: 'ca',
  AUD: 'au', INR: 'in', CNY: 'cn', BDT: 'bd',
  EUR: 'eu', USD: 'us', NZD: 'nz', HKD: 'hk',
  SGD: 'sg', SEK: 'se', NOK: 'no', DKK: 'dk',
  MXN: 'mx', BRL: 'br', ZAR: 'za', NGN: 'ng',
  KES: 'ke', KRW: 'kr', IDR: 'id', MYR: 'my',
  THB: 'th', PLN: 'pl', TRY: 'tr', SAR: 'sa', AED: 'ae',
};

// Currency names
const CURRENCY_NAMES = {
  GBP: 'British Pound', JPY: 'Japanese Yen', CHF: 'Swiss Franc',
  CAD: 'Canadian Dollar', AUD: 'Australian Dollar', INR: 'Indian Rupee',
  CNY: 'Chinese Yuan', BDT: 'Bangladeshi Taka', EUR: 'Euro',
  NZD: 'New Zealand Dollar', HKD: 'Hong Kong Dollar', SGD: 'Singapore Dollar',
  SEK: 'Swedish Krona', NOK: 'Norwegian Krone', DKK: 'Danish Krone',
  MXN: 'Mexican Peso', BRL: 'Brazilian Real', ZAR: 'South African Rand',
  NGN: 'Nigerian Naira', KES: 'Kenyan Shilling', KRW: 'South Korean Won',
  IDR: 'Indonesian Rupiah', MYR: 'Malaysian Ringgit', THB: 'Thai Baht',
  PLN: 'Polish Zloty', TRY: 'Turkish Lira', SAR: 'Saudi Riyal', AED: 'UAE Dirham',
};

// Format amount with commas
const formatAmount = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Get flag path
const getFlagPath = (code) => {
  const country = CURRENCY_FLAGS[code];
  return country ? `./assets/images/flags/${country}.webp` : '';
};

// Get favorites from localStorage
const getFavorites = () => JSON.parse(localStorage.getItem('fx-favorites')) || [];

// Save favorites to localStorage
const saveFavorites = (favs) => localStorage.setItem('fx-favorites', JSON.stringify(favs));

// --- Render compare list ---
export const renderCompare = async (sendAmount = 1000, baseCurrency = 'USD') => {
  try {
    const data = await getLatestRates(baseCurrency);
    const favorites = getFavorites();

    compareMeta.innerHTML = `<strong>${formatAmount(sendAmount)} FROM ${baseCurrency}</strong>`;
    compareCount.textContent = `${COMPARE_CURRENCIES.length} pairs`;

    const rows = COMPARE_CURRENCIES.filter(code => code !== baseCurrency).map(code => {
      const rate = data.rates[code];
      if (!rate) return '';
      const amount = sendAmount * rate;
      const isFav = favorites.some(f => f.pair === `${baseCurrency}/${code}`);

      return `
        <li class="compare-item">
          <img class="compare-item__flag" src="${getFlagPath(code)}" alt="${code} flag">
          <div class="compare-item__info">
            <p class="compare-item__code">${code}</p>
            <p class="compare-item__name">${CURRENCY_NAMES[code] || code}</p>
          </div>
          <div class="compare-item__amounts">
            <p class="compare-item__amount">${formatAmount(amount)}</p>
            <p class="compare-item__rate">@ ${rate.toFixed(4)}</p>
          </div>
          <button class="star-btn ${isFav ? 'star-btn--active' : ''}" data-code="${code}" data-base="${baseCurrency}" aria-label="Pin ${baseCurrency}/${code}">
            <img src="./assets/images/${isFav ? 'icon-star-filled.svg' : 'icon-star.svg'}" alt="">
          </button>
        </li>
      `;
    }).join('');

    compareList.innerHTML = rows;
    compareEmpty.hidden = true;

    // Handle star clicks
    compareList.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        const base = btn.dataset.base;
        const pairKey = `${base}/${code}`;
        const favs = getFavorites();
        const idx = favs.findIndex(f => f.pair === pairKey);

        if (idx === -1) {
          favs.push({ pair: pairKey, rate: data.rates[code] });
        } else {
          favs.splice(idx, 1);
        }
        saveFavorites(favs);
        renderCompare(sendAmount, baseCurrency);
      });
    });

  } catch (e) {
    compareEmpty.hidden = false;
  }
};

// --- Init ---
export const initCompare = () => {
  renderCompare();
};