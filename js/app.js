// Main entry point — starts everything up

import { updateCurrencyCount } from './header.js';
import { initTicker } from './ticker.js';
import { initConverter } from './converter.js';
import { initPicker } from './picker.js';
import { initTabs } from './tabs.js';
import { initChart } from './chart.js';
import { initCompare } from './compare.js';
import { initFavorites } from './favorites.js';
import { initLog } from './log.js';


// --- Init ---
updateCurrencyCount();
initTicker();
initConverter();
initPicker();
initTabs();
initChart();
initCompare();
initFavorites();
initLog();

