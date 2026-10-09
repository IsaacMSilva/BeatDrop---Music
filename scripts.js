'use strict';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const hue = str => { let h = 0; for (const c of String(str)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

const IC = {
  play: 'M8 5v14l11-7z', pause: 'M6 19h4V5H6zm8-14v14h4V5z', prev: 'M6 6h2v12H6zm3.5 6l8.5 6V6z', next: 'M6 18l8.5-6L6 6zM16 6v12h2V6z',
  shuf: 'M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z',
  rep: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z',
  heart: 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z',
  heartF: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  vol: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z',
  mute: 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z',
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  search: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  queue: 'M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z',
  more: 'M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'
};
const ic = (k, s) => `<svg viewBox="0 0 24 24"${s ? ` style="width:${s}px;height:${s}px"` : ''}><path d="${IC[k]}"/></svg>`;

/* ---------- Persistência ---------- */
const LS = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- Dados ---------- */
const DB = new Map();            // id -> faixa
const ALB = {};                  // albumId -> {name, artist, art, ids}
const RAW = [
  ['Noite em Santo André', 'Aurora Sintética', 260, 110, 'min', 84, 'tri', 11],
  ['Neon Rodovia', 'Aurora Sintética', 300, 130.8, 'min', 104, 'sq', 22],
  ['Chuva de Verão', 'Lofi Garagem', 200, 98, 'dor', 72, 'sin', 33],
  ['Código Limpo', 'Lofi Garagem', 160, 123.5, 'maj', 92, 'tri', 44],
  ['Madrugada Lo-fi', 'Lofi Garagem', 230, 110, 'dor', 68, 'sin', 55],
  ['Horizonte', 'Maré Alta', 30, 146.8, 'maj', 100, 'tri', 66],
  ['Pulso', 'Maré Alta', 340, 98, 'min', 118, 'sq', 77],
  ['Fio de Prata', 'Cidade Dormindo', 190, 130.8, 'dor', 78, 'sin', 88],
  ['Maré Alta', 'Cidade Dormindo', 210, 110, 'min', 76, 'tri', 99],
  ['Cidade Dormindo', 'Cidade Dormindo', 280, 123.5, 'min', 64, 'sin', 111],
  ['Brasa', 'Voo Baixo', 15, 146.8, 'dor', 96, 'tri', 122],
  ['Voo Baixo', 'Voo Baixo', 50, 130.8, 'maj', 108, 'sq', 133]
];
const DEMO = RAW.map((r, i) => {
  const t = { id: 'd' + i, title: r[0], artist: r[1], album: 'Demo', h: r[2], root: r[3], sc: r[4], bpm: r[5], wave: r[6], seed: r[7], dur: 45 };
  DB.set(t.id, t); return t.id;
});
const P = [
  { id: 'foco', name: 'Foco Total', desc: 'Batidas calmas para estudar e programar.', h: 150, ids: [DEMO[0], DEMO[2], DEMO[3], DEMO[4]] },
  { id: 'neon', name: 'Noite Neon', desc: 'Synthwave para rodar de madrugada.', h: 300, ids: [DEMO[1], DEMO[6], DEMO[10], DEMO[11]] },
  { id: 'chill', name: 'Chill Vibes', desc: 'Relaxe e deixe o dia desacelerar.', h: 200, ids: [DEMO[5], DEMO[7], DEMO[8], DEMO[9]] },
  { id: 'mix', name: 'Mix Demo', desc: 'Todas as faixas de demonstração.', h: 30, ids: DEMO.slice() }
];
const SPEC = {
  liked: { id: 'liked', name: 'Músicas Curtidas', desc: 'Tudo que você curtiu.', h: 340 },
  local: { id: 'local', name: 'Meus Arquivos', desc: 'Músicas que você adicionou do seu computador.', h: 120 }
};
const GENRES = [['Pop', 320], ['Rock', 0], ['Funk', 45], ['Sertanejo', 35], ['MPB', 150], ['Hip Hop', 270], ['Eletrônica', 190], ['Jazz', 220], ['Forró', 25], ['Samba', 120], ['Reggae', 100], ['Clássica', 250]];

let liked = new Set(LS.get('sp_liked', []));
let UPL = LS.get('sp_upl', []);                 // playlists do usuário [{id,name,ids}]
Object.values(LS.get('sp_tracks', {})).forEach(t => DB.set(t.id, t));
const localIds = [];
function persist() {
  LS.set('sp_liked', [...liked]); LS.set('sp_upl', UPL);
  const need = new Set([...liked, ...UPL.flatMap(p => p.ids)]), o = {};
  need.forEach(id => { const t = DB.get(id); if (t && t.remote) o[id] = t; });
  LS.set('sp_tracks', o);
}
const allPl = () => [...P, ...UPL.map(u => ({ ...u, desc: 'Playlist sua', h: hue(u.name), user: true })), SPEC.liked, ...(localIds.length ? [SPEC.local] : [])];
const getPl = id => allPl().find(p => p.id === id);
const getList = id => id === 'liked' ? [...liked].filter(x => DB.has(x)) : id === 'local' ? localIds : (getPl(id) || { ids: [] }).ids.filter(x => DB.has(x));

/* ---------- API iTunes (JSONP: funciona sem CORS) ---------- */
let jc = 0;
function jsonp(url) {
  return new Promise((res, rej) => {
    const cb = '__jp' + (++jc), s = document.createElement('script');
    const clean = () => { clearTimeout(tm); delete window[cb]; s.remove(); };
    const tm = setTimeout(() => { clean(); rej(new Error('timeout')); }, 12000);
    window[cb] = d => { clean(); res(d); };
    s.onerror = () => { clean(); rej(new Error('rede')); };
    s.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + cb;
    document.head.appendChild(s);
  });
}
const big = u => (u || '').replace(/\d+x\d+bb/, '400x400bb').replace('100x100', '400x400');
const mapIt = r => ({
  id: 'i' + r.trackId, title: r.trackName, artist: r.artistName, album: r.collectionName, albumId: r.collectionId,
  art: big(r.artworkUrl100), src: r.previewUrl, dur: (r.trackTimeMillis || 0) / 1000, remote: true, h: hue(r.artistName)
});

/* ---------- Sintetizador das faixas demo ---------- */
const SC = { min: [0, 2, 3, 7, 8, 5, 10], maj: [0, 2, 4, 7, 9, 5, 11], dor: [0, 2, 3, 7, 9, 5, 10] };
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function synth(t) {
  const sr = 22050, N = sr * t.dur, d = new Float32Array(N), r = rng(t.seed), sc = SC[t.sc], sl = Math.floor(60 / t.bpm / 2 * sr);
  const pat = Array.from({ length: 16 }, () => r() < .7 ? [0, 1, 2, 3, 4][r() * 5 | 0] : -1), prog = [0, 3, 2, 4];
  const voice = (f, s, len, type, g) => { for (let k = 0; k < len && s + k < N; k++) { const ph = f * k / sr % 1; const v = type === 'sq' ? (ph < .5 ? .5 : -.5) : type === 'tri' ? 4 * Math.abs(ph - .5) - 1 : Math.sin(6.2832 * ph); d[s + k] += v * Math.exp(-k / len * 4) * Math.min(1, k / 80) * g; } };
  for (let i = 0; i * sl < N; i++) {
    const s = i * sl, bar = (i >> 3) % 4, m = i % 16, dg = pat[m];
    if (dg >= 0) voice(t.root * 2 * 2 ** ((sc[dg] + (r() < .15 ? 12 : 0)) / 12), s, sl * 1.6 | 0, t.wave, .22);
    if (i % 8 === 0 || i % 8 === 5) voice(t.root / 2 * 2 ** (sc[prog[bar]] / 12), s, sl * 3, 'sin', .45);
    if (i % 8 === 0) for (const o of [0, 2, 4]) voice(t.root * 2 ** (sc[(prog[bar] + o) % 7] / 12), s, sl * 7, 'sin', .08);
    if (i % 4 === 0) { let ph = 0; const L = sr * .16 | 0; for (let k = 0; k < L && s + k < N; k++) { ph += (45 + 90 * Math.exp(-k / sr * 35)) / sr; d[s + k] += Math.sin(6.2832 * ph) * Math.exp(-k / L * 5) * .6; } }
    if (i % 2 === 1) { const L = sr * .035 | 0; for (let k = 0; k < L && s + k < N; k++) d[s + k] += (r() * 2 - 1) * Math.exp(-k / L * 5) * .07; }
  }
  let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(d[i]));
  for (let i = 0; i < N; i++) { let g = .85 / (pk || 1); if (i < sr / 4) g *= i / (sr / 4); if (i > N - sr) g *= (N - i) / sr; d[i] *= g; }
  const b = new ArrayBuffer(44 + N * 2), v = new DataView(b), w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + N * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, N * 2, true);
  for (let i = 0; i < N; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[i])) * 32767, true);
  return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
}

/* ---------- Helpers de UI ---------- */
const grad = h => `linear-gradient(135deg,hsl(${h} 70% 45%),hsl(${(h + 55) % 360} 70% 22%))`;
const tcover = t => t.art ? `<div class="cv"><img src="${esc(t.art)}" alt="" loading="lazy"></div>` : `<div class="cv" style="background:${grad(t.h || 0)}">♪</div>`;
const pcover = p => `<div class="cv" style="background:${grad(p.h)}">${p.id === 'liked' ? '♥' : p.id === 'local' ? '♫' : esc(p.name[0] || '♪')}</div>`;
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1800); }

/* ---------- Player ---------- */
const a = $('#au');
let Q = [], qi = -1, cur = null, shuf = false, rep = 0, lastRes = [];
$('#n-home').innerHTML = ic('home') + 'Início'; $('#n-search').innerHTML = ic('search') + 'Buscar';
$('#bShuf').innerHTML = ic('shuf', 20); $('#bPrev').innerHTML = ic('prev'); $('#bPlay').innerHTML = ic('play'); $('#bNext').innerHTML = ic('next'); $('#bRep').innerHTML = ic('rep', 20);
$('#bMute').innerHTML = ic('vol', 20); $('#bQueue').innerHTML = ic('queue', 20);
a.volume = .7; $('#vol').style.setProperty('--p', '70%');

function ctxIds(c) {
  if (c === 'all') return DEMO;
  if (c === 'search') return lastRes;
  const [k, id] = c.split(/:(.+)/);
  return k === 'album' ? (ALB[id] || {}).ids || [] : getList(id);
}
const sameQ = ids => JSON.stringify(Q) === JSON.stringify(ids);
function playIn(id, ids) { Q = ids.slice(); qi = Q.indexOf(id); if (qi < 0) { Q = [id]; qi = 0; } load(id); }
function playTrack(id, c) { playIn(id, ctxIds(c)); }
function load(id) {
  const t = DB.get(id); if (!t) return;
  cur = id;
  if (!t.src && t.sc) t.src = synth(t);
  a.src = t.src; a.play().catch(() => {});
  nowUI(); mark(); renderQueue();
}
function next(auto) {
  if (!Q.length) return;
  if (auto && rep === 2) { a.currentTime = 0; a.play(); return; }
  let n;
  if (shuf && Q.length > 1) { do { n = Math.random() * Q.length | 0; } while (n === qi); }
  else { n = qi + 1; if (n >= Q.length) { if (rep === 1) n = 0; else { a.pause(); a.currentTime = 0; return; } } }
  qi = n; load(Q[qi]);
}
function prev() { if (!Q.length) return; if (a.currentTime > 3) { a.currentTime = 0; return; } qi = (qi - 1 + Q.length) % Q.length; load(Q[qi]); }
function toggle() { if (cur == null) { playIn(DEMO[0], DEMO); return; } a.paused ? a.play() : a.pause(); }
function nowUI() {
  const t = DB.get(cur); if (!t) return;
  const on = liked.has(t.id);
  $('#np').innerHTML = `${tcover(t)}<div style="min-width:0"><b>${esc(t.title)}</b><small>${esc(t.artist)}${t.remote ? '<span class="tag">PRÉVIA 30s</span>' : ''}</small></div><button class="hb ${on ? 'liked' : ''}" data-like="${t.id}" style="opacity:1;color:${on ? 'var(--g)' : 'var(--mut)'}">${ic(on ? 'heartF' : 'heart', 20)}</button>`;
  document.title = t.title + ' • ' + t.artist;
  try {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: t.artist, album: t.album || '', artwork: t.art ? [{ src: t.art, sizes: '400x400' }] : [] });
      navigator.mediaSession.setActionHandler('nexttrack', () => next(false));
      navigator.mediaSession.setActionHandler('previoustrack', prev);
    }
  } catch (e) {}
}
function mark() {
  document.querySelectorAll('[data-pt]').forEach(e => e.classList.toggle('on', e.dataset.pt === cur));
  $('#bPlay').innerHTML = ic(!a.paused && cur != null ? 'pause' : 'play'); syncHero();
}
a.onplay = a.onpause = mark; a.onended = () => next(true);
a.onerror = () => { if (cur != null) toast('Não foi possível tocar esta faixa'); };
a.onloadedmetadata = () => { $('#td').textContent = fmt(a.duration); };
a.ontimeupdate = () => { const p = a.duration ? a.currentTime / a.duration * 1000 : 0; $('#seek').value = p; $('#seek').style.setProperty('--p', p / 10 + '%'); $('#tc').textContent = fmt(a.currentTime); };
$('#seek').oninput = e => { if (a.duration) a.currentTime = e.target.value / 1000 * a.duration; e.target.style.setProperty('--p', e.target.value / 10 + '%'); };
$('#vol').oninput = e => { a.volume = e.target.value / 100; a.muted = false; e.target.style.setProperty('--p', e.target.value + '%'); volUI(); };
function volUI() { $('#bMute').innerHTML = ic(a.muted || a.volume === 0 ? 'mute' : 'vol', 20); }
$('#bMute').onclick = () => { a.muted = !a.muted; volUI(); };
$('#bPlay').onclick = toggle; $('#bNext').onclick = () => next(false); $('#bPrev').onclick = prev;
$('#bShuf').onclick = e => { shuf = !shuf; e.currentTarget.classList.toggle('on', shuf); const h = $('#heroShuf'); if (h) h.classList.toggle('on', shuf); };
$('#bRep').onclick = e => { rep = (rep + 1) % 3; const b = e.currentTarget; b.classList.toggle('on', rep > 0); b.innerHTML = (rep === 2 ? '<span style="font-size:11px;font-weight:800">1</span>' : '') + ic('rep', 20); b.title = ['Repetir: desligado', 'Repetir tudo', 'Repetir uma'][rep]; };
$('#bQueue').onclick = () => { $('#queue').classList.toggle('open'); $('#bQueue').classList.toggle('on', $('#queue').classList.contains('open')); renderQueue(); };

/* ---------- Fila ---------- */
function qrow(t, i, isCur) {
  if (!t) return '';
  return `<div class="qr ${isCur ? 'on' : ''}" data-qi="${i}">${tcover(t)}<div><b>${esc(t.title)}</b><small>${esc(t.artist)}</small></div>${isCur ? '' : `<button data-qrm="${i}" title="Remover">${ic('close', 18)}</button>`}</div>`;
}
function renderQueue() {
  const el = $('#queue'); if (!el.classList.contains('open')) return;
  const t = DB.get(cur), rest = Q.slice(qi + 1);
  el.innerHTML = `<div class="qh"><h3>Fila de reprodução</h3><button data-qclose>${ic('close', 20)}</button></div>` +
    (t ? `<h4>Tocando agora</h4>${qrow(t, qi, true)}` : '') +
    `<h4>A seguir</h4>` + (rest.map((id, k) => qrow(DB.get(id), qi + 1 + k, false)).join('') || '<p class="empty">A fila está vazia.</p>');
}
function addQ(id, after) {
  if (!Q.length || cur == null) { playIn(id, [id]); return; }
  if (after) Q.splice(qi + 1, 0, id); else Q.push(id);
  renderQueue(); toast(after ? 'Vai tocar em seguida' : 'Adicionada à fila');
}

/* ---------- Views ---------- */
let view = { v: 'home' }, searchTok = 0, debounce;
const row = (t, i, c) => `<div class="row ${t.id === cur ? 'on' : ''}" data-pt="${t.id}" data-ctx="${c}" role="button" tabindex="0"><span class="n">${i + 1}</span><span class="t">${tcover(t)}<span style="min-width:0"><b>${esc(t.title)}</b><small>${esc(t.artist)}</small></span></span><button class="hb ${liked.has(t.id) ? 'liked' : ''}" data-like="${t.id}" title="Curtir">${ic(liked.has(t.id) ? 'heartF' : 'heart', 18)}</button><span>${t.dur ? fmt(t.dur) : '--:--'}</span><button class="mb" data-more="${t.id}" data-ctx="${c}" title="Mais opções">${ic('more', 20)}</button></div>`;
const tcard = t => `<div class="card" data-pt="${t.id}" data-ctx="all" role="button" tabindex="0">${tcover(t)}<b>${esc(t.title)}</b><small>${esc(t.artist)}</small><span class="fab">${ic('play')}</span></div>`;
const pcard = p => `<div class="card" data-pl="${p.id}" role="button" tabindex="0">${pcover(p)}<b>${esc(p.name)}</b><small>${esc(p.desc)}</small><span class="fab" data-playctx="pl:${p.id}">${ic('play')}</span></div>`;
const albCard = t => { ALB[t.albumId] = ALB[t.albumId] || { name: t.album, artist: t.artist, art: t.art }; return `<div class="card" data-alb="${t.albumId}" role="button" tabindex="0">${tcover(t)}<b>${esc(t.album)}</b><small>${esc(t.artist)}</small></div>`; };

function renderTop() {
  const nv = `<button class="pill nv" data-nav="home">Início</button><button class="pill nv" data-nav="search">Buscar</button><button class="pill nv" data-nav="lib">Biblioteca</button>`;
  $('#top').innerHTML = view.v === 'search'
    ? `${nv}<label class="sb">${ic('search', 20)}<input id="q" placeholder="Artistas, músicas ou álbuns" autocomplete="off" value="${esc(view.q || '')}"></label>`
    : `${nv}<button class="pill" id="addf" style="margin-left:auto">+ Adicionar músicas</button>`;
  const q = $('#q');
  if (q) {
    q.oninput = e => { view.q = e.target.value; clearTimeout(debounce); debounce = setTimeout(searchView, 450); };
    q.focus(); q.setSelectionRange(q.value.length, q.value.length);
  }
  const af = $('#addf'); if (af) af.onclick = () => $('#file').click();
}
function render() {
  renderTop();
  document.querySelectorAll('.nav [data-nav]').forEach(b => b.classList.toggle('on', b.dataset.nav === view.v));
  const el = $('#view'), v = view.v;
  if (v === 'home') homeView(el); else if (v === 'search') { el.innerHTML = '<div id="res"></div>'; searchView(); }
  else if (v === 'lib') el.innerHTML = `<h1>Sua Biblioteca</h1><div class="grid">${allPl().map(pcard).join('')}</div>`;
  else if (v === 'pl') plView(el); else if (v === 'album') albumView(el);
  renderLib(); $('#main').scrollTop = 0;
}
function homeView(el) {
  const h = new Date().getHours(), g = h < 5 ? 'Boa madrugada' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  el.innerHTML = `<h1>${g}</h1><div class="short">${allPl().map(p => `<button class="sc" data-pl="${p.id}">${pcover(p)}${esc(p.name)}</button>`).join('')}</div>
  <h2>Explore por gênero</h2><div class="genres">${GENRES.map(([n, h]) => `<button class="genre" data-genre="${esc(n)}" style="background:${grad(h)}">${esc(n)}</button>`).join('')}</div>
  <h2>Suas playlists</h2><div class="grid">${allPl().map(pcard).join('')}</div>
  <h2>Faixas de demonstração</h2><div class="grid">${DEMO.map(id => tcard(DB.get(id))).join('')}</div>`;
}
async function searchView() {
  const res = $('#res'); if (!res) return;
  const q = (view.q || '').trim(), tok = ++searchTok;
  if (!q) { res.innerHTML = `<h2>Navegar por gênero</h2><div class="genres">${GENRES.map(([n, h]) => `<button class="genre" data-genre="${esc(n)}" style="background:${grad(h)}">${esc(n)}</button>`).join('')}</div>`; return; }
  res.innerHTML = '<p class="empty">Buscando…</p>';
  try {
    const d = await jsonp(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=40&country=BR`);
    if (tok !== searchTok || !$('#res')) return;
    const items = (d.results || []).filter(r => r.previewUrl && r.trackId).map(mapIt);
    items.forEach(t => DB.set(t.id, t)); lastRes = items.map(t => t.id);
    const albs = [], seen = new Set();
    items.forEach(t => { if (t.albumId && !seen.has(t.albumId) && albs.length < 8) { seen.add(t.albumId); albs.push(t); } });
    $('#res').innerHTML = items.length
      ? `<h2>Músicas</h2>${items.map((t, i) => row(t, i, 'search')).join('')}<h2>Álbuns</h2><div class="grid">${albs.map(albCard).join('')}</div>`
      : `<p class="empty">Nenhum resultado para "${esc(q)}".</p>`;
  } catch (e) {
    if (tok === searchTok && $('#res')) $('#res').innerHTML = '<p class="empty">Não foi possível buscar agora. Verifique sua conexão e tente novamente.</p>';
  }
}
function heroHTML(cover, kind, title, sub, ctx, editable, extra) {
  return `<div class="hero">${cover}<div><small>${kind}</small><h1 ${editable ? 'contenteditable="true" spellcheck="false" id="plTitle"' : ''}>${esc(title)}</h1><p>${esc(sub)}</p></div></div>
  <div class="bar"><button class="big" id="heroPlay" data-playctx="${ctx}">${ic('play')}</button><button class="ic ${shuf ? 'on' : ''}" id="heroShuf" title="Aleatório">${ic('shuf', 28)}</button>${extra || ''}</div>`;
}
function plView(el) {
  const p = getPl(view.pid) || P[0], ids = getList(p.id), n = ids.length;
  const del = p.user ? `<button class="ic" id="plDel" title="Excluir playlist">${ic('trash', 26)}</button>` : '';
  el.innerHTML = heroHTML(pcover(p), 'PLAYLIST', p.name, `${p.desc} • ${n} música${n === 1 ? '' : 's'}`, 'pl:' + p.id, p.user, del) +
    (n ? ids.map((id, i) => row(DB.get(id), i, 'pl:' + p.id)).join('') : `<p class="empty">${p.id === 'liked' ? 'Toque no coração ♥ de uma música para vê-la aqui.' : p.user ? 'Playlist vazia. Use "⋯" em qualquer música para adicioná-la aqui.' : 'Nada por aqui ainda.'}</p>`);
  bindHero(p);
}
function bindHero(p) {
  const hs = $('#heroShuf'); if (hs) hs.onclick = () => $('#bShuf').click();
  const t = $('#plTitle');
  if (t && p) {
    t.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); t.blur(); } };
    t.onblur = () => { const u = UPL.find(x => x.id === p.id); const nm = t.textContent.trim().slice(0, 40); if (u && nm) { u.name = nm; persist(); renderLib(); } else if (u) t.textContent = u.name; };
  }
  const d = $('#plDel'); if (d && p) d.onclick = () => {
    if (!d.dataset.sure) { d.dataset.sure = 1; d.style.color = '#f15e6c'; toast('Clique de novo para excluir'); setTimeout(() => { delete d.dataset.sure; d.style.color = ''; }, 2500); return; }
    UPL = UPL.filter(x => x.id !== p.id); persist(); go('home');
  };
}
async function albumView(el) {
  const id = view.aid; let m = ALB[id] || {};
  el.innerHTML = '<p class="empty">Carregando álbum…</p>';
  try {
    if (!m.ids) {
      const d = await jsonp(`https://itunes.apple.com/lookup?id=${id}&entity=song&country=BR`);
      const c = (d.results || []).find(r => r.wrapperType === 'collection') || {};
      const ts = (d.results || []).filter(r => r.wrapperType === 'track' && r.previewUrl).map(mapIt);
      ts.forEach(t => DB.set(t.id, t));
      m = ALB[id] = Object.assign(m, { name: c.collectionName || m.name, artist: c.artistName || m.artist, art: big(c.artworkUrl100) || m.art, ids: ts.map(t => t.id), year: (c.releaseDate || '').slice(0, 4) });
    }
    if (view.v !== 'album' || view.aid !== id) return;
    const cv = m.art ? `<div class="cv"><img src="${esc(m.art)}" alt=""></div>` : `<div class="cv" style="background:${grad(hue(m.name))}">♪</div>`;
    el.innerHTML = heroHTML(cv, 'ÁLBUM', m.name || 'Álbum', `${m.artist || ''}${m.year ? ' • ' + m.year : ''} • ${m.ids.length} músicas`, 'album:' + id) +
      m.ids.map((x, i) => row(DB.get(x), i, 'album:' + id)).join('');
    bindHero(null);
  } catch (e) { if (view.v === 'album') el.innerHTML = '<p class="empty">Não foi possível carregar o álbum.</p>'; }
}
function syncHero() {
  const b = $('#heroPlay'); if (!b) return;
  const same = Q.length && cur != null && sameQ(ctxIds(b.dataset.playctx));
  b.innerHTML = ic(same && !a.paused ? 'pause' : 'play');
}
function renderLib() {
  $('#lib').innerHTML = `<h3>Sua Biblioteca <button id="newpl" title="Criar playlist">${ic('plus', 20)}</button></h3>` +
    allPl().map(p => `<button class="li ${view.v === 'pl' && view.pid === p.id ? 'on' : ''}" data-pl="${p.id}">${pcover(p)}<span><b>${esc(p.name)}</b><small>Playlist • ${getList(p.id).length} músicas</small></span></button>`).join('');
  $('#newpl').onclick = () => openModal(null);
}
function go(v, extra) { view = { v, q: '', ...(v === 'pl' ? { pid: extra } : v === 'album' ? { aid: extra } : {}) }; render(); }

/* ---------- Menu de contexto ---------- */
const menu = $('#menu');
function openMenu(btn) {
  const id = btn.dataset.more, ctx = btn.dataset.ctx || '';
  let h = `<button data-act="queue" data-id="${id}">Adicionar à fila</button><button data-act="next" data-id="${id}">Tocar em seguida</button><hr><small>Adicionar à playlist</small>`;
  UPL.forEach(u => { h += `<button data-act="addpl" data-pl="${u.id}" data-id="${id}">${esc(u.name)}</button>`; });
  h += `<button data-act="newpl" data-id="${id}">+ Nova playlist…</button>`;
  if (ctx.startsWith('pl:u')) h += `<hr><button data-act="rmpl" data-pl="${ctx.slice(3)}" data-id="${id}">Remover desta playlist</button>`;
  menu.innerHTML = h; menu.hidden = false;
  const r = btn.getBoundingClientRect(), w = menu.offsetWidth, hh = menu.offsetHeight;
  menu.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.right - w)) + 'px';
  menu.style.top = Math.max(8, Math.min(innerHeight - hh - 8, r.bottom + 4)) + 'px';
}
function menuAct(b) {
  const { act, id, pl } = b.dataset; menu.hidden = true;
  if (act === 'queue') addQ(id, false);
  else if (act === 'next') addQ(id, true);
  else if (act === 'newpl') openModal(id);
  else if (act === 'addpl') { const u = UPL.find(x => x.id === pl); if (u && !u.ids.includes(id)) { u.ids.push(id); persist(); renderLib(); toast('Adicionada a ' + u.name); } else toast('Já está nesta playlist'); }
  else if (act === 'rmpl') { const u = UPL.find(x => x.id === pl); if (u) { u.ids = u.ids.filter(x => x !== id); persist(); render(); } }
}

/* ---------- Modal de nova playlist ---------- */
let pending = null;
function openModal(id) { pending = id; $('#modal').hidden = false; const i = $('#plName'); i.value = ''; i.focus(); }
function closeModal() { $('#modal').hidden = true; }
function createPl() {
  const name = $('#plName').value.trim() || 'Minha playlist #' + (UPL.length + 1);
  const u = { id: 'u' + Date.now(), name, ids: pending ? [pending] : [] };
  UPL.push(u); persist(); closeModal();
  if (pending) { renderLib(); toast('Playlist criada e música adicionada'); } else go('pl', u.id);
}
$('#plOk').onclick = createPl; $('#plCancel').onclick = closeModal;
$('#plName').onkeydown = e => { if (e.key === 'Enter') createPl(); if (e.key === 'Escape') closeModal(); };
$('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };

/* ---------- Eventos globais ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  const act = t.closest('[data-act]'); if (act) { menuAct(act); return; }
  const mb = t.closest('[data-more]'); if (mb) { e.stopPropagation(); openMenu(mb); return; }
  menu.hidden = true;
  if (t.closest('[data-qclose]')) { $('#bQueue').click(); return; }
  const qrm = t.closest('[data-qrm]'); if (qrm) { e.stopPropagation(); Q.splice(+qrm.dataset.qrm, 1); renderQueue(); return; }
  const qn = t.closest('[data-qi]'); if (qn) { qi = +qn.dataset.qi; load(Q[qi]); return; }
  const lk = t.closest('[data-like]');
  if (lk) {
    e.stopPropagation(); const id = lk.dataset.like;
    liked.has(id) ? liked.delete(id) : liked.add(id); persist();
    if (view.v === 'pl' && view.pid === 'liked') render();
    else { const on = liked.has(id); document.querySelectorAll(`[data-like="${CSS.escape(id)}"]`).forEach(b => { b.classList.toggle('liked', on); b.innerHTML = ic(on ? 'heartF' : 'heart', b.closest('.np') ? 20 : 18); if (b.closest('.np')) b.style.color = on ? 'var(--g)' : 'var(--mut)'; }); renderLib(); }
    return;
  }
  const pp = t.closest('[data-playctx]');
  if (pp) {
    e.stopPropagation(); const c = pp.dataset.playctx, ids = ctxIds(c); if (!ids.length) return;
    if (cur != null && sameQ(ids)) { toggle(); return; }
    playIn(shuf ? ids[Math.random() * ids.length | 0] : ids[0], ids); return;
  }
  const pt = t.closest('[data-pt]');
  if (pt) { const id = pt.dataset.pt, c = pt.dataset.ctx; if (id === cur && sameQ(ctxIds(c))) { toggle(); return; } playTrack(id, c); return; }
  const pl = t.closest('[data-pl]'); if (pl) { go('pl', pl.dataset.pl); return; }
  const al = t.closest('[data-alb]'); if (al) { go('album', al.dataset.alb); return; }
  const gn = t.closest('[data-genre]'); if (gn) { view = { v: 'search', q: gn.dataset.genre }; render(); return; }
  const nv = t.closest('[data-nav]'); if (nv) go(nv.dataset.nav);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches('[role=button]')) { e.target.click(); return; }
  if (/INPUT|TEXTAREA/.test(e.target.tagName) && e.target.type !== 'range') return;
  if (e.target.isContentEditable) return;
  if (e.code === 'Space') { e.preventDefault(); toggle(); }
  else if (e.shiftKey && e.code === 'ArrowRight') next(false);
  else if (e.shiftKey && e.code === 'ArrowLeft') prev();
  else if (e.code === 'ArrowRight' && a.duration) a.currentTime = Math.min(a.duration, a.currentTime + 5);
  else if (e.code === 'ArrowLeft') a.currentTime = Math.max(0, a.currentTime - 5);
});
$('#file').onchange = e => {
  [...e.target.files].forEach((f, k) => {
    const id = 'f' + Date.now() + k, t = { id, title: f.name.replace(/\.[^.]+$/, ''), artist: 'Arquivo local', album: 'Local', h: hue(f.name), src: URL.createObjectURL(f), dur: 0 };
    DB.set(id, t); localIds.push(id);
    const au = new Audio(); au.preload = 'metadata'; au.src = t.src;
    au.onloadedmetadata = () => { t.dur = au.duration; if (view.v === 'pl' && view.pid === 'local') render(); };
  });
  e.target.value = ''; go('pl', 'local');
};
render();
