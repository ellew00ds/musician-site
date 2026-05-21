/**
 * Sterling Steffen — main.js
 *
 * All interactive behavior: text scramble, audio easter eggs, ripple
 * animations, ASCII art flash, and cursor trail.
 *
 * ── EGG SPOTS ───────────────────────────────────────────────────────────────
 *   #egg-name    → click the artist name          → "Drift"   (ambient arpeggio)
 *   #egg-rule    → click the thin rule            → "Chord"   (Am9 sustained)
 *   #egg-dot     → click the "·" in Austin · TX  → "Ping"    (crystal sequence)
 *   #egg-fstar   → click the ✦ in the footer     → "Bell"    (resonant bell)
 *   #egg-corner  → click the ○ in the corner     → "Kick"    (four-on-the-floor)
 *   #egg-top     → click top-left (invisible)    → "Static"  (filtered noise)
 *   .booking-cta → triple-click                  → "Arp"     (fast pentatonic)
 *   Spacebar     → press while nothing is focused → random tune
 */


// ── TIME-OF-DAY WARMTH SHIFT ──────────────────────────────────────────────────
// Night (9 pm–5 am): cooler blue-grey. Afternoon (11 am–4 pm): warmer amber.
(function () {
  const h = new Date().getHours();
  if (h >= 21 || h < 5)       document.documentElement.style.setProperty('--color-bg', '#0a0b0e');
  else if (h >= 11 && h < 16) document.documentElement.style.setProperty('--color-bg', '#0e0c08');
}());


// ── UTILS ────────────────────────────────────────────────────────────────────

/** Returns the lazy-initialized AudioContext, resuming if suspended. */
let audioCtx = null;
function ctx() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/** Tracks how many eggs are currently playing. Controls the grain boost. */
let activeTuneCount = 0;
function setAudioActive(delta) {
  activeTuneCount = Math.max(0, activeTuneCount + delta);
  document.body.classList.toggle('audio-active', activeTuneCount > 0);
}


// ── TEXT SCRAMBLE ─────────────────────────────────────────────────────────────
/*
 * Letters cycle through random characters then lock into the final text.
 * Used for the artist family name "Steffen" on load + glitch re-scrambles.
 *
 * Works with gradient text (background-clip: text) because we're changing
 * textContent — the gradient simply renders on whatever characters are there.
 */
// Lowercase + soft punctuation — feels more typographic, less harsh than caps/symbols
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz·—–~·';

/**
 * Scrambles el's text toward finalText. Letters lock in one by one (left→right).
 * Returns a Promise that resolves when fully decoded.
 * @param {HTMLElement} el
 * @param {string} finalText
 * @param {{ frameMs?: number, lockDelayMs?: number }} opts
 */
function scrambleTo(el, finalText, { frameMs = 40, lockDelayMs = 85 } = {}) {
  const letters = finalText.split('');
  const lockFrame = letters.map((_, i) => Math.ceil((i * lockDelayMs) / frameMs));
  const totalFrames = lockFrame[letters.length - 1] + 6;
  let frame = 0;

  return new Promise(resolve => {
    const tick = setInterval(() => {
      el.textContent = letters.map((char, i) => {
        if (char === ' ') return ' ';
        if (frame >= lockFrame[i]) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join('');

      if (++frame > totalFrames) {
        clearInterval(tick);
        el.textContent = finalText;
        resolve();
      }
    }, frameMs);
  });
}

// ── NAME SCRAMBLE SETUP ───────────────────────────────────────────────────────
const nameEl     = document.querySelector('.artist-name__given');
const FINAL_NAME = 'Sterling';

// Defined at module scope so resize handler can call it too
function scheduleReScramble() {
  if (!nameEl) return;
  scrambleTo(nameEl, FINAL_NAME, { frameMs: 30, lockDelayMs: 38 });
  nameEl.animate([
    { filter: 'drop-shadow(0 0 48px rgba(240,220,180,0.07))' },
    { filter: 'drop-shadow(0 0 40px rgba(240,220,180,0.12)) drop-shadow(-2.5px 0 rgba(255,140,30,0.45)) drop-shadow(2.5px 0 rgba(0,210,255,0.45))' },
    { filter: 'drop-shadow(0 0 48px rgba(240,220,180,0.07)) drop-shadow(1.5px 0 rgba(255,140,30,0.3)) drop-shadow(-1.5px 0 rgba(0,210,255,0.3))', transform: 'translateX(-1px) skewX(-0.2deg)' },
    { filter: 'drop-shadow(0 0 48px rgba(240,220,180,0.07))', transform: 'none' },
    { filter: 'drop-shadow(0 0 48px rgba(240,220,180,0.07)) drop-shadow(-0.5px 0 rgba(255,140,30,0.18)) drop-shadow(0.5px 0 rgba(0,210,255,0.18))' },
    { filter: 'drop-shadow(0 0 48px rgba(240,220,180,0.07))' },
  ], { duration: 520, easing: 'linear' });
}

if (nameEl) {
  // Set scrambled state immediately so the blur-fade reveals soft random chars
  nameEl.textContent = FINAL_NAME
    .split('')
    .map(() => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])
    .join('');

  // Decode during the fade-in animation (starts at 0.18s, ends at ~1.5s)
  setTimeout(() => scrambleTo(nameEl, FINAL_NAME, { frameMs: 38, lockDelayMs: 80 }), 350);

  setTimeout(() => {
    scheduleReScramble();
    setInterval(scheduleReScramble, 17000);
  }, 13000);
}


// ── WEB AUDIO TUNES ──────────────────────────────────────────────────────────
/*
 * Each function plays a distinct procedural tune and returns a stop() function.
 * onEnd callback fires when the tune finishes naturally.
 *
 * To replace with Bandcamp embeds: swap a function body with one that sets
 * an off-screen iframe's src to a Bandcamp embed URL (see README).
 */

/** "Drift" — slow ambient arpeggio in A minor. Spacious, hypnotic. */
function playDrift(onEnd) {
  const c = ctx();
  const notes = [110, 165, 220, 261, 330]; // A2 E3 A3 C4 E4
  const TOTAL = 6.5;
  const master = c.createGain();
  master.gain.setValueAtTime(0.18, c.currentTime);
  master.connect(c.destination);

  const oscs = notes.map((freq, i) => {
    const osc = c.createOscillator(), gain = c.createGain();
    const t = c.currentTime + i * 0.3;
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.5 + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.1, c.currentTime + 4.5);
    gain.gain.linearRampToValueAtTime(0, c.currentTime + TOTAL);
    osc.connect(gain); gain.connect(master);
    osc.start(t); osc.stop(c.currentTime + TOTAL + 0.1);
    return osc;
  });

  oscs[oscs.length - 1].onended = onEnd;
  return () => {
    master.gain.linearRampToValueAtTime(0, c.currentTime + 0.25);
    oscs.forEach(o => { try { o.stop(c.currentTime + 0.3); } catch (_) {} });
  };
}

/** "Ping" — crystal triangle-wave sequence. Bright, glassy, quick. */
function playPing(onEnd) {
  const c = ctx();
  const notes = [880, 1108, 1320, 880, 659, 880]; // A5 C#6 E6 A5 E5 A5
  const master = c.createGain();
  master.connect(c.destination);

  const oscs = notes.map((freq, i) => {
    const osc = c.createOscillator(), gain = c.createGain();
    const t = c.currentTime + i * 0.22;
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(gain); gain.connect(master);
    osc.start(t); osc.stop(t + 0.5);
    return osc;
  });

  oscs[oscs.length - 1].onended = onEnd;
  return () => oscs.forEach(o => { try { o.stop(c.currentTime); } catch (_) {} });
}

/** "Kick" — four-on-the-floor kick drum + sawtooth bass. 120 BPM, 4 bars. */
function playKick(onEnd) {
  const c = ctx();
  const BEAT = 0.5, BARS = 8;
  const bassNotes = [55, 55, 82, 55, 55, 55, 65, 55]; // A1 A1 E2 A1 A1 A1 C2 A1
  const sources = [];

  for (let i = 0; i < BARS; i++) {
    const t = c.currentTime + i * BEAT;

    // Kick: sine sweep 180Hz → 40Hz
    const kick = c.createOscillator(), kg = c.createGain();
    kick.type = 'sine';
    kick.frequency.setValueAtTime(180, t);
    kick.frequency.exponentialRampToValueAtTime(40, t + 0.18);
    kg.gain.setValueAtTime(0.75, t);
    kg.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    kick.connect(kg); kg.connect(c.destination);
    kick.start(t); kick.stop(t + 0.3);
    sources.push(kick);

    // Bass: sawtooth melody
    const bass = c.createOscillator(), bg = c.createGain();
    bass.type = 'sawtooth';
    bass.frequency.value = bassNotes[i];
    bg.gain.setValueAtTime(0.07, t);
    bg.gain.linearRampToValueAtTime(0, t + BEAT - 0.05);
    bass.connect(bg); bg.connect(c.destination);
    bass.start(t); bass.stop(t + BEAT);
    sources.push(bass);
  }

  setTimeout(onEnd, (BARS * BEAT + 0.4) * 1000);
  return () => sources.forEach(o => { try { o.stop(c.currentTime); } catch (_) {} });
}

/** "Static" — bandpass-filtered white noise burst. Eerie, textural. */
function playStatic(onEnd) {
  const c = ctx();
  const DURATION = 2.5;
  const buf = c.createBuffer(1, c.sampleRate * DURATION, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const src    = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const gain   = c.createGain();

  src.buffer       = buf;
  filter.type      = 'bandpass';
  filter.frequency.value = 900;
  filter.Q.value   = 0.7;

  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.11, c.currentTime + 0.12);
  gain.gain.linearRampToValueAtTime(0.07, c.currentTime + 1.8);
  gain.gain.linearRampToValueAtTime(0, c.currentTime + DURATION);

  src.connect(filter); filter.connect(gain); gain.connect(c.destination);
  src.start();
  src.onended = onEnd;
  return () => { try { src.stop(); } catch (_) {} };
}

/** "Chord" — sustained Am9 chord, notes staggered in. Lush, spacious. */
function playChord(onEnd) {
  const c = ctx();
  const notes = [110, 165, 196, 247, 294]; // Am9: A2 E3 G3 B3 D4
  const TOTAL = 5.5;
  const master = c.createGain();
  master.gain.setValueAtTime(0.14, c.currentTime);
  master.connect(c.destination);

  const oscs = notes.map((freq, i) => {
    const osc = c.createOscillator(), gain = c.createGain();
    const t = c.currentTime + i * 0.09;
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.35);
    gain.gain.linearRampToValueAtTime(0.1, c.currentTime + 3.8);
    gain.gain.linearRampToValueAtTime(0, c.currentTime + TOTAL);
    osc.connect(gain); gain.connect(master);
    osc.start(t); osc.stop(c.currentTime + TOTAL + 0.1);
    return osc;
  });

  oscs[oscs.length - 1].onended = onEnd;
  return () => {
    master.gain.linearRampToValueAtTime(0, c.currentTime + 0.3);
    oscs.forEach(o => { try { o.stop(c.currentTime + 0.35); } catch (_) {} });
  };
}

/** "Bell" — deep resonant bell tone (A2 + overtones). Slow, meditative decay. */
function playBell(onEnd) {
  const c = ctx();
  const partials = [220, 440, 659, 880]; // A3 A4 E5 A5 — natural harmonic series
  const TOTAL = 5.0;
  const master = c.createGain();
  master.gain.setValueAtTime(0.15, c.currentTime);
  master.connect(c.destination);

  const oscs = partials.map((freq, i) => {
    const osc = c.createOscillator(), gain = c.createGain();
    osc.type = i === 0 ? 'sine' : 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.18 / (i + 1), c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + TOTAL - i * 0.3);
    osc.connect(gain); gain.connect(master);
    osc.start(c.currentTime); osc.stop(c.currentTime + TOTAL + 0.1);
    return osc;
  });

  oscs[0].onended = onEnd;
  return () => {
    master.gain.linearRampToValueAtTime(0, c.currentTime + 0.3);
    oscs.forEach(o => { try { o.stop(c.currentTime + 0.35); } catch (_) {} });
  };
}

/** "Arp" — fast minor-pentatonic arpeggio. Random notes, sawtooth, slightly detuned. */
function playArp(onEnd) {
  const c = ctx();
  const scale = [220, 261, 293, 329, 392, 440, 523, 659, 784]; // A minor pentatonic across 3 octaves
  const STEP = 0.11, COUNT = 14;
  const oscs = [];

  for (let i = 0; i < COUNT; i++) {
    const osc  = c.createOscillator(), gain = c.createGain();
    const t    = c.currentTime + i * STEP;
    const freq = scale[Math.floor(Math.random() * scale.length)];
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 12; // ±6 cents
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t); osc.stop(t + 0.18);
    oscs.push(osc);
  }

  oscs[oscs.length - 1].onended = onEnd;
  return () => oscs.forEach(o => { try { o.stop(c.currentTime); } catch (_) {} });
}


// ── RIPPLE / SPLASH ANIMATION ─────────────────────────────────────────────────
/*
 * Spawns concentric rings at (x, y) using the Web Animations API.
 * 'expand' = rings grow outward (on play).
 * 'collapse' = rings implode (on stop).
 * Colors match the glitch palette: white / cyan / red.
 */
const RINGS_EXPAND = [
  { size: 28,  ms: 580, delay: 0,  color: 'rgba(255, 255, 255, 0.55)' },
  { size: 52,  ms: 880, delay: 50, color: 'rgba(0,   210, 255, 0.28)' },
  { size: 18,  ms: 420, delay: 25, color: 'rgba(255, 140, 30,  0.28)' },
];
const RINGS_COLLAPSE = [
  { size: 70,  ms: 450, delay: 0,  color: 'rgba(255, 255, 255, 0.38)' },
  { size: 44,  ms: 360, delay: 35, color: 'rgba(0,   210, 255, 0.20)' },
];

function spawnRipple(x, y, type = 'expand') {
  (type === 'expand' ? RINGS_EXPAND : RINGS_COLLAPSE).forEach(({ size, ms, delay, color }) => {
    const el = document.createElement('div');
    el.className = 'ripple';
    Object.assign(el.style, {
      left: `${x}px`, top: `${y}px`,
      width: `${size}px`, height: `${size}px`,
      border: `1px solid ${color}`,
    });
    document.body.appendChild(el);

    const anim = el.animate(
      type === 'expand'
        ? [{ transform: 'translate(-50%,-50%) scale(0.1)', opacity: 1 },
           { transform: 'translate(-50%,-50%) scale(9)',   opacity: 0 }]
        : [{ transform: 'translate(-50%,-50%) scale(5)',   opacity: 0.8 },
           { transform: 'translate(-50%,-50%) scale(0)',   opacity: 0 }],
      { duration: ms, delay, easing: type === 'expand' ? 'ease-out' : 'ease-in', fill: 'forwards' }
    );
    anim.onfinish = () => el.remove();
  });
}


// ── EGG SPOT SETUP ───────────────────────────────────────────────────────────
/*
 * setupEgg wires up a button element to a tune function.
 * Independent state: each spot can play simultaneously.
 */
function setupEgg(id, tune) {
  const el = document.getElementById(id);
  if (!el) return;
  let stopFn = null, playing = false;

  el.addEventListener('click', e => {
    const { clientX: x, clientY: y } = e;
    if (playing) {
      stopFn?.();
      stopFn = null; playing = false;
      el.classList.remove('is-active');
      setAudioActive(-1);
      spawnRipple(x, y, 'collapse');
    } else {
      playing = true;
      el.classList.add('is-active');
      setAudioActive(1);
      spawnRipple(x, y, 'expand');
      stopFn = tune(() => {
        playing = false; stopFn = null;
        el.classList.remove('is-active');
        setAudioActive(-1);
      });
    }
  });
}

// egg-name: click → Drift. Hold 1.8s → all 7 tunes at once.
// Custom handler so hold and click don't conflict.
(function () {
  const el = document.getElementById('egg-name');
  if (!el) return;

  let stopFn = null, playing = false;
  let holdTimer = null, holdFired = false;

  function clearHold() {
    clearTimeout(holdTimer);
    holdTimer = null;
    el.style.transition = 'box-shadow 0.25s ease';
    el.style.boxShadow = '';
  }

  function startHold(x, y) {
    holdFired = false;
    // Glow builds linearly over the hold duration as a loading indicator
    el.style.transition = 'box-shadow 1.8s linear';
    el.style.boxShadow = '0 0 140px rgba(240, 220, 180, 0.28)';

    holdTimer = setTimeout(() => {
      holdFired = true;
      el.style.transition = 'box-shadow 0.1s ease';
      el.style.boxShadow = '0 0 200px rgba(240, 220, 180, 0.5)';

      ALL_TUNES.forEach(tune => {
        setAudioActive(1);
        tune(() => setAudioActive(-1));
      });
      [0, 120, 240, 360].forEach(d =>
        setTimeout(() => spawnRipple(x, y, 'expand'), d)
      );

      setTimeout(() => {
        el.style.transition = 'box-shadow 1.2s ease';
        el.style.boxShadow = '';
      }, 300);
    }, 1800);
  }

  el.addEventListener('mousedown',  e => startHold(e.clientX, e.clientY));
  el.addEventListener('mouseup',    clearHold);
  el.addEventListener('mouseleave', clearHold);
  el.addEventListener('touchstart', e => {
    const t = e.touches[0];
    startHold(t.clientX, t.clientY);
  }, { passive: true });
  el.addEventListener('touchend',   clearHold);
  el.addEventListener('touchcancel', clearHold);

  el.addEventListener('click', e => {
    if (holdFired) { holdFired = false; return; } // swallow click after hold

    const { clientX: x, clientY: y } = e;
    if (playing) {
      stopFn?.();
      stopFn = null; playing = false;
      el.classList.remove('is-active');
      setAudioActive(-1);
      spawnRipple(x, y, 'collapse');
    } else {
      playing = true;
      el.classList.add('is-active');
      setAudioActive(1);
      spawnRipple(x, y, 'expand');
      stopFn = playDrift(() => {
        playing = false; stopFn = null;
        el.classList.remove('is-active');
        setAudioActive(-1);
      });
    }
  });
}());

setupEgg('egg-dot',    playPing);
setupEgg('egg-corner', playKick);
setupEgg('egg-top',    playStatic);
setupEgg('egg-rule',   playChord);
setupEgg('egg-fstar',  playBell);


// ── TRIPLE-CLICK BOOKING BUTTON ───────────────────────────────────────────────
/*
 * Clicking the booking CTA three times within 500ms plays the Arp tune
 * instead of navigating. A secret for the attentive.
 */
const bookingEl = document.querySelector('.booking-cta');
if (bookingEl) {
  let clickCount = 0, resetTimer = null;

  bookingEl.addEventListener('click', e => {
    clickCount++;
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { clickCount = 0; }, 500);

    if (clickCount >= 3) {
      clickCount = 0;
      clearTimeout(resetTimer);
      e.preventDefault(); // prevent link navigation on triple-click
      setAudioActive(1);
      spawnRipple(e.clientX, e.clientY, 'expand');
      playArp(() => setAudioActive(-1));
    }
  });
}


// ── SPACEBAR EASTER EGG ───────────────────────────────────────────────────────
/*
 * Pressing Space (while not focused on an interactive element) plays a random
 * tune from the full set. Ripple fires from the center of the screen.
 */
const ALL_TUNES = [playDrift, playPing, playKick, playStatic, playArp, playChord, playBell];

document.addEventListener('keydown', e => {
  if (e.code !== 'Space') return;
  const tag = document.activeElement?.tagName;
  if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') return;
  e.preventDefault();

  const tune = ALL_TUNES[Math.floor(Math.random() * ALL_TUNES.length)];
  setAudioActive(1);
  spawnRipple(window.innerWidth / 2, window.innerHeight / 2, 'expand');
  tune(() => setAudioActive(-1));
});


// ── ASCII ART FLASH ───────────────────────────────────────────────────────────
/*
 * Every 18–24 seconds, a brief piece of ASCII art fades in at a random
 * position, stays for ~1.8 seconds, then fades out.
 * Opacity is ~11% — subtle, like a visual artifact.
 *
 * showASCII() — trigger a single flash (no reschedule; safe to call anytime)
 * flashASCII() — show + schedule the next one
 */
const ASCII_POOL = [
  // Halfwidth katakana cascade — sparse, Matrix reference
  'ｼﾅﾓﾆｻﾜﾂｵﾘｱﾑﾐｷｳｸｺｿｶ\nｻﾜﾂｵﾘｱﾑｰｳｼﾐﾋｷｻﾜｵﾘｱ',

  // Katakana + digits interleaved — two lines
  'ｷ2ｼ8ｵ4ﾊ7ﾐ1ｷ5ｼ9ｵ3ﾊ6\n8ﾐ2ｷ7ｼ4ｵ1ﾊ5ﾐ9ｷ3ｼ6ｵ',

  // Disco ball — light scattered across the floor
  '  * · * · * · *\n  ·  ( · o · )  ·\n  * · * · * · *\n      disco      ',

  // Champagne — celebration
  '    °  ·  °  · °\n  |  cheers  !!  |\n  |  ~~~~~~~~   |\n   \\___________/',

  // FFT frequency analysis — live spectrum snapshot
  'fft  t=2.341s\nA2  ████████████  -12\nE3  ████░░░░░░░░  -24\nA3  ██████░░░░░░  -19\nC4  ███░░░░░░░░░  -28',

  // ADSR envelope — the shape of every synthesised note
  'attack  decay  sustain\n      /\\\n     /  \\______\n    /          \\___\n    A    D    S   R',

  // VU meter — stereo level display
  'L  ▓▓▓▓▓▓▓▓▓░░  -4dBFS\nR  ▓▓▓▓▓▓▓░░░░  -8dBFS\n─────────────────────\npeak  -0.3dBFS  OK   ',

  // MIDI note dump — NoteOn events, hex velocity + timestamp
  'note_on  A3  v82  t+0.000\nnote_on  E4  v61  t+0.480\nnote_on  G4  v74  t+0.720\nnote_on  A4  v58  t+1.200',

  // Music notes — free-floating constellation
  '  ♩   ♪   ♫   ♬  \n    ♬   ♩   ♪    \n  ♪   ♫   ♬   ♩  ',

  // First dance cue — the wedding moment
  ' ♩  first dance  ♩\n    A min · 88 BPM\n     here we go   ',

  // Waveform amplitude bars — like a DAW region view
  '▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆\n▁▃▅▇█▇▅▃▁▃▅▇█▇▅▃▁▃▅▇\n▂▄▆█▆▄▂▄▆█▆▄▂▄▆█▆▄▂▄',

  // Camelot wheel — harmonic key compatibility (DJ mixing shorthand)
  'key  8A  ←→  9A  ←→  7A\nA min  F maj  D min\nmix  harmonic  ✓     ',

  // Alto sax fingerings — ● = pressed, ○ = open. Left hand ─ right hand.
  'patch.sax_01\ninst  alto.sax\nnote  A4  440Hz\nkeys  ●●○  ─  ●●○  ',
  'patch.sax_02\ninst  alto.sax\nnote  G4  392Hz\nkeys  ●●●  ─  ●●○  ',
  'patch.sax_03\ninst  alto.sax\nnote  F4  349Hz\nkeys  ●●●  ─  ●●●  ',
  'patch.sax_04\ninst  alto.sax  oct ●\nnote  D5  587Hz\nkeys  ●○○  ─  ○○○  ',
  'patch.sax_05\ninst  alto.sax\nnote  Bb4  466Hz\nkeys  ●bis●  ─  ○○○  ',

  // DJ set marker — Rekordbox/Serato style cue log
  '@ 00:32:14  120.0 BPM\nkey  A minor  (8A)\ntrk  sterling_live_v3\nbar  016  beat  001',

  // Dance floor — room energy read
  '[ floor   full   ✓ ]\n  ●●●●●●●●●●●    \n  energy ████████  ',

  // Pitch detection — chromatic tuner readout
  'A4  440.0 Hz  in tune\n+0.1 ct  ████████●░\nref  440  ♩ = 120    ',

  // Crossfader / EQ channel strip
  'ch A  ────────●────  +2\nhi  ●  mid  ●  lo  ○\ncue  on  fader  78%  ',

  // Waveform overview — long-form track analysis
  'overview  t=00:00 → 06:30\n▁▁▂▃▅▇█▇▅▄▃▄▅▇█▆▄▃▂▁\nenergy  ▲ peak  02:14  ',

  // Sparkle burst — confetti / fireworks
  '  ✦  *  ✦  *  ✦  \n  *     ✦     *  \n  ✦  *  ✦  *  ✦  ',

  // Go time — the countdown
  '  3  ·  2  ·  1  \n ♩  ♪  ♫  ♬  ♩  \n   go  time  !!  ',

  // ── Non-sequiturs — same opacity as DSP readouts, pure personality
  'wrong reverb.\nstill ok.             ',

  'the sax was right\nall along.            ',

  'lost the set list.\nimprovised.           ',

  'the drummer was right\nabout the reverb.     ',
];

function showASCII() {
  const el = document.getElementById('ascii-flash');
  if (!el) return;

  el.textContent = ASCII_POOL[Math.floor(Math.random() * ASCII_POOL.length)];
  // Tighter range keeps large multi-line blocks away from viewport edges
  el.style.top   = `${28 + Math.random() * 44}%`;
  el.style.left  = `${25 + Math.random() * 50}%`;

  // Force reflow to restart animation cleanly
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = 'ascii-in-out 2.6s ease-in-out forwards';
}

function flashASCII() {
  showASCII();
  // Schedule next flash: 18–24 seconds (randomised to avoid predictability)
  setTimeout(flashASCII, 18000 + Math.random() * 6000);
}

// First flash fires after 20–26 seconds
setTimeout(flashASCII, 20000 + Math.random() * 6000);


// ── RESIZE GLITCH ─────────────────────────────────────────────────────────────
/*
 * Glitch fires DURING resize drag, not after.
 * - First event of each drag: name scrambles once
 * - Every 120ms of continuous resize: body filter pulse
 * - 200ms after last event (drag end): ASCII art fires
 */
let resizeEndTimer    = null;
let lastResizeGlitch  = 0;
let resizeStarted     = false;

window.addEventListener('resize', () => {
  const now = Date.now();

  if (!resizeStarted) {
    resizeStarted = true;
    scheduleReScramble();
  }

  if (now - lastResizeGlitch > 120) {
    lastResizeGlitch = now;
    document.body.animate(
      [
        { filter: 'brightness(1.06) hue-rotate(4deg) saturate(1.3)' },
        { filter: 'none' },
        { filter: 'brightness(0.93) contrast(1.08) hue-rotate(-3deg)' },
        { filter: 'none' },
      ],
      { duration: 160, easing: 'linear' }
    );
  }

  clearTimeout(resizeEndTimer);
  resizeEndTimer = setTimeout(() => {
    resizeStarted    = false;
    lastResizeGlitch = 0;
    showASCII();
  }, 200);
});


// ── CURSOR TRAIL — SINE WAVE ──────────────────────────────────────────────────
/*
 * Each dot is offset vertically by sin(phase), so continuous motion traces
 * a waveform — like drawing audio on screen. Amplitude 8px, ~0.45 rad/dot.
 * Evokes oscilloscope traces and the feel of live audio signal.
 */
if (window.matchMedia('(pointer: fine)').matches) {
  let lastX = 0, lastY = 0;
  let wavePhase = 0;
  const MIN_DIST  = 4;    // tighter spacing for a smoother wave
  const WAVE_AMP  = 8;    // px — vertical oscillation
  const WAVE_STEP = 0.45; // radians per dot

  document.addEventListener('mousemove', e => {
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) return;

    const angle = Math.atan2(dy, dx); // travel direction for dash rotation
    lastX = e.clientX;
    lastY = e.clientY;

    wavePhase += WAVE_STEP;
    const yOffset = Math.sin(wavePhase) * WAVE_AMP;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.style.left = `${e.clientX}px`;
    dot.style.top  = `${e.clientY + yOffset}px`;
    dot.style.setProperty('--dot-angle', `${angle}rad`);
    document.body.appendChild(dot);

    requestAnimationFrame(() => dot.classList.add('cursor-dot--fade'));
    setTimeout(() => dot.remove(), 500);
  });
}


// ── DEPTH PARALLAX + CURSOR SPOTLIGHT ────────────────────────────────────────
/*
 * Parallax: three layers at different depths.
 *   .artist-anchor (Sterling + egg overlay)  → foreground, follows cursor
 *   .artist-name__family (STEFFEN label)     → background, drifts opposite
 *   .tag (Austin · TX)                       → midground, follows gently
 *
 * The CSS `translate` property (Level 2) is used instead of `transform` so it
 * composes cleanly with the CSS animation `transform` on child elements — no
 * conflict with nameReveal, fadeUp, or tag-glitch animations.
 *
 * Net visual positions (cursor at full right, nx = 1):
 *   Sterling:  anchor translates +5px  (foreground — floats toward viewer)
 *   STEFFEN:   anchor +5px + family −8px = −3px  (recedes away)
 *   Tag:       +2px  (between the two)
 *
 * Spotlight: a soft 380px radial gradient that trails the cursor at low opacity,
 * like a stage light sweeping a dark floor.
 */
if (window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

  const anchorEl  = document.querySelector('.artist-anchor');
  const familyEl  = document.querySelector('.artist-name__family');
  const tagEl     = document.querySelector('.tag');
  const spotlight = document.querySelector('.spotlight');

  let pendingFrame = false;
  let nx = 0, ny = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    nx = (cx / window.innerWidth  - 0.5) * 2;  // −1..1 from center
    ny = (cy / window.innerHeight - 0.5) * 2;

    // Reveal spotlight on first move (classList change is sync, fine outside rAF)
    if (spotlight && !document.body.classList.contains('has-spotlight')) {
      document.body.classList.add('has-spotlight');
    }

    if (!pendingFrame) {
      pendingFrame = true;
      requestAnimationFrame(() => {
        if (anchorEl)  anchorEl.style.translate = `${nx * 5}px ${ny * 2.5}px`;
        if (familyEl)  familyEl.style.translate = `${-nx * 8}px ${-ny * 3}px`;
        if (tagEl)     tagEl.style.translate    = `${nx * 2}px ${ny * 1}px`;
        if (spotlight) {
          spotlight.style.setProperty('--spot-x', `${cx}px`);
          spotlight.style.setProperty('--spot-y', `${cy}px`);
        }
        pendingFrame = false;
      });
    }
  });
}


// ── KONAMI HINT MODE ──────────────────────────────────────────────────────────
/*
 * After 30 seconds of idle time (no mouse, key, touch, or scroll), all egg
 * spots briefly surface to ~30% opacity for 1.1s — one whisper that secrets
 * exist, then they vanish. Resets on any user activity.
 *
 * Named "Konami hint" because it rewards the patient: the hint only appears
 * if you leave the page completely alone, which is itself a kind of stillness.
 */
const HINT_IDLE_MS = 30000;
const HINT_SHOW_MS = 1100;
const EGG_IDS = ['egg-name', 'egg-dot', 'egg-corner', 'egg-top', 'egg-rule', 'egg-fstar'];

let hintIdleTimer = null;

function fireHint() {
  const eggs = EGG_IDS.map(id => document.getElementById(id)).filter(Boolean);
  eggs.forEach(el => el.classList.add('egg--hint'));
  setTimeout(() => eggs.forEach(el => el.classList.remove('egg--hint')), HINT_SHOW_MS);
}

function resetHintTimer() {
  clearTimeout(hintIdleTimer);
  hintIdleTimer = setTimeout(fireHint, HINT_IDLE_MS);
}

['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(evt => {
  document.addEventListener(evt, resetHintTimer, { passive: true });
});

resetHintTimer();


// ── TITLE DRIFT ───────────────────────────────────────────────────────────────
/*
 * After 90 seconds of inactivity the page title quietly swaps to a non-sequitur,
 * then reverts after 3.5 seconds. Only visible in a background tab — a small
 * reward for people who leave the page running.
 */
const ORIGINAL_TITLE = document.title;
const DRIFT_TITLES = [
  'still in A minor',
  'the downbeat was here',
  'lost the set list. improvised.',
  'the sax was right all along',
  'tuned to A=432, just for you',
  'wrong key. still vibing.',
];

let titleDriftTimer  = null;
let titleRevertTimer = null;

function fireTitleDrift() {
  document.title = DRIFT_TITLES[Math.floor(Math.random() * DRIFT_TITLES.length)];
  clearTimeout(titleRevertTimer);
  titleRevertTimer = setTimeout(() => {
    document.title = ORIGINAL_TITLE;
    titleDriftTimer = setTimeout(fireTitleDrift, 90000);
  }, 3500);
}

function resetTitleDrift() {
  clearTimeout(titleDriftTimer);
  clearTimeout(titleRevertTimer);
  document.title = ORIGINAL_TITLE;
  titleDriftTimer = setTimeout(fireTitleDrift, 90000);
}

['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(evt => {
  document.addEventListener(evt, resetTitleDrift, { passive: true });
});

resetTitleDrift();


// ── SOUND TRAY ────────────────────────────────────────────────────────────────
/*
 * Bottom tray triggered by the ∿ glyph (bottom-left corner).
 * Shows the 7 audio easter eggs as playable buttons.
 * Close: re-click ∿, press Escape, or click [ esc ] inside.
 */
const tray         = document.getElementById('info-tray');
const trayClose    = document.getElementById('tray-close');
const traySongsBtn = document.getElementById('tray-songs');

let trayOpen = false;

function openTray() {
  if (!tray) return;
  tray.hidden = false;
  tray.removeAttribute('aria-hidden');
  requestAnimationFrame(() => tray.classList.add('is-open'));
  trayOpen = true;
  traySongsBtn?.classList.add('is-active');
}

function closeTray() {
  if (!tray) return;
  tray.classList.remove('is-open');
  tray.addEventListener('transitionend', () => {
    if (!tray.classList.contains('is-open')) {
      tray.hidden = true;
      tray.setAttribute('aria-hidden', 'true');
    }
  }, { once: true });
  trayOpen = false;
  traySongsBtn?.classList.remove('is-active');
}

traySongsBtn?.addEventListener('click', () => trayOpen ? closeTray() : openTray());
trayClose?.addEventListener('click', closeTray);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && trayOpen) closeTray();
});


// ── SONG SELECTOR ─────────────────────────────────────────────────────────────
/*
 * Each [data-tune] button in the sounds tray plays its tune exclusively.
 * Clicking the same button while playing stops it (toggle).
 * Only one tray song plays at a time (independent of egg-spot sounds).
 */
const TUNE_MAP = {
  drift: playDrift, ping: playPing, kick: playKick,
  static: playStatic, arp: playArp, chord: playChord, bell: playBell,
};

let activeSongStop = null;
let activeSongBtn  = null;


document.querySelectorAll('[data-tune]').forEach(btn => {
  btn.addEventListener('click', () => {
    const tune = TUNE_MAP[btn.dataset.tune];
    if (!tune) return;

    if (activeSongStop) {
      activeSongStop();
      activeSongStop = null;
      activeSongBtn?.classList.remove('is-playing');
      setAudioActive(-1);
      if (activeSongBtn === btn) { activeSongBtn = null; return; }
      activeSongBtn = null;
    }

    activeSongBtn = btn;
    btn.classList.add('is-playing');
    setAudioActive(1);
    const rect = btn.getBoundingClientRect();
    spawnRipple(rect.left + rect.width / 2, rect.top + rect.height / 2, 'expand');
    activeSongStop = tune(() => {
      activeSongStop = null;
      btn.classList.remove('is-playing');
      activeSongBtn = null;
      setAudioActive(-1);
    });
  });
});
