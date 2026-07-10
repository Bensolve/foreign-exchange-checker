import { getLatestRates } from './api.js';

// Grab the ticker list element
const tickerList = document.getElementById('ticker-list');

// The pairs we want to show in the ticker
const TICKER_PAIRS = ['EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY'];

// Build one ticker item and return it as HTML
const createTickerItem = (pair, rate, change) => {
  const direction = change >= 0 ? 'up' : 'dn';
  const arrow = change >= 0 ? '▲' : '▼';
  return `
    <li class="ticker__item">
      <span class="ticker__change ticker__change--${direction}">${arrow} ${Math.abs(change).toFixed(2)}%</span>
      <span class="ticker__pair">USD/${pair}</span>
      <span class="ticker__rate">${rate}</span>
    </li>
  `;
};

// Fetch today's rates, calculate change, and render the ticker
export const initTicker = async () => {
  const today = await getLatestRates('USD');
  // Duplicate the list so the scroll animation loops seamlessly
  const items = TICKER_PAIRS.map(pair => {
    const rate = today.rates[pair];
    const change = (Math.random() * 0.4 - 0.2); // placeholder until yesterday's API is added
    return createTickerItem(pair, rate.toFixed(4), change);
  }).join('');

  tickerList.innerHTML = items + items;
};