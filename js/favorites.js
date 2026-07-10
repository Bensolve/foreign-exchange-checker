import { getLatestRates } from './api.js';

// --- DOM Elements ---
const favsList = document.getElementById('favs-list');
const favsEmpty = document.getElementById('favs-empty');
const favsCount = document.getElementById('favs-count');
const favBadge = document.getElementById('fav-badge');

// --- Storage ---
const getFavorites = () => JSON.parse(localStorage.getItem('fx-favorites')) || [];
const saveFavorites = (favs) => localStorage.setItem('fx-favorites', JSON.stringify(favs));

// --- Render ---
export const renderFavorites = async () => {
  const favorites = getFavorites();
  favBadge.textContent = favorites.length || '';
  favsCount.textContent = `${favorites.length} favorites`;

  if (favorites.length === 0) {
    favsList.innerHTML = '';
    favsEmpty.hidden = false;
    return;
  }

  favsEmpty.hidden = true;

  // Fetch latest rates for all pairs
  const data = await getLatestRates('USD');

  favsList.innerHTML = favorites.map(f => {
    const [base, symbol] = f.pair.split('/');
    const rate = base === 'USD' ? data.rates[symbol] : (data.rates[symbol] / data.rates[base]);
    const change = (Math.random() * 0.4 - 0.2).toFixed(2); // placeholder for 24h change
    const isPos = change >= 0;

    return `
      <li class="fav-item">
        <span class="fav-item__pair">${base} → ${symbol}</span>
        <div class="fav-item__data">
          <p class="fav-item__rate">${rate ? rate.toFixed(4) : '—'}</p>
          <p class="fav-item__change ${isPos ? 'fav-item__change--pos' : 'fav-item__change--neg'}">
            ${isPos ? '▲ +' : '▼ '}${Math.abs(change)}%
          </p>
        </div>
        <button class="star-btn star-btn--active" data-pair="${f.pair}" aria-label="Unpin ${f.pair}">
          <img src="./assets/images/icon-star-filled.svg" alt="">
        </button>
      </li>
    `;
  }).join('');

  // Handle unpin
  favsList.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pair = btn.dataset.pair;
      const favs = getFavorites().filter(f => f.pair !== pair);
      saveFavorites(favs);
      renderFavorites();
    });
  });
};

// --- Init ---
export const initFavorites = () => {
  renderFavorites();
};