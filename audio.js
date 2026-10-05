// Synth Wave Defense -- audio.js  v2.4
// DSP-движок: разделение laserHit/melterHit, динамический throttle и custom-синтез.

const SFX = (function () {
  'use strict';

  const MASTER_VOLUME = 0.55;
  const MAX_VOICES = 32;
  const BEAM_KEEPALIVE = 0.14;

  // Базовые минимальные интервалы между одинаковыми звуками (в секундах)
  const THROTTLE = {
    gun: 0.055, mortarFire: 0.09, explosion: 0.07, tesla: 0.09,
    railgun: 0.11, stasis: 0.12, steam: 0.10, enemyDeath: 0.045,
    baseHit: 0.18, tap: 0.04, 
    laserHit: 0.035, melterHit: 0.045, beamHit: 0.045
  };

  const LOW_PRIORITY = {
    gun: true, tesla: true, railgun: true, stasis: true,
    enemyDeath: true, explosion: true, steam: true, mortarFire: true,
    laserHit: true, melterHit: true, beamHit: true
  };

  let ctx = null;
  let master = null;
  let sfxBus = null;
  let comp = null;
  let whiteNoiseBuffer = null;
  let brownNoiseBuffer = null;
  let distortionCurve = null;
  let voices = 0;
  let enabled = true;
  let volume = 1;
  let unlocked = false;

  const lastPlayed = Object.create(null);
  const customThrottles = Object.create(null); // name -> seconds

  function now() { return ctx ? ctx.currentTime : 0; }

  function makeDistortionCurve(amount = 20) {
    const k = typeof amount === 'number' ? amount : 20;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

function ensureCtx() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();

      // 1. Создание и настройка компрессора/лимитера
      comp = ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-14, ctx.currentTime);
      comp.knee.setValueAtTime(12, ctx.currentTime);
      comp.ratio.setValueAtTime(20, ctx.currentTime);
      comp.attack.setValueAtTime(0.001, ctx.currentTime);
      comp.release.setValueAtTime(0.12, ctx.currentTime);

      // 2. Шины громкости
      master = ctx.createGain();
      master.gain.value = MASTER_VOLUME * volume;

      sfxBus = ctx.createGain();
      sfxBus.gain.value = 1;

      // 3. Маршрутизация: sfxBus -> comp -> master -> destination
      sfxBus.connect(comp);
      comp.connect(master);
      master.connect(ctx.destination);

      const len = Math.floor(ctx.sampleRate * 2);
      
      whiteNoiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const wd = whiteNoiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) wd[i] = Math.random() * 2 - 1;

      brownNoiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const bd = brownNoiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        bd[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = bd[i];
        bd[i] *= 3.5;
      }

      distortionCurve = makeDistortionCurve(25);
      return ctx;
    } catch (e) {
      console.warn('[Audio] Failed to initialize AudioContext:', e);
      ctx = null;
      return null;
    }
  }
  
  function resume() {
    if (!ctx) return;
    try { if (ctx.state === 'suspended') ctx.resume(); } catch (e) { }
  }

  const samples = Object.create(null);
  const customSynths = Object.create(null);
  let sampleBase = 'sfx/';

  function decode(arrayBuffer) {
    return new Promise((resolve, reject) => {
      if (!ensureCtx()) { reject(new Error('no audio context')); return; }
      let p;
      try { p = ctx.decodeAudioData(arrayBuffer, resolve, reject); } catch (e) { reject(e); return; }
      if (p && typeof p.then === 'function') p.then(resolve, reject);
    });
  }

  function store(name, buf, opts) {
    const slot = samples[name] || (samples[name] = { bufs: [], gain: 1, pitch: 0 });
    slot.bufs.push(buf);
    if (opts) {
      if (typeof opts.gain === 'number') slot.gain = opts.gain;
      if (typeof opts.pitch === 'number') slot.pitch = opts.pitch;
    }
  }

  function normalise(entry) {
    if (!entry) return null;
    if (typeof entry === 'string') return { src: [entry], gain: 1, pitch: 0 };
    if (Array.isArray(entry)) return { src: entry, gain: 1, pitch: 0 };
    const src = typeof entry.src === 'string' ? [entry.src] : (entry.src || []);
    return { src, gain: entry.gain == null ? 1 : entry.gain, pitch: entry.pitch || 0 };
  }

  function loadSamples(manifest, baseUrl) {
    if (baseUrl != null) sampleBase = baseUrl;
    if (!manifest || !ensureCtx()) return Promise.resolve({ ok: [], failed: Object.keys(manifest || {}) });

    const ok = [], failed = [];
    const jobs = [];

    Object.keys(manifest).forEach(name => {
      const spec = normalise(manifest[name]);
      if (!spec || !spec.src.length) return;
      spec.src.forEach(file => {
        const url = /^(https?:|data:|blob:|\/)/.test(file) ? file : sampleBase + file;
        jobs.push(
          fetch(url)
            .then(r => { if (!r.ok) throw new Error(r.status + ' ' + url); return r.arrayBuffer(); })
            .then(decode)
            .then(buf => { store(name, buf, spec); if (ok.indexOf(name) < 0) ok.push(name); })
            .catch(() => { if (failed.indexOf(file) < 0) failed.push(file); })
        );
      });
    });

    return Promise.all(jobs).then(() => ({ ok, failed }));
  }

  function registerBuffer(name, buf, opts) {
    if (!buf) return;
    if (opts && opts.replace !== false) delete samples[name];
    store(name, buf, opts);
  }

  function clearSample(name) {
    if (name == null) { 
      Object.keys(samples).forEach(k => delete samples[k]); 
      Object.keys(customSynths).forEach(k => delete customSynths[k]);
      Object.keys(customThrottles).forEach(k => delete customThrottles[k]);
      return; 
    }
    delete samples[name];
    delete customSynths[name];
    delete customThrottles[name];
  }

  function hasSample(name) { return !!(samples[name] && samples[name].bufs.length); }
  function sampleNames() { return Object.keys(samples).filter(hasSample); }

  function playSample(name) {
    const slot = samples[name];
    if (!slot || !slot.bufs.length) return false;
    const t0 = now();
    const src = ctx.createBufferSource();
    src.buffer = slot.bufs.length === 1
      ? slot.bufs[0]
      : slot.bufs[(Math.random() * slot.bufs.length) | 0];

    if (slot.pitch) {
      try { src.detune.value = (Math.random() * 2 - 1) * slot.pitch; } catch (e) { }
    }

    const g = ctx.createGain();
    g.gain.value = slot.gain;
    src.connect(g);
    g.connect(sfxBus);
    src.start(t0);
    track(src, src.buffer.duration);
    return true;
  }

  function budget(name) {
    if (voices >= MAX_VOICES) return !LOW_PRIORITY[name];
    return true;
  }

  function track(node, dur) {
    voices++;
    const release = () => { voices = Math.max(0, voices - 1); };
    try { node.onended = release; } catch (e) { }
    setTimeout(release, (dur + 0.3) * 1000);
  }

  function tone(o) {
    if (!ensureCtx()) return;
    const t0 = (o.at || 0) + now();
    const dur = o.dur || 0.12;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(Math.max(1, o.freq || 440), t0);
    if (o.freq2 && o.freq2 !== o.freq) {
      const f2 = Math.max(1, o.freq2);
      if (o.exp) osc.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
      else osc.frequency.linearRampToValueAtTime(f2, t0 + dur);
    }
    if (o.detune) osc.detune.setValueAtTime(o.detune, t0);

    const peak = Math.max(0.0001, o.gain == null ? 0.3 : o.gain);
    const atk = Math.max(0.001, o.attack == null ? 0.004 : o.attack);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    let tail = g;
    if (o.filter) {
      const bq = ctx.createBiquadFilter();
      bq.type = o.filter;
      bq.frequency.setValueAtTime(o.cutoff || o.freq || 1200, t0);
      if (o.cutoff2) {
        if (o.exp) bq.frequency.exponentialRampToValueAtTime(Math.max(1, o.cutoff2), t0 + dur);
        else bq.frequency.linearRampToValueAtTime(Math.max(1, o.cutoff2), t0 + dur);
      }
      if (o.q) bq.Q.value = o.q;
      tail.connect(bq);
      tail = bq;
    }

    if (o.drive && o.drive > 0) {
      const shaper = ctx.createWaveShaper();
      shaper.curve = distortionCurve;
      tail.connect(shaper);
      tail = shaper;
    }

    osc.connect(g);
    tail.connect(o.dest || sfxBus);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
    track(osc, dur + (o.at || 0));
    return osc;
  }

  function noise(o) {
    if (!ensureCtx()) return;
    const t0 = (o.at || 0) + now();
    const dur = o.dur || 0.12;
    const src = ctx.createBufferSource();
    src.buffer = (o.noiseType === 'brown') ? brownNoiseBuffer : whiteNoiseBuffer;
    src.loop = true;
    const offset = Math.random() * 1.5;

    const bq = ctx.createBiquadFilter();
    bq.type = o.filter || 'lowpass';
    bq.frequency.setValueAtTime(Math.max(1, o.cutoff || 2000), t0);
    if (o.cutoff2) {
      if (o.exp) bq.frequency.exponentialRampToValueAtTime(Math.max(1, o.cutoff2), t0 + dur);
      else bq.frequency.linearRampToValueAtTime(Math.max(1, o.cutoff2), t0 + dur);
    }
    bq.Q.value = o.q == null ? 1 : o.q;

    const g = ctx.createGain();
    const peak = Math.max(0.0001, o.gain == null ? 0.25 : o.gain);
    const atk = Math.max(0.001, o.attack == null ? 0.003 : o.attack);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(bq);
    bq.connect(g);

    let tail = g;
    if (o.drive && o.drive > 0) {
      const shaper = ctx.createWaveShaper();
      shaper.curve = distortionCurve;
      tail.connect(shaper);
      tail = shaper;
    }

    tail.connect(o.dest || sfxBus);
    src.start(t0, offset);
    src.stop(t0 + dur + 0.02);
    track(src, dur + (o.at || 0));
    return src;
  }

  function uiTick(variant) {
    const c = 2600 + (variant || 0) * 180;
    noise({ dur: 0.030, gain: 0.20, attack: 0.001, filter: 'bandpass', cutoff: c, cutoff2: c * 0.75, q: 0.9 });
    noise({ dur: 0.014, gain: 0.10, attack: 0.001, filter: 'highpass', cutoff: 5200 });
  }

  function fireTick() {
    const c = 1500 + Math.random() * 260;
    noise({ dur: 0.038, gain: 0.17, attack: 0.001, filter: 'bandpass', cutoff: c, cutoff2: c * 0.6, q: 0.8 });
    noise({ dur: 0.016, gain: 0.07, attack: 0.001, filter: 'lowpass', cutoff: 900 });
  }

  function hitTick() {
    const c = 5200 + Math.random() * 900;
    noise({ dur: 0.024, gain: 0.14, attack: 0.001, filter: 'highpass', cutoff: c });
    noise({ dur: 0.012, gain: 0.06, attack: 0.001, filter: 'bandpass', cutoff: 3400, q: 1.1 });
  }

  const SOUND_ALIAS = {
    tap: ['ui', 0], back: ['ui', -1], toggle: ['ui', 1], confirm: ['ui', 2],
    denied: ['ui', -2], build: ['ui', 1], upgrade: ['ui', 2], sell: ['ui', -1],
    waveStart: ['ui', 1], bossIncoming: ['ui', 2], victory: ['ui', 2],
    defeat: ['ui', -2], revive: ['ui', 1], star: ['ui', 2], reward: ['ui', 1],
    unlock: ['ui', 2],
    gun: ['fire'], mortarFire: ['fire'], tesla: ['fire'], railgun: ['fire'],
    stasis: ['fire'],
    explosion: ['hit'], steam: ['hit'], baseHit: ['hit'],
    enemyDeath: ['hit'], miniBossDeath: ['hit'], bossDeath: ['hit'],
    laserHit: ['hit'], melterHit: ['hit'], beamHit: ['hit']
  };

  const SOUNDS = Object.create(null);
  Object.keys(SOUND_ALIAS).forEach(name => {
    const [kind, variant] = SOUND_ALIAS[name];
    SOUNDS[name] = () => {
      if (kind === 'ui') uiTick(variant || 0);
      else if (kind === 'fire') fireTick();
      else hitTick();
    };
  });

  function beam() { return; }

  function playLayer(layer) {
    if (!layer) return;
    if (layer.synth === 'tone') tone(layer);
    else noise(layer);
  }

  function play(name, arg) {
    if (!enabled) return;
    if (!ensureCtx()) return;
    resume();

    const fn = SOUNDS[name];
    const sampled = hasSample(name);
    const hasCustom = !!customSynths[name];

    if (!fn && !sampled && !hasCustom) return;

    const t = now();
    // Проверяем кастомный троттлинг из манифеста, затем дефолтный
    const gap = customThrottles[name] !== undefined ? customThrottles[name] : THROTTLE[name];
    if (gap) {
      const last = lastPlayed[name] || -999;
      if (t - last < gap) return;
      lastPlayed[name] = t;
    }
    if (!budget(name)) return;

    try {
      if (hasCustom) {
        const c = customSynths[name];
        if (Array.isArray(c)) c.forEach(playLayer);
        else playLayer(c);
        return;
      }
      if (sampled && playSample(name)) return;
      if (fn) fn(arg);
    } catch (e) { }
  }

  function death(e) {
    if (!e) return play('enemyDeath');
    if (e.isBoss) return play('bossDeath');
    if (e.isMiniBoss) return play('miniBossDeath');
    return play('enemyDeath');
  }

  function setEnabled(on) {
    enabled = !!on;
    if (enabled) { ensureCtx(); resume(); }
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (master) {
      try { master.gain.setTargetAtTime(MASTER_VOLUME * volume, now(), 0.02); } catch (e) { }
    }
  }

  function isEnabled() { return enabled; }

  const TAPPABLE = 'button, .menu-btn, .menu-btn-primary-capsule, .menu-btn-glass-capsule,' +
    '.level-btn, .setting-row, .badge-half, .switch, .loadout-widget-header,' +
    '.build-slot, .upgrade-node, [data-sfx], [onclick]';

  function installUiHooks() {
    document.addEventListener('pointerdown', (ev) => {
      if (!unlocked) { unlocked = true; ensureCtx(); resume(); }
      if (!enabled) return;
      let el = ev.target;
      let hit = null;
      for (let i = 0; i < 5 && el && el !== document.body; i++) {
        if (el.matches && el.matches(TAPPABLE)) { hit = el; break; }
        el = el.parentElement;
      }
      if (!hit) return;
      if (hit.disabled || hit.classList.contains('disabled')) { play('denied'); return; }
      const override = hit.getAttribute && hit.getAttribute('data-sfx');
      if (override === 'none') return;
      play(override || 'tap');
    }, { passive: true, capture: true });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) resume();
    });
  }

  return {
    play, beam, death,
    setEnabled, setVolume, isEnabled,
    installUiHooks,
    unlock() { ensureCtx(); resume(); },
    loadSamples, registerBuffer, clearSample, hasSample, sampleNames,

    autoload() {
      try {
        if (typeof window.SFX_MANIFEST !== 'undefined' && window.SFX_MANIFEST) {
          const files = {};
          Object.keys(window.SFX_MANIFEST).forEach(k => {
            const entry = window.SFX_MANIFEST[k];
            
            // Если передан объект с полем throttle и вложенным config
            let synthConfig = entry;
            if (entry && typeof entry === 'object' && entry.config) {
              if (typeof entry.throttle === 'number') {
                customThrottles[k] = entry.throttle > 1 ? entry.throttle / 1000 : entry.throttle;
              }
              synthConfig = entry.config;
            }

            const isLayerArray = Array.isArray(synthConfig) && synthConfig.length > 0 && typeof synthConfig[0] === 'object' && synthConfig[0].synth;
            const isSingleLayer = synthConfig && typeof synthConfig === 'object' && !Array.isArray(synthConfig) && synthConfig.synth;

            if (isLayerArray || isSingleLayer) {
              customSynths[k] = synthConfig;
            } else {
              files[k] = entry;
            }
          });
          return loadSamples(files, window.SFX_BASE || 'sfx/');
        }
      } catch (e) { }
      return Promise.resolve({ ok: [], failed: [] });
    },

    _names() { return Object.keys(SOUNDS); },
    _ctx() { return ensureCtx(); },
    _tone: tone,
    _noise: noise
  };
})();