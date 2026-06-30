/* ===== Pastizzi Crush — Maltese match-3 (specials + juice + sound) ===== */
(function () {
  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const ROWS = 8, COLS = 8, PAD = 3;
  const TYPES = [
    { e: '🥟', c: '#F4B23E' }, { e: '🍕', c: '#E14B3B' }, { e: '🧀', c: '#F7E27A' },
    { e: '🥧', c: '#8FB85A' }, { e: '🍩', c: '#C77C46' }, { e: '🍰', c: '#E78BB0' },
  ];
  // 3D Maltese-pastry art (gradients defined in index.html). Distinct silhouettes + colours for fair matching.
  const ICONS = [
    // 0 Pastizz tal-irkotta — flaky golden lens with ricotta peeking out
    "<path d='M9,50 Q50,15 91,50 Q50,85 9,50 Z' fill='url(#gGold)' stroke='#9c6913' stroke-width='2.5'/>" +
    "<path d='M22,50 Q50,31 78,50 M24,42 Q50,27 76,42 M24,58 Q50,73 76,58' fill='none' stroke='#b9791a' stroke-width='2' opacity='.75'/>" +
    "<ellipse cx='50' cy='50' rx='13' ry='7.5' fill='#fff6e2'/><ellipse cx='50' cy='48.5' rx='8.5' ry='4' fill='#fff' opacity='.7'/>",
    // 1 Maltese pizza — square golden crust, tomato, peas + olive
    "<rect x='13' y='13' width='74' height='74' rx='15' fill='url(#gGold2)' stroke='#a9781f' stroke-width='3'/>" +
    "<rect x='22' y='22' width='56' height='56' rx='10' fill='url(#gRed)'/>" +
    "<circle cx='37' cy='40' r='4' fill='#7fb74c'/><circle cx='61' cy='37' r='4' fill='#7fb74c'/><circle cx='48' cy='60' r='4' fill='#7fb74c'/>" +
    "<circle cx='63' cy='61' r='5.5' fill='#33241d'/><circle cx='63' cy='61' r='2.2' fill='#7a5436'/>",
    // 2 Ġbejna — round cheeselet with peppercorns
    "<ellipse cx='50' cy='59' rx='37' ry='27' fill='#d4b03b'/>" +
    "<ellipse cx='50' cy='48' rx='37' ry='27' fill='url(#gCream)' stroke='#c19f31' stroke-width='2.5'/>" +
    "<circle cx='39' cy='46' r='2.8' fill='#5a4326'/><circle cx='61' cy='42' r='2.8' fill='#5a4326'/><circle cx='53' cy='55' r='2.8' fill='#5a4326'/>",
    // 3 Qassata tal-piżelli — golden crimped ring filled with green peas
    "<circle cx='50' cy='50' r='40' fill='url(#gGold2)' stroke='#9c6913' stroke-width='2'/>" +
    "<circle cx='50' cy='50' r='38' fill='none' stroke='#e3aa3c' stroke-width='9' stroke-dasharray='10 6'/>" +
    "<circle cx='50' cy='50' r='23' fill='url(#gPea)' stroke='#4f7a26' stroke-width='2'/>" +
    "<circle cx='44' cy='46' r='5' fill='#a9da57'/><circle cx='57' cy='45' r='5' fill='#a9da57'/><circle cx='50' cy='57' r='5' fill='#9ad047'/><circle cx='59' cy='56' r='4' fill='#8cc23f'/><circle cx='41' cy='56' r='4' fill='#8cc23f'/>",
    // 4 Imqaret — brown date pillow-diamond
    "<rect x='22' y='22' width='56' height='56' rx='12' transform='rotate(45 50 50)' fill='url(#gBrown)' stroke='#5e3514' stroke-width='2.5'/>" +
    "<polygon points='50,31 69,50 50,69 31,50' fill='#5a3417' opacity='.82'/>" +
    "<path d='M41,50H59M50,41V59' stroke='#d3aa72' stroke-width='2.6' stroke-linecap='round' opacity='.7'/>",
    // 5 Figolla — pink-iced almond heart with cherry
    "<path d='M50,85 C17,60 24,28 50,42 C76,28 83,60 50,85 Z' fill='url(#gPink)' stroke='#bd5080' stroke-width='2.5'/>" +
    "<path d='M50,53 C36,42 30,54 38,62 M50,53 C64,42 70,54 62,62' stroke='#fff' stroke-width='4' fill='none' stroke-linecap='round' opacity='.92'/>" +
    "<circle cx='50' cy='37' r='6' fill='#d8324f'/><circle cx='48' cy='35' r='2' fill='#ff96a6'/>",
  ];
  const tileSVG = type => `<svg class='ic' viewBox='0 0 100 100'>${ICONS[type]}<ellipse cx='38' cy='31' rx='20' ry='11' fill='url(#gGloss)'/></svg>`;
  // Luzzu boat — the "ingredient" piece you drop to the bottom (not matchable)
  const ING = TYPES.length;
  const ING_BG = 'radial-gradient(circle at 33% 27%, rgba(255,255,255,.6), rgba(255,255,255,0) 46%), #2c6fb0';
  const luzzuSVG = () => "<svg class='ic' viewBox='0 0 100 100'>" +
    "<path d='M16,58 H84 L74,76 H26 Z' fill='#e8b54a' stroke='#9c6f15' stroke-width='3'/>" +
    "<rect x='30' y='40' width='6' height='20' fill='#b5232a'/><path d='M36,40 56,52 36,52 Z' fill='#fff'/>" +
    "<path d='M16,58 H84' stroke='#1f7ab5' stroke-width='5' stroke-linecap='round'/>" +
    "<circle cx='24' cy='66' r='4' fill='#1f7ab5'/><circle cx='76' cy='66' r='4' fill='#b5232a'/>" +
    "<ellipse cx='40' cy='34' rx='14' ry='7' fill='#fff' opacity='.22'/></svg>";
  // Level design — first few are gentle tutorials, then it ramps.
  // Board shapes — each must be column-contiguous (no playable cell with a hole both above & below it in its column)
  const SHAPES = {
    full: () => true,
    diamond: (r, c) => Math.abs(r - 3.5) + Math.abs(c - 3.5) <= 4,
    octagon: (r, c) => !((r < 2 && c < 2) || (r < 2 && c > 5) || (r > 5 && c < 2) || (r > 5 && c > 5)),
    narrow: (r, c) => c >= 1 && c <= 6,
    vee: (r, c) => r >= Math.round(Math.abs(c - 3.5) - 0.5),
    cross: (r, c) => (c >= 2 && c <= 5) || (r >= 2 && r <= 5),
  };
  // Objective types: score | clear (jelly/ice/jam coats) | collect (X of a piece) | drop (deliver luzzi)
  const LEVELS = [
    { shape: 'full', type: 'score', target: 700, moves: 18, tip: 'Tap a treat, then a neighbour, to swap. Match 3!' },
    { shape: 'full', type: 'score', target: 1300, moves: 16, tip: 'Match 4 → BLAST 💥 (clears a row + column).' },
    { shape: 'octagon', type: 'score', target: 1900, moves: 16, tip: 'Match 5 → SUPER ✨ · L/T shape → WRAPPED 💣.' },
    { shape: 'diamond', type: 'clear', coat: 'jelly', spec: 'all1', moves: 18, tip: 'New shape 🔷 — clear ALL the jelly!' },
    { shape: 'full', type: 'collect', collect: { t: 0, n: 18 }, moves: 16, tip: 'Collect 18 pastizzi 🥟 — match them to gather!' },
    { shape: 'narrow', type: 'score', target: 2600, moves: 14, tip: 'Tight on moves — swap specials together for combos!' },
    { shape: 'cross', type: 'clear', coat: 'jelly', spec: 'all1', moves: 16, tip: 'Plus-shaped board — clear the jelly.' },
    { shape: 'full', type: 'clear', coat: 'ice', spec: 'all1', moves: 17, tip: 'Frozen tiles ❄️ — match on the ice twice to smash it!' },
    { shape: 'vee', type: 'score', target: 3200, moves: 14 },
    { shape: 'full', type: 'drop', drop: 4, moves: 20, tip: 'Sail the luzzi ⛵ down to the bottom row to deliver them!' },
    { shape: 'octagon', type: 'clear', coat: 'jam', spec: 'all1', moves: 16, tip: 'Honey-jam 🍯 — clear it by matching right NEXT to it!' },
    { shape: 'diamond', type: 'clear', coat: 'jelly', spec: 'all2', moves: 20, tip: 'Double jelly in the middle needs two hits.' },
  ];
  const SHAPE_CYCLE = ['full', 'octagon', 'diamond', 'narrow', 'cross', 'vee'];
  const levelCfg = lv => {
    if (lv <= LEVELS.length) return LEVELS[lv - 1];
    const shape = SHAPE_CYCLE[(lv - 1) % SHAPE_CYCLE.length];
    const k = lv % 5;
    if (k === 0) return { shape, type: 'clear', coat: lv % 10 === 0 ? 'ice' : 'jelly', spec: 'all1', moves: 16 };
    if (k === 2) return { shape, type: 'collect', collect: { t: lv % TYPES.length, n: 16 + (lv % 10) }, moves: 16 };
    if (k === 4) return { shape, type: 'drop', drop: 4, moves: 20 };
    return { shape, type: 'score', target: 3200 + (lv - LEVELS.length) * 700, moves: Math.max(12, 16 - Math.floor(lv / 6)) };
  };

  const board = $('board');
  let grid = [], cell = 56, busy = false, selected = null, down = null, lastSwap = new Set();
  let level = 1, moves = 20, score = 0, target = 1000, best = +(localStorage.getItem('pc_best') || 0);
  let overlayAction = 'start';
  let mode = 'score', jellyGrid = null, jellyEls = null, coatKind = null, jellyLeft = 0, totalJelly = 0;
  let collected = 0, collectGoal = 0, collectType = 0, dropLeft = 0, totalDrop = 0;
  let muted = localStorage.getItem('pc_mute') === '1';
  let blocked = null;
  const isBlocked = (r, c) => blocked && blocked[r][c];
  function setShape(name) { const fn = SHAPES[name] || SHAPES.full; blocked = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => !fn(r, c))); }

  /* ---------- sound (WebAudio, no files) ---------- */
  let AC = null;
  function initAudio() { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch {} }
  function beep(freq, dur, type = 'triangle', vol = 0.18, slideTo) {
    if (!AC || muted) return; const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + dur);
  }
  function noiseBurst(dur = .35, vol = .26) {
    if (!AC || muted) return; const n = AC.createBufferSource(), buf = AC.createBuffer(1, Math.floor(AC.sampleRate * dur), AC.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    n.buffer = buf; const g = AC.createGain(), f = AC.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(1900, AC.currentTime); f.frequency.exponentialRampToValueAtTime(220, AC.currentTime + dur);
    g.gain.setValueAtTime(vol, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + dur);
    n.connect(f).connect(g).connect(AC.destination); n.start();
  }
  // C-major pentatonic ladder — pops climb this scale for that addictive "rising" feel
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00];
  const note = (i, dur = .12, vol = .16, type = 'triangle') => beep(SCALE[Math.max(0, Math.min(SCALE.length - 1, i))], dur, type, vol);
  const sfx = {
    swap: () => beep(300, .06, 'sine', .1),
    bad: () => beep(190, .16, 'sawtooth', .12, 110),
    // each cascade starts higher up the scale; tiles within a wave ascend too
    pop: (chain, n) => { const base = Math.min(SCALE.length - 4, (chain - 1)); const k = Math.min(5, Math.max(2, Math.ceil(n / 2))); for (let i = 0; i < k; i++) setTimeout(() => { note(base + i, .12, .16); note(base + i + 2, .12, .05, 'sine'); }, i * 55); },
    special: () => { [0, 2, 4, 6, 8].forEach((s, i) => setTimeout(() => note(s, .1, .16, 'sine'), i * 40)); },
    boom: () => { noiseBurst(.36, .28); beep(150, .42, 'sine', .22, 50); note(8, .14, .1, 'square'); },
    win: () => { [0, 2, 4, 5, 7, 9, 10].forEach((s, i) => setTimeout(() => note(s, .22, .2), i * 90)); },
  };

  /* ---------- background music (procedural loop, no files) ---------- */
  // Gentle Mediterranean-ish arpeggio over a slow chord change. Pure WebAudio so it stays offline.
  let musicTimer = null, musicGain = null, mStep = 0;
  const CHORDS = [[0, 4, 7, 12], [-3, 0, 4, 9], [-5, 2, 5, 9], [-1, 2, 7, 11]]; // i / vi / IV / V-ish, semitones from A
  const MROOT = 220; // A3
  function mTone(semi, dur, vol, type) {
    const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = MROOT * Math.pow(2, semi / 12);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .03); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    o.connect(g).connect(musicGain); o.start(t); o.stop(t + dur + .05);
  }
  function startMusic() {
    if (!AC || muted || musicTimer) return;
    if (!musicGain) { musicGain = AC.createGain(); musicGain.gain.value = .05; musicGain.connect(AC.destination); }
    musicTimer = setInterval(() => {
      const chord = CHORDS[Math.floor(mStep / 8) % CHORDS.length];
      const semi = chord[mStep % 4] + (mStep % 8 >= 4 ? 12 : 0);
      mTone(semi + 12, .5, .5, 'triangle');                 // arpeggio pluck
      if (mStep % 8 === 0) mTone(chord[0] - 12, 1.6, .55, 'sine'); // soft bass on chord change
      mStep++;
    }, 300);
  }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }
  function setMuted(m) {
    muted = m; localStorage.setItem('pc_mute', m ? '1' : '0');
    const b = $('snd'); if (b) { b.textContent = m ? '🔇' : '🔊'; b.classList.toggle('off', m); }
    if (m) stopMusic(); else { initAudio(); startMusic(); }
  }

  /* ---------- helpers ---------- */
  const inB = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;
  const tileAt = (r, c) => inB(r, c) ? grid[r][c] : null;
  const rnd = () => Math.floor(Math.random() * TYPES.length);
  const xy = (r, c) => ({ x: c * cell + PAD, y: r * cell + PAD });
  const allTiles = () => { const a = []; for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (grid[r][c]) a.push(grid[r][c]); return a; };

  function layout() {
    cell = board.clientWidth / COLS; const sz = cell - PAD * 2;
    document.querySelectorAll('.tile').forEach(el => { el.style.width = sz + 'px'; el.style.height = sz + 'px'; el.style.fontSize = (cell * 0.54) + 'px'; });
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (grid[r] && grid[r][c]) setPos(grid[r][c], true);
    if (jellyEls) for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (jellyEls[r][c]) placeJelly(jellyEls[r][c], r, c);
  }
  function setPos(t, instant) {
    const { x, y } = xy(t.r, t.c), tr = `translate(${x}px,${y}px)`;
    if (instant) t.el.style.transition = 'none';
    t.el.style.transform = tr; t.el.style.setProperty('--t', tr); t.el.dataset.r = t.r; t.el.dataset.c = t.c;
    if (instant) { void t.el.offsetWidth; t.el.style.transition = ''; }
  }
  function tileBg(type) { return `radial-gradient(circle at 33% 27%, rgba(255,255,255,.65), rgba(255,255,255,0) 46%), ${TYPES[type].c}`; }
  function makeTile(type, r, c, fromRow) {
    const el = document.createElement('div'); el.className = 'tile' + (type === ING ? ' ing' : '');
    el.innerHTML = type === ING ? luzzuSVG() : tileSVG(type); el.style.background = type === ING ? ING_BG : tileBg(type);
    const sz = cell - PAD * 2; el.style.width = sz + 'px'; el.style.height = sz + 'px'; el.style.fontSize = (cell * 0.54) + 'px';
    board.appendChild(el); const t = { el, type, r, c, special: null }; el.__t = t; grid[r][c] = t;
    if (fromRow != null) { t.r = fromRow; setPos(t, true); t.r = r; requestAnimationFrame(() => setPos(t, false)); } else setPos(t, true);
    return t;
  }
  function setSpecial(t, kind) { t.special = kind; t.el.classList.remove('sp-blast', 'sp-super', 'sp-wrap'); t.el.classList.add(kind === 'super' ? 'sp-super' : kind === 'wrap' ? 'sp-wrap' : 'sp-blast'); }

  function newBoard() {
    board.querySelectorAll('.tile,.spark,.pscore,.combo').forEach(e => e.remove());
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (isBlocked(r, c)) continue;
      let type; do { type = rnd(); } while (
        (c >= 2 && grid[r][c - 1] && grid[r][c - 2] && grid[r][c - 1].type === type && grid[r][c - 2].type === type) ||
        (r >= 2 && grid[r - 1][c] && grid[r - 2][c] && grid[r - 1][c].type === type && grid[r - 2][c].type === type));
      makeTile(type, r, c);
    }
  }

  /* ---------- coats: jelly / ice / jam ---------- */
  function placeJelly(el, r, c) { const { x, y } = xy(r, c), sz = cell - PAD * 2; el.style.width = sz + 'px'; el.style.height = sz + 'px'; el.style.transform = `translate(${x}px,${y}px)`; }
  function coatClass(kind, lay) { return 'jelly ' + kind + (lay >= 2 ? ' j2' : ''); }
  function buildCoats(kind, spec) {
    board.querySelectorAll('.jelly').forEach(e => e.remove());
    jellyEls = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    jellyGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    coatKind = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    jellyLeft = 0; totalJelly = 0;
    if (!kind || !spec) return;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (isBlocked(r, c)) continue;
      let lay = 1; if (spec === 'all2' && r >= 2 && r <= 5 && c >= 2 && c <= 5) lay = 2;
      if (kind === 'ice') lay = 2;                 // ice is always 2 layers (smash twice)
      jellyGrid[r][c] = lay; coatKind[r][c] = kind; jellyLeft += lay; totalJelly += lay;
      const el = document.createElement('div'); el.className = coatClass(kind, lay); board.appendChild(el); jellyEls[r][c] = el; placeJelly(el, r, c);
    }
  }
  function decCoat(r, c) {
    if (!jellyGrid || jellyGrid[r][c] <= 0) return;
    jellyGrid[r][c]--; jellyLeft--; const el = jellyEls[r][c];
    if (jellyGrid[r][c] <= 0) { if (el) { el.remove(); jellyEls[r][c] = null; } coatKind[r][c] = null; }
    else if (el) el.className = coatClass(coatKind[r][c], jellyGrid[r][c]);
  }

  /* ---------- matching ---------- */
  function findMatches() {            // returns runs as { tiles:[...], dir:'h'|'v' }
    const runs = [];
    const same = (t, run) => t && run[0] && t.type === run[0].type && t.type !== ING; // luzzi never match
    for (let r = 0; r < ROWS; r++) { let run = [grid[r][0]]; for (let c = 1; c < COLS; c++) { const t = grid[r][c]; if (same(t, run)) run.push(t); else { if (run.length >= 3 && run.every(Boolean) && run[0].type !== ING) runs.push({ tiles: run, dir: 'h' }); run = [t]; } } if (run.length >= 3 && run.every(Boolean) && run[0].type !== ING) runs.push({ tiles: run, dir: 'h' }); }
    for (let c = 0; c < COLS; c++) { let run = [grid[0][c]]; for (let r = 1; r < ROWS; r++) { const t = grid[r][c]; if (same(t, run)) run.push(t); else { if (run.length >= 3 && run.every(Boolean) && run[0].type !== ING) runs.push({ tiles: run, dir: 'v' }); run = [t]; } } if (run.length >= 3 && run.every(Boolean) && run[0].type !== ING) runs.push({ tiles: run, dir: 'v' }); }
    return runs;
  }
  const pickSurvivor = arr => arr.find(t => lastSwap.has(t)) || arr[Math.floor(arr.length / 2)];

  function mostCommonType() { const cnt = {}; allTiles().forEach(t => cnt[t.type] = (cnt[t.type] || 0) + 1); let best = 0, bt = 0; for (const k in cnt) if (cnt[k] > best) { best = cnt[k]; bt = +k; } return bt; }
  function expandSpecials(set) {
    const q = [...set].filter(t => t.special), seen = new Set(q);
    while (q.length) {
      const t = q.shift();
      if (t.special === 'blast') {
        for (let c = 0; c < COLS; c++) { const u = grid[t.r][c]; if (u) { set.add(u); if (u.special && !seen.has(u)) { seen.add(u); q.push(u); } } }
        for (let r = 0; r < ROWS; r++) { const u = grid[r][t.c]; if (u) { set.add(u); if (u.special && !seen.has(u)) { seen.add(u); q.push(u); } } }
      } else if (t.special === 'wrap') {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const u = tileAt(t.r + dr, t.c + dc); if (u) { set.add(u); if (u.special && !seen.has(u)) { seen.add(u); q.push(u); } } }
      } else if (t.special === 'super') {
        const type = mostCommonType(); allTiles().forEach(u => { if (u.type === type) { set.add(u); if (u.special && !seen.has(u)) { seen.add(u); q.push(u); } } });
      }
    }
  }

  /* ---------- effects ---------- */
  function popup(amount, set) { let sx = 0, sy = 0, n = 0; set.forEach(t => { const { x, y } = xy(t.r, t.c); sx += x; sy += y; n++; }); if (!n) return; const el = document.createElement('div'); el.className = 'pscore'; el.textContent = '+' + amount; el.style.left = (sx / n) + 'px'; el.style.top = (sy / n) + 'px'; board.appendChild(el); setTimeout(() => el.remove(), 800); }
  let sparkBudget = 0;
  function spark(t) { if (sparkBudget <= 0) return; sparkBudget--; const { x, y } = xy(t.r, t.c), cx = x + (cell - PAD * 2) / 2, cy = y + (cell - PAD * 2) / 2; for (let i = 0; i < 5; i++) { const s = document.createElement('div'); s.className = 'spark'; s.style.left = cx + 'px'; s.style.top = cy + 'px'; s.style.background = TYPES[t.type].c; const a = Math.random() * 6.28, d = 16 + Math.random() * 24; s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px'); board.appendChild(s); setTimeout(() => s.remove(), 520); } }
  function shake() { board.classList.add('shake'); setTimeout(() => board.classList.remove('shake'), 320); }
  function comboText(x) { const m = { 2: 'Tasty!', 3: 'Yummy!', 4: 'Pastizz Power!' }; const txt = typeof x === 'string' ? x : (m[x] || (x >= 5 ? 'MELTDOWN!' : '')); if (!txt) return; const el = document.createElement('div'); el.className = 'combo'; el.textContent = txt; board.appendChild(el); setTimeout(() => el.remove(), 800); }
  function flash() { const f = $('flash'); f.classList.add('on'); setTimeout(() => f.classList.remove('on'), 130); }
  function shockAt(x, y, power) { const d = document.createElement('div'); d.className = 'shock'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.setProperty('--s', (power >= 2 ? 190 : 120) + 'px'); board.appendChild(d); setTimeout(() => d.remove(), 440); }
  function confettiAt(xf, yf, power) { if (!window.confetti) return; window.confetti({ particleCount: 30 + power * 30, spread: 78, startVelocity: 36, decay: .9, scalar: 1.05, ticks: 110, origin: { x: xf, y: yf }, colors: ['#F4B23E', '#E14B3B', '#F7E27A', '#8FB85A', '#C77C46', '#E78BB0', '#ffffff'], disableForReducedMotion: true }); }
  function boom(set, power) {
    let sx = 0, sy = 0, n = 0; set.forEach(t => { const { x, y } = xy(t.r, t.c); sx += x; sy += y; n++; }); if (!n) return;
    const bx = sx / n + (cell - PAD * 2) / 2, by = sy / n + (cell - PAD * 2) / 2;
    shockAt(bx, by, power); flash(); sfx.boom();
    const rect = board.getBoundingClientRect();
    confettiAt((rect.left + bx) / window.innerWidth, (rect.top + by) / window.innerHeight, power);
  }
  function confettiRain() { if (!window.confetti) return; const end = Date.now() + 1000; (function frame() { window.confetti({ particleCount: 7, spread: 70, startVelocity: 45, ticks: 200, origin: { x: Math.random(), y: -0.1 }, colors: ['#F4B23E', '#E14B3B', '#F7E27A', '#8FB85A', '#C77C46', '#E78BB0', '#fff'], disableForReducedMotion: true }); if (Date.now() < end) requestAnimationFrame(frame); })(); }

  async function eliminate(set, gained, opts) {
    set.forEach(t => { if (t.type === ING) set.delete(t); }); // luzzi survive blasts — they only leave by delivery
    if (!set.size) return;
    score += gained; popup(gained, set);
    if (opts.shake) shake();
    if (opts.special || opts.chain >= 3 || set.size >= 8) boom(set, opts.special ? 2 : 1);
    sparkBudget = 28;
    const jamHits = new Set();
    set.forEach(t => {
      spark(t);
      const k = coatKind && coatKind[t.r][t.c];
      if (k === 'jelly' || k === 'ice') decCoat(t.r, t.c);            // jelly/ice clear under the match
      if (coatKind) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = t.r + dr, nc = t.c + dc; if (inB(nr, nc) && coatKind[nr][nc] === 'jam') jamHits.add(nr + ',' + nc); }
      if (mode === 'collect' && t.type === collectType) collected++;   // gather the target piece
      t.el.classList.add('pop'); grid[t.r][t.c] = null;
    });
    jamHits.forEach(key => { const [r, c] = key.split(',').map(Number); decCoat(r, c); }); // jam clears NEXT to a match
    sfx.pop(opts.chain, set.size);
    await sleep(190);
    set.forEach(t => t.el.remove());
    updateHUD();
    await collapse();
  }

  async function collapse() {
    for (let c = 0; c < COLS; c++) {
      const rows = []; for (let r = ROWS - 1; r >= 0; r--) if (!isBlocked(r, c)) rows.push(r); // bottom → top playable
      const stack = []; rows.forEach(r => { if (grid[r][c]) { stack.push(grid[r][c]); grid[r][c] = null; } });
      let i = 0; for (; i < stack.length; i++) { const r = rows[i], t = stack[i]; grid[r][c] = t; if (t.r !== r) { t.r = r; setPos(t, false); } }
      let above = 1; for (; i < rows.length; i++) { makeTile(rnd(), rows[i], c, -above); above++; }
    }
    await sleep(210);
  }

  async function resolve() {
    let chain = 0;
    while (true) {
      const runs = findMatches(); if (!runs.length) break; chain++;
      const set = new Set(); runs.forEach(rn => rn.tiles.forEach(t => set.add(t)));
      const survivors = new Map();
      // 5+ in a line → Super Pastizz (color bomb)
      runs.forEach(rn => { if (rn.tiles.length >= 5) { const t = pickSurvivor(rn.tiles); if (!survivors.has(t)) survivors.set(t, 'super'); } });
      // L / T shape (a tile in both a horizontal AND vertical run) → Wrapped bomb
      const hSet = new Set(), vSet = new Set();
      runs.forEach(rn => { const s = rn.dir === 'h' ? hSet : vSet; rn.tiles.forEach(t => s.add(t)); });
      for (const t of set) if (hSet.has(t) && vSet.has(t) && !survivors.has(t)) survivors.set(t, 'wrap');
      // exactly 4 in a line → Blast (striped)
      runs.forEach(rn => { if (rn.tiles.length === 4 && !rn.tiles.some(t => survivors.has(t))) survivors.set(pickSurvivor(rn.tiles), 'blast'); });
      survivors.forEach((k, t) => set.delete(t));
      const hadSpecial = [...set].some(t => t.special);
      expandSpecials(set);
      let gained = 0; runs.forEach(rn => gained += rn.tiles.length * 30 + (rn.tiles.length >= 5 ? 150 : rn.tiles.length === 4 ? 60 : 0)); gained = Math.round(gained * chain);
      if (survivors.size) sfx.special(); if (chain >= 2) comboText(chain);
      survivors.forEach((k, t) => setSpecial(t, k));
      await eliminate(set, gained, { chain, shake: chain >= 2 || set.size >= 6 || survivors.size > 0, special: survivors.size > 0 || hadSpecial });
    }
    return chain;
  }

  // luzzi delivered when they reach the lowest playable cell of their column
  async function deliverIngredients() {
    if (mode !== 'drop') return;
    let any = true, delivered = false;
    while (any) {
      any = false;
      for (let c = 0; c < COLS; c++) {
        let br = -1; for (let r = ROWS - 1; r >= 0; r--) if (!isBlocked(r, c)) { br = r; break; }
        if (br < 0) continue;
        const t = grid[br][c];
        if (t && t.type === ING) {
          dropLeft = Math.max(0, dropLeft - 1); delivered = true; any = true;
          boom(new Set([t]), 2); t.el.classList.add('pop'); grid[br][c] = null;
          const el = t.el; setTimeout(() => el.remove(), 200);
        }
      }
      if (any) { updateHUD(); await sleep(220); await collapse(); }
    }
    if (delivered) updateHUD();
  }
  function placeIngredients(n) {
    const cols = []; for (let c = 0; c < COLS; c++) if (!isBlocked(0, c) && grid[0][c]) cols.push(c);
    for (let i = cols.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[cols[i], cols[j]] = [cols[j], cols[i]]; }
    for (let i = 0; i < n && i < cols.length; i++) { const c = cols[i], old = grid[0][c]; if (old) old.el.remove(); grid[0][c] = null; makeTile(ING, 0, c); }
  }

  /* ---------- swapping ---------- */
  function swapData(a, b) { const ar = a.r, ac = a.c, br = b.r, bc = b.c; grid[ar][ac] = b; grid[br][bc] = a; a.r = br; a.c = bc; b.r = ar; b.c = ac; }
  async function superSwap(a, b) {
    const sup = a.special === 'super' ? a : b, other = sup === a ? b : a, set = new Set();
    if (other.special === 'super') allTiles().forEach(t => set.add(t));
    else { allTiles().forEach(t => { if (t.type === other.type) set.add(t); }); set.add(sup); }
    expandSpecials(set);
    moves--; updateHUD(); sfx.special(); comboText('SUPER PASTIZZ!');
    await eliminate(set, set.size * 45, { chain: 2, shake: true, special: true });
    await resolve(); await deliverIngredients();
  }
  function areaAround(t, rad, set) { for (let dr = -rad; dr <= rad; dr++) for (let dc = -rad; dc <= rad; dc++) { const u = tileAt(t.r + dr, t.c + dc); if (u) set.add(u); } }
  async function comboSwap(a, b) {
    moves--; updateHUD();
    swapData(a, b); setPos(a, false); setPos(b, false); sfx.swap(); await sleep(160);
    const k = [a.special, b.special], set = new Set([a, b]);
    if (a.special === 'super' && b.special === 'super') { allTiles().forEach(t => set.add(t)); comboText('BOARD WIPE!'); }
    else if (k.includes('super')) { const sup = a.special === 'super' ? a : b, other = sup === a ? b : a, ok = other.special; allTiles().forEach(t => { if (t.type === other.type) { setSpecial(t, ok); set.add(t); } }); set.add(sup); comboText('SUPER COMBO!'); }
    else if (k[0] === 'wrap' && k[1] === 'wrap') { areaAround(a, 2, set); comboText('MEGA BOMB!'); }
    else if (k.includes('wrap') && k.includes('blast')) {
      for (let dr = -1; dr <= 1; dr++) { const r = a.r + dr; if (r >= 0 && r < ROWS) for (let c = 0; c < COLS; c++) if (grid[r][c]) set.add(grid[r][c]); }
      for (let dc = -1; dc <= 1; dc++) { const c = a.c + dc; if (c >= 0 && c < COLS) for (let r = 0; r < ROWS; r++) if (grid[r][c]) set.add(grid[r][c]); }
      comboText('CROSS BLAST!');
    } else { for (let c = 0; c < COLS; c++) if (grid[a.r][c]) set.add(grid[a.r][c]); for (let r = 0; r < ROWS; r++) if (grid[r][a.c]) set.add(grid[r][a.c]); comboText('DOUBLE BLAST!'); }
    expandSpecials(set); sfx.special();
    await eliminate(set, set.size * 50, { chain: 3, shake: true, special: true });
    await resolve(); await deliverIngredients();
  }
  async function trySwap(a, b) {
    if (busy || !a || !b) return;
    if (a.special && b.special) { busy = true; deselect(); await comboSwap(a, b); busy = false; checkEnd(); return; }
    if (a.special === 'super' || b.special === 'super') { busy = true; deselect(); await superSwap(a, b); busy = false; checkEnd(); return; }
    busy = true; deselect(); lastSwap = new Set([a, b]);
    swapData(a, b); setPos(a, false); setPos(b, false); sfx.swap(); await sleep(180);
    if (findMatches().length === 0) { swapData(a, b); setPos(a, false); setPos(b, false); sfx.bad(); await sleep(180); toast('No match'); lastSwap = new Set(); busy = false; return; }
    moves--; updateHUD(); await resolve(); await deliverIngredients(); lastSwap = new Set(); busy = false; checkEnd();
  }

  /* ---------- input ---------- */
  function select(t) { selected = t; t.el.classList.add('sel'); }
  function deselect() { if (selected) selected.el.classList.remove('sel'); selected = null; }
  const adj = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
  function onTap(t) { if (busy || !t) return; if (!selected) return select(t); if (selected === t) return deselect(); if (adj(selected, t)) { const s = selected; trySwap(s, t); } else { deselect(); select(t); } }
  board.addEventListener('pointerdown', e => { initAudio(); const el = e.target.closest('.tile'); if (!el) return; down = { t: el.__t, x: e.clientX, y: e.clientY }; });
  document.addEventListener('pointerup', e => {
    if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y, ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < 8) onTap(down.t);
    else { let dr = 0, dc = 0; if (ax > ay) dc = dx > 0 ? 1 : -1; else dr = dy > 0 ? 1 : -1; const nt = tileAt(down.t.r + dr, down.t.c + dc); if (nt) trySwap(down.t, nt); }
    down = null;
  });
  document.addEventListener('pointercancel', () => { down = null; });

  /* ---------- HUD / levels ---------- */
  function updateHUD() {
    $('level').textContent = level; $('moves').textContent = moves; $('score').textContent = score.toLocaleString();
    if (score > best) { best = score; localStorage.setItem('pc_best', best); }
    $('best').textContent = best.toLocaleString();
    if (mode === 'clear') { const lbl = coatKind && coatKind.some(row => row.includes('ice')) ? '❄️ Ice' : coatKind && coatKind.some(row => row.includes('jam')) ? '🍯 Jam' : '🍓 Jelly'; $('goalfill').style.width = (totalJelly ? (totalJelly - jellyLeft) / totalJelly * 100 : 100) + '%'; $('goaltext').textContent = `${lbl} left: ${jellyLeft}`; }
    else if (mode === 'collect') { $('goalfill').style.width = Math.min(100, collected / collectGoal * 100) + '%'; $('goaltext').textContent = `Collect ${TYPES[collectType].e} ${Math.min(collected, collectGoal)}/${collectGoal}`; }
    else if (mode === 'drop') { $('goalfill').style.width = (totalDrop ? (totalDrop - dropLeft) / totalDrop * 100 : 100) + '%'; $('goaltext').textContent = `⛵ Luzzi to deliver: ${dropLeft}`; }
    else { $('goalfill').style.width = Math.min(100, score / target * 100) + '%'; $('goaltext').textContent = `Target ${target.toLocaleString()}`; }
  }
  function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 1600); }
  function showOverlay(emoji, title, text, btn, action) { $('ovEmoji').textContent = emoji; $('ovTitle').textContent = title; $('ovText').innerHTML = text; $('ovBtn').textContent = btn; overlayAction = action; $('overlay').classList.remove('hide'); }
  async function startLevel() {
    const cfg = levelCfg(level); mode = cfg.type || 'score'; target = cfg.target || 0; moves = cfg.moves; score = 0; selected = null;
    collected = 0; collectGoal = 0; dropLeft = 0; totalDrop = 0;
    if (mode === 'collect') { collectType = cfg.collect.t; collectGoal = cfg.collect.n; }
    if (mode === 'drop') { dropLeft = totalDrop = cfg.drop; }
    setShape(cfg.shape || 'full');
    newBoard(); buildCoats(mode === 'clear' ? cfg.coat : null, mode === 'clear' ? cfg.spec : null);
    if (mode === 'drop') placeIngredients(totalDrop);
    layout(); updateHUD(); $('overlay').classList.add('hide');
    busy = true; await resolve(); busy = false; updateHUD();
    if (cfg.tip) setTimeout(() => toast(cfg.tip), 500);
  }
  function checkEnd() {
    const won = mode === 'clear' ? jellyLeft <= 0 : mode === 'collect' ? collected >= collectGoal : mode === 'drop' ? dropLeft <= 0 : score >= target;
    const goalMsg = mode === 'clear' ? `All cleared! Score <b>${score.toLocaleString()}</b>.`
      : mode === 'collect' ? `Collected all ${collectGoal} ${TYPES[collectType].e}!`
        : mode === 'drop' ? `All luzzi delivered! ⛵` : `You scored <b>${score.toLocaleString()}</b>.`;
    if (won) { sfx.win(); confettiRain(); showOverlay('🎉', `Level ${level} cleared!`, goalMsg, 'Next level', 'next'); }
    else if (moves <= 0) {
      const miss = mode === 'clear' ? `<b>${jellyLeft}</b> left — so close!`
        : mode === 'collect' ? `<b>${collectGoal - collected}</b> more ${TYPES[collectType].e} needed!`
          : mode === 'drop' ? `<b>${dropLeft}</b> luzzi still at sea!` : `You reached <b>${score.toLocaleString()}</b> of ${target.toLocaleString()}.`;
      showOverlay('😅', 'Out of moves', miss, 'Try again', 'retry');
    }
  }
  const forcedLevel = +new URLSearchParams(location.search).get('lvl') || 0;
  $('ovBtn').addEventListener('click', () => { initAudio(); startMusic(); if (overlayAction === 'next') level++; if (overlayAction === 'start') level = forcedLevel || 1; startLevel(); });

  window.addEventListener('resize', layout);
  document.addEventListener('DOMContentLoaded', () => {
    $('best').textContent = best.toLocaleString();
    const sb = $('snd'); if (sb) { sb.textContent = muted ? '🔇' : '🔊'; sb.classList.toggle('off', muted); sb.addEventListener('click', () => setMuted(!muted)); }
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  });
})();
