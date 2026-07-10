// --- DOM Elements ---
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const dropdown = document.getElementById('tabs-dropdown');
const tabsNav = document.getElementById('tabs-nav');
const activeTabLabel = document.getElementById('active-tab-label');

// --- Helpers ---
// Switch to the clicked tab and show its panel
const switchTab = (selectedTab) => {
  tabs.forEach(tab => {
    tab.classList.remove('tab--active');
    tab.setAttribute('aria-selected', 'false');
  });
  panels.forEach(panel => {
    panel.classList.remove('tab-panel--active');
    panel.hidden = true;
  });

  selectedTab.classList.add('tab--active');
  selectedTab.setAttribute('aria-selected', 'true');
  const panel = document.getElementById(`panel-${selectedTab.dataset.tab}`);
  panel.classList.add('tab-panel--active');
  panel.hidden = false;


  // Re-render when switching tabs
  if (selectedTab.dataset.tab === 'favorites') {
    import('./favorites.js').then(m => m.renderFavorites());
  }
  if (selectedTab.dataset.tab === 'compare') {
    import('./compare.js').then(m => m.renderCompare());
  }

  if (selectedTab.dataset.tab === 'log') {
  import('./log.js').then(m => m.renderLog());
}

  // Update dropdown label and close it
  activeTabLabel.textContent = selectedTab.dataset.label;
  tabsNav.hidden = true;
  dropdown.setAttribute('aria-expanded', 'false');
};

// Toggle dropdown open/close
dropdown.addEventListener('click', () => {
  const isHidden = tabsNav.hidden;
  tabsNav.hidden = !isHidden;
  dropdown.setAttribute('aria-expanded', String(isHidden));
});

// --- Events ---
tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab)));

// --- Init ---
export const initTabs = () => {
  tabsNav.hidden = true;
  const defaultTab = document.querySelector('[data-tab="history"]');
  switchTab(defaultTab);
};