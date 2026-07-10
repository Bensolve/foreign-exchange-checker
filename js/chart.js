import { getRateHistory } from "./api.js";

// --- DOM Elements ---
const statOpen = document.getElementById("stat-open");
const statLast = document.getElementById("stat-last");
const statChange = document.getElementById("stat-change");
const statPct = document.getElementById("stat-pct");
const canvas = document.getElementById("rate-chart");
const ctx = canvas.getContext("2d");
const chartPair = document.getElementById("chart-pair");
const chartMeta = document.getElementById("chart-meta");
const historyError = document.getElementById("history-error");

// --- Helpers ---
// Get the start date based on the selected range
const getStartDate = (range) => {
  const today = new Date();
  const map = { "1d": 1, "1w": 7, "1m": 30, "3m": 90, "1y": 365, "5y": 1825 };
  today.setDate(today.getDate() - map[range]);
  return today.toISOString().split("T")[0];
};

// Get today's date as a string
const getToday = () => new Date().toISOString().split("T")[0];

// Draw the line and area chart on the canvas including labels
const drawChart = (rates) => {
  const values = Object.values(rates);
  const dates = Object.keys(rates);
  const min = Math.min(...values) * 0.999;
  const max = Math.max(...values) * 1.001;

  const w = (canvas.width = canvas.parentElement.clientWidth);
  const h = (canvas.height = canvas.parentElement.clientHeight);

  // Padding to leave room for labels
  const padL = 60, padR = 16, padT = 40, padB = 30;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const toX = (i) => padL + (i / (values.length - 1)) * chartW;
  const toY = (v) => padT + (1 - (v - min) / (max - min)) * chartH;

  ctx.clearRect(0, 0, w, h);

  // Gradient fill
  const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
  grad.addColorStop(0, "rgba(200,242,58,0.3)");
  grad.addColorStop(1, "rgba(200,242,58,0.01)");

  ctx.beginPath();
  ctx.moveTo(toX(0), toY(values[0]));
  values.forEach((v, i) => { if (i > 0) ctx.lineTo(toX(i), toY(v)); });
  ctx.lineTo(toX(values.length - 1), padT + chartH);
  ctx.lineTo(toX(0), padT + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(values[0]));
  values.forEach((v, i) => { if (i > 0) ctx.lineTo(toX(i), toY(v)); });
  ctx.strokeStyle = "#c8f23a";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Y axis labels — top, mid, bottom
  ctx.fillStyle = "#555";
  ctx.font = "9px JetBrains Mono, monospace";
  ctx.textAlign = "right";
  ctx.fillText(max.toFixed(4), padL - 6, padT + 4);
  ctx.fillText(((max + min) / 2).toFixed(4), padL - 6, padT + chartH / 2 + 4);
  ctx.fillText(min.toFixed(4), padL - 6, padT + chartH + 4);

  // X axis labels — first, mid, last
  ctx.textAlign = "left";
  ctx.fillText(dates[0], padL, padT + chartH + 20);
  ctx.textAlign = "center";
  ctx.fillText(dates[Math.floor(dates.length / 2)], padL + chartW / 2, padT + chartH + 20);
  ctx.textAlign = "right";
  ctx.fillText(dates[dates.length - 1], padL + chartW, padT + chartH + 20);
};

// --- Core ---
// Fetch rate history and draw the chart
export const updateChart = async (base, symbol, range) => {
  try {
    historyError.hidden = true;
    const startDate = getStartDate(range);
    const endDate = getToday();
    const data = await getRateHistory(base, symbol, startDate, endDate);

    // Each date maps to a rate e.g. { "2025-04-14": 0.8512 }
    const rates = {};
    Object.entries(data.rates).forEach(([date, r]) => {
      rates[date] = r[symbol];
    });

    chartPair.textContent = `${base}/${symbol}`;
    chartMeta.textContent = `${Object.values(rates).at(-1).toFixed(4)} · ${endDate}`;

    drawChart(rates);

    // Update stat cards
    const values = Object.values(rates);
    const open = values[0];
    const last = values[values.length - 1];
    const change = last - open;
    const pct = ((change / open) * 100).toFixed(2);

    statOpen.textContent = open.toFixed(4);
    statLast.textContent = last.toFixed(4);
    statChange.textContent = (change >= 0 ? "+" : "") + change.toFixed(4);
    statPct.textContent = (change >= 0 ? "▲ +" : "▼ ") + pct + "%";
    statChange.className = "stat-card__value " + (change >= 0 ? "stat-card__value--pos" : "stat-card__value--neg");
    statPct.className = "stat-card__value " + (change >= 0 ? "stat-card__value--pos" : "stat-card__value--neg");
  } catch (e) {
    // Show error state if chart fails to load
    historyError.hidden = false;
  }
};

// Handle range button clicks
document.querySelectorAll(".range-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".range-btn").forEach((b) => b.classList.remove("range-btn--active"));
    btn.classList.add("range-btn--active");
    updateChart("USD", "EUR", btn.dataset.range);
  });
});

// --- Init ---
export const initChart = (base = "USD", symbol = "EUR", range = "1m") => {
  updateChart(base, symbol, range);
};