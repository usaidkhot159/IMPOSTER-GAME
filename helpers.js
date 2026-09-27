const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function pickN(arr, n) { return shuffle(arr).slice(0, n); }

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  children.flat().forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}

function showToast(msg, type = 'default') {
  const container = document.getElementById('toast-container');
  const toast = el('div', { class: `toast toast-${type}` }, msg);
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function formatScore(n) {
  return n.toLocaleString();
}

function pluralize(n, word) {
  return `${n} ${word}${n !== 1 ? 's' : ''}`;
}
