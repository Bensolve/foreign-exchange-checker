// Handles saving and loading favorites and conversion log from localStorage

const FAVORITES_KEY = 'fx-favorites';
const LOG_KEY = 'fx-log';

// --- Favorites ---
// Get all pinned pairs from localStorage
export const getFavorites = () => {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
};

// Save all pinned pairs to localStorage
export const saveFavorites = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

// Add a pair to favorites
export const addFavorite = (pair) => {
  const favorites = getFavorites();
  if (!favorites.find(f => f.pair === pair.pair)) {
    favorites.push(pair);
    saveFavorites(favorites);
  }
};

// Remove a pair from favorites
export const removeFavorite = (pairKey) => {
  const favorites = getFavorites().filter(f => f.pair !== pairKey);
  saveFavorites(favorites);
};

// --- Log ---
// Get all logged conversions from localStorage
export const getLog = () => {
  return JSON.parse(localStorage.getItem(LOG_KEY)) || [];
};

// Save all logged conversions to localStorage
export const saveLog = (log) => {
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
};

// Add a conversion to the log
export const addToLog = (entry) => {
  const log = getLog();
  log.unshift(entry);
  saveLog(log);
};

// Remove one entry from the log by id
export const removeFromLog = (id) => {
  const log = getLog().filter(e => e.id !== id);
  saveLog(log);
};

// Clear the entire log
export const clearLog = () => {
  localStorage.removeItem(LOG_KEY);
};