// Shared utilities used across multiple files

// Map currency code to country flag code
export const CURRENCY_FLAGS = {
  USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp',
  CHF: 'ch', CAD: 'ca', AUD: 'au', NZD: 'nz',
  CNY: 'cn', HKD: 'hk', SGD: 'sg', SEK: 'se',
  NOK: 'no', DKK: 'dk', MXN: 'mx', INR: 'in',
  BRL: 'br', ZAR: 'za', NGN: 'ng', KES: 'ke',
  KRW: 'kr', IDR: 'id', MYR: 'my', THB: 'th',
  PLN: 'pl', TRY: 'tr', SAR: 'sa', AED: 'ae',
};

// Get flag image path from currency code
export const getFlagPath = (code) => {
  const country = CURRENCY_FLAGS[code];
  return country ? `./assets/images/flags/${country}.webp` : '';
};

// Format a number with commas e.g. 1000 → 1,000.00
export const formatAmount = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });