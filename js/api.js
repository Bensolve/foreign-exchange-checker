const BASE_URL = 'https://api.frankfurter.dev/v1';

// Get the full list of all available currencies
export async function getCurrencies() {
  const res = await fetch(`${BASE_URL}/currencies`);
  if (!res.ok) throw new Error('Failed to fetch currencies');
  return res.json();
}

// Get today's rates for all currencies based on a chosen base currency
export async function getLatestRates(base = 'USD') {
  const res = await fetch(`${BASE_URL}/latest?base=${base}`);
  if (!res.ok) throw new Error('Failed to fetch latest rates');
  return res.json();
}

// Get today's rate between just two currencies
export async function getSingleRate(base, symbol) {
  const res = await fetch(`${BASE_URL}/latest?base=${base}&symbols=${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch rate');
  return res.json();
}

// Get the rate between two currencies over a date range for the chart
export async function getRateHistory(base, symbol, startDate, endDate) {
  const res = await fetch(`${BASE_URL}/${startDate}..${endDate}?base=${base}&symbols=${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch rate history');
  return res.json();
}