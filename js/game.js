/* ===== Pastizzi Crush — Maltese match-3 (specials + juice + sound) ===== */
(function () {
  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const ROWS = 8, COLS = 8, PAD = 3;
  // Real photo-style Maltese pastry pieces (6 distinct types)
  const TYPES = [
    { e: '🥟', c: '#ecd0a0', img: 'assets/p-irkotta.png' }, // pastizz tal-irkotta (ricotta)
    { e: '🫛', c: '#8cbf4e', img: 'assets/p-pizelli.png' },  // pastizz tal-piżelli (peas)
    { e: '🍕', c: '#d8442e', img: 'assets/pizza.png' },      // Maltese pizza
    { e: '🟫', c: '#a25f28', img: 'assets/imqaret.png' },    // imqaret (date)
    { e: '🍩', c: '#c07e2e', img: 'assets/qaghaq.png' },     // qagħqa tal-għasel (honey ring)
    { e: '🌸', c: '#f2e6cf', img: 'assets/figolla.png' },    // figolla
  ];
  // Rich glossy Maltese-pastry art in the logo's style (gradients in index.html). 6 distinct colours for fair matching.
  const ICONS = [
    // 0 Pastizz tal-irkotta — flaky golden lens, many sfoljata layers, ricotta peeking out
    "<path d='M5,50 Q50,11 95,50 Q50,89 5,50 Z' fill='url(#gGold)' stroke='#915f0e' stroke-width='2'/>" +
    "<path d='M10,50 Q50,17 90,50' fill='none' stroke='#fff0c4' stroke-width='2' opacity='.8'/>" +
    "<path d='M13,49 Q50,22 87,49 M17,47 Q50,27 83,47 M21,45 Q50,32 79,45' fill='none' stroke='#c5851d' stroke-width='2.1'/>" +
    "<path d='M13,51 Q50,78 87,51 M17,53 Q50,73 83,53 M21,55 Q50,68 79,55' fill='none' stroke='#b97c19' stroke-width='2.1'/>" +
    "<path d='M30,50 Q50,43 70,50 Q50,57 30,50 Z' fill='#fff6e0'/><path d='M35,49 Q50,46 65,49' fill='none' stroke='#ecd6a6' stroke-width='1.5'/>" +
    "<path d='M22,40 Q50,23 78,40' fill='none' stroke='#ffe7a8' stroke-width='2.4' opacity='.7' stroke-linecap='round'/>",
    // 1 Maltese pizza — golden crust, tomato sauce, cheese, peas, olive, basil
    "<rect x='11' y='11' width='78' height='78' rx='17' fill='url(#gGold2)' stroke='#a9781f' stroke-width='2.5'/>" +
    "<rect x='11' y='11' width='78' height='78' rx='17' fill='none' stroke='#ffe9b8' stroke-width='2' opacity='.5'/>" +
    "<rect x='20' y='20' width='60' height='60' rx='12' fill='url(#gRed)'/>" +
    "<ellipse cx='35' cy='34' rx='7' ry='5' fill='#ffe7bd' opacity='.85'/><ellipse cx='63' cy='45' rx='6' ry='4' fill='#ffe7bd' opacity='.8'/>" +
    "<circle cx='39' cy='42' r='4' fill='#84bd50' stroke='#5e8a31' stroke-width='1'/><circle cx='57' cy='34' r='4' fill='#84bd50' stroke='#5e8a31' stroke-width='1'/><circle cx='46' cy='60' r='4' fill='#84bd50' stroke='#5e8a31' stroke-width='1'/>" +
    "<circle cx='64' cy='62' r='6' fill='#2b1f1a'/><circle cx='64' cy='62' r='2.4' fill='#8a5f3c'/>",
    // 2 Ġbejna — round peppered cheeselet, basket ridges
    "<ellipse cx='50' cy='61' rx='37' ry='25' fill='#cfa733'/>" +
    "<ellipse cx='50' cy='48' rx='37' ry='26' fill='url(#gCream)' stroke='#bd9a2c' stroke-width='2'/>" +
    "<path d='M18,46 H82 M22,39 H78 M22,54 H78' fill='none' stroke='#e3cf80' stroke-width='1.6' opacity='.6'/>" +
    "<circle cx='38' cy='44' r='2.6' fill='#352616'/><circle cx='60' cy='41' r='2.6' fill='#352616'/><circle cx='52' cy='54' r='2.6' fill='#352616'/><circle cx='44' cy='52' r='2' fill='#352616'/>" +
    "<ellipse cx='40' cy='40' rx='13' ry='5' fill='#fff' opacity='.45'/>",
    // 3 Qassata tal-piżelli — round pastry, crimped rim, green-pea filling
    "<circle cx='50' cy='53' r='38' fill='url(#gGoldDeep)'/>" +
    "<circle cx='50' cy='49' r='38' fill='url(#gGold2)' stroke='#915f0e' stroke-width='2'/>" +
    "<circle cx='50' cy='49' r='33' fill='none' stroke='#e6ad3e' stroke-width='8' stroke-dasharray='9 6' stroke-linecap='round'/>" +
    "<circle cx='50' cy='49' r='21' fill='url(#gPea)' stroke='#4d7825' stroke-width='1.5'/>" +
    "<circle cx='44' cy='45' r='4.6' fill='#a9da57'/><circle cx='57' cy='44' r='4.6' fill='#a9da57'/><circle cx='50' cy='55' r='4.6' fill='#9ad047'/><circle cx='58' cy='55' r='3.6' fill='#8cc23f'/><circle cx='42' cy='54' r='3.6' fill='#8cc23f'/>" +
    "<circle cx='42.5' cy='43.5' r='1.4' fill='#e6ffb0'/><circle cx='55.5' cy='42.5' r='1.4' fill='#e6ffb0'/>",
    // 4 Imqaret — fried date pillow-diamond, sugar-dusted, date slit
    "<rect x='22' y='22' width='56' height='56' rx='13' transform='rotate(45 50 50)' fill='url(#gBrown)' stroke='#5a3214' stroke-width='2'/>" +
    "<rect x='28' y='28' width='44' height='44' rx='10' transform='rotate(45 50 50)' fill='none' stroke='#caa06d' stroke-width='1.6' opacity='.45'/>" +
    "<path d='M37,50 H63' stroke='#3a2110' stroke-width='5' stroke-linecap='round'/>" +
    "<path d='M40,50 H60' stroke='#7a4a22' stroke-width='2' stroke-linecap='round'/>" +
    "<circle cx='40' cy='37' r='1.5' fill='#fff' opacity='.75'/><circle cx='60' cy='38' r='1.5' fill='#fff' opacity='.7'/><circle cx='38' cy='60' r='1.5' fill='#fff' opacity='.7'/><circle cx='62' cy='61' r='1.5' fill='#fff' opacity='.65'/><circle cx='50' cy='32' r='1.3' fill='#fff' opacity='.6'/>",
    // 5 Figolla — pink-iced almond heart, sprinkles + cherry
    "<path d='M50,86 C15,60 23,26 50,42 C77,26 85,60 50,86 Z' fill='url(#gPink)' stroke='#bd5080' stroke-width='2'/>" +
    "<path d='M50,53 C35,41 28,54 37,63 M50,53 C65,41 72,54 63,63' fill='none' stroke='#fff' stroke-width='4' stroke-linecap='round' opacity='.9'/>" +
    "<line x1='38' y1='58' x2='42' y2='60' stroke='#ffe04a' stroke-width='2.4' stroke-linecap='round'/><line x1='58' y1='56' x2='62' y2='59' stroke='#5ec8ff' stroke-width='2.4' stroke-linecap='round'/><line x1='48' y1='70' x2='52' y2='71' stroke='#7be06a' stroke-width='2.4' stroke-linecap='round'/>" +
    "<circle cx='50' cy='37' r='6.5' fill='url(#gCherry)'/><circle cx='47.5' cy='34.5' r='2' fill='#ffb3c0'/>",
  ];
  const tileSVG = type => `<svg class='ic' viewBox='0 0 100 100'>${ICONS[type]}<ellipse cx='38' cy='30' rx='19' ry='10' fill='url(#gGloss)'/></svg>`;
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

  const NOLOOP = /[?&]t=1/.test(location.search); // headless-test flag: skip perpetual timers
  const board = $('board');
  let grid = [], cell = 56, busy = false, selected = null, down = null, lastSwap = new Set();
  let level = 1, moves = 20, score = 0, target = 1000, best = +(localStorage.getItem('pc_best') || 0);
  let overlayAction = 'start';
  let mode = 'score', jellyGrid = null, jellyEls = null, coatKind = null, jellyLeft = 0, totalJelly = 0;
  let collected = 0, collectGoal = 0, collectType = 0, dropLeft = 0, totalDrop = 0;
  let sfxOn = localStorage.getItem('pc_sfx') !== '0';     // sound effects + voices
  let musicOn = localStorage.getItem('pc_music') !== '0'; // background music
  let blocked = null;
  const isBlocked = (r, c) => blocked && blocked[r][c];
  function setShape(name) { const fn = SHAPES[name] || SHAPES.full; blocked = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => !fn(r, c))); }

  /* ---------- sound (WebAudio) ---------- */
  let AC = null, sfxBus = null;
  function initAudio() {
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (!sfxBus) { sfxBus = AC.createGain(); sfxBus.gain.value = 0.5; sfxBus.connect(AC.destination); } // keep effects gentle (50%)
      if (AC.state === 'suspended') AC.resume(); loadVoices();
    } catch { }
  }
  const sfxOut = () => sfxBus || (AC && AC.destination);
  /* ---------- Maltese voice callouts (real recordings) ---------- */
  const VOICE = {}; let voiceGain = null, voicesLoaded = false, lastVoiceT = 0;
  function loadVoices() {
    if (voicesLoaded || !AC || NOLOOP) return; voicesLoaded = true;
    voiceGain = AC.createGain(); voiceGain.gain.value = 1; voiceGain.connect(sfxOut());
    const files = { title: 'assets/voice-title.mp3', mela: 'assets/voice-mela.mp3', prosit: 'assets/voice-prosit.mp3', nomatch: 'assets/voice-nomatch.mp3' };
    for (const k in files) fetch(files[k]).then(r => r.arrayBuffer()).then(a => AC.decodeAudioData(a)).then(buf => { VOICE[k] = buf; }).catch(() => { });
  }
  function playVoice(name, vol = 0.95, minGap = 0, retries = 10) {
    if (!sfxOn || !AC) return;
    if (AC.state === 'suspended') AC.resume();
    if (!VOICE[name] || !voiceGain) { if (retries > 0) setTimeout(() => playVoice(name, vol, 0, retries - 1), 130); return; } // wait for decode
    const now = (performance || Date).now(); if (minGap && now - lastVoiceT < minGap) return; lastVoiceT = now;
    const s = AC.createBufferSource(); s.buffer = VOICE[name];
    const g = AC.createGain(); g.gain.value = vol; s.connect(g).connect(voiceGain); s.start();
  }
  function beep(freq, dur, type = 'triangle', vol = 0.18, slideTo) {
    if (!AC || !sfxOn) return; const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(sfxOut()); o.start(t); o.stop(t + dur);
  }
  function noiseBurst(dur = .35, vol = .26) {
    if (!AC || !sfxOn) return; const n = AC.createBufferSource(), buf = AC.createBuffer(1, Math.floor(AC.sampleRate * dur), AC.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    n.buffer = buf; const g = AC.createGain(), f = AC.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(1900, AC.currentTime); f.frequency.exponentialRampToValueAtTime(220, AC.currentTime + dur);
    g.gain.setValueAtTime(vol, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + dur);
    n.connect(f).connect(g).connect(sfxOut()); n.start();
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
    start: () => { [0, 2, 4].forEach((s, i) => setTimeout(() => note(s + 2, .11, .16), i * 65)); },
    // triumphant rising triad fanfare
    win: () => { [[0, 2, 4], [2, 4, 6], [4, 6, 8]].forEach((ch, i) => setTimeout(() => ch.forEach(s => note(s, .3, .15)), i * 150)); setTimeout(() => { note(9, .5, .2); note(11, .5, .12, 'sine'); }, 500); },
  };

  /* ---------- background music (procedural, no files) ---------- */
  // Warm Mediterranean loop: soft pad + plucked arpeggio + bass + gentle melody. Pure WebAudio (offline).
  let musicTimer = null, musicGain = null, musicFilter = null, mStep = 0;
  const MROOT = 220; // A3
  const PROG = [[0, 4, 7], [7, 11, 14], [-3, 0, 4], [-7, -3, 0]];   // I – V – vi – IV (triads)
  // Catchy singable lead hook — 8 steps/bar × 4 bars, semitones from A (null = rest for groove)
  const LEAD = [
    12, null, 16, 19, 16, 14, 12, null,
    11, null, 14, 18, 16, 14, 11, null,
    9, 12, 14, 16, 14, 12, 9, null,
    5, 9, 12, 14, 12, 9, 7, null,
  ];
  function mVoice(semi, dur, vol, type, dest) {
    const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = MROOT * Math.pow(2, semi / 12);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .04); g.gain.exponentialRampToValueAtTime(.0006, t + dur);
    o.connect(g).connect(dest || musicGain); o.start(t); o.stop(t + dur + .05);
  }
  function mLead(semi, dur, vol) {                          // bright bell/marimba lead — the hook
    const t = AC.currentTime, f = MROOT * Math.pow(2, semi / 12);
    const o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain(), g2 = AC.createGain();
    o.type = 'triangle'; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f * 2; g2.gain.value = .35; o2.connect(g2).connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .015); g.gain.exponentialRampToValueAtTime(.0005, t + dur);
    o.connect(g).connect(musicGain); o.start(t); o.stop(t + dur + .05); o2.start(t); o2.stop(t + dur + .05);
  }
  function mPad(chord) {                                   // sustained, detuned, swelling chord
    const t = AC.currentTime, dur = 2.5;
    chord.forEach(semi => [0, 0.35].forEach(det => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sawtooth'; o.frequency.value = MROOT * Math.pow(2, semi / 12) / 2 * (1 + det / 100);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .7); g.gain.linearRampToValueAtTime(.04, t + dur - .7); g.gain.exponentialRampToValueAtTime(.0004, t + dur);
      o.connect(g).connect(musicFilter); o.start(t); o.stop(t + dur + .1);
    }));
  }
  function startMusic() {
    if (!AC || !musicOn || musicTimer || NOLOOP) return;
    if (!musicGain) {
      musicGain = AC.createGain(); musicGain.gain.value = .34;
      musicFilter = AC.createBiquadFilter(); musicFilter.type = 'lowpass'; musicFilter.frequency.value = 1500; musicFilter.Q.value = .6;
      musicFilter.connect(musicGain); musicGain.connect(AC.destination);
    }
    mStep = 0;
    const beat = () => {
      const gi = mStep % 32, bar = Math.floor(gi / 8) % PROG.length, chord = PROG[bar], s = gi % 8;
      if (s === 0) mPad(chord);
      if (s === 0 || s === 4) mVoice(chord[0] - 12, .5, .26, 'sine');            // bass on beats 1 & 3
      if (s % 2 === 0) mVoice(chord[(s / 2) % 3] + 12, .34, .11, 'triangle');    // soft arp
      const L = LEAD[gi]; if (L != null) mLead(L + 12, .26, .24);                // the catchy hook
      mStep++;
    };
    beat(); if (!NOLOOP) musicTimer = setInterval(beat, 300);
  }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }
  function setSfx(on) { sfxOn = on; localStorage.setItem('pc_sfx', on ? '1' : '0'); syncSettingsUI(); }
  function setMusic(on) {
    musicOn = on; localStorage.setItem('pc_music', on ? '1' : '0');
    if (on) { initAudio(); onMenu() ? startMenuMusic() : startGameMusic(); }
    else stopBg();
    syncSettingsUI();
  }
  /* ---------- background music (real looped tracks, 50% volume) ---------- */
  const MENU_TRACKS = ['assets/menu1.mp3'];                     // home / menu
  const GAME_TRACKS = ['assets/menu2.mp3', 'assets/menu3.mp3']; // in a level
  let bgAudio = null, bgList = null;
  const onMenu = () => { const m = $('map'); return m && !m.classList.contains('hide'); };
  function playBg(list) {
    if (!musicOn || NOLOOP) return;
    if (!bgAudio) { bgAudio = new Audio(); bgAudio.loop = true; bgAudio.volume = .5; }
    if (bgList !== list || bgAudio.paused) { bgList = list; bgAudio.src = list[Math.floor(Math.random() * list.length)]; bgAudio.play().catch(() => { }); }
  }
  function stopBg() { if (bgAudio && !bgAudio.paused) bgAudio.pause(); }
  function startMenuMusic() { playBg(MENU_TRACKS); }
  function startGameMusic() { playBg(GAME_TRACKS); }
  function syncSettingsUI() {
    const m = $('setMusic'), s = $('setSfx');
    if (m) { m.classList.toggle('on', musicOn); m.textContent = musicOn ? '🎵 Music: ON' : '🎵 Music: OFF'; }
    if (s) { s.classList.toggle('on', sfxOn); s.textContent = sfxOn ? '🔊 Effects: ON' : '🔊 Effects: OFF'; }
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
    el.innerHTML = type === ING ? luzzuSVG() : `<img class="ic" src="${TYPES[type].img}" alt="" draggable="false">`; // real pastry photo
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
    shockAt(bx, by, power); flash(); sfx.boom(); if (navigator.vibrate) try { navigator.vibrate(power >= 2 ? 45 : 22); } catch { }
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
      if (survivors.size) sfx.special(); if (chain >= 2) comboText(chain); if (chain >= 3 || survivors.size) playVoice('prosit', .9, 1400);
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
    moves--; updateHUD(); sfx.special(); comboText('SUPER PASTIZZ!'); playVoice('prosit', 1, 900);
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
    expandSpecials(set); sfx.special(); playVoice('prosit', 1, 900);
    await eliminate(set, set.size * 50, { chain: 3, shake: true, special: true });
    await resolve(); await deliverIngredients();
  }
  async function trySwap(a, b) {
    if (busy || !a || !b) return;
    if (a.special && b.special) { busy = true; deselect(); await comboSwap(a, b); await ensurePlayable(); busy = false; checkEnd(); return; }
    if (a.special === 'super' || b.special === 'super') { busy = true; deselect(); await superSwap(a, b); await ensurePlayable(); busy = false; checkEnd(); return; }
    busy = true; deselect(); lastSwap = new Set([a, b]);
    swapData(a, b); setPos(a, false); setPos(b, false); sfx.swap(); await sleep(180);
    if (findMatches().length === 0) { swapData(a, b); setPos(a, false); setPos(b, false); sfx.bad(); playVoice('nomatch', .9, 700); await sleep(180); toast('No match'); lastSwap = new Set(); busy = false; return; }
    moves--; updateHUD(); await resolve(); await deliverIngredients(); await ensurePlayable(); lastSwap = new Set(); busy = false; checkEnd();
  }

  /* ---------- input ---------- */
  function select(t) { selected = t; t.el.classList.add('sel'); }
  function deselect() { if (selected) selected.el.classList.remove('sel'); selected = null; }
  const adj = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
  function onTap(t) { if (busy || !t) return; if (!selected) return select(t); if (selected === t) return deselect(); if (adj(selected, t)) { const s = selected; trySwap(s, t); } else { deselect(); select(t); } }
  board.addEventListener('pointerdown', e => { initAudio(); const el = e.target.closest('.tile'); if (!el) return; down = { t: el.__t, x: e.clientX, y: e.clientY }; });
  document.addEventListener('pointerup', e => {
    if (!down) return;
    if (aiming) { applyBooster(down.t); down = null; return; }
    const dx = e.clientX - down.x, dy = e.clientY - down.y, ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < 8) onTap(down.t);
    else { let dr = 0, dc = 0; if (ax > ay) dc = dx > 0 ? 1 : -1; else dr = dy > 0 ? 1 : -1; const nt = tileAt(down.t.r + dr, down.t.c + dc); if (nt) trySwap(down.t, nt); }
    down = null;
  });
  document.addEventListener('pointercancel', () => { down = null; });

  /* ---------- HUD / levels ---------- */
  const pieceMini = t => `<img src="${TYPES[t].img}" alt="" style="height:1.15em;vertical-align:-3px">`;
  function updateHUD() {
    $('level').textContent = level; $('moves').textContent = moves; $('score').textContent = score.toLocaleString();
    if (score > best) { best = score; localStorage.setItem('pc_best', best); }
    $('best').textContent = best.toLocaleString();
    if (mode === 'clear') { const lbl = coatKind && coatKind.some(row => row.includes('ice')) ? '❄️ Ice' : coatKind && coatKind.some(row => row.includes('jam')) ? '🍯 Jam' : '🍓 Jelly'; $('goalfill').style.width = (totalJelly ? (totalJelly - jellyLeft) / totalJelly * 100 : 100) + '%'; $('goaltext').textContent = `${lbl} left: ${jellyLeft}`; }
    else if (mode === 'collect') { $('goalfill').style.width = Math.min(100, collected / collectGoal * 100) + '%'; $('goaltext').innerHTML = `Collect ${pieceMini(collectType)} ${Math.min(collected, collectGoal)}/${collectGoal}`; }
    else if (mode === 'drop') { $('goalfill').style.width = (totalDrop ? (totalDrop - dropLeft) / totalDrop * 100 : 100) + '%'; $('goaltext').textContent = `⛵ Luzzi to deliver: ${dropLeft}`; }
    else { $('goalfill').style.width = Math.min(100, score / target * 100) + '%'; $('goaltext').textContent = `Target ${target.toLocaleString()}`; }
  }
  function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 1600); }
  function showOverlay(emoji, title, text, btn, action) { $('ovEmoji').textContent = emoji; $('ovStars').classList.add('hide'); $('ovTitle').textContent = title; $('ovText').innerHTML = text; $('ovBtn').textContent = btn; overlayAction = action; $('overlay').classList.remove('hide'); }
  const FRAME_TINTS = ['#e8b54a', '#c8313a', '#3f7cc0', '#6fa03a', '#d98a2c', '#9b6bd0'];
  async function startLevel() {
    const cfg = levelCfg(level); mode = cfg.type || 'score'; target = cfg.target || 0; moves = cfg.moves; score = 0; selected = null;
    // in-game background = the world you're playing (world 1 has 5 variants → different each play)
    const gw = Math.floor((level - 1) / WORLD_SIZE);
    const igPool = gw === 0 ? ['assets/ig1.jpg', 'assets/ig2.jpg', 'assets/ig3.jpg', 'assets/ig4.jpg', 'assets/ig5.jpg'] : ['assets/world' + (gw + 1) + '.jpg'];
    $('gamebg').style.backgroundImage = `url(${igPool[Math.floor(Math.random() * igPool.length)]})`;
    board.style.setProperty('--frame', FRAME_TINTS[Math.floor(Math.random() * FRAME_TINTS.length)]);
    collected = 0; collectGoal = 0; dropLeft = 0; totalDrop = 0;
    if (mode === 'collect') { collectType = cfg.collect.t; collectGoal = cfg.collect.n; }
    if (mode === 'drop') { dropLeft = totalDrop = cfg.drop; }
    setShape(cfg.shape || 'full');
    newBoard(); buildCoats(mode === 'clear' ? cfg.coat : null, mode === 'clear' ? cfg.spec : null);
    if (mode === 'drop') placeIngredients(totalDrop);
    layout(); updateHUD(); updateCoinsUI(); $('overlay').classList.add('hide');
    busy = true; await resolve(); await ensurePlayable(); busy = false; updateHUD();
    if (cfg.tip) setTimeout(() => toast(cfg.tip), 500);
  }
  function checkEnd() {
    if (!$('map').classList.contains('hide')) return;   // left to the map mid-cascade — don't pop an overlay over it
    const won = mode === 'clear' ? jellyLeft <= 0 : mode === 'collect' ? collected >= collectGoal : mode === 'drop' ? dropLeft <= 0 : score >= target;
    if (won || moves <= 0) { if (score > 0) addScore(getPlayer(), score, getAvatar()); }   // record on any level end
    const goalMsg = mode === 'clear' ? `All cleared! Score <b>${score.toLocaleString()}</b>.`
      : mode === 'collect' ? `Collected all ${collectGoal} ${pieceMini(collectType)}!`
        : mode === 'drop' ? `All luzzi delivered! ⛵` : `You scored <b>${score.toLocaleString()}</b>.`;
    if (won) {
      const startMoves = levelCfg(level).moves || 1, frac = moves / startMoves;
      const st = frac >= 0.5 ? 3 : frac >= 0.25 ? 2 : 1;
      saveStars(level, st); unlockNext(level);
      const reward = 20 + st * 15; addCoins(reward);
      sfx.win(); confettiRain(); setTimeout(() => playVoice('mela', 1), 220); if (navigator.vibrate) try { navigator.vibrate([40, 30, 90]); } catch { }
      showOverlay('🎉', `Level ${level} cleared!`, `${goalMsg}<br>🪙 <b>+${reward}</b> coins`, 'Next level', 'next');
      $('ovStars').innerHTML = [0, 1, 2].map(i => `<b class="${i < st ? 'on' : 'off'}" style="animation-delay:${(i * 0.2).toFixed(2)}s">★</b>`).join('');
      $('ovStars').classList.remove('hide');
    }
    else if (moves <= 0) {
      loseLife(); renderMeta();
      const miss = mode === 'clear' ? `<b>${jellyLeft}</b> left — so close!`
        : mode === 'collect' ? `<b>${collectGoal - collected}</b> more ${pieceMini(collectType)} needed!`
          : mode === 'drop' ? `<b>${dropLeft}</b> luzzi still at sea!` : `You reached <b>${score.toLocaleString()}</b> of ${target.toLocaleString()}.`;
      showOverlay('😅', 'Out of moves', `${miss}<br>💔 lost a life`, 'Try again', 'retry');
    }
  }
  /* ---------- level-select map + progress ---------- */
  const MAXLEVELS = 40, WORLD_SIZE = 5;
  const WORLD_NAMES = ['Village Bakery', 'Valletta Streets', 'Mdina Night', 'Marsaxlokk Market', 'Gozo Farm', 'Blue Lagoon', 'Festa Week', 'Three Cities', 'Dingli Cliffs', 'Pastizzi Factory'];
  const getUnlocked = () => Math.max(1, +(localStorage.getItem('pc_unlocked') || 1));
  const getStars = () => { try { return JSON.parse(localStorage.getItem('pc_stars') || '{}'); } catch { return {}; } };
  function saveStars(lv, st) { const s = getStars(); if ((s[lv] || 0) < st) { s[lv] = st; localStorage.setItem('pc_stars', JSON.stringify(s)); } }
  function unlockNext(lv) { if (lv + 1 > getUnlocked()) localStorage.setItem('pc_unlocked', Math.min(MAXLEVELS, lv + 1)); }
  // Per-world themed scenes (each world its own backdrop) with a winding path + your avatar on the current level.
  // Distinct backdrop per world; drop in assets/worldN.jpg to replace a gradient with real illustration art.
  const WORLD_BG = [
    'linear-gradient(180deg,#c99a55,#8a5a2a)',   // 1 Village Bakery — warm bread
    'linear-gradient(180deg,#9fc4e0,#d8c48c)',   // 2 Valletta Streets — limestone + sky
    'linear-gradient(180deg,#2b2456,#5a3a7c)',   // 3 Mdina Night
    'linear-gradient(180deg,#2f95a0,#7fc7b4)',   // 4 Marsaxlokk Market — sea
    'linear-gradient(180deg,#7aa93f,#c2d382)',   // 5 Gozo Farm
    'linear-gradient(180deg,#3ab6cf,#a9e4e2)',   // 6 Blue Lagoon
    'linear-gradient(180deg,#c02a30,#e8a54a)',   // 7 Festa Week
    'linear-gradient(180deg,#4d6f90,#9fb4c4)',   // 8 Three Cities
    'linear-gradient(180deg,#96683f,#c8a672)',   // 9 Dingli Cliffs
    'linear-gradient(180deg,#b0762c,#e8c46a)',   // 10 Pastizzi Factory
  ];
  const worldBgURL = w => `assets/world${w + 1}.jpg`;   // optional real art per world
  // per-world road palette (edge, sandy body, cobble dash) so the path blends into each scene
  const WORLD_ROAD = [
    { e: '#3f7cc0', b: '#e6cd94', d: '#f4e2b6' }, // 1 Village Bakery
    { e: '#4a86c8', b: '#ecd9a8', d: '#f7ead0' }, // 2 Valletta limestone
    { e: '#caa143', b: '#7d6947', d: '#d8c48a' }, // 3 Mdina Night — warm lantern stone
    { e: '#2f9aa8', b: '#e6cd94', d: '#f4e2b6' }, // 4 Marsaxlokk — teal edge
    { e: '#6fa03a', b: '#c9a86a', d: '#e6d09a' }, // 5 Gozo Farm — dirt
    { e: '#38c0d0', b: '#ecdcb0', d: '#f7ecd2' }, // 6 Blue Lagoon — turquoise
    { e: '#e8b54a', b: '#a97f48', d: '#e8cf94' }, // 7 Festa Week — gold, lit
    { e: '#4a86c8', b: '#e6d3a2', d: '#f2e2be' }, // 8 Three Cities
    { e: '#e0954a', b: '#cfa76a', d: '#efcf96' }, // 9 Dingli Cliffs — sunset
    { e: '#5a8fb0', b: '#e6cd94', d: '#f4e2b6' }, // 10 Pastizzi Factory — steel
  ];
  // node anchors (%x,%y) along each 3D pathway image, computed from its centre-line — level 1 at bottom
  const PATH_NODES = [
    [[46.4, 90], [44.4, 72], [61.1, 52], [43.8, 32], [55.2, 13]],
    [[50.1, 90], [49.2, 72], [51.0, 52], [53.3, 32], [48.3, 13]],
    [[53.0, 90], [45.0, 72], [56.1, 52], [47.4, 32], [53.3, 13]],
    [[50.1, 90], [49.0, 72], [52.6, 52], [48.7, 32], [58.2, 13]],
    [[52.8, 90], [48.3, 72], [43.5, 52], [52.6, 32], [54.8, 13]],
    [[53.1, 90], [45.4, 72], [58.5, 52], [44.6, 32], [51.7, 13]],
    [[45.4, 90], [50.5, 72], [51.3, 52], [49.1, 32], [57.6, 13]],
    [[43.1, 90], [51.8, 72], [47.6, 52], [62.1, 32], [64.9, 13]],
    [[48.1, 90], [53.4, 72], [50.4, 52], [45.8, 32], [49.6, 13]],
  ];
  let viewWorld = null;                                  // which world screen is showing
  // Full-screen, one world at a time, using the real 3D pathway art.
  function buildMap() {
    const list = $('mapList'); if (!list) return;
    const unlocked = getUnlocked(), stars = getStars(), cur = Math.min(unlocked, MAXLEVELS);
    const worlds = Math.ceil(MAXLEVELS / WORLD_SIZE);
    if (viewWorld == null) viewWorld = Math.floor((cur - 1) / WORLD_SIZE);
    viewWorld = Math.max(0, Math.min(worlds - 1, viewWorld));
    const w = viewWorld, pathIdx = w % PATH_NODES.length, anchors = PATH_NODES[pathIdx];
    list.className = 'oneworld'; list.innerHTML = '';
    const sec = document.createElement('section'); sec.className = 'scene';
    sec.style.background = WORLD_BG[w % WORLD_BG.length];
    const bg = new Image(); bg.onload = () => { sec.style.backgroundImage = `url(${bg.src})`; }; bg.src = worldBgURL(w);
    sec.insertAdjacentHTML('beforeend', `<div class="scene-tint"></div><div class="world-ribbon">${escapeHtml(WORLD_NAMES[w] || ('World ' + (w + 1)))}<span>World ${w + 1}</span></div>`);
    const wrap = document.createElement('div'); wrap.className = 'pathwrap';
    wrap.innerHTML = `<img class="pathimg" src="assets/path${pathIdx + 1}.png" alt="">`;
    const n = Math.min(WORLD_SIZE, MAXLEVELS - w * WORLD_SIZE);
    for (let j = 0; j < n; j++) {
      const lv = w * WORLD_SIZE + j + 1, a = anchors[j], locked = lv > unlocked, st = stars[lv] || 0;
      const node = document.createElement('div'); node.className = 'node'; node.style.left = a[0] + '%'; node.style.top = a[1] + '%';
      const btn = document.createElement('button'); btn.className = 'lvl-node' + (locked ? ' locked' : '') + (st > 0 ? ' cleared' : '') + (lv === cur ? ' current' : '');
      const starHtml = `<span class="stars"><b class="${st > 0 ? 'on' : 'off'}">★</b><b class="${st > 1 ? 'on' : 'off'}">★</b><b class="${st > 2 ? 'on' : 'off'}">★</b></span>`;
      btn.innerHTML = locked ? '' : `${starHtml}<span class="num">${lv}</span>`;
      if (!locked) btn.addEventListener('click', () => playLevel(lv));
      node.appendChild(btn); wrap.appendChild(node);
      if (lv === cur) { const av = document.createElement('div'); av.className = 'avatar'; av.textContent = getAvatar(); av.style.left = a[0] + '%'; av.style.top = a[1] + '%'; wrap.appendChild(av); }
    }
    sec.appendChild(wrap);
    sec.insertAdjacentHTML('beforeend',
      `<button class="wnav prev" id="wPrev"${w <= 0 ? ' disabled' : ''}>‹</button><button class="wnav next" id="wNext"${w >= worlds - 1 ? ' disabled' : ''}>›</button>`);
    list.appendChild(sec);
    const p = $('wPrev'), nx = $('wNext');
    if (p) p.addEventListener('click', () => { viewWorld--; buildMap(); });
    if (nx) nx.addEventListener('click', () => { viewWorld++; buildMap(); });
  }
  function setScreen(s) { document.body.classList.remove('on-menu', 'on-map', 'playing'); document.body.classList.add(s); }
  function playLevel(lv) {
    if (lifeState().lives <= 0) { toast('No lives left ❤️ — wait for a refill'); renderMeta(); return; }
    stopMetaTicker(); initAudio(); sfx.start(); playVoice('title', 1); startGameMusic(); level = lv;
    setScreen('playing'); $('menu').classList.add('hide'); $('map').classList.add('hide'); $('overlay').classList.add('hide'); startLevel();
  }
  function openMenu() {
    setScreen('on-menu'); renderProfile(); renderLeaderboard();
    $('map').classList.add('hide'); $('overlay').classList.add('hide'); $('settings').classList.add('hide'); $('account').classList.add('hide');
    $('menu').classList.remove('hide'); startMenuMusic(); startMetaTicker();
  }
  function openMap() {
    setScreen('on-map'); viewWorld = null; buildMap();
    $('menu').classList.add('hide'); $('overlay').classList.add('hide'); $('settings').classList.add('hide');
    $('map').classList.remove('hide'); startMenuMusic(); startMetaTicker();
  }
  function goHome() { deselect(); aiming = null; clearAim(); openMap(); }

  /* ---------- account + settings + leaderboard (local) ---------- */
  const AVATARS = ['🥟', '🍕', '🍩', '🌸', '⛵', '🧑‍🍳', '👩‍🍳', '🇲🇹', '🌟', '🐐'];
  const getPlayer = () => (localStorage.getItem('pc_player') || 'Player');
  const getAvatar = () => (localStorage.getItem('pc_avatar') || '🥟');
  const hasAccount = () => !!localStorage.getItem('pc_player');
  let pickAv = getAvatar();
  function openAccount() {
    pickAv = getAvatar(); $('accName').value = hasAccount() ? getPlayer() : '';
    const wrap = $('avatarPick'); wrap.innerHTML = AVATARS.map(a => `<button class="av${a === pickAv ? ' on' : ''}" data-a="${a}">${a}</button>`).join('');
    wrap.querySelectorAll('.av').forEach(b => b.addEventListener('click', () => { pickAv = b.dataset.a; wrap.querySelectorAll('.av').forEach(x => x.classList.toggle('on', x === b)); }));
    $('account').classList.remove('hide');
  }
  function saveAccount() {
    const name = ($('accName').value || 'Player').trim().slice(0, 12) || 'Player';
    localStorage.setItem('pc_player', name); localStorage.setItem('pc_avatar', pickAv);
    $('account').classList.add('hide'); renderProfile(); renderLeaderboard();
  }
  function renderProfile() {
    const p = $('profile'); if (!p) return;
    p.innerHTML = `<span class="pf-av">${getAvatar()}</span><span class="pf-name">${escapeHtml(getPlayer())}</span><span class="pf-best">🏆 ${best.toLocaleString()}</span>`;
  }
  function openSettings() { syncSettingsUI(); $('settings').classList.remove('hide'); }
  const SEED_SCORES = [{ name: 'Marija', score: 4200, av: '👩‍🍳' }, { name: 'Ġużeppi', score: 3600, av: '🧑‍🍳' }, { name: 'Chikku', score: 2900, av: '🐐' }, { name: 'Tereża', score: 2100, av: '🌟' }];
  function getScores() { try { const s = JSON.parse(localStorage.getItem('pc_scores') || 'null'); if (Array.isArray(s)) return s; } catch { } return SEED_SCORES.slice(); }
  function addScore(name, score, av) {
    const best = {}; for (const e of getScores()) if (!best[e.name] || e.score > best[e.name].score) best[e.name] = { score: e.score, av: e.av || '🥟' };
    if (!best[name] || score > best[name].score) best[name] = { score, av: av || '🥟' };
    const s = Object.keys(best).map(n => ({ name: n, score: best[n].score, av: best[n].av })).sort((a, b) => b.score - a.score).slice(0, 12);
    localStorage.setItem('pc_scores', JSON.stringify(s));
  }
  const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function renderLeaderboard() {
    const el = $('leaderList'); if (!el) return;
    const me = getPlayer(), s = getScores().slice(0, 8);
    el.innerHTML = s.map((e, i) => `<div class="lb-row${e.name === me ? ' me' : ''}"><span class="lb-rank">${i + 1}</span><span class="lb-av">${e.av || '🥟'}</span><span class="lb-name">${escapeHtml(e.name)}</span><span class="lb-score">${(e.score || 0).toLocaleString()}</span></div>`).join('') || '<div class="lb-empty">No scores yet — play to get on the board!</div>';
  }

  /* ---------- lives + coins meta ---------- */
  const MAX_LIVES = 5, LIFE_MS = 20 * 60 * 1000, START_COINS = 120;
  function lifeState() {
    let lives = localStorage.getItem('pc_lives'); lives = lives == null ? MAX_LIVES : +lives;
    let next = +(localStorage.getItem('pc_life_ts') || 0);
    if (lives < MAX_LIVES && next) {
      while (lives < MAX_LIVES && Date.now() >= next) { lives++; next += LIFE_MS; }
      if (lives >= MAX_LIVES) { lives = MAX_LIVES; next = 0; }
      localStorage.setItem('pc_lives', lives); localStorage.setItem('pc_life_ts', next || '');
    }
    return { lives, next };
  }
  function loseLife() {
    const { lives } = lifeState(); if (lives <= 0) return;
    if (lives === MAX_LIVES) localStorage.setItem('pc_life_ts', Date.now() + LIFE_MS);
    localStorage.setItem('pc_lives', lives - 1);
  }
  function getCoins() { const r = localStorage.getItem('pc_coins'); return r == null ? START_COINS : +r; }
  function setCoins(v) { localStorage.setItem('pc_coins', Math.max(0, Math.round(v))); updateCoinsUI(); }
  function addCoins(n) { setCoins(getCoins() + n); }
  function claimDaily() {
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem('pc_daily') === today) { toast('🎁 Already claimed — come back tomorrow!'); return; }
    localStorage.setItem('pc_daily', today); addCoins(75); if (navigator.vibrate) try { navigator.vibrate(30); } catch { }
    confettiRain(); toast('🎁 Daily bonus: +75 coins!');
  }
  function updateCoinsUI() { const c = getCoins(); const a = $('coinsNum'), b = $('gCoins'); if (a) a.textContent = c; if (b) b.textContent = c; updateBoosterUI(); }
  function updateBoosterUI() {
    const c = getCoins();
    document.querySelectorAll('.boost').forEach(bt => {
      const b = bt.dataset.b, own = invCount(b);
      bt.classList.toggle('cant', own <= 0 && c < BCOST[b]);
      const bc = bt.querySelector('.bc'); if (bc) { bc.textContent = own > 0 ? '×' + own : BCOST[b]; bc.classList.toggle('owned', own > 0); }
    });
  }
  function renderMeta() {
    const { lives, next } = lifeState();
    const ml = $('livesNum'); if (ml) ml.textContent = lives;
    const tt = $('metaTimer');
    if (tt) { if (lives >= MAX_LIVES || !next) tt.textContent = 'Lives full'; else { const s = Math.max(0, Math.ceil((next - Date.now()) / 1000)); tt.textContent = '❤️ +1 in ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); } }
    updateCoinsUI();
  }
  let metaTimer = null;
  function startMetaTicker() { renderMeta(); if (!metaTimer && !NOLOOP) metaTimer = setInterval(renderMeta, 1000); }
  function stopMetaTicker() { if (metaTimer) { clearInterval(metaTimer); metaTimer = null; } }

  /* ---------- boosters + power-up shop ---------- */
  const BCOST = { moves: 30, shuffle: 40, line: 50, colour: 60, area: 70 };
  const BOOST_META = {
    moves: { icon: '➕', name: '+5 Moves', desc: 'Five extra moves' },
    shuffle: { icon: '🔀', name: 'Shuffle', desc: 'Reshuffle the whole board' },
    line: { icon: '🚀', name: 'Kinnie Rocket', desc: 'Clears a full row + column' },
    colour: { icon: '🫧', name: 'Kinnie Splash', desc: 'Clears one whole colour' },
    area: { icon: '🎆', name: 'Festa Firework', desc: 'Blows up a 3×3 area' },
  };
  const getInv = () => { try { return JSON.parse(localStorage.getItem('pc_inv') || '{}'); } catch { return {}; } };
  const invCount = b => getInv()[b] || 0;
  function addInv(b, n) { const v = getInv(); v[b] = Math.max(0, (v[b] || 0) + n); localStorage.setItem('pc_inv', JSON.stringify(v)); }
  function payBooster(b) { if (invCount(b) > 0) { addInv(b, -1); updateBoosterUI(); return true; } if (getCoins() >= BCOST[b]) { setCoins(getCoins() - BCOST[b]); return true; } return false; }
  let aiming = null;
  function markAim() { board.classList.add('aim'); document.querySelectorAll('.boost').forEach(b => b.classList.toggle('on', b.dataset.b === aiming)); }
  function clearAim() { board.classList.remove('aim'); document.querySelectorAll('.boost').forEach(b => b.classList.remove('on')); }
  function useBooster(b) {
    if (busy) return;
    if (invCount(b) <= 0 && getCoins() < BCOST[b]) { toast('Get more in the 🛒 Shop'); return; }
    if (b === 'moves') { if (payBooster(b)) { moves += 5; updateHUD(); toast('➕ +5 moves!'); } return; }
    if (b === 'shuffle') { if (payBooster(b)) doShuffle(); return; }
    if (aiming === b) { aiming = null; clearAim(); return; }        // toggle off
    aiming = b; markAim(); toast('Tap a piece to use it');           // targeted — pay on apply
  }
  // ---- shop ----
  function openShop() { renderShop(); $('shop').classList.remove('hide'); }
  function buyBooster(b) { if (getCoins() < BCOST[b]) { toast('Not enough coins 🪙'); return; } setCoins(getCoins() - BCOST[b]); addInv(b, 1); renderShop(); updateBoosterUI(); toast(BOOST_META[b].name + ' bought! 🎉'); }
  function renderShop() {
    const sc = $('shopCoins'); if (sc) sc.textContent = getCoins();
    const today = new Date().toISOString().slice(0, 10), claimed = localStorage.getItem('pc_dealDay') === today, dd = $('dailyDeal');
    if (dd) {
      dd.innerHTML = `<div class="deal-tag">✨ Daily Deal</div><div class="deal-body"><span class="deal-ic">🎆</span> <b>Festa Firework</b> — <s>🪙${BCOST.area}</s> FREE!</div>` +
        (claimed ? `<button class="btn btn-ghost" disabled>Claimed ✓ — back tomorrow</button>` : `<button class="btn" id="claimDeal">🎁 Claim FREE</button>`);
      if (!claimed) $('claimDeal').addEventListener('click', () => { localStorage.setItem('pc_dealDay', today); addInv('area', 1); confettiRain(); renderShop(); updateBoosterUI(); toast('🎆 Festa Firework claimed!'); });
    }
    const sl = $('shopList');
    if (sl) {
      sl.innerHTML = Object.keys(BCOST).map(b => { const m = BOOST_META[b], own = invCount(b); return `<div class="shop-row"><span class="shop-ic">${m.icon}</span><span class="shop-info"><b>${m.name}</b><small>${m.desc}</small></span>${own ? `<span class="shop-own">×${own}</span>` : ''}<button class="shop-buy" data-b="${b}">🪙 ${BCOST[b]}</button></div>`; }).join('');
      sl.querySelectorAll('.shop-buy').forEach(bt => bt.addEventListener('click', () => buyBooster(bt.dataset.b)));
    }
  }
  async function applyBooster(t) {
    const b = aiming; aiming = null; clearAim();
    if (!t || t.type === ING) return;
    if (!payBooster(b)) return;
    busy = true; const set = new Set();
    if (b === 'line') { for (let c = 0; c < COLS; c++) if (grid[t.r][c]) set.add(grid[t.r][c]); for (let r = 0; r < ROWS; r++) if (grid[r][t.c]) set.add(grid[r][t.c]); comboText('KINNIE ROCKET!'); }
    else if (b === 'colour') { const ty = t.type; allTiles().forEach(u => { if (u.type === ty) set.add(u); }); comboText('KINNIE SPLASH!'); }
    else if (b === 'area') { for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const u = tileAt(t.r + dr, t.c + dc); if (u) set.add(u); } comboText('FESTA FIREWORK!'); }
    expandSpecials(set); sfx.special();
    await eliminate(set, set.size * 20, { chain: 2, shake: true, special: true });
    await resolve(); await deliverIngredients(); await ensurePlayable();
    busy = false; updateHUD(); checkEnd();
  }
  // is there any legal move left? (a special counts, or a swap that makes a line)
  function hasMove() {
    if (allTiles().some(t => t.special)) return true;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const t = grid[r][c]; if (!t || t.type === ING) continue;
      for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const u = tileAt(r + dr, c + dc); if (!u || u.type === ING) continue;
        [t.type, u.type] = [u.type, t.type]; const ok = findMatches().length > 0; [t.type, u.type] = [u.type, t.type];
        if (ok) return true;
      }
    }
    return false;
  }
  function scrambleTypes() {                       // reshuffle the movable pieces (no coins)
    const movable = allTiles().filter(t => !t.special && t.type !== ING);
    const types = movable.map(t => t.type);
    for (let att = 0; att < 40; att++) {
      for (let i = types.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[types[i], types[j]] = [types[j], types[i]]; }
      movable.forEach((t, i) => t.type = types[i]);
      if (findMatches().length === 0 && hasMove()) break;   // valid: no free match, but solvable
    }
    movable.forEach(t => { t.el.innerHTML = `<img class="ic" src="${TYPES[t.type].img}" alt="" draggable="false">`; });
  }
  // never soft-lock: if no move exists, auto-shuffle until one does
  async function ensurePlayable() {
    if (busy && aiming) return;
    let tries = 0;
    while (!hasMove() && tries++ < 12) { toast('No moves — shuffling! 🔀'); await sleep(220); scrambleTypes(); await sleep(160); await resolve(); }
  }
  async function doShuffle() {
    busy = true; scrambleTypes(); toast('🔀 Board shuffled'); await sleep(140);
    await resolve(); await deliverIngredients(); await ensurePlayable();
    busy = false; updateHUD(); checkEnd();
  }

  const forcedLevel = +new URLSearchParams(location.search).get('lvl') || 0;
  $('ovBtn').addEventListener('click', () => {
    initAudio();
    if (overlayAction === 'next') level++;
    else if (overlayAction === 'start') level = forcedLevel || 1;
    if (!forcedLevel && lifeState().lives <= 0) { toast('No lives left ❤️ — wait for a refill'); openMap(); return; }
    sfx.start(); startGameMusic(); startLevel();
  });
  $('ovMap').addEventListener('click', openMap);

  window.addEventListener('resize', layout);

  /* ---------- install prompt (iOS instructions / Android native) ---------- */
  let deferredPrompt = null;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const SHARE_SVG = "<svg class='shareico' width='15' height='17' viewBox='0 0 50 60' fill='none' stroke='#1f7ab5' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'><path d='M25 5 V37'/><path d='M14 16 L25 5 L36 16'/><path d='M12 26 H6 V54 H44 V26 H38'/></svg>";
  function showInstall(kind) {
    if (isStandalone() || localStorage.getItem('pc_noinstall') === '1') return;
    const el = $('install'), msg = $('installMsg'), btn = $('installBtn'); if (!el) return;
    el.classList.toggle('ios', kind === 'ios');
    if (kind === 'ios') { msg.innerHTML = "<b>Install Pastizzi Crush</b><br>1. Tap Share " + SHARE_SVG + "&nbsp; in the Safari bar<br>2. Choose <b>“Add to Home Screen”</b>"; btn.style.display = 'none'; }
    else { msg.innerHTML = "<b>Install Pastizzi Crush</b><br>Add it to your home screen"; btn.style.display = ''; }
    el.classList.remove('hide');
  }
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; showInstall('android'); });

  // Unlock + warm up audio on the very first interaction anywhere (mobile autoplay policies)
  function unlockAudio() { initAudio(); if (musicOn && onMenu()) startMenuMusic(); }
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio, { passive: true });

  document.addEventListener('DOMContentLoaded', () => {
    $('best').textContent = best.toLocaleString();
    document.querySelectorAll('.boost').forEach(bt => bt.addEventListener('click', () => useBooster(bt.dataset.b)));
    const hb = $('home'); if (hb) hb.addEventListener('click', goHome);
    $('mapPlay').addEventListener('click', () => playLevel(Math.min(getUnlocked(), MAXLEVELS)));
    $('menuPlay').addEventListener('click', openMap);
    $('mapBack').addEventListener('click', openMenu);
    // swipe left/right to change world on the map
    let mapDown = null;
    $('map').addEventListener('pointerdown', e => { mapDown = { x: e.clientX, y: e.clientY }; });
    $('map').addEventListener('pointerup', e => {
      if (!mapDown) return; const dx = e.clientX - mapDown.x, dy = e.clientY - mapDown.y; mapDown = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        const worlds = Math.ceil(MAXLEVELS / WORLD_SIZE), nw = viewWorld + (dx < 0 ? 1 : -1);
        if (nw >= 0 && nw < worlds) { viewWorld = nw; buildMap(); }
      }
    });
    $('btnShop').addEventListener('click', openShop);
    $('shopClose').addEventListener('click', () => $('shop').classList.add('hide'));
    $('btnDaily').addEventListener('click', claimDaily);
    // settings panel
    $('gear').addEventListener('click', openSettings);
    $('setClose').addEventListener('click', () => $('settings').classList.add('hide'));
    $('setMusic').addEventListener('click', () => setMusic(!musicOn));
    $('setSfx').addEventListener('click', () => setSfx(!sfxOn));
    $('setHome').addEventListener('click', () => { $('settings').classList.add('hide'); goHome(); });
    $('setAccount').addEventListener('click', () => { $('settings').classList.add('hide'); openAccount(); });
    // account panel
    $('accSave').addEventListener('click', saveAccount);
    $('profile').addEventListener('click', openAccount);
    if (!hasAccount() && !forcedLevel) setTimeout(() => { if (!isIOS() || isStandalone()) openAccount(); }, 400); // first-run create account
    renderProfile();
    syncSettingsUI();
    renderMeta();
    const ib = $('installBtn'), ix = $('installX');
    if (ib) ib.addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('install').classList.add('hide'); });
    if (ix) ix.addEventListener('click', () => { $('install').classList.add('hide'); localStorage.setItem('pc_noinstall', '1'); });
    if ('serviceWorker' in navigator && !NOLOOP) navigator.serviceWorker.register('sw.js').catch(() => {});
    // On iPhone Safari you must add the app to your home screen before you can play
    if (isIOS() && !isStandalone() && !forcedLevel) {
      $('iosgateMsg').innerHTML = "To play, add Pastizzi Crush to your home screen:<br>1. Tap <b>Share</b> " + SHARE_SVG + "<br>2. Choose <b>“Add to Home Screen”</b><br>3. Open it from your home screen 🥟";
      $('map').classList.add('hide'); $('overlay').classList.add('hide');
      $('iosgate').classList.remove('hide');
      return; // block the map/game until installed
    }
    buildMap();
    if (forcedLevel) playLevel(forcedLevel); else openMenu();   // start on the main menu
  });
})();
