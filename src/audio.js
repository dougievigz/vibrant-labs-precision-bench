/* =============================================================================
   audio.js — tiny WebAudio synth. No asset files; everything is generated.
   All sounds are short and unobtrusive — this is a clinical bench, not an arcade.
============================================================================= */

let ctx = null;
let muted = false;
let master = null;

function ensure() {
  if (ctx) return ctx;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.28;
    master.connect(ctx.destination);
  } catch (e) {
    ctx = null;
  }
  return ctx;
}

export function unlock() {
  const c = ensure();
  if (c && c.state === "suspended") c.resume();
}

export function setMuted(m) {
  muted = m;
}
export function isMuted() {
  return muted;
}

/* one oscillator "blip" */
function tone({ freq = 440, type = "sine", dur = 0.12, vol = 0.5, glide = 0, delay = 0 }) {
  const c = ensure();
  if (!c || muted) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + glide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/* filtered noise burst (for "whir"/processing) */
function noise({ dur = 0.3, vol = 0.18, freq = 800, q = 0.7 }) {
  const c = ensure();
  if (!c || muted) return;
  const t0 = c.currentTime;
  const frames = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = q;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(bp); bp.connect(g); g.connect(master);
  src.start(t0);
}

export const sfx = {
  click()   { tone({ freq: 520, type: "triangle", dur: 0.05, vol: 0.25 }); },
  pickup()  { tone({ freq: 380, type: "sine", dur: 0.09, vol: 0.4, glide: 180 }); },
  route()   { tone({ freq: 300, type: "sine", dur: 0.08, vol: 0.3, glide: 80 }); },
  run()     { noise({ dur: 0.5, vol: 0.10, freq: 1200, q: 0.6 });
              tone({ freq: 140, type: "sawtooth", dur: 0.45, vol: 0.06 }); },
  correct() { tone({ freq: 660, type: "sine", dur: 0.1, vol: 0.4 });
              tone({ freq: 990, type: "sine", dur: 0.16, vol: 0.36, delay: 0.09 }); },
  wrong()   { tone({ freq: 180, type: "square", dur: 0.16, vol: 0.3, glide: -60 });
              tone({ freq: 120, type: "square", dur: 0.2, vol: 0.26, delay: 0.07, glide: -30 }); },
  combo(n)  { tone({ freq: 520 + Math.min(n, 8) * 70, type: "triangle", dur: 0.1, vol: 0.3 }); },
  reportDone() {
    [523, 659, 784].forEach((f, i) => tone({ freq: f, type: "sine", dur: 0.14, vol: 0.32, delay: i * 0.07 }));
  },
  shiftDone() {
    [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, type: "sine", dur: 0.22, vol: 0.34, delay: i * 0.1 }));
  },
  fail()    { [330, 262, 196].forEach((f, i) => tone({ freq: f, type: "sawtooth", dur: 0.3, vol: 0.3, delay: i * 0.14 })); },
};
