// Utilitaires partagés des simulateurs Patrimed (vanilla JS, aucune dépendance).

const eur = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const nbFr = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export function fmtEuro(n) {
  return eur.format(Math.round(n));
}

export function fmtNumber(n) {
  return nbFr.format(Math.round(n));
}

export function fmtPercent(n, decimals = 1) {
  return n.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + ' %';
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

// Lit un <input type="number"> en tolérant les saisies vides ou invalides.
export function readNumber(input, fallback = 0) {
  const v = parseFloat(String(input.value).replace(',', '.'));
  return Number.isFinite(v) ? v : fallback;
}

export function debounce(fn, delay = 150) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Événement GA4 si le consentement a été donné (gtag absent sinon).
export function trackEvent(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

// Arrondit un maximum d'axe à une valeur « propre » (1/2/2.5/5 × 10^n).
function niceCeil(value) {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = Math.pow(10, exp);
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (value <= m * base) return m * base;
  }
  return 10 * base;
}

function fmtAxis(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' M€';
  if (n >= 1_000) return nbFr.format(n / 1_000) + ' k€';
  return nbFr.format(n) + ' €';
}

/**
 * Dessine un graphique en courbes dans `el` (SVG responsive via viewBox).
 * series : [{ label, color, fill (bool), points: [{x, y}] }]
 * opts : { xLabel } — l'axe X est en années (x entier).
 */
export function drawLineChart(el, series, opts = {}) {
  const W = 640;
  const H = 340;
  const pad = { top: 16, right: 16, bottom: 34, left: 62 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;

  const allPoints = series.flatMap((s) => s.points);
  const xMax = Math.max(1, ...allPoints.map((p) => p.x));
  const yMax = niceCeil(Math.max(1, ...allPoints.map((p) => p.y)) * 1.05);

  const sx = (x) => pad.left + (x / xMax) * iw;
  const sy = (y) => pad.top + ih - (y / yMax) * ih;

  const yTicks = 4;
  let grid = '';
  for (let i = 0; i <= yTicks; i++) {
    const yVal = (yMax / yTicks) * i;
    const y = sy(yVal);
    grid += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="#e5e7eb" stroke-width="1" ${i === 0 ? '' : 'stroke-dasharray="4 4"'}/>`;
    grid += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6b7280">${fmtAxis(yVal)}</text>`;
  }

  // Ticks X : ~6 étiquettes max, en années entières.
  const xStep = Math.max(1, Math.ceil(xMax / 6));
  for (let x = 0; x <= xMax; x += xStep) {
    grid += `<text x="${sx(x)}" y="${H - pad.bottom + 18}" text-anchor="middle" font-size="11" fill="#6b7280">${x}</text>`;
  }
  grid += `<text x="${pad.left + iw / 2}" y="${H - 2}" text-anchor="middle" font-size="11" fill="#9ca3af">${opts.xLabel || 'Années'}</text>`;

  let paths = '';
  for (const s of series) {
    const pts = s.points.map((p) => `${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');
    if (s.fill) {
      const first = s.points[0];
      const last = s.points[s.points.length - 1];
      paths += `<polygon points="${sx(first.x).toFixed(1)},${sy(0)} ${pts} ${sx(last.x).toFixed(1)},${sy(0)}" fill="${s.color}" opacity="0.12"/>`;
    }
    paths += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''}/>`;
  }

  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${opts.ariaLabel || 'Graphique de projection'}" style="width:100%;height:auto;display:block">${grid}${paths}</svg>`;
}

// Capitalisation mensuelle : taux annuel net -> valeur finale + trajectoire annuelle.
// Renvoie { final, byYear: [{x: année, y: capital}] }
export function projectMonthly({ initial, monthly, years, annualRate }) {
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  let capital = initial;
  const byYear = [{ x: 0, y: capital }];
  for (let m = 1; m <= years * 12; m++) {
    capital = capital * (1 + monthlyRate) + monthly;
    if (m % 12 === 0) byYear.push({ x: m / 12, y: capital });
  }
  return { final: capital, byYear };
}
