// Synth Wave Defense -- music.js  v2.0
// [MUS100] Background Music Engine Module: Manages streaming music tracks, category transitions, and Web Audio ducking/filtering.

const MusicManager = (function () {
  'use strict';

  // [MUS101] Track Playlist Registry (mapped by game screen state)
  const TRACKS = {
    menu: [
      'music/menu_01.ogg',
      'music/menu_02.ogg',
      'music/menu_03.ogg'
    ],
    battle: [
      'music/battle_01.ogg',
      'music/battle_02.ogg',
      'music/battle_03.ogg',
      'music/battle_04.ogg',
      'music/battle_05.ogg',
      'music/battle_06.ogg',
      'music/battle_07.ogg',
      'music/battle_08.ogg',
      'music/battle_09.ogg',
    ],
    win: [
      'music/win.ogg'
    ],
    lose: [
      'music/lose.ogg'
    ]
  };

  // [MUS101.01] Music Category Behaviors (volume, looping, and fade durations)
  const CATEGORY = {
    menu:   { loop: true,  volume: 0.45, fadeIn: 1.2,  fadeOut: 0.8 },
    battle: { loop: true,  volume: 0.38, fadeIn: 0.9,  fadeOut: 0.6 },
    win:    { loop: true,  volume: 0.60, fadeIn: 0.05, fadeOut: 0.4 },
    lose:   { loop: true,  volume: 0.55, fadeIn: 0.05, fadeOut: 0.4 }
  };

  const FADE_STEP_MS = 50;

  // [MUS102] Music Engine State Variables
  let enabled = true;
  let volume = 1;          // player's master music trim, 0..1
  let ducked = false;      // menu/pause ducking state for in-battle music
  const DUCK_FACTOR = 0.80;
  const DUCK_FILTER_FREQ = 800;   // Hz low-pass cutoff when paused/ducked
  const NORMAL_FILTER_FREQ = 20000; // Hz low-pass cutoff during normal playback

  let current = null;      // { el, category, cfg }
  let category = null;     // category currently requested
  let pending = null;      // category queued until the first user gesture
  let unlocked = false;
  let fadeTimer = null;
  let playlist = [];       // remaining shuffled tracks for a looping category

  // [MUS103] Asset Preloading Pipeline
  const preloadedAudio = Object.create(null);
  function preloadTracks() {
    Object.keys(TRACKS).forEach(cat => {
      (TRACKS[cat] || []).forEach(path => {
        if (!preloadedAudio[path]) {
          try {
            const a = new Audio();
            a.src = path;
            a.preload = 'auto';
            preloadedAudio[path] = a;
          } catch (e) {}
        }
      });
    });
  }
  try { preloadTracks(); } catch (e) {}

  // [MUS104] Web Audio Biquad Filter & Gain Node Graph Initialization
  let audioCtx = null;
  let filterNode = null;
  let masterGain = null;

  function ensureAudioCtx() {
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        try { audioCtx.resume(); } catch (e) {}
      }
      return audioCtx;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 1.0;

      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(ducked ? DUCK_FILTER_FREQ : NORMAL_FILTER_FREQ, audioCtx.currentTime);

      filterNode.connect(masterGain);
      masterGain.connect(audioCtx.destination);
      return audioCtx;
    } catch (e) {
      audioCtx = null;
      filterNode = null;
      masterGain = null;
      return null;
    }
  }

  // [MUS104.01] HTMLAudioElement to Web Audio Routing
  function connectElementToWebAudio(el) {
    if (!ensureAudioCtx()) return null;
    if (el._gainNode) return el._gainNode;
    try {
      const source = el._mediaSource || audioCtx.createMediaElementSource(el);
      el._mediaSource = source;

      const gNode = audioCtx.createGain();
      const initVol = typeof el.volume === 'number' ? el.volume : 0;
      gNode.gain.setValueAtTime(initVol, audioCtx.currentTime);

      source.disconnect();
      source.connect(gNode);
      gNode.connect(filterNode);
      el._gainNode = gNode;
      try { el.volume = 1.0; } catch (e) {}
      return gNode;
    } catch (e) {
      return null;
    }
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // [MUS105] Volume Fading & Dynamic Crossfade Automation
  const fading = [];   // { el, gNode, from, to, elapsed, dur, stopAtEnd }

  function stepFades() {
    for (let i = fading.length - 1; i >= 0; i--) {
      const f = fading[i];
      f.elapsed += FADE_STEP_MS / 1000;
      const k = f.dur > 0 ? Math.min(1, f.elapsed / f.dur) : 1;
      const v = f.from + (f.to - f.from) * k;

      if (!f.gNode) {
        try { f.el.volume = Math.max(0, Math.min(1, v)); } catch (e) { }
      } else {
        try { if (f.el.volume !== 1) f.el.volume = 1; } catch (e) { }
      }

      if (k >= 1) {
        if (f.stopAtEnd) {
          try { f.el.pause(); } catch (e) { }
        }
        fading.splice(i, 1);
      }
    }
    if (!fading.length && fadeTimer) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }
  }

  function fadeTo(el, to, dur, stopAtEnd) {
    if (!el) return;
    const duration = Math.max(0.01, dur || 0);
    const targetVol = Math.max(0, Math.min(1, to));

    const gNode = connectElementToWebAudio(el);

    // Drop any fade already running on this element
    for (let i = fading.length - 1; i >= 0; i--) if (fading[i].el === el) fading.splice(i, 1);

    let from = 0;
    if (gNode) {
      from = gNode.gain ? gNode.gain.value : 0;
    } else {
      try { from = el.volume; } catch (e) { }
    }

    if (gNode && audioCtx) {
      try {
        const now = audioCtx.currentTime;
        gNode.gain.cancelScheduledValues(now);
        gNode.gain.setValueAtTime(from, now);
        gNode.gain.linearRampToValueAtTime(targetVol, now + duration);
      } catch (e) { }
    }

    fading.push({ el: el, gNode: gNode, from: from, to: targetVol, elapsed: 0, dur: duration, stopAtEnd: !!stopAtEnd });
    if (!fadeTimer) fadeTimer = setInterval(stepFades, FADE_STEP_MS);
  }

  // [MUS106] Playback Execution & Playlist Management
  function levelFor(cfg) { return cfg.volume * volume * (ducked ? DUCK_FACTOR : 1.0); }

  // [MUS106.01] Audio Ducking & Low-Pass Filter Control
  function setDucked(on, dur) {
    ducked = !!on;
    const duration = dur != null ? dur : 0.08;
    const targetFreq = ducked ? DUCK_FILTER_FREQ : NORMAL_FILTER_FREQ;

    ensureAudioCtx();
    if (filterNode && audioCtx) {
      try {
        const now = audioCtx.currentTime;
        filterNode.frequency.cancelScheduledValues(now);
        filterNode.frequency.setTargetAtTime(Math.max(10, targetFreq), now, Math.max(0.01, duration / 3));
      } catch (e) {
        try { filterNode.frequency.value = targetFreq; } catch (err) {}
      }
    }

    if (current) fadeTo(current.el, levelFor(current.cfg), duration);
  }

  function startTrack(path, cat, cfg) {
    let el;
    try {
      if (preloadedAudio[path] && preloadedAudio[path].paused && !preloadedAudio[path]._inUse) {
        el = preloadedAudio[path];
        el._inUse = true;
        el.currentTime = 0;
      } else {
        el = new Audio();
        el.src = path;
      }
      el.loop = false;          // looping handled below so playlists can advance
      el.preload = 'auto';
      el.volume = 0;
    } catch (e) { return null; }

    const releaseTrack = function () {
      el._inUse = false;
    };

    connectElementToWebAudio(el);

    el.addEventListener('ended', function () {
      if (!current || current.el !== el) return;
      if (cfg.loop) {
        const catList = TRACKS[cat] || [];
        if (catList.length === 1) {
          try {
            el.currentTime = 0;
            const p = el.play();
            if (p && typeof p.catch === 'function') p.catch(function () {});
            fadeTo(el, levelFor(cfg), 0.1);
          } catch (e) {
            advance(cat, cfg);
          }
        } else {
          advance(cat, cfg);
        }
      } else {
        releaseTrack();
        current = null;
      }
    });

    el.addEventListener('error', function () {
      releaseTrack();
      if (!current || current.el !== el) return;
      current = null;
      if (cfg.loop && playlist.length) advance(cat, cfg);
    });

    const p = (function () { try { return el.play(); } catch (e) { return null; } })();
    if (p && typeof p.catch === 'function') {
      p.catch(function (err) {
        if (!unlocked || (err && err.name === 'NotAllowedError')) {
          pending = cat;
        }
      });
    }

    fadeTo(el, levelFor(cfg), cfg.fadeIn);
    return el;
  }

  function advance(cat, cfg) {
    if (!playlist.length) playlist = shuffle(TRACKS[cat] || []);
    const next = playlist.shift();
    if (!next) { current = null; return; }
    const el = startTrack(next, cat, cfg);
    current = el ? { el: el, category: cat, cfg: cfg } : null;
  }

  function stopCurrent(fadeOut) {
    if (!current) return;
    if (current.el) current.el._inUse = false;
    fadeTo(current.el, 0, fadeOut == null ? 0.6 : fadeOut, true);
    current = null;
  }

  // [MUS106.02] Category Playback Switcher
  function playCategory(cat) {
    const cfg = CATEGORY[cat];
    if (!cfg) return;

    const list = TRACKS[cat] || [];
    if (!list.length) {
      if (cfg.loop) { category = cat; stopCurrent(cfg.fadeOut); }
      return;
    }

    if (ducked) {
      setDucked(false, 0.08);
    }

    if (category === cat && current) {
      if (current.el.paused) {
        const p = (function () { try { return current.el.play(); } catch (e) { return null; } })();
        if (p && typeof p.catch === 'function') {
          p.catch(function () {
            startCategoryFresh(cat, cfg, list);
          });
        }
      }
      fadeTo(current.el, levelFor(cfg), cfg.fadeIn || 0.4);
      return;
    }

    startCategoryFresh(cat, cfg, list);
  }

  function startCategoryFresh(cat, cfg, list) {
    category = cat;

    if (!enabled) return;
    if (!unlocked) { pending = cat; return; }

    const prev = current;
    current = null;
    if (prev) fadeTo(prev.el, 0, cfg.fadeIn * 0.8, true);

    playlist = shuffle(list);
    advance(cat, cfg);
  }

  // [MUS107] Public Interface & Lifecycle Control
  return {
    menu: function () { playCategory('menu'); },
    battle: function () { playCategory('battle'); },
    win: function () { playCategory('win'); },
    lose: function () { playCategory('lose'); },

    play: playCategory,
    current: function () { return category; },
    currentTrack: function () {
      if (!current || !current.el || !current.el.src) return 'None';
      try {
        const src = current.el.src;
        const parts = src.split('/');
        return parts[parts.length - 1] || 'None';
      } catch (e) {
        return 'None';
      }
    },
    setDucked: function (on, dur) { setDucked(on, dur); },

    stop: function (fadeOut) {
      category = null;
      pending = null;
      stopCurrent(fadeOut);
    },

    setEnabled: function (on) {
      const next = !!on;
      if (enabled === next) return;
      enabled = next;
      if (!enabled) {
        pending = category;
        stopCurrent(0.35);
      } else if (category) {
        const want = category;
        category = null;      // force playCategory to actually restart
        playCategory(want);
      }
    },

    isEnabled: function () { return enabled; },

    setVolume: function (v) {
      volume = Math.max(0, Math.min(1, v));
      if (current) fadeTo(current.el, levelFor(current.cfg), 0.15);
    },

    // Unlock playback after initial user gesture
    unlock: function () {
      ensureAudioCtx();
      if (!unlocked) {
        unlocked = true;
      }
      const want = pending || category;
      if (want && enabled) {
        pending = null;
        if (!current || current.el.paused) {
          category = null;
          playCategory(want);
        }
      }
    },

    suspend: function () {
      if (audioCtx && audioCtx.state === 'running') {
        try { audioCtx.suspend(); } catch (e) {}
      }
      if (current) { try { current.el.pause(); } catch (e) { } }
    },
    resume: function () {
      ensureAudioCtx();
      if (current && enabled) {
        if (current.el.paused) {
          const p = (function () { try { return current.el.play(); } catch (e) { return null; } })();
          if (p && typeof p.catch === 'function') p.catch(function () { });
        }
      }
    },

    _tracks: function () { return TRACKS; },
    _categories: function () { return CATEGORY; },

    // [MUS107.01] Diagnostic Inspector Function
    diagnose: function () {
      const counts = {};
      Object.keys(TRACKS).forEach(function (k) { counts[k] = (TRACKS[k] || []).length; });

      const report = {
        enabled: enabled,
        unlocked: unlocked,
        ducked: ducked,
        audioCtxState: audioCtx ? audioCtx.state : 'null',
        filterFreq: filterNode ? Math.round(filterNode.frequency.value) : null,
        requestedCategory: category,
        pendingCategory: pending,
        trackCounts: counts,
        playing: null
      };

      if (current) {
        report.playing = {
          category: current.category,
          src: current.el.src,
          paused: current.el.paused,
          volume: Math.round((current.el.volume || 0) * 100) / 100,
          position: Math.round((current.el.currentTime || 0) * 10) / 10,
          duration: current.el.duration,
          readyState: current.el.readyState,
          networkState: current.el.networkState,
          error: current.el.error ? current.el.error.code : null
        };
      }

      const why = [];
      if (!enabled) why.push('music is switched off in Settings');
      if (!unlocked) why.push('no user gesture yet -- tap the screen once');
      if (!category) why.push('no category has been requested');
      if (category && !counts[category]) why.push('TRACKS.' + category + ' is empty');
      if (current && current.el.error) why.push('the current file failed to load -- check the path and its exact capitalisation');
      if (current && current.el.paused) why.push('the element is paused');
      if (!why.length && current) why.push('nothing looks wrong -- if you still hear nothing, check device volume and the master trim');
      report.why = why;

      try { console.log('[music] diagnose', report); } catch (e) { }
      return report;
    }
  };
})();
