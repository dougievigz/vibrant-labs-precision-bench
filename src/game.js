/* =============================================================================
   VIBRANT LABS — Precision Bench · game.js
   Engine: screens, bench, patient queue, routing interaction, scoring, timer.
============================================================================= */
import {
  SPECIMENS, ANALYZERS, CLASSES, SYSTEMS, MARKERS, PANELS, SHIFTS,
  PATIENT_NAMES, GRADES,
} from "./data.js";
import { sfx, setMuted, isMuted, unlock } from "./audio.js";

/* ------------------------------------------------------------------ utils */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rint = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rint(arr.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function fmtTime(s) { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
const sysColor = (k) => SYSTEMS[k] || SYSTEMS.foundation;
const azById = (id) => ANALYZERS.find((a) => a.id === id);

/* ------------------------------------------------------------ molecule glyphs */
function glyph(cls, color) {
  const c = color || "#0142E2";
  const S = (inner) => `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  switch (cls) {
    case "antibody": // Y-shaped immunoglobulin
      return S(`<path d="M12 21V12M12 12L6 5M12 12l6-7" stroke="${c}" stroke-width="2.1" stroke-linecap="round"/>
        <circle cx="6" cy="4.4" r="2" fill="${c}"/><circle cx="18" cy="4.4" r="2" fill="${c}"/>
        <rect x="9.6" y="20" width="4.8" height="2.4" rx="1.2" fill="${c}"/>`);
    case "hex": // small molecule
      return S(`<path d="M12 3l7 4v8l-7 4-7-4V7z" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="12" cy="11" r="2.3" fill="${c}"/>`);
    case "atom": // element / metal
      return S(`<circle cx="12" cy="12" r="2.4" fill="${c}"/>
        <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="${c}" stroke-width="1.7"/>
        <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="${c}" stroke-width="1.7" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="${c}" stroke-width="1.7" transform="rotate(120 12 12)"/>`);
    case "helix": // nucleic acid
      return S(`<path d="M8 3c0 4 8 5 8 9s-8 5-8 9M16 3c0 4-8 5-8 9s8 5 8 9" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
        <path d="M8.7 7h6.6M8.2 12h7.6M8.7 17h6.6" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`);
    case "protein": // folded GI protein
      return S(`<path d="M7 9c-2 0-3 2-2 3.6C3.4 14 4 16.5 6 16.7c.6 2 3 2.4 4.2 1 1.6 1 3.8.2 4.2-1.6 2 0 2.8-2.3 1.6-3.7 1-1.6 0-3.7-2-3.7-.4-1.8-2.7-2.3-4-1-1.2-1-3.2-.4-3.8 1.3H7z"
        stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/>`);
    case "droplet": // clinical chemistry (blood)
    default:
      return S(`<path d="M12 3s6 6.4 6 10.2A6 6 0 1 1 6 13.2C6 9.4 12 3 12 3z" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M9 13.4a3 3 0 0 0 3 3" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`);
  }
}

/* --------------------------------------------------------- analyzer icons */
function azIcon(id, c) {
  const S = (inner) => `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${inner}</svg>`;
  switch (id) {
    case "immunochip": // silicon chip grid
      return S(`<rect x="13" y="6" width="22" height="20" rx="2" stroke="${c}" stroke-width="2"/>
        ${[10, 16, 22].map((y) => [17, 23, 29].map((x) => `<rect x="${x}" y="${y}" width="3" height="3" rx="0.6" fill="${c}"/>`).join("")).join("")}
        ${[6, 12, 18, 24].map((y) => `<path d="M9 ${y}h4M35 ${y}h4" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`).join("")}`);
    case "lcmsms": // mass spectrum peaks
      return S(`<path d="M6 25h36" stroke="${c}" stroke-width="1.6"/>
        <path d="M10 25V18M16 25V9M22 25V20M28 25V13M34 25V22M40 25V16" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`);
    case "icpms": // plasma torch rings
      return S(`<circle cx="24" cy="16" r="3" fill="${c}"/>
        <circle cx="24" cy="16" r="7" stroke="${c}" stroke-width="1.8"/>
        <circle cx="24" cy="16" r="11" stroke="${c}" stroke-width="1.4" opacity="0.7"/>
        <path d="M24 27v3M24 2v3" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`);
    case "pcrseq": // helix in a tube
      return S(`<rect x="18" y="4" width="12" height="24" rx="6" stroke="${c}" stroke-width="2"/>
        <path d="M21 8c0 3 6 4 6 8s-6 5-6 8M27 8c0 3-6 4-6 8s6 5 6 8" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`);
    case "elisa": // microplate wells
      return S(`<rect x="9" y="7" width="30" height="18" rx="2" stroke="${c}" stroke-width="1.8"/>
        ${[11, 17, 23].map((y) => [14, 20, 26, 32].map((x) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${c}"/>`).join("")).join("")}`);
    case "chem": // flask + droplet
    default:
      return S(`<path d="M20 5h8M22 5v7l-7 12a2 2 0 0 0 1.8 3h14.4A2 2 0 0 0 33 24l-7-12V5" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M18.5 20h11" stroke="${c}" stroke-width="1.6"/>`);
  }
}

/* --------------------------------------------------------- specimen visual */
function specMini(specKey) {
  const s = SPECIMENS[specKey];
  return `<div class="spec ${s.kind}">
    <div class="spec-vis" style="--sc:${s.color};--cap:${s.cap}"></div>
    <div class="spec-lab">${s.short}</div>
  </div>`;
}

/* ------------------------------------------------------------------ state */
const HS_KEY = "vibrantLabs.best.v1";
const state = {
  shiftIndex: 0, shift: null,
  queue: [], patientIndex: 0, patient: null,
  score: 0, streak: 0, bestCombo: 1,
  attempts: 0, correct: 0, misroutes: 0, routed: 0,
  qcMax: 6, qcLeft: 6,
  timeLeft: 0, timerId: null, running: false,
  held: null, heldMode: null,
  startMs: 0,
};
let pointer = { x: -100, y: -100 };
const benchEls = {}; // id -> element
let bestScore = Number(localStorage.getItem(HS_KEY) || 0);

/* ------------------------------------------------------------------ screen */
function setScreen(name) { document.body.dataset.screen = name; }

/* ============================================================ BENCH (once) */
function buildBench() {
  const bench = $("#bench");
  bench.innerHTML = ANALYZERS.map((a) => `
    <div class="analyzer" data-az="${a.id}" style="--ac:${a.accent}">
      <div class="az-head">
        <span class="az-name">${a.mono}</span>
        <span class="az-led"></span>
      </div>
      <div class="az-icon">${azIcon(a.id, a.accent)}</div>
      <div class="az-detects">${a.detects}</div>
      <div class="az-hint" data-hint="${a.id}"></div>
      <div class="az-slot">IDLE</div>
      <div class="az-progress"></div>
    </div>`).join("");

  $$(".analyzer", bench).forEach((node) => {
    const id = node.dataset.az;
    benchEls[id] = node;
    node.addEventListener("click", () => { if (state.held) routeTo(id); });
    node.addEventListener("pointerenter", () => { if (state.held) node.classList.add("target"); });
    node.addEventListener("pointerleave", () => node.classList.remove("target"));
  });
}

/* set per-machine hint chips (which class it runs) for tutorial shifts */
function refreshHints() {
  const byAz = {};
  Object.entries(CLASSES).forEach(([, v]) => { byAz[v.analyzer] = v; });
  Object.entries(CLASSES).forEach(([k, v]) => {
    const node = $(`[data-hint="${v.analyzer}"]`);
    if (node) node.textContent = `↳ ${v.label.toUpperCase()}`;
  });
  document.body.classList.toggle("hints-off", !state.shift.hints);
}

/* ============================================================ SHIFT / QUEUE */
function buildQueue(shift) {
  if (shift.queue) return shift.queue.slice();
  const out = [];
  const pool = shift.pool.slice();
  // ensure variety: cycle through a shuffled pool until count reached
  let bag = shuffle(pool);
  for (let i = 0; i < shift.count; i++) {
    if (!bag.length) bag = shuffle(pool);
    out.push(bag.pop());
  }
  return out;
}

function startShift(idx) {
  state.shiftIndex = idx;
  state.shift = idx < SHIFTS.length ? SHIFTS[idx] : makeOverflowShift(idx);
  state.queue = buildQueue(state.shift);
  state.patientIndex = 0;
  state.score = state.score; // cumulative across shifts within a run
  state.streak = 0; state.bestCombo = 1;
  state.attempts = 0; state.correct = 0; state.misroutes = 0; state.routed = 0;
  state.qcMax = state.shift.qc; state.qcLeft = state.shift.qc;
  state.timeLeft = state.shift.time;
  state.startMs = Date.now();

  refreshHints();
  renderQcPips();
  updateHud();
  setScreen("game");
  state.running = true;
  startTimer();
  loadPatient();
}

function makeOverflowShift(idx) {
  const n = idx - SHIFTS.length + 1;
  const pool = Object.keys(PANELS).filter((k) => PANELS[k].tier >= 2);
  return { id: idx + 1, title: `Overflow ${n}`, brief: "", pool, count: 6 + n, time: 160, hints: false, qc: 4 };
}

/* --------------------------------------------------------------- timer */
function startTimer() {
  stopTimer();
  state.timerId = setInterval(() => {
    if (!state.running) return;
    state.timeLeft -= 1;
    const clock = $("#hud-clock");
    clock.textContent = fmtTime(state.timeLeft);
    clock.classList.toggle("warn", state.timeLeft <= 20);
    if (state.timeLeft <= 0) endShift(false, "Shift clock expired.");
  }, 1000);
}
function stopTimer() { if (state.timerId) clearInterval(state.timerId); state.timerId = null; }

/* ============================================================ PATIENT */
function makeAccession(i) {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `VW-${ymd}-${String(1000 + state.shift.id * 100 + i).slice(-4)}`;
}

function loadPatient() {
  const panelId = state.queue[state.patientIndex];
  const panel = PANELS[panelId];
  const accent = sysColor(panel.sys);
  const markers = shuffle(panel.markers).map((id, i) => ({
    uid: `${panelId}-${i}-${id}`, id, ...MARKERS[id],
  }));
  const specimens = [...new Set(markers.map((m) => m.spec))];

  state.patient = { panelId, panel, accent, markers, total: markers.length, done: 0 };

  // intake
  const badge = $("#panel-badge");
  badge.textContent = panel.panel;
  badge.style.setProperty("--accent", accent);
  $("#intake").style.setProperty("--accent", accent);
  $("#acc-no").textContent = makeAccession(state.patientIndex);
  $("#acc-patient").textContent = pick(PATIENT_NAMES);
  $("#panel-blurb").textContent = panel.blurb;
  $("#specimen-rack").innerHTML = specimens.map(specMini).join("");
  $("#queue-pill").textContent = `REPORT ${state.patientIndex + 1} / ${state.queue.length}`;
  updateReportProgress();

  const intake = $("#intake");
  intake.classList.remove("flash-in"); void intake.offsetWidth; intake.classList.add("flash-in");

  renderTray();
}

function renderTray() {
  const tray = $("#tray");
  tray.innerHTML = state.patient.markers.map(aliquotMarkup).join("");
  $$(".aliquot", tray).forEach((node) => node.addEventListener("pointerdown", onAliquotDown));
}

function aliquotMarkup(m) {
  const col = sysColor(m.sys);
  const cls = CLASSES[m.cls];
  const sp = SPECIMENS[m.spec];
  return `<div class="aliquot" data-uid="${m.uid}" style="--sys:${col}">
    <div class="aliq-top">
      <span class="aliq-glyph">${glyph(cls.glyph, col)}</span>
      <span class="aliq-name">${m.name}</span>
    </div>
    <div class="aliq-meta">
      <span class="aliq-class">${cls.label}</span>
      <span class="aliq-spec" style="--scol:${sp.color}"><b></b>${sp.label}</span>
    </div>
  </div>`;
}

function updateReportProgress() {
  const p = state.patient;
  $("#report-progress-text").textContent = `${p.done} / ${p.total} routed`;
  $("#rp-fill").style.width = `${(p.done / p.total) * 100}%`;
  $("#rp-fill").style.background = p.accent;
}

/* ============================================================ INTERACTION */
function currentMarker(uid) { return state.patient.markers.find((m) => m.uid === uid); }
function aliquotEl(uid) { return $(`.aliquot[data-uid="${uid}"]`); }

let downInfo = null;
function onAliquotDown(e) {
  if (!state.running) return;
  const node = e.currentTarget;
  const uid = node.dataset.uid;
  e.preventDefault();
  downInfo = { uid, x: e.clientX, y: e.clientY, moved: false };
  pointer = { x: e.clientX, y: e.clientY };
  document.addEventListener("pointermove", onDocMoveDrag);
  document.addEventListener("pointerup", onDocUp, { once: true });
}

function onDocMoveDrag(e) {
  if (!downInfo) return;
  const dx = e.clientX - downInfo.x, dy = e.clientY - downInfo.y;
  if (!downInfo.moved && Math.hypot(dx, dy) > 6) {
    downInfo.moved = true;
    pickUp(downInfo.uid, "drag");
  }
}

function onDocUp(e) {
  document.removeEventListener("pointermove", onDocMoveDrag);
  const info = downInfo; downInfo = null;
  if (!info) return;
  if (info.moved) {
    // drag release: route if over an analyzer
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const az = target && target.closest(".analyzer");
    if (az) routeTo(az.dataset.az);
    else drop();
  } else {
    // click: toggle sticky selection
    if (state.held === info.uid) drop();
    else pickUp(info.uid, "sticky");
  }
}

function pickUp(uid, mode) {
  if (state.held && state.held !== uid) drop();
  state.held = uid; state.heldMode = mode;
  const m = currentMarker(uid);
  const held = $("#held");
  held.innerHTML = aliquotMarkup(m);
  held.classList.add("active");
  const src = aliquotEl(uid);
  if (src) src.classList.add("held-src");
  positionHeld();
  sfx.pickup();
}

function drop() {
  if (!state.held) return;
  const src = aliquotEl(state.held);
  if (src) src.classList.remove("held-src");
  state.held = null; state.heldMode = null;
  $("#held").classList.remove("active");
  $$(".analyzer.target").forEach((n) => n.classList.remove("target"));
}

function positionHeld() {
  const held = $("#held");
  held.style.left = pointer.x + "px";
  held.style.top = pointer.y + "px";
}

/* persistent pointer tracking for the floating aliquot */
document.addEventListener("pointermove", (e) => {
  pointer = { x: e.clientX, y: e.clientY };
  if (state.held) positionHeld();
});

/* ============================================================ ROUTING */
function routeTo(azId) {
  if (!state.held || !state.running) return;
  const uid = state.held;
  const m = currentMarker(uid);
  if (!m) { drop(); return; }
  const correct = CLASSES[m.cls].analyzer === azId;
  const node = benchEls[azId];
  state.attempts++;

  if (correct) {
    state.correct++; state.routed++;
    state.streak++;
    const mult = multFor(state.streak);
    state.bestCombo = Math.max(state.bestCombo, mult);
    const gained = 100 * mult;
    state.score += gained;
    if (state.streak >= 2) sfx.combo(state.streak);

    runMachine(node, azId, true, m, gained);

    // remove the aliquot
    const src = aliquotEl(uid);
    if (src) {
      src.classList.remove("held-src");
      src.classList.add("routed");
      setTimeout(() => src.remove(), 340);
    }
    state.patient.done++;
    state.held = null; state.heldMode = null;
    $("#held").classList.remove("active");
    node.classList.remove("target");
    updateReportProgress();
    updateHud();
    if (state.patient.done >= state.patient.total) setTimeout(reportComplete, 360);
  } else {
    state.misroutes++; state.streak = 0; state.qcLeft--;
    runMachine(node, azId, false, m, 0);
    const src = aliquotEl(uid);
    if (src) { src.classList.add("reject"); setTimeout(() => src.classList.remove("reject"), 420); }
    misrouteToast(m, azId);
    drop();
    renderQcPips();
    updateHud();
    if (state.qcLeft <= 0) { setTimeout(() => endShift(false, "QC tolerance exhausted — bench placed on hold."), 500); }
  }
}

function multFor(streak) { return streak >= 9 ? 4 : streak >= 6 ? 3 : streak >= 3 ? 2 : 1; }

function runMachine(node, azId, ok, m, gained) {
  const a = azById(azId);
  const slot = $(".az-slot", node);
  const prog = $(".az-progress", node);
  if (ok) {
    node.classList.add("busy");
    slot.textContent = `RUN · ${shortName(m.name)}`;
    prog.style.setProperty("--run", "0.6s");
    prog.style.background = a.accent;
    sfx.run();
    setTimeout(() => sfx.correct(), 380);
    chip(node, "ok", `✓ +${gained}`);
    setTimeout(() => {
      node.classList.remove("busy");
      node.classList.add("correct");
      slot.textContent = "VERIFIED";
      setTimeout(() => { node.classList.remove("correct"); slot.textContent = "IDLE"; }, 700);
    }, 640);
  } else {
    node.classList.add("wrong");
    slot.textContent = "REJECT";
    sfx.wrong();
    chip(node, "bad", "✕ RERUN");
    setTimeout(() => { node.classList.remove("wrong"); slot.textContent = "IDLE"; }, 700);
  }
}

function shortName(n) { return n.replace(/\(.*?\)/g, "").trim().slice(0, 16).toUpperCase(); }

function chip(node, kind, text) {
  const r = node.getBoundingClientRect();
  const c = document.createElement("div");
  c.className = `run-chip ${kind}`;
  c.textContent = text;
  c.style.left = r.left + r.width / 2 + "px";
  c.style.top = r.top + 12 + "px";
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 1000);
}

function misrouteToast(m, azId) {
  const right = azById(CLASSES[m.cls].analyzer);
  const wrong = azById(azId);
  toast(
    `<b>Misroute.</b> ${m.name} — <b>${CLASSES[m.cls].label}</b> — runs on <b>${right.mono}</b>, not ${wrong.mono}.`,
    "bad", 2600
  );
}

/* ------------------------------------------------------------- toast */
let toastT = null;
function toast(html, kind = "", ms = 2200) {
  const t = $("#toast");
  t.className = "toast " + kind;
  t.innerHTML = html;
  void t.offsetWidth;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), ms);
}

/* ============================================================ HUD */
function updateHud() {
  $("#hud-score").textContent = state.score.toLocaleString();
  $("#hud-combo").textContent = "×" + multFor(state.streak);
  const acc = state.attempts ? Math.round((state.correct / state.attempts) * 100) : 100;
  $("#hud-acc").textContent = acc + "%";
  $("#hud-shift-no").textContent = "SHIFT " + state.shift.id;
  $("#hud-shift-title").textContent = state.shift.title;
  $("#hud-clock").textContent = fmtTime(state.timeLeft);
}
function renderQcPips() {
  const wrap = $("#qc-pips");
  wrap.innerHTML = "";
  for (let i = 0; i < state.qcMax; i++) {
    const pip = document.createElement("i");
    if (i >= state.qcLeft) pip.classList.add("spent");
    wrap.appendChild(pip);
  }
}

/* ============================================================ FLOW */
function reportComplete() {
  sfx.reportDone();
  const methods = new Set(state.patient.markers.map((m) => CLASSES[m.cls].analyzer)).size;
  const bonus = 40 * methods;
  state.score += bonus;
  toast(`<b>Report verified.</b> ${state.patient.panel.panel} — ${methods} ${methods > 1 ? "analyzers" : "analyzer"} · +${bonus} bonus`, "good", 1900);
  updateHud();
  state.patientIndex++;
  if (state.patientIndex >= state.queue.length) {
    setTimeout(() => endShift(true), 700);
  } else {
    setTimeout(loadPatient, 620);
  }
}

function endShift(passed, reason = "") {
  if (!state.running && passed) return;
  state.running = false;
  stopTimer();
  drop();

  let timeBonus = 0;
  if (passed) { timeBonus = Math.round(state.timeLeft) * 5; state.score += timeBonus; }
  if (state.score > bestScore) { bestScore = state.score; localStorage.setItem(HS_KEY, String(bestScore)); }

  const acc = state.attempts ? state.correct / state.attempts : 1;
  const grade = passed ? GRADES.find((g) => acc >= g.min) : GRADES[GRADES.length - 1];
  const tatMs = Date.now() - state.startMs;

  showResults({ passed, reason, acc, grade, timeBonus, tatMs });
  passed ? sfx.shiftDone() : sfx.fail();
}

/* ============================================================ RESULTS */
function showResults({ passed, reason, acc, grade, timeBonus, tatMs }) {
  setScreen("results");
  const accPct = Math.round(acc * 100);
  $("#results-eyebrow").textContent = passed
    ? `SHIFT ${state.shift.id} · ${state.shift.title.toUpperCase()} — COMPLETE`
    : `SHIFT ${state.shift.id} · ${state.shift.title.toUpperCase()} — QC HOLD`;

  const ring = $("#grade-ring");
  ring.style.setProperty("--grade-deg", clamp(acc, 0, 1) * 360 + "deg");
  const col = !passed ? "var(--bad)" : acc >= 0.9 ? "var(--ok)" : acc >= 0.8 ? "var(--nutrient)" : "var(--cardio)";
  ring.style.setProperty("--grade-col", col);
  $("#grade-letter").textContent = grade.g;
  $("#grade-label").textContent = grade.label;

  $("#res-acc").textContent = accPct + "%";
  $("#res-score").textContent = state.score.toLocaleString();
  $("#res-routed").textContent = state.routed;
  $("#res-best").textContent = "×" + state.bestCombo;
  $("#res-tat").textContent = fmtTime(tatMs / 1000);
  $("#res-misroute").textContent = state.misroutes;

  let note;
  if (!passed) {
    note = `${reason} Reset the bench and run it back — accuracy is the job.`;
  } else if (state.shiftIndex + 1 < SHIFTS.length) {
    note = `Clean run. ${timeBonus ? `+${timeBonus} turnaround bonus banked. ` : ""}Shift ${SHIFTS[state.shiftIndex + 1].id}: ${SHIFTS[state.shiftIndex + 1].title} is up next.`;
  } else {
    note = `You cleared the core rotation. ${timeBonus ? `+${timeBonus} turnaround bonus. ` : ""}Overflow shifts keep coming — push your high score.`;
  }
  $("#results-note").textContent = note;

  $("#btn-continue").style.display = passed ? "" : "none";
  $("#btn-retry").style.display = "";
  $("#btn-continue").textContent = state.shiftIndex + 1 < SHIFTS.length ? "Next shift" : "Overflow shift";
}

/* ============================================================ MODALS */
function openModal(id) { $(id).classList.add("open"); $(id).setAttribute("aria-hidden", "false"); }
function closeModal(id) { $(id).classList.remove("open"); $(id).setAttribute("aria-hidden", "true"); }
function closeAllModals() { $$(".modal-veil.open").forEach((m) => { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); }); }

function buildCodex() {
  const byAz = {};
  Object.entries(CLASSES).forEach(([k, v]) => { (byAz[v.analyzer] = byAz[v.analyzer] || []).push(v.label); });
  $("#codex-list").innerHTML = ANALYZERS.map((a) => `
    <div class="codex-item" style="--ac:${a.accent}">
      <div class="codex-icon">${azIcon(a.id, a.accent)}</div>
      <div class="codex-body">
        <h4>${a.name}</h4>
        <div class="codex-tech">${a.tech}</div>
        <div class="codex-detects">Runs: ${(byAz[a.id] || []).join(" · ")}</div>
        <div class="codex-blurb">${a.blurb}</div>
      </div>
    </div>`).join("");
}

/* ============================================================ PAUSE */
function pauseGame() {
  if (document.body.dataset.screen !== "game" || !state.running) return;
  state.running = false;
  openModal("#modal-pause");
}
function resumeGame() {
  closeModal("#modal-pause");
  if (document.body.dataset.screen === "game") state.running = true;
}

/* ============================================================ BRIEF */
function showBrief(idx) {
  const sh = idx < SHIFTS.length ? SHIFTS[idx] : makeOverflowShift(idx);
  $("#brief-shift-no").textContent = "SHIFT " + sh.id;
  $("#brief-title").textContent = sh.title;
  $("#brief-text").textContent = sh.brief || "Volume keeps climbing. Same rules — route every marker to its analyzer and protect your accuracy.";
  $("#brief-count").textContent = sh.queue ? sh.queue.length : sh.count;
  $("#brief-time").textContent = fmtTime(sh.time);
  $("#brief-qc").textContent = sh.qc;
  setScreen("brief");
}

/* ============================================================ WIRING */
function newRun() {
  state.score = 0;
  startFromBrief(0);
}
function startFromBrief(idx) { showBrief(idx); state._pendingShift = idx; }

function init() {
  buildBench();
  buildCodex();
  $("#title-hiscore").textContent = bestScore ? bestScore.toLocaleString() : "—";

  // title
  $("#btn-play").addEventListener("click", () => { unlock(); sfx.click(); newRun(); });
  $("#btn-how").addEventListener("click", () => { sfx.click(); openModal("#modal-how"); });
  $("#btn-codex-title").addEventListener("click", () => { sfx.click(); openCodex(); });

  // mute
  $("#btn-mute").addEventListener("click", () => {
    const m = !isMuted(); setMuted(m); document.body.classList.toggle("muted", m);
    if (!m) { unlock(); sfx.click(); }
  });

  // brief
  $("#btn-start-shift").addEventListener("click", () => { unlock(); sfx.click(); startShift(state._pendingShift ?? 0); });

  // how / codex modals
  $("#btn-how-close").addEventListener("click", () => closeModal("#modal-how"));
  $("#btn-how-go").addEventListener("click", () => closeModal("#modal-how"));
  $("#btn-codex-close").addEventListener("click", () => closeCodex());
  $("#btn-codex-game").addEventListener("click", () => { sfx.click(); openCodex(); });

  // pause
  $("#btn-pause").addEventListener("click", () => { sfx.click(); pauseGame(); });
  $("#btn-resume").addEventListener("click", () => { sfx.click(); resumeGame(); });
  $("#btn-pause-codex").addEventListener("click", () => { openCodex(); });
  $("#btn-pause-quit").addEventListener("click", () => { closeAllModals(); abandon(); });

  // results
  $("#btn-continue").addEventListener("click", () => { sfx.click(); startFromBrief(state.shiftIndex + 1); });
  $("#btn-retry").addEventListener("click", () => { sfx.click(); retryShift(); });
  $("#btn-quit").addEventListener("click", () => { sfx.click(); toTitle(); });

  // veil click-to-close (codex/how only; pause must use buttons)
  $$(".modal-veil").forEach((v) => v.addEventListener("click", (e) => {
    if (e.target !== v || v.id === "modal-pause") return;
    if (v.id === "modal-codex") closeCodex();
    else closeModal("#" + v.id);
  }));

  // keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if ($("#modal-codex").classList.contains("open")) closeCodex();
      else if ($("#modal-how").classList.contains("open")) closeModal("#modal-how");
      else if ($("#modal-pause").classList.contains("open")) { /* pause: use buttons */ }
      else if (state.held) drop();
      else if (document.body.dataset.screen === "game") pauseGame();
    }
    if ((e.key === "p" || e.key === "P") && document.body.dataset.screen === "game" && !$$(".modal-veil.open").length) pauseGame();
  });

  // drop held when clicking tray empty space
  $("#tray").addEventListener("click", (e) => { if (e.target.id === "tray" && state.held) drop(); });

  setScreen("title");
}

/* codex open/close — pauses the shift clock while open, resumes on any close path */
let codexPausedGame = false;
function openCodex() {
  if (document.body.dataset.screen === "game" && state.running) {
    state.running = false; codexPausedGame = true;
  }
  openModal("#modal-codex");
}
function closeCodex() {
  closeModal("#modal-codex");
  if (codexPausedGame && document.body.dataset.screen === "game" && !$("#modal-pause").classList.contains("open")) {
    state.running = true;
  }
  codexPausedGame = false;
}

function retryShift() { startShift(state.shiftIndex); }
function abandon() { stopTimer(); state.running = false; toTitle(); }
function toTitle() {
  $("#title-hiscore").textContent = bestScore ? bestScore.toLocaleString() : "—";
  setScreen("title");
}

/* go */
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
