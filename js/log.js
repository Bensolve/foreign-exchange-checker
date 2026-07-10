// --- DOM Elements ---
const logList = document.getElementById('log-list');
const logEmpty = document.getElementById('log-empty');
const logBadge = document.getElementById('log-badge');
const clearLogBtn = document.getElementById('clear-log-btn');

// --- Storage ---
const getLog = () => JSON.parse(localStorage.getItem('fx-log')) || [];
const saveLog = (log) => localStorage.setItem('fx-log', JSON.stringify(log));

// --- Helpers ---
// Get relative time e.g. 20m, 1h, 13 May
const relativeTime = (date) => {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 3600) return Math.floor(diff / 60) + 'M';
  if (diff < 86400) return Math.floor(diff / 3600) + 'H';
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// --- Render ---
export const renderLog = () => {
  const log = getLog();
  logBadge.textContent = log.length || '';

  if (log.length === 0) {
    logList.innerHTML = '';
    logEmpty.hidden = false;
    return;
  }

  logEmpty.hidden = true;
  logList.innerHTML = log.map(entry => `
    <li class="log-item">
      <div class="log-item__left">
        <p class="log-item__time">${relativeTime(entry.time)}</p>
        <p class="log-item__pair">${entry.pair.replace('/', ' → ')}</p>
      </div>
      <div class="log-item__right">
        <p class="log-item__send">${entry.send}</p>
        <p class="log-item__receive">${entry.receive}</p>
      </div>
      <button class="btn-delete" data-id="${entry.id}" aria-label="Delete entry">
        <img src="./assets/images/icon-delete.svg" alt="">
      </button>
    </li>
  `).join('');

  // Handle delete
  logList.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const updated = getLog().filter(e => e.id !== id);
      saveLog(updated);
      renderLog();
    });
  });
};

// --- Events ---
clearLogBtn.addEventListener('click', () => {
  saveLog([]);
  renderLog();
});

// --- Init ---
export const initLog = () => {
  renderLog();
};