// Synth Wave Defense -- music.js  v2.0
//
// Background music. Four categories, driven entirely by "where is the player
// right now", never by explicit play/stop calls from screen code:
//
//   menu    -- start screen, level select, upgrades, settings. Loops.
//   battle  -- inside a match. Loops.
//   win     -- victory screen. One-shot sting, then silence.
//   lose    -- defeat screen. One-shot sting, then silence.
//
// Deliberately NOT Web Audio, unlike audio.js. Music is long, and a plain
// HTMLAudioElement streams it instead of holding a fully decoded PCM copy in
// memory -- a three-minute stereo track is ~30 MB decoded, which is a real
// problem on a cheap Android device. It also keeps working from file:// when
// index.html is opened straight off the disk, where fetch() would be blocked.
// The cost is that crossfades ramp element.volume on a timer rather than using
// a gain node, which is perfectly adequate for music.
//
// Separation of concerns, as with the rest of the project:
//   audio.js  = short reactive sounds, synthesized or sampled
//   music.js  = long looping beds, streamed  <-- this file
// Neither knows about the other.
//
// Everything fails silently. A missing or unplayable track must never throw
// into the game loop or leave the player stuck on a screen.
// ============================================================================

const MusicManager = (function () {
  'use strict';

  // --- Track lists --------------------------------------------------------
  //
  // Drop files into a music/ folder next to index.html and list them here.
  // Multiple entries in menu/battle become a playlist: one is picked at random
  // on entry, and when it finishes the next one starts, so a long session
  // doesn't loop the same ninety seconds forever.
  //
  // An empty array is valid and means "this category is silent" -- the game
  // runs perfectly well with no music files at all.
  //
  // Ship OGG. Android WebView plays it natively and it is roughly a tenth the
  // size of WAV at the same perceived quality.

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

  // Per-category behaviour. Stings play once and stop; beds loop forever.
  // Volume is per-category because a victory sting mastered at full level will
  // otherwise jump out over a deliberately quiet menu bed.
  const CATEGORY = {
    menu:   { loop: true,  volume: 0.45, fadeIn: 1.2,  fadeOut: 0.8 },
    battle: { loop: true,  volume: 0.38, fadeIn: 0.9,  fadeOut: 0.6 },
    win:    { loop: true,  volume: 0.60, fadeIn: 0.05, fadeOut: 0.4 },
    lose:   { loop: true,  volume: 0.55, fadeIn: 0.05, fadeOut: 0.4 }
  };

  const FADE_STEP_MS = 50;

  // --- State --------------------------------------------------------------

  let enabled = true;
  let volume = 1;          // player's master music trim, 0..1
  let ducked = false;      // menu/pause ducking state for in-battle music
  const DUCK_FACTOR = 0.35;
  const DUCK_FILTER_FREQ = 800;   // Hz low-pass cutoff when paused/ducked
  const NORMAL_FILTER_FREQ = 20000; // Hz low-pass cutoff during normal playback

  let current = null;      // { el, category, cfg }
  let category = null;     // category currently requested
  let pending = null;      // category queued until the first user gesture
  let unlocked = false;
  let fadeTimer = null;
  let playlist = [];       // remaining shuffled tracks for a looping category

  // Web Audio graph for filtering
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

  function connectElementToWebAudio(el) {
    if (!ensureAudioCtx()) return;
    if (el._mediaSource) return;
    try {
      const source = audioCtx.createMediaElementSource(el);
      source.connect(filterNode);
      el._mediaSource = source;
    } catch (e) {
      // Fallback: if Web Audio routing fails, HTMLAudioElement plays directly
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

  // --- Fading -------------------------------------------------------------
  //
  // One shared timer drives every in-flight fade. Elements that reach zero are
  // paused and dropped, and the timer stops itself once nothing is moving, so
  // an idle menu isn't burning a 20 Hz interval forever.

  const fading = [];   // { el, from, to, elapsed, dur, stopAtEnd }

  function stepFades() {
    for (let i = fading.length - 1; i >= 0; i--) {
      const f = fading[i];
      f.elapsed += FADE_STEP_MS / 1000;
      const k = f.dur > 0 ? Math.min(1, f.elapsed / f.dur) : 1;
      const v = f.from + (f.to - f.from) * k;
      try { f.el.volume = Math.max(0, Math.min(1, v)); } catch (e) { }
      if (k >= 1) {
        if (f.stopAtEnd) {
          // Pause and drop the reference; that's all. Do NOT clear src and call
          // load() to "release" the element: with no src attribute the media
          // element re-runs resource selection against the document's own URL,
          // so it tries to play index.html as audio. Under file:// that also
          // trips the unique-origin check and prints an alarming security
          // warning for what is really just a finished crossfade. The element
          // is unreferenced after this and gets collected normally.
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
    // Drop any fade already running on this element, otherwise two ramps fight.
    for (let i = fading.length - 1; i >= 0; i--) if (fading[i].el === el) fading.splice(i, 1);
    let from = 0;
    try { from = el.volume; } catch (e) { }
    fading.push({ el: el, from: from, to: to, elapsed: 0, dur: dur || 0, stopAtEnd: !!stopAtEnd });
    if (!fadeTimer) fadeTimer = setInterval(stepFades, FADE_STEP_MS);
  }

  // --- Playback -----------------------------------------------------------

  function levelFor(cfg) { return cfg.volume * volume * (ducked ? DUCK_FACTOR : 1.0); }

  function setDucked(on, dur) {
    ducked = !!on;
    const duration = dur != null ? dur : 0.4;
    const targetFreq = ducked ? DUCK_FILTER_FREQ : NORMAL_FILTER_FREQ;

    ensureAudioCtx();
    if (filterNode && audioCtx) {
      try {
        const now = audioCtx.currentTime;
        filterNode.frequency.cancelScheduledValues(now);
        filterNode.frequency.setValueAtTime(filterNode.frequency.value, now);
        filterNode.frequency.exponentialRampToValueAtTime(Math.max(10, targetFreq), now + duration);
      } catch (e) {
        try { filterNode.frequency.value = targetFreq; } catch (err) {}
      }
    }

    if (current) fadeTo(current.el, levelFor(current.cfg), duration);
  }

  function startTrack(path, cat, cfg) {
    let el;
    try {
      el = new Audio();
      el.src = path;
      el.loop = false;          // looping handled below so playlists can advance
      el.preload = 'auto';
      el.volume = 0;
    } catch (e) { return null; }

    connectElementToWebAudio(el);

    el.addEventListener('ended', function () {
      if (!current || current.el !== el) return;
      if (cfg.loop) {
        // For single-track categories (like win or lose), loop the same track directly
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
        // A sting finished. Leave silence rather than guessing what follows --
        // the next screen transition will ask for whatever is right.
        current = null;
      }
    });

    // A missing or corrupt file must not strand the category: skip to the next
    // entry if there is one, otherwise go quiet.
    el.addEventListener('error', function () {
      if (!current || current.el !== el) return;
      current = null;
      if (cfg.loop && playlist.length) advance(cat, cfg);
    });

    const p = (function () { try { return el.play(); } catch (e) { return null; } })();
    if (p && typeof p.catch === 'function') {
      p.catch(function (err) {
        // Autoplay refused, almost always because no gesture has happened yet.
        // Remember the intent and replay it from unlock().
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
    fadeTo(current.el, 0, fadeOut == null ? 0.6 : fadeOut, true);
    current = null;
  }

  // The only entry point that matters. Idempotent: asking for the category
  // that is already playing does nothing, so screen code can call it freely on
  // every transition without tracking what came before.
  function playCategory(cat) {
    const cfg = CATEGORY[cat];
    if (!cfg) return;

    const list = TRACKS[cat] || [];
    if (!list.length) {
      // Nothing recorded for this category. A bed with no tracks means silence;
      // a missing sting leaves whatever is playing alone rather than cutting it.
      if (cfg.loop) { category = cat; stopCurrent(cfg.fadeOut); }
      return;
    }

    // Always restore ducking state when requesting a category
    if (ducked) {
      setDucked(false, 0.4);
    }

    if (category === cat && current) {
      // Category is already requested and current exists
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

  // --- Public surface -----------------------------------------------------

  return {
    menu: function () { playCategory('menu'); },
    battle: function () { playCategory('battle'); },
    win: function () { playCategory('win'); },
    lose: function () { playCategory('lose'); },

    play: playCategory,
    current: function () { return category; },
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

    // Master music trim, 0..1. Applied on top of each category's own level.
    setVolume: function (v) {
      volume = Math.max(0, Math.min(1, v));
      if (current) fadeTo(current.el, levelFor(current.cfg), 0.15);
    },

    // Call from the first real user gesture. Mobile browsers and WebView both
    // refuse to start audio before one, so whatever category was requested
    // during the loading screen is held in `pending` and released here.
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

    // WebView suspends but does not always pause media when the app goes to the
    // background; without this, music keeps playing over the launcher.
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

    // Exposed so audio-lab.html can list and audition what is configured
    // without duplicating the track table.
    _tracks: function () { return TRACKS; },
    _categories: function () { return CATEGORY; },

    // Type MusicManager.diagnose() in the console when music is silent. Every
    // reason it can legitimately stay quiet -- no tracks listed, toggle off, no
    // gesture yet, file failed to load -- is invisible by design, because this
    // file swallows errors rather than risk throwing into the game loop. This
    // is the window into that.
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
          // readyState 0 means the browser never got any data: almost always a
          // wrong path or a filename whose case doesn't match on disk.
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
