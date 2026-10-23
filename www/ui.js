// [UI100] Presentation layer and rendering pipeline initialization.

// [UI100.01] Thread Lag & Memory Monitor: High-frequency sampler tracking WebView thread freezes (>20ms).
window._maxThreadLag = 0;
window._lastThreadLag = 0;

(function initThreadLagMonitor() {
  let lastTick = performance.now();
  const lagSamples = [];

  setInterval(() => {
    const now = performance.now();
    const delta = now - lastTick;
    lastTick = now;

    const lag = Math.max(0, Math.round(delta - 20));

    if (lag > 5) {
      lagSamples.push({ time: now, lag: lag });
      if (lag > window._maxThreadLag) {
        window._maxThreadLag = lag;
      }
    }

    const cutoff = now - 2000;
    while (lagSamples.length > 0 && lagSamples[0].time < cutoff) {
      lagSamples.shift();
    }

    let peakLast = 0;
    for (let i = 0; i < lagSamples.length; i++) {
      if (lagSamples[i].lag > peakLast) {
        peakLast = lagSamples[i].lag;
      }
    }
    window._lastThreadLag = peakLast;
  }, 20);
})();

function getJSHeapSizeMB() {
  if (typeof performance !== 'undefined' && performance.memory && typeof performance.memory.usedJSHeapSize === 'number') {
    return performance.memory.usedJSHeapSize / (1024 * 1024);
  }
  return null;
}

window.perfProfiler = {
  times: { sim: 0, towers: 0, drawMobs: 0, drawFx: 0, total: 0 },
  accum: { sim: 0, towers: 0, drawMobs: 0, drawFx: 0, frames: 0 },
  lastFlush: performance.now(),
  report: ''
};

// [UI101] Glow sprites cache for high-performance additive blending.
const GLOW_SPRITES = Object.create(null);
function createGlowSprite(color) {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const gCtx = c.getContext('2d');
  const half = size / 2;
  const grad = gCtx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, color);
  grad.addColorStop(1, 'transparent');
  gCtx.fillStyle = grad;
  gCtx.beginPath();
  gCtx.arc(half, half, half, 0, Math.PI * 2);
  gCtx.fill();
  return c;
}

// [UI102] Offscreen canvas cache for static grid and track rendering.
let offscreenGridCanvas = null;
let offscreenGridDirty = true;

function invalidateGridCache() {
  offscreenGridDirty = true;
}

function updateOffscreenGrid() {
  if (!offscreenGridCanvas) {
    offscreenGridCanvas = document.createElement('canvas');
  }
  
  const w = COLS * TILE_SIZE;
  const h = ROWS * TILE_SIZE;
  
  if (offscreenGridCanvas.width !== w || offscreenGridCanvas.height !== h) {
    offscreenGridCanvas.width = w;
    offscreenGridCanvas.height = h;
  }
  
  const oCtx = offscreenGridCanvas.getContext('2d');
  oCtx.clearRect(0, 0, w, h);
  
  // [UI102.01] Static grid cell background rendering.
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellVal = grid[r] ? grid[r][c] : 0;
      oCtx.fillStyle = (cellVal === 1) ? 'rgba(16, 26, 52, 0.50)' : (cellVal === 3 ? 'rgba(0, 0, 0, 0.75)' : 'rgba(10, 14, 26, 0.35)');
      oCtx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      oCtx.strokeStyle = (cellVal === 1) ? 'rgba(35, 60, 110, 0.60)' : (cellVal === 3 ? 'rgba(0, 0, 0, 0.90)' : 'rgba(20, 32, 58, 0.40)');
      oCtx.lineWidth = 1;
      oCtx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  oCtx.save();
  oCtx.strokeStyle = 'rgba(0, 229, 255, 0.22)';
  oCtx.lineWidth = 1.5;
  
  // [UI102.02] Static track side rails rendering.
  if (typeof pathCells !== 'undefined' && Array.isArray(pathCells)) {
    pathCells.forEach(cell => {
      if (cell.rails) {
        cell.rails.forEach(rail => {
          oCtx.beginPath();
          oCtx.moveTo(rail.x1, rail.y1);
          oCtx.lineTo(rail.x2, rail.y2);
          oCtx.stroke();
        });
      }
      if (cell.turnPivot && cell.turnAngles && cell.turnRadii) {
        cell.turnRadii.forEach(rad => {
          oCtx.beginPath();
          oCtx.arc(cell.turnPivot.x, cell.turnPivot.y, rad, cell.turnAngles.start, cell.turnAngles.end, cell.turnAngles.anticlockwise);
          oCtx.stroke();
        });
      }
    });
  }
  oCtx.restore();

  offscreenGridDirty = false;
}

// [UI103] Offscreen neon disc sprite cache for particle rendering optimization.
const NEON_DISC_SPRITES = Object.create(null);
function getNeonDiscSprite(color) {
  if (NEON_DISC_SPRITES[color]) return NEON_DISC_SPRITES[color];
  const size = 32;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const gCtx = c.getContext('2d');
  const half = size / 2;
  const grad = gCtx.createRadialGradient(half, half, 1, half, half, half);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.35, color);
  grad.addColorStop(0.85, color + '55');
  grad.addColorStop(1, 'transparent');
  gCtx.fillStyle = grad;
  gCtx.beginPath();
  gCtx.arc(half, half, half, 0, Math.PI * 2);
  gCtx.fill();
  NEON_DISC_SPRITES[color] = c;
  return c;
}

// [UI104] Offscreen sprite cache for enemy geometry rendering.
const ENEMY_SPRITE_CACHE = Object.create(null);

function getEnemyShapeSprite(shape, color, radius, glowColor) {
  const safeShape = shape || 'circle';
  const safeColor = color || '#00e5ff';
  const safeGlow = glowColor || safeColor;
  const safeR = Math.max(4, Math.round(radius || 12));
  const key = `${safeShape}_${safeColor}_${safeGlow}_${safeR}`;

  if (ENEMY_SPRITE_CACHE[key]) return ENEMY_SPRITE_CACHE[key];

  const padding = 10;
  const size = Math.ceil((safeR * 1.5 + padding) * 2);
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const sCtx = c.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  sCtx.save();
  sCtx.translate(cx, cy);

  // [UI104.01] Diffuse neon glow lighting pass.
  const grad = sCtx.createRadialGradient(0, 0, 2, 0, 0, safeR * 2.2);
  grad.addColorStop(0, safeGlow + '66');
  grad.addColorStop(0.5, safeGlow + '20');
  grad.addColorStop(1, 'transparent');
  sCtx.fillStyle = grad;
  sCtx.beginPath();
  sCtx.arc(0, 0, safeR * 2.2, 0, Math.PI * 2);
  sCtx.fill();

  // [UI104.02] Primary geometry body and neon outline pass.
  sCtx.fillStyle = safeGlow + '33';
  sCtx.strokeStyle = safeColor;
  sCtx.lineWidth = 2.4;

  sCtx.beginPath();
  if (safeShape === 'circle') {
    sCtx.arc(0, 0, safeR, 0, Math.PI * 2);
  } else if (safeShape === 'triangle') {
    const R = safeR * 1.2;
    sCtx.moveTo(R, 0);
    sCtx.lineTo(-R * 0.5, R * 0.866);
    sCtx.lineTo(-R * 0.5, -R * 0.866);
    sCtx.closePath();
  } else if (safeShape === 'trapezoid' || safeShape === 'triangle_inverted') {
    sCtx.moveTo(safeR * 1.2, -safeR * 0.4);
    sCtx.lineTo(safeR * 1.2, safeR * 0.4);
    sCtx.lineTo(-safeR * 0.8, safeR * 0.9);
    sCtx.lineTo(-safeR * 0.8, -safeR * 0.9);
    sCtx.closePath();
  } else if (safeShape === 'kite') {
    sCtx.moveTo(safeR * 1.4, 0);
    sCtx.lineTo(0, -safeR * 0.9);
    sCtx.lineTo(-safeR * 1.1, 0);
    sCtx.lineTo(0, safeR * 0.9);
    sCtx.closePath();
  } else if (safeShape === 'square') {
    const s = safeR * 1.5;
    if (typeof sCtx.roundRect === 'function') {
      sCtx.roundRect(-s/2, -s/2, s, s, 3);
    } else {
      sCtx.rect(-s/2, -s/2, s, s);
    }
  } else if (safeShape === 'diamond') {
    sCtx.moveTo(0, -safeR * 1.3);
    sCtx.lineTo(safeR * 1.1, 0);
    sCtx.lineTo(0, safeR * 1.3);
    sCtx.lineTo(-safeR * 1.1, 0);
    sCtx.closePath();
  } else if (safeShape === 'hexagon') {
    for (let hx = 0; hx < 6; hx++) {
      const a = (hx * Math.PI) / 3;
      const hxX = Math.cos(a) * safeR * 1.15;
      const hxY = Math.sin(a) * safeR * 1.15;
      if (hx === 0) sCtx.moveTo(hxX, hxY); else sCtx.lineTo(hxX, hxY);
    }
    sCtx.closePath();
  } else if (safeShape === 'octagon') {
    for (let oc = 0; oc < 8; oc++) {
      const a = (oc * Math.PI) / 4;
      const ocX = Math.cos(a) * safeR * 1.2;
      const ocY = Math.sin(a) * safeR * 1.2;
      if (oc === 0) sCtx.moveTo(ocX, ocY); else sCtx.lineTo(ocX, ocY);
    }
    sCtx.closePath();
  } else {
    sCtx.arc(0, 0, safeR, 0, Math.PI * 2);
  }

  sCtx.fill();
  sCtx.stroke();
  sCtx.restore();

  ENEMY_SPRITE_CACHE[key] = {
    canvas: c,
    half: cx
  };
  return ENEMY_SPRITE_CACHE[key];
}

// [UI105] Offscreen concentric smoke sprite cache.
let SMOKE_SPRITE = null;
function getSmokeSprite() {
  if (SMOKE_SPRITE) return SMOKE_SPRITE;
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const sCtx = c.getContext('2d');
  const half = size / 2;
  const grad = sCtx.createRadialGradient(half, half, 4, half, half, half);
  grad.addColorStop(0, 'rgba(48, 54, 76, 0.9)');
  grad.addColorStop(0.5, 'rgba(28, 32, 48, 0.6)');
  grad.addColorStop(0.85, 'rgba(15, 18, 28, 0.2)');
  grad.addColorStop(1, 'transparent');
  sCtx.fillStyle = grad;
  sCtx.beginPath();
  sCtx.arc(half, half, half, 0, Math.PI * 2);
  sCtx.fill();
  SMOKE_SPRITE = c;
  return c;
}

function getGlowSprite(color) {
  if (!GLOW_SPRITES[color]) {
    GLOW_SPRITES[color] = createGlowSprite(color);
  }
  return GLOW_SPRITES[color];
}

// [UI107] Banner and incoming threat alert visual indicators.
function showNewTowerBanner(type) {
  const banner = document.getElementById('newTowerBanner');
  if (!banner) return;
  const iconBox = document.getElementById('newTowerBannerIcon');
  const nameEl = document.getElementById('newTowerBannerName');
  if (iconBox) iconBox.innerHTML = TOWER_ICONS[type] || '';
  if (nameEl) nameEl.textContent = TOWER_NAMES[type] || type;
  banner.classList.add('visible');
  newTowerBannerHideTimer = 4.5;
}

function hideNewTowerBanner() {
  const banner = document.getElementById('newTowerBanner');
  if (banner) banner.classList.remove('visible');
  newTowerBannerHideTimer = 0;
}

function showIncomingAlert(type) {
  const banner = document.getElementById('incomingAlertBanner');
  const textEl = document.getElementById('incomingAlertText');
  if (!banner || !textEl) return;

  banner.className = 'incoming-alert-banner';
  if (type === 'boss') {
    banner.classList.add('boss');
    textEl.textContent = '⚠️ BOSS INCOMING ⚠️';
  } else if (type === 'miniboss') {
    banner.classList.add('miniboss');
    textEl.textContent = '⚡ MINI BOSS INCOMING ⚡';
  } else {
    return;
  }

  banner.classList.add('visible');
  activeBossAlertType = type;
  bossAlertShown = true;
  bossAlertHideTimer = 3.0;
}

function hideIncomingAlert() {
  const banner = document.getElementById('incomingAlertBanner');
  if (banner) banner.classList.remove('visible');
  activeBossAlertType = null;
}

// [UI108] Viewport canvas resize and camera coordinate transform system.
function resizeCanvasAndCamera() {
  const vpWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const vpHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.width = vpWidth * dpr;
  canvas.height = vpHeight * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  FIELD_WIDTH = COLS * TILE_SIZE;
  FIELD_HEIGHT = ROWS * TILE_SIZE;

  const topHudEl = document.getElementById('topHud');
  const bottomEl = document.getElementById('controlsWrapper');
  const topH = (topHudEl && !topHudEl.classList.contains('hidden'))
    ? topHudEl.getBoundingClientRect().height
    : 76;
  const bottomH = (bottomEl && !bottomEl.classList.contains('hidden'))
    ? bottomEl.getBoundingClientRect().height
    : 110;

  const usableHeight = Math.max(220, vpHeight - topH - bottomH);

  const PADDING_CELLS = 1;
  const paddedWidth = FIELD_WIDTH + (TILE_SIZE * PADDING_CELLS * 2);
  const paddedHeight = FIELD_HEIGHT + (TILE_SIZE * PADDING_CELLS * 2);

  const oldBaseZoom = baseZoom || 1.0;
  const zoomRatio = (camZoom && oldBaseZoom) ? (camZoom / oldBaseZoom) : 1.0;

  baseZoom = Math.min(vpWidth / paddedWidth, usableHeight / paddedHeight);
  minZoom = baseZoom * 0.90;
  maxZoom = Math.max(1.8, baseZoom * 2.2);

  camZoom = Math.min(maxZoom, Math.max(minZoom, baseZoom * zoomRatio));

  const targetCenterY = topH + (usableHeight / 2);
  camX = (vpWidth / 2) - (FIELD_WIDTH * camZoom / 2);
  camY = targetCenterY - (FIELD_HEIGHT * camZoom / 2);

  clampCamera();
  if (typeof invalidateGridCache === 'function') {
    invalidateGridCache();
  }
}

function clampCamera() {
  const screenW = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const screenH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const viewFieldW = FIELD_WIDTH * camZoom;
  const viewFieldH = FIELD_HEIGHT * camZoom;

  const topHudEl = document.getElementById('topHud');
  const bottomEl = document.getElementById('controlsWrapper');
  const topH = (topHudEl && !topHudEl.classList.contains('hidden'))
    ? topHudEl.getBoundingClientRect().height
    : 76;
  const bottomH = (bottomEl && !bottomEl.classList.contains('hidden'))
    ? bottomEl.getBoundingClientRect().height
    : 110;

  const usableHeight = Math.max(100, screenH - topH - bottomH);

  if (viewFieldW <= screenW) {
    camX = (screenW - viewFieldW) / 2;
  } else {
    camX = Math.max(screenW - viewFieldW, Math.min(0, camX));
  }

  if (viewFieldH <= usableHeight) {
    camY = topH + (usableHeight - viewFieldH) / 2;
  } else {
    const minY = (screenH - bottomH) - viewFieldH;
    const maxY = topH;
    camY = Math.max(minY, Math.min(maxY, camY));
  }
}

function screenToWorld(sx, sy) {
  const rect = canvas.getBoundingClientRect();
  const relX = sx - rect.left;
  const relY = sy - rect.top;
  return {
    x: (relX - camX) / camZoom,
    y: (relY - camY) / camZoom
  };
}

function worldToScreen(wx, wy) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: wx * camZoom + camX + rect.left,
    y: wy * camZoom + camY + rect.top
  };
}

window.addEventListener('resize', resizeCanvasAndCamera);
window.addEventListener('orientationchange', () => {
  setTimeout(resizeCanvasAndCamera, 100);
});
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', resizeCanvasAndCamera);
  window.visualViewport.addEventListener('scroll', resizeCanvasAndCamera);
}
window.addEventListener('load', resizeCanvasAndCamera);

// [UI109] Lock default touch behaviors on active canvas and UI overlays.
document.addEventListener('touchmove', (e) => {
  if (gameState === 'PLAYING') {
    const isScrollableOverlay = e.target.closest && e.target.closest('.result-stack, .upgrades-row-list, .settings-box');
    if (!isScrollableOverlay && e.cancelable) {
      e.preventDefault();
    }
  }
}, { passive: false });

// [UI110] Interactive level tutorial overlay and sequence step controller.
function initTutorialForLevel(lvl) {
  tutorialActive = false;
  tutorialLevel = null;
  tutorialStep = -1;
  tutorialTargetTower = null;
  tutorialDestCell = null;
  hideTutorialUI();

  if (lvl === 1 && !tutorialSeen.l1 && !hasClearedLevelBefore(1)) {
    tutorialActive = true;
    tutorialLevel = 1;
    tutorialStep = 0;
    tutorialDestCell = findTutorialBuildCell();
    const skipBtn = document.getElementById('tutorialSkipBtn');
    if (skipBtn) skipBtn.classList.remove('hidden');
  } else if (lvl === 2 && !tutorialSeen.l2 && !hasClearedLevelBefore(2)) {
    tutorialActive = true;
    tutorialLevel = 2;
    tutorialStep = -1;
    const skipBtn = document.getElementById('tutorialSkipBtn');
    if (skipBtn) skipBtn.classList.remove('hidden');
  }
}

function hideTutorialUI() {
  const layer = document.getElementById('tutorialLayer');
  if (layer) layer.classList.add('hidden');
  const skipBtn = document.getElementById('tutorialSkipBtn');
  if (skipBtn) skipBtn.classList.add('hidden');
}

function completeTutorial(lvl) {
  tutorialActive = false;
  tutorialLevel = null;
  tutorialStep = -1;
  tutorialTargetTower = null;
  if (lvl === 1) tutorialSeen.l1 = true;
  if (lvl === 2) tutorialSeen.l2 = true;
  hideTutorialUI();
  saveGameSoon();
  safeTrack('tutorial_step_complete', { level: lvl });
}

function skipTutorial() {
  if (!tutorialActive || !tutorialLevel) return;
  completeTutorial(tutorialLevel);
}

function buildDiagnostics() {
  const probe = (label, fn) => {
    try { return { label, ok: true, value: fn() }; }
    catch (e) { return { label, ok: false, value: 'ERROR: ' + (e && e.message ? e.message : e) }; }
  };

  function audioReport() {
    const rows = [];
    rows.push(probe('audio.js loaded', () => typeof SFX !== 'undefined' && !!SFX));
    rows.push(probe('music.js loaded', () => typeof MusicManager !== 'undefined' && !!MusicManager));
    rows.push(probe('settings.sfxVolume', () => settings.sfxVolume));
    rows.push(probe('settings.musicVolume', () => settings.musicVolume));
    rows.push(probe('SFX.isEnabled()', () => SFX.isEnabled()));
    rows.push(probe('MUSIC.isEnabled()', () => MusicManager.isEnabled()));
    rows.push(probe('MUSIC.current()', () => MusicManager.current()));
    rows.push(probe('AudioContext state', () => {
      const c = SFX._ctx && SFX._ctx();
      return c ? c.state : 'no context yet (needs a tap)';
    }));
    rows.push(probe('sample pack loaded', () => {
      const n = SFX.sampleNames ? SFX.sampleNames() : [];
      return n.length ? n.length + ' samples' : 'none (using synth ticks)';
    }));
    return rows;
  }

  function generalReport() {
    return [
      probe('game booted', () => !!window.__gameBooted),
      probe('gameState', () => gameState),
      probe('currentLevel / maxUnlocked', () => `${currentLevel} / ${maxUnlockedLevel}`),
      probe('devMode', () => devMode),
      probe('perfMode', () => perfMode),
      probe('towers / enemies / projectiles', () => `${towers.length} / ${enemies.length} / ${projectiles.length}`),
      probe('data.js levels', () => Object.keys(LEVELS_DATA).length),
      probe('save present', () => !!localStorage.getItem('sectorDefenseTD_save_v1')),
      probe('selectedLoadout', () => selectedLoadout.join(', '))
    ];
  }

  function print(title, rows) {
    console.group('%c' + title, 'color:#00e5ff;font-weight:bold');
    rows.forEach(r => {
      const bad = !r.ok || r.value === false;
      console.log('%c' + (bad ? '✗' : '✓') + ' ' + r.label + ':',
        'color:' + (bad ? '#ff2a85' : '#8ef3ff'), r.value);
    });
    console.groupEnd();
  }

  const diag = function () {
    print('Synth Wave Defense — diagnostics', generalReport());
    print('Audio', audioReport());
    console.log('%cTip: diag.audio() for audio only, diag.fix() to force-restart audio, diag.silent() to check why nothing is audible.', 'color:#6f7c96');
    return undefined;
  };

  diag.audio = function () { print('Audio', audioReport()); };
  diag.game = function () { print('Game', generalReport()); };

  diag.silent = function () {
    const reasons = [];
    try {
      if (typeof SFX === 'undefined' || !SFX) reasons.push('audio.js did not load');
      else {
        if (!SFX.isEnabled()) reasons.push('SFX disabled — sound volume is at 0 in Settings');
        const c = SFX._ctx && SFX._ctx();
        if (!c) reasons.push('AudioContext not created yet — browser requires a gesture');
        else if (c.state === 'suspended') reasons.push('AudioContext suspended — tap page once or call diag.fix()');
      }
      if (typeof MusicManager === 'undefined' || !MusicManager) reasons.push('music.js did not load');
      else {
        if (!MusicManager.isEnabled()) reasons.push('music disabled — music volume is at 0 in Settings');
        if (!MusicManager.current()) reasons.push('no music category active right now');
      }
    } catch (e) { reasons.push('probe threw: ' + e.message); }

    if (!reasons.length) console.log('%c✓ Nothing is muting audio — it should be audible.', 'color:#8ef3ff');
    else reasons.forEach(r => console.log('%c✗ ' + r, 'color:#ff2a85'));
  };

  diag.fix = function () {
    try { SFX.unlock(); } catch (e) { console.log('SFX.unlock failed:', e.message); }
    try { musicUnlock(); } catch (e) { console.log('musicUnlock failed:', e.message); }
    try {
      applySfxVolume(settings.sfxVolume != null ? settings.sfxVolume : 100, false);
      applyMusicVolume(settings.musicVolume != null ? settings.musicVolume : 70, false);
    } catch (e) { console.log('volume reapply failed:', e.message); }
    try {
      const want = (gameState === 'PLAYING' || gameState === 'PAUSED') ? 'battle' : 'menu';
      MusicManager.play(want);
      console.log('%c✓ audio re-armed, music category: ' + want, 'color:#8ef3ff');
    } catch (e) { console.log('music restart failed:', e.message); }
  };

  diag.testSound = function () {
    try {
      SFX.unlock();
      ['tap', 'gun', 'explosion'].forEach((n, i) => setTimeout(() => SFX.play(n), i * 260));
      console.log('%cPlaying test audio ticks…', 'color:#8ef3ff');
    } catch (e) { console.log('test failed:', e.message); }
  };

  return diag;
}
window.diag = buildDiagnostics();

window.resetTutorial = function () {
  tutorialSeen.l1 = false;
  tutorialSeen.l2 = false;
  tutorialSeen.l3 = false;
  Object.keys(tutorialSeen).forEach(k => {
    if (k.startsWith('towerUnlock_l')) tutorialSeen[k] = false;
  });
  saveGameSoon();
  console.log('Tutorial flags reset.');
};

function findTutorialBuildCell() {
  const centerC = (COLS - 1) / 2;
  const centerR = (ROWS - 1) / 2;
  let best = null;
  let bestDist = Infinity;
  for (let r = 0; r < ROWS; r++) {
    if (!grid[r]) continue;
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] !== 0) continue;
      const d = Math.hypot(c - centerC, r - centerR);
      if (d < bestDist) {
        bestDist = d;
        best = { c, r };
      }
    }
  }
  return best;
}

function applyTutorialHighlight(rect, text, mode) {
  const pad = 10;
  const spotlight = document.getElementById('tutorialSpotlight');
  spotlight.style.left = (rect.x - pad) + 'px';
  spotlight.style.top = (rect.y - pad) + 'px';
  spotlight.style.width = (rect.w + pad * 2) + 'px';
  spotlight.style.height = (rect.h + pad * 2) + 'px';
  spotlight.classList.remove('hidden');

  const cx = rect.x + rect.w / 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const placeAbove = rect.y > vh * 0.5;

  const bubble = document.getElementById('tutorialBubble');
  document.getElementById('tutorialBubbleText').textContent = text;
  bubble.style.left = Math.min(Math.max(cx, 116), vw - 116) + 'px';
  bubble.style.top = placeAbove ? (rect.y - pad - 54) + 'px' : (rect.y + rect.h + pad + 16) + 'px';
  bubble.classList.remove('hidden');

  if (mode === 'tap') {
    const tapPulse = document.getElementById('tutorialTapPulse');
    tapPulse.style.left = cx + 'px';
    tapPulse.style.top = (rect.y + rect.h / 2) + 'px';
    tapPulse.classList.remove('hidden');
    document.getElementById('tutorialPointer').classList.add('hidden');
    document.getElementById('tutorialDropRing').classList.add('hidden');
  }
}

function positionTutorialTapOnElement(el, text) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  applyTutorialHighlight({ x: r.left, y: r.top, w: r.width, h: r.height }, text, 'tap');
}

function positionTutorialTapAtWorld(wx, wy, text) {
  const screen = worldToScreen(wx, wy);
  const radius = 26 * camZoom;
  applyTutorialHighlight({ x: screen.x - radius, y: screen.y - radius, w: radius * 2, h: radius * 2 }, text, 'tap');
}

function positionTutorialCloseStep() {
  const topLeft = worldToScreen(0, 0);
  const bottomRight = worldToScreen(FIELD_WIDTH, FIELD_HEIGHT);
  const pad = 6;
  const fieldWidth = Math.max(0, (bottomRight.x - topLeft.x) - pad * 2);
  const fieldHeight = Math.max(0, (bottomRight.y - topLeft.y) - pad * 2);

  const fieldEl = document.getElementById('tutorialFieldHighlight');
  if (fieldEl) {
    fieldEl.style.left = (topLeft.x + pad) + 'px';
    fieldEl.style.top = (topLeft.y + pad) + 'px';
    fieldEl.style.width = fieldWidth + 'px';
    fieldEl.style.height = fieldHeight + 'px';
    fieldEl.classList.remove('hidden');
  }

  const spotlight = document.getElementById('tutorialSpotlight');
  if (spotlight) {
    spotlight.style.left = (topLeft.x + pad) + 'px';
    spotlight.style.top = (topLeft.y + pad) + 'px';
    spotlight.style.width = fieldWidth + 'px';
    spotlight.style.height = fieldHeight + 'px';
    spotlight.classList.remove('hidden');
  }

  const cx = topLeft.x + (bottomRight.x - topLeft.x) / 2;
  const cy = topLeft.y + (bottomRight.y - topLeft.y) / 2;
  const vw = window.innerWidth;

  const bubble = document.getElementById('tutorialBubble');
  const bubbleText = document.getElementById('tutorialBubbleText');
  if (bubbleText) bubbleText.textContent = 'Tap the field to close';
  if (bubble) {
    bubble.style.left = Math.min(Math.max(cx, 116), vw - 116) + 'px';
    bubble.style.top = Math.max(16, cy - 30) + 'px';
    bubble.classList.remove('hidden');
  }

  const tapPulse = document.getElementById('tutorialTapPulse');
  if (tapPulse) {
    tapPulse.style.left = cx + 'px';
    tapPulse.style.top = cy + 'px';
    tapPulse.classList.remove('hidden');
  }

  const pointer = document.getElementById('tutorialPointer');
  if (pointer) pointer.classList.add('hidden');
  const dropRing = document.getElementById('tutorialDropRing');
  if (dropRing) dropRing.classList.add('hidden');
}

function updateTutorialOverlay(now) {
  const layer = document.getElementById('tutorialLayer');
  if (!layer) return;
  if (!tutorialActive || gameState !== 'PLAYING' || tutorialStep < 0) {
    layer.classList.add('hidden');
    return;
  }
  layer.classList.remove('hidden');

  const fieldEl = document.getElementById('tutorialFieldHighlight');
  if (fieldEl && !(tutorialLevel === 2 && tutorialStep === 2)) fieldEl.classList.add('hidden');

  if (tutorialLevel === 1 && tutorialStep === 0) {
    positionTutorialDrag(now);
  } else if (tutorialLevel === 1 && tutorialStep === 1) {
    positionTutorialTapOnElement(document.getElementById('waveBtn'), 'Tap GO to start the wave');
  } else if (tutorialLevel === 2 && tutorialStep === 0 && tutorialTargetTower) {
    positionTutorialTapAtWorld(tutorialTargetTower.x, tutorialTargetTower.y, 'Tap your tower');
  } else if (tutorialLevel === 2 && tutorialStep === 1) {
    positionTutorialTapOnElement(document.getElementById('inspectUpgradeBtn'), 'Upgrade it here');
  } else if (tutorialLevel === 2 && tutorialStep === 2) {
    positionTutorialCloseStep();
  }
}

function positionTutorialDrag(now) {
  const srcEl = document.getElementById('btn-gun');
  if (!srcEl || !tutorialDestCell) return;
  const srcRect = srcEl.getBoundingClientRect();
  applyTutorialHighlight({ x: srcRect.left, y: srcRect.top, w: srcRect.width, h: srcRect.height }, 'Drag a tower onto the field', 'drag');

  const destWorld = {
    x: tutorialDestCell.c * TILE_SIZE + TILE_SIZE / 2,
    y: tutorialDestCell.r * TILE_SIZE + TILE_SIZE / 2
  };
  const destScreen = worldToScreen(destWorld.x, destWorld.y);
  const tileScreenSize = TILE_SIZE * camZoom;

  const dropRing = document.getElementById('tutorialDropRing');
  dropRing.style.left = (destScreen.x - tileScreenSize * 0.36) + 'px';
  dropRing.style.top = (destScreen.y - tileScreenSize * 0.36) + 'px';
  dropRing.style.width = (tileScreenSize * 0.72) + 'px';
  dropRing.style.height = (tileScreenSize * 0.72) + 'px';
  dropRing.classList.remove('hidden');

  const srcCx = srcRect.left + srcRect.width / 2;
  const srcCy = srcRect.top + srcRect.height / 2;

  const period = 2200;
  const t = (now % period) / period;
  let px, py, opacity;
  if (t < 0.12) {
    px = srcCx; py = srcCy; opacity = 1;
  } else if (t < 0.55) {
    const localT = (t - 0.12) / 0.43;
    const eased = localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;
    px = srcCx + (destScreen.x - srcCx) * eased;
    py = srcCy + (destScreen.y - srcCy) * eased;
    opacity = 1;
  } else if (t < 0.75) {
    px = destScreen.x; py = destScreen.y; opacity = 1;
  } else if (t < 0.85) {
    px = destScreen.x; py = destScreen.y;
    opacity = 1 - (t - 0.75) / 0.10;
  } else {
    px = srcCx; py = srcCy; opacity = 0;
  }

  const pointer = document.getElementById('tutorialPointer');
  pointer.style.left = px + 'px';
  pointer.style.top = py + 'px';
  pointer.style.opacity = opacity;
  pointer.classList.remove('hidden');

  document.getElementById('tutorialTapPulse').classList.add('hidden');
}

function setGlow(color, blur) {
  if (perfMode === 'low') {
    ctx.shadowBlur = 0;
    return;
  }
  ctx.shadowColor = color;
  ctx.shadowBlur = Math.min(blur, 8);
}

function pushParticle(p) {
  const cap = perfMode === 'low' ? 55 : 95;
  if (particles.length > cap) {
    if (!p.isSmoke && !p.isBossFx && Math.random() < 0.45) return;
    particles[0].life *= 0.5;
  }
  particles.push(p);
}

function formatResourceVal(val) {
  const n = Math.floor(Number(val) || 0);
  if (n < 1000) return String(n);
  if (n < 10000) {
    const k = Math.floor(n / 100) / 10;
    return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'K';
  }
  if (n < 1000000) {
    return Math.floor(n / 1000) + 'K';
  }
  const m = Math.floor(n / 100000) / 10;
  return (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + 'M';
}

function formatResourceVal(val) {
  const n = Math.floor(Number(val) || 0);
  if (n < 1000) return String(n);
  if (n < 10000) {
    const k = Math.floor(n / 100) / 10;
    return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'K';
  }
  if (n < 1000000) {
    return Math.floor(n / 1000) + 'K';
  }
  const m = Math.floor(n / 100000) / 10;
  return (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + 'M';
}

// Единый контроллер видимости элементов верхней панели
function syncTopHudVisibility() {
  const isActiveBattle = (typeof gameState !== 'undefined' && gameState === 'PLAYING');

  const diamondBadge = document.getElementById('hudDiamondBadge');
  const prismBadge = document.getElementById('hudPrismBadge');
  const econHpBadge = document.getElementById('econHpSplitBadge');
  const levelWaveBadge = document.getElementById('levelWaveSplitBadge');
  const hudRightGroup = document.getElementById('hudRightGroup');

  // В активном бою (PLAYING) скрываем Алмазы и Призмы; в меню, паузе и на экранах итогов — показываем
  if (diamondBadge) diamondBadge.classList.toggle('hidden', isActiveBattle);
  if (prismBadge) prismBadge.classList.toggle('hidden', isActiveBattle);

  // В активном бою (PLAYING) показываем Золото, Жизни, Уровень и Волну; везде вне боя (включая паузу) — скрываем
  if (econHpBadge) econHpBadge.classList.toggle('hidden', !isActiveBattle);
  if (levelWaveBadge) levelWaveBadge.classList.toggle('hidden', !isActiveBattle);

  // Правая группа с кнопкой Settings видна всегда
  if (hudRightGroup) hudRightGroup.classList.remove('hidden');

  // Синхронизируем виджет управления скоростью (он сам скроется, если мы не в бою)
  if (typeof updateHudSpeedWidget === 'function') updateHudSpeedWidget();
}
window.syncTopHudVisibility = syncTopHudVisibility;

function updateDiamondUI() {
  const formatted = formatResourceVal(diamonds);
  const el = document.getElementById('globalDiamondsVal');
  if (el) el.textContent = formatted;
  const elLevels = document.getElementById('levelsDiamondVal');
  if (elLevels) elLevels.textContent = formatted;
  const elUpgrades = document.getElementById('upgradesDiamondVal');
  if (elUpgrades) elUpgrades.textContent = formatted;
  const elShop = document.getElementById('shopDiamondVal');
  if (elShop) elShop.textContent = formatted;
  const elBp = document.getElementById('bpDiamondVal');
  if (elBp) elBp.textContent = formatted;
  const badge = document.getElementById('hudDiamondBadge');
  if (badge) {
    if (devMode) {
      badge.classList.add('interactive');
      badge.title = "Click: +50 / Hold: set amount (Dev Mode)";
    } else {
      badge.classList.remove('interactive');
      badge.removeAttribute('title');
    }
  }
  syncTopHudVisibility();
}

function updatePrismUI() {
  const formatted = formatResourceVal(prisms);
  const el = document.getElementById('globalPrismsVal');
  if (el) el.textContent = formatted;
  const elLevels = document.getElementById('levelsPrismVal');
  if (elLevels) elLevels.textContent = formatted;
  const elUpgrades = document.getElementById('upgradesPrismVal');
  if (elUpgrades) elUpgrades.textContent = formatted;
  const elShop = document.getElementById('shopPrismVal');
  if (elShop) elShop.textContent = formatted;
  const elBp = document.getElementById('bpPrismVal');
  if (elBp) elBp.textContent = formatted;
  const badge = document.getElementById('hudPrismBadge');
  if (badge) {
    if (devMode) {
      badge.classList.add('interactive');
      badge.title = "Click: +10 / Hold: set amount (Dev Mode)";
    } else {
      badge.classList.remove('interactive');
      badge.removeAttribute('title');
    }
  }
  syncTopHudVisibility();
}

let devHoldTimer = null;
let devHoldTriggered = false;
let devHoldStartPos = { x: 0, y: 0 };

function promptDevDiamonds() {
  if (!devMode) return;
  devInputOpen = true;
  const val = prompt("Set Diamonds:", diamonds);
  devInputOpen = false;
  suppressBackgroundPause();
  if (val !== null) {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      diamonds = parsed;
      updateDiamondUI();
      renderUpgradeTree();
      saveGameSoon();
    }
  }
}

function promptDevPrisms() {
  if (!devMode) return;
  devInputOpen = true;
  const val = prompt("Set Prisms:", prisms);
  devInputOpen = false;
  suppressBackgroundPause();
  if (val !== null) {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      prisms = parsed;
      updatePrismUI();
      renderUpgradeTree();
      saveGameSoon();
    }
  }
}

function promptDevGold() {
  if (!devMode) return;
  devInputOpen = true;
  const val = prompt("Set Gold:", gold);
  devInputOpen = false;
  suppressBackgroundPause();
  if (val !== null) {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      gold = parsed;
      updateUI();
    }
  }
}

function promptDevHp() {
  if (!devMode) return;
  devInputOpen = true;
  const val = prompt("Set Lives (HP):", baseHp);
  devInputOpen = false;
  suppressBackgroundPause();
  if (val !== null) {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      baseHp = parsed;
      updateUI();
    }
  }
}

function devPromptLevelSelect() {
  if (!devMode) return;
  devInputOpen = true;
  const val = prompt(`Select Level (1 - ${TOTAL_LEVELS}):`, currentLevel);
  devInputOpen = false;
  suppressBackgroundPause();

  if (val !== null) {
    const lvl = parseInt(val, 10);
    if (!isNaN(lvl) && lvl >= 1 && lvl <= TOTAL_LEVELS) {
      startSpecificLevel(lvl);
    }
  }
}

function devPromptWaveSelect() {
  if (!devMode) return;
  const lvlConfig = (typeof LEVELS_DATA !== 'undefined') ? LEVELS_DATA[currentLevel] : null;
  const maxW = isEndlessMode ? 999 : (lvlConfig ? lvlConfig.totalWaves : 10);

  devInputOpen = true;
  const val = prompt(`Select Wave (1 - ${maxW}):`, wave);
  devInputOpen = false;
  suppressBackgroundPause();

  if (val !== null) {
    const targetW = parseInt(val, 10);
    if (!isNaN(targetW) && targetW >= 1 && (isEndlessMode || targetW <= maxW)) {
      devJumpToWave(targetW);
    }
  }
}

// [UI111] Dev mode resource click and hold handlers.
function initDevResourceHold() {
  const setupHold = (id, promptFn) => {
    const el = document.getElementById(id);
    if (!el || el.dataset.holdBound) return;
    el.dataset.holdBound = '1';

    el.addEventListener('pointerdown', (e) => {
      if (!devMode) return;
      devHoldTriggered = false;
      devHoldStartPos = { x: e.clientX, y: e.clientY };
      clearTimeout(devHoldTimer);
      devHoldTimer = setTimeout(() => {
        devHoldTriggered = true;
        if (typeof vibrate === 'function') vibrate('light');
        else if (navigator.vibrate) { try { navigator.vibrate(35); } catch(e){} }
        promptFn();
      }, 500);
    });

    el.addEventListener('pointermove', (e) => {
      if (!devHoldTimer) return;
      if (Math.hypot(e.clientX - devHoldStartPos.x, e.clientY - devHoldStartPos.y) > 10) {
        clearTimeout(devHoldTimer);
        devHoldTimer = null;
      }
    });

    const cancel = () => {
      clearTimeout(devHoldTimer);
      devHoldTimer = null;
    };
    el.addEventListener('pointerup', cancel);
    el.addEventListener('pointercancel', cancel);
  };

  setupHold('hudDiamondBadge', promptDevDiamonds);
  setupHold('hudPrismBadge', promptDevPrisms);
  setupHold('goldHalf', promptDevGold);
  setupHold('hpHalf', promptDevHp);
}

function handleDevDiamondClick() {
  if (!devMode) return;
  if (devHoldTriggered) {
    devHoldTriggered = false;
    return;
  }
  diamonds += 50;
  updateDiamondUI();
  renderUpgradeTree();
  saveGameSoon();
}

function handleDevPrismClick() {
  if (!devMode) return;
  if (devHoldTriggered) {
    devHoldTriggered = false;
    return;
  }
  prisms += 10;
  updatePrismUI();
  renderUpgradeTree();
  saveGameSoon();
}

function handleDevGoldClick() {
  if (!devMode) return;
  if (devHoldTriggered) {
    devHoldTriggered = false;
    return;
  }
  gold += 200;
  updateUI();
}

function handleDevHpClick() {
  if (!devMode) return;
  if (devHoldTriggered) {
    devHoldTriggered = false;
    return;
  }
  baseHp = Math.min(99, baseHp + 5);
  updateUI();
}

const BASE_BRANCH_ICONS = {
  base_hp: `<svg width="25" height="25" viewBox="-32 -32 64 64"><circle cx="0" cy="0" r="17" fill="none" stroke="#f05f9f" stroke-width="1.6"/><circle cx="0" cy="0" r="11" fill="none" stroke="#f05f9f" stroke-width="1" opacity=".35"/><path d="M 0 8 L -7.5 0.5 A 4.8 4.8 0 0 1 0 -6 A 4.8 4.8 0 0 1 7.5 0.5 Z" fill="#f05f9f"/></svg>`,
  base_gold: `<svg width="25" height="25" viewBox="-32 -32 64 64"><circle cx="0" cy="0" r="17" fill="none" stroke="#f59e0b" stroke-width="1.6"/><circle cx="0" cy="0" r="11" fill="none" stroke="#f59e0b" stroke-width="1" opacity=".35"/><circle cx="0" cy="0" r="8" fill="#f59e0b"/><text x="0" y="4" font-size="11" font-weight="900" fill="#0a0e1c" text-anchor="middle" font-family="Montserrat, sans-serif">$</text></svg>`
};
const BASE_BRANCH_COLORS = { base_hp: '#f05f9f', base_gold: '#f59e0b' };

function enablePointerScroll(el) {
  if (!el || el.dataset.pointerScrollBound) return;
  el.dataset.pointerScrollBound = '1';

  let isDown = false;
  let startY = 0;
  let scrollTop = 0;
  let isDragging = false;

  el.addEventListener('pointerdown', (e) => {
    isDown = true;
    isDragging = false;
    startY = e.clientY;
    scrollTop = el.scrollTop;
  });

  el.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > 4) {
      isDragging = true;
      el.scrollTop = scrollTop - dy;
    }
  });

  const endDrag = (e) => {
    if (isDragging && e) {
      const preventClick = (clickEv) => {
        clickEv.stopPropagation();
        clickEv.preventDefault();
      };
      el.addEventListener('click', preventClick, { capture: true, once: true });
      setTimeout(() => el.removeEventListener('click', preventClick, { capture: true }), 50);
    }
    isDown = false;
    isDragging = false;
  };

  el.addEventListener('pointerup', endDrag);
  el.addEventListener('pointercancel', endDrag);
  el.addEventListener('pointerleave', endDrag);
}

// [UI112] Meta-upgrade skill tree DOM interface renderer.
function renderUpgradeTree() {
  updateDiamondUI();
  updatePrismUI();
  const container = document.getElementById('upgradesTreeBody');
  if (!container) return;
  enablePointerScroll(container);
  container.innerHTML = '';

  const maxStep = devMode ? 10 : getMaxUpgradeStep();
  const isPhase2UnlockedGlobally = devMode || getLoadoutReferenceLevel() >= 31 || maxUnlockedLevel >= 31 || (typeof clearedLevels !== 'undefined' && clearedLevels.includes(30));

  const towerRows = UPGRADE_BRANCH_SPECS.towers.map(card => {
    const towerType = card.icon;
    const isLockedCard = !devMode && getLoadoutReferenceLevel() < getTowerUnlockLevel(towerType);
    return {
      key: card.branches[0].key,
      label: card.title,
      iconHtml: TOWER_ICONS[towerType] || '',
      color: (TOWER_CONFIGS[towerType] && TOWER_CONFIGS[towerType].color) || '#00e5ff',
      isLockedCard,
      lockedLabel: isLockedCard ? `${card.title} (Lv.${getTowerUnlockLevel(towerType)})` : card.title
    };
  });
  const baseRows = (UPGRADE_BRANCH_SPECS.base[0].branches || []).map(br => ({
    key: br.key,
    label: br.name,
    iconHtml: BASE_BRANCH_ICONS[br.key] || '',
    color: BASE_BRANCH_COLORS[br.key] || '#00e5ff',
    isLockedCard: false,
    lockedLabel: br.name
  }));

  const addGroupLabel = (text) => {
    const label = document.createElement('div');
    label.className = 'upgrades-row-group-label';
    label.textContent = text;
    container.appendChild(label);
  };

  const addRow = (row) => {
    const currentLvl = upgradeTreeData[row.key] || 0;
    const nextStep = currentLvl + 1;

    let isSectorGated = false;
    let lvlNeeded = 11;

    if (!row.isLockedCard && !devMode) {
      if (nextStep <= 10) {
        if (nextStep > maxStep) {
          isSectorGated = true;
          if (nextStep > 8) lvlNeeded = 31;
          else if (nextStep > 6) lvlNeeded = 21;
          else lvlNeeded = 11;
        }
      } else {
        if (!isPhase2UnlockedGlobally) {
          isSectorGated = true;
          lvlNeeded = 31;
        }
      }
    }

    const card = document.createElement('div');
    card.className = 'upgrade-row-card' + (row.isLockedCard ? ' locked-row' : '');

    const iconWrap = document.createElement('div');
    iconWrap.className = 'upgrade-row-icon' + (row.isLockedCard ? ' locked-icon' : '');
    iconWrap.style.borderColor = row.isLockedCard ? 'rgba(140,200,255,0.18)' : row.color;
    iconWrap.innerHTML = row.iconHtml;
    card.appendChild(iconWrap);

    const info = document.createElement('div');
    info.className = 'upgrade-row-info';

    const head = document.createElement('div');
    head.className = 'upgrade-row-head';
    const nameEl = document.createElement('span');
    nameEl.className = 'upgrade-row-name' + (row.isLockedCard ? ' locked-name' : '');
    nameEl.textContent = row.isLockedCard ? row.lockedLabel : row.label;

    const lvlEl = document.createElement('span');
    lvlEl.className = 'upgrade-row-level';

    if (row.isLockedCard) {
      lvlEl.style.color = '#5d6a85';
      lvlEl.textContent = 'LOCKED';
    } else if (currentLvl < 10) {
      lvlEl.style.color = row.color;
      lvlEl.textContent = `${currentLvl}/10`;
    } else if (currentLvl < 15) {
      lvlEl.style.color = '#d946ef';
      lvlEl.textContent = `ASC ${currentLvl - 10}/5`;
    } else if (!isScalingBranch(row.key)) {
      lvlEl.style.color = '#d946ef';
      lvlEl.textContent = 'ASCENDED MAX';
    } else {
      lvlEl.style.color = '#00e5ff';
      lvlEl.textContent = `SYNTH +${currentLvl - 15}`;
    }

    head.appendChild(nameEl);
    head.appendChild(lvlEl);
    info.appendChild(head);

    const segs = document.createElement('div');
    segs.className = 'upgrade-row-segments';

    if (currentLvl < 10) {
      for (let s = 1; s <= 10; s++) {
        const seg = document.createElement('div');
        seg.className = 'upgrade-row-seg' + (row.isLockedCard ? ' locked-seg' : '');
        if (!row.isLockedCard && s <= currentLvl) {
          seg.style.background = row.color;
        }
        segs.appendChild(seg);
      }
    } else if (currentLvl < 15 || !isScalingBranch(row.key)) {
      for (let s = 1; s <= 5; s++) {
        const seg = document.createElement('div');
        seg.className = 'upgrade-row-seg' + (row.isLockedCard ? ' locked-seg' : '');
        if (!row.isLockedCard && s <= (currentLvl - 10)) {
          seg.style.background = '#d946ef';
          seg.style.boxShadow = '0 0 8px #d946ef';
        }
        segs.appendChild(seg);
      }
    } else {
      const seg = document.createElement('div');
      seg.className = 'upgrade-row-seg';
      seg.style.flex = '1';
      seg.style.background = 'linear-gradient(90deg, #00e5ff, #d946ef)';
      seg.style.boxShadow = '0 0 10px rgba(217, 70, 239, 0.5)';
      segs.appendChild(seg);
    }
    info.appendChild(segs);
    card.appendChild(info);

    if (devMode && !row.isLockedCard && currentLvl > 0) {
      const minusBtn = document.createElement('button');
      minusBtn.className = 'upgrade-row-dev-minus';
      minusBtn.textContent = '−';
      minusBtn.onclick = () => handleNodeClick(row.key, currentLvl - 1);
      card.appendChild(minusBtn);
    }

    const buyBtn = document.createElement('button');
    buyBtn.className = 'upgrade-row-buy';

    if (row.isLockedCard) {
      buyBtn.classList.add('locked-buy');
      buyBtn.innerHTML = `<span style="font-size:12px; filter:grayscale(1) brightness(.7);">🔒</span>`;
    } else if (currentLvl >= 15 && !isScalingBranch(row.key)) {
      buyBtn.classList.add('locked-buy', 'max-buy');
      buyBtn.innerHTML = `<span class="upgrade-row-buy-cost" style="color:#d946ef; font-size:10px;">ASCENDED MAX</span>`;
      buyBtn.onclick = () => {
        sfx('denied');
        showHintToast('Branch is ASCENDED MAX (Lvl 15)');
      };
    } else if (isSectorGated) {
      buyBtn.classList.add('locked-buy');
      buyBtn.innerHTML = `<span style="font-size:11px; filter:grayscale(1) brightness(.7);">🔒</span><span class="upgrade-row-buy-cost" style="color:#8ea3c4; font-size:10px;">L${lvlNeeded}</span>`;
      buyBtn.onclick = () => {
        sfx('denied');
        showHintToast(`Unlocks on Level ${lvlNeeded}`);
      };
    } else {
      const costs = getUpgradeCostForLevel(nextStep);
      const costD = costs.diamonds;
      const costP = costs.prisms;

      const diamondIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2" stroke-linejoin="round" style="flex:none;"><polygon points="6 3 18 3 22 9 12 22 2 9" fill="rgba(0,229,255,.25)"/><polyline points="2 9 12 13 22 9"/><line x1="12" y1="22" x2="12" y2="13"/></svg>`;
      const prismIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d946ef" stroke-width="2.2" stroke-linejoin="round" style="flex:none;"><polygon points="12 2 21 12 12 22 3 12" fill="rgba(217,70,239,.25)"/><polyline points="3 12 12 15 21 12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`;

      const canAffordD = diamonds >= costD;
      const canAffordP = prisms >= costP;
      const canAffordBoth = canAffordD && canAffordP;

      if (costD > 0 && costP > 0) {
        buyBtn.classList.add('dual-cost-btn');
        buyBtn.innerHTML = `
          <div class="dual-cost-row">
            ${diamondIcon}
            <span class="upgrade-row-buy-cost" style="color:${canAffordD ? '#ffffff' : '#f05f9f'};">${costD}</span>
          </div>
          <div class="dual-cost-row">
            ${prismIcon}
            <span class="upgrade-row-buy-cost" style="color:${canAffordP ? '#ffffff' : '#f05f9f'};">${costP}</span>
          </div>
        `;
      } else if (costP > 0) {
        buyBtn.innerHTML = `${prismIcon}<span class="upgrade-row-buy-cost" style="color:${canAffordP ? '#ffffff' : '#f05f9f'};">${costP}</span>`;
      } else {
        buyBtn.innerHTML = `${diamondIcon}<span class="upgrade-row-buy-cost" style="color:${canAffordD ? '#ffffff' : '#f05f9f'};">${costD}</span>`;
      }

      if (!canAffordBoth) {
        buyBtn.style.opacity = '0.75';
      }

      buyBtn.onclick = () => handleNodeClick(row.key, nextStep);
    }
    card.appendChild(buyBtn);
    container.appendChild(card);
  };

  addGroupLabel('Towers');
  towerRows.forEach(addRow);
  addGroupLabel('Base');
  baseRows.forEach(addRow);
}

let isNavigatingSection = false;
let modeLevelSections = { normal: 1, overdrive: 1, endless: 1 };

function navLevelSection(dir) {
  if (isNavigatingSection) return;
  const target = currentLevelSection + dir;
  if (target < 1 || target > TOTAL_SECTIONS) return;
  
  let isTargetUnlocked = false;
  if (devMode) {
      isTargetUnlocked = true;
  } else if (currentLevelMode === 'overdrive') {
      const reqLvl = (target - 1) * LEVELS_PER_SECTION;
      isTargetUnlocked = reqLvl === 0 || !!overdriveClearedLevels[reqLvl];
  } else {
      isTargetUnlocked = maxUnlockedLevel > (target - 1) * LEVELS_PER_SECTION;
  }
  
  if (!isTargetUnlocked) return;

  const grid = document.getElementById('levelsGrid');
  if (!grid) {
    currentLevelSection = target;
    modeLevelSections[currentLevelMode] = target;
    renderLevelsGrid();
    return;
  }

  isNavigatingSection = true;
  grid.classList.remove('grid-swipe-out-left', 'grid-swipe-out-right', 'grid-swipe-in-left', 'grid-swipe-in-right');
  void grid.offsetWidth;
  const outClass = dir > 0 ? 'grid-swipe-out-left' : 'grid-swipe-out-right';
  const inClass = dir > 0 ? 'grid-swipe-in-right' : 'grid-swipe-in-left';

  grid.classList.add(outClass);

  setTimeout(() => {
    currentLevelSection = target;
    modeLevelSections[currentLevelMode] = target;
    renderLevelsGrid();
    grid.classList.remove(outClass);
    void grid.offsetWidth;
    grid.classList.add(inClass);

    setTimeout(() => {
      grid.classList.remove(inClass);
      isNavigatingSection = false;
    }, 220);
  }, 180);
}

let currentLevelMode = 'normal';

function selectLevelMode(mode) {
  if (mode === 'overdrive') {
    if (!isOverdriveUnlocked()) {
      if (typeof sfx === 'function') sfx('denied');
      if (typeof showHintToast === 'function') showHintToast('Complete Campaign Level 20 to unlock HARDCORE!');
      return;
    }
  } else if (mode === 'endless') {
    if (!isEndlessUnlocked()) {
      if (typeof sfx === 'function') sfx('denied');
      if (typeof showHintToast === 'function') showHintToast('Complete Campaign Level 15 to unlock Endless Arena!');
      return;
    }
  }

  if (typeof sfx === 'function') sfx('confirm');
  
  if (currentLevelMode) {
    modeLevelSections[currentLevelMode] = currentLevelSection;
  }
  
  currentLevelMode = mode;
  isOverdriveMode = (mode === 'overdrive');
  isEndlessMode = (mode === 'endless');

  let targetSec = modeLevelSections[mode] || 1;
  let maxAllowedSec = 1;
  
  if (devMode) {
      maxAllowedSec = typeof TOTAL_SECTIONS !== 'undefined' ? TOTAL_SECTIONS : 5;
  } else if (mode === 'overdrive') {
      let maxHC = 1;
      const hcKeys = Object.keys(overdriveClearedLevels).map(Number);
      if (hcKeys.length > 0) {
          maxHC = Math.max(...hcKeys) + 1;
      }
      maxAllowedSec = Math.ceil(maxHC / LEVELS_PER_SECTION);
  } else {
      maxAllowedSec = Math.ceil(maxUnlockedLevel / LEVELS_PER_SECTION);
  }
  
  currentLevelSection = Math.min(targetSec, Math.max(1, maxAllowedSec));
  modeLevelSections[mode] = currentLevelSection;

  updateModeSwitcherUI();
  if (mode === 'endless') {
    renderEndlessDashboardUI();
  } else {
    renderLevelsGrid();
  }
}

function updateModeSwitcherUI() {
  const tabNormal = document.getElementById('tabNormal');
  const tabOverdrive = document.getElementById('tabOverdrive');
  const tabEndless = document.getElementById('tabEndless');
  const levelsScreen = document.getElementById('levelsScreen');

  const odUnlocked = isOverdriveUnlocked();
  const endlessUnlocked = isEndlessUnlocked();

  if (tabNormal) tabNormal.classList.toggle('active', currentLevelMode === 'normal');
  if (tabOverdrive) {
    tabOverdrive.classList.toggle('active', currentLevelMode === 'overdrive');
    tabOverdrive.classList.toggle('locked', !odUnlocked);
  }
  if (tabEndless) {
    tabEndless.classList.toggle('active', currentLevelMode === 'endless');
    tabEndless.classList.toggle('locked', !endlessUnlocked);
  }

  if (levelsScreen) {
    levelsScreen.classList.toggle('mode-normal-active', currentLevelMode === 'normal');
    levelsScreen.classList.toggle('mode-overdrive-active', currentLevelMode === 'overdrive');
    levelsScreen.classList.toggle('mode-endless-active', currentLevelMode === 'endless');
  }

  const campaignView = document.getElementById('levelsCampaignView');
  const endlessView = document.getElementById('endlessDashboardView');

const swipeHint = document.getElementById('chapterSwipeHint');

  if (currentLevelMode === 'endless') {
    if (campaignView) campaignView.classList.add('hidden');
    if (endlessView) {
        endlessView.classList.remove('hidden');
        if (swipeHint) {
            // Переносим подсказку в Endless экран
            const endlessNav = document.querySelector('.endless-part-nav');
            if (endlessNav) endlessNav.after(swipeHint);
        }
    }
    renderEndlessDashboardUI();
  } else {
    if (campaignView) {
        campaignView.classList.remove('hidden');
        if (swipeHint) {
            // Возвращаем подсказку в Normal/Hardcore экран
            const normalNav = document.querySelector('.level-part-navigator:not(.endless-part-nav)');
            if (normalNav) normalNav.after(swipeHint);
        }
    }
    if (endlessView) endlessView.classList.add('hidden');
  }
  
// Динамическая смена арта (Hardcore / Endless / Normal) с ультра-мягким бесшовным градиентом
  const artDisplay = document.getElementById('modeArtDisplay');
  if (artDisplay) {
    if (currentLevelMode === 'overdrive') {
      // 1. HARDCORE MODE: Faceted Gem Heart
      artDisplay.innerHTML = `
        <svg viewBox="0 0 240 100" class="mode-art-svg" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="hcArtBlur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <mask id="hcArtMask">
              <rect x="25" y="10" width="190" height="80" rx="16" fill="#ffffff" filter="url(#hcArtBlur)" />
            </mask>
            <linearGradient id="hcArtGridFade" x1="0" y1="62" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#f05f9f" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#f05f9f" stop-opacity="0.85" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="240" height="100" fill="#000000" mask="url(#hcArtMask)" />
          <g stroke="url(#hcArtGridFade)">
            <line x1="120" y1="62" x2="16" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="62" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="94" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="120" y2="100" stroke-width="1.3" stroke-opacity="0.9" />
            <line x1="120" y1="62" x2="146" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="178" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="224" y2="100" stroke-width="1" />
            <line x1="84" y1="70" x2="156" y2="70" stroke-width="1" stroke-opacity="0.35" />
            <line x1="58" y1="79" x2="182" y2="79" stroke-width="1" stroke-opacity="0.55" />
            <line x1="28" y1="90" x2="212" y2="90" stroke-width="1" stroke-opacity="0.75" />
          </g>
          <line x1="20" y1="62" x2="220" y2="62" stroke="#f05f9f" stroke-width="1.2" stroke-opacity="0.55" />
          <g stroke="#f05f9f" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="120,24 102,13 84,18 78,32 88,44 120,55 152,44 162,32 156,18 138,13" stroke-width="1.8" stroke-opacity="0.95" />
            <line x1="120" y1="24" x2="120" y2="55" stroke-width="1.1" stroke-opacity="0.85" />
            <line x1="102" y1="13" x2="109" y2="32" stroke-width="0.85" stroke-opacity="0.65" />
            <line x1="138" y1="13" x2="131" y2="32" stroke-width="0.85" stroke-opacity="0.65" />
            <line x1="84" y1="18" x2="109" y2="32" stroke-width="0.85" stroke-opacity="0.65" />
            <line x1="156" y1="18" x2="131" y2="32" stroke-width="0.85" stroke-opacity="0.65" />
            <line x1="78" y1="32" x2="109" y2="32" stroke-width="0.85" stroke-opacity="0.65" />
            <line x1="162" y1="32" x2="131" y2="32" stroke-width="0.85" stroke-opacity="0.65" />
            <line x1="109" y1="32" x2="120" y2="55" stroke-width="1.0" stroke-opacity="0.75" />
            <line x1="131" y1="32" x2="120" y2="55" stroke-width="1.0" stroke-opacity="0.75" />
            <line x1="88" y1="44" x2="109" y2="32" stroke-width="0.8" stroke-opacity="0.55" />
            <line x1="152" y1="44" x2="131" y2="32" stroke-width="0.8" stroke-opacity="0.55" />
            <circle cx="120" cy="55" r="1.5" fill="#ffffff" stroke="#f05f9f" stroke-width="1" />
          </g>
        </svg>
      `;
    } else if (currentLevelMode === 'endless') {
      // 2. ENDLESS MODE: Cyber Mobius Infinity Loop
      artDisplay.innerHTML = `
        <svg viewBox="0 0 240 100" class="mode-art-svg" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="endlessArtBlur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <mask id="endlessArtMask">
              <rect x="25" y="10" width="190" height="80" rx="16" fill="#ffffff" filter="url(#endlessArtBlur)" />
            </mask>
            <linearGradient id="endlessArtGridFade" x1="0" y1="62" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#d946ef" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#d946ef" stop-opacity="0.85" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="240" height="100" fill="#000000" mask="url(#endlessArtMask)" />
          <g stroke="url(#endlessArtGridFade)">
            <line x1="120" y1="62" x2="16" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="62" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="94" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="120" y2="100" stroke-width="1.3" stroke-opacity="0.9" />
            <line x1="120" y1="62" x2="146" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="178" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="224" y2="100" stroke-width="1" />
            <line x1="84" y1="70" x2="156" y2="70" stroke-width="1" stroke-opacity="0.35" />
            <line x1="58" y1="79" x2="182" y2="79" stroke-width="1" stroke-opacity="0.55" />
            <line x1="28" y1="90" x2="212" y2="90" stroke-width="1" stroke-opacity="0.75" />
          </g>
          <line x1="20" y1="62" x2="220" y2="62" stroke="#d946ef" stroke-width="1.2" stroke-opacity="0.55" />
          <g stroke-linecap="round" stroke-linejoin="round">
            <path d="M86 36 C66 36 59 45 59 53 C59 61 66 70 86 70 C110 70 130 36 154 36 C174 36 181 45 181 53 C181 61 174 70 154 70 C130 70 110 36 86 36 Z" stroke="#d946ef" stroke-width="1.9" stroke-opacity="0.9" />
            <path d="M86 41 C72 41 67 47 67 53 C67 58 72 65 86 65 C104 65 121 41 154 41 C168 41 173 47 173 53 C173 58 168 65 154 65 C121 65 104 41 86 41 Z" stroke="#c084fc" stroke-width="0.9" stroke-opacity="0.65" />
            <line x1="59" y1="50" x2="59" y2="56" stroke="#ffffff" stroke-width="1.6" stroke-opacity="0.8" />
            <line x1="181" y1="50" x2="181" y2="56" stroke="#ffffff" stroke-width="1.6" stroke-opacity="0.8" />
            <circle cx="120" cy="53" r="2.2" fill="#ffffff" stroke="#d946ef" stroke-width="1.2" />
          </g>
        </svg>
      `;
    } else {
      // 3. NORMAL MODE: Sliced Inverted Triangle
      artDisplay.innerHTML = `
        <svg viewBox="0 0 240 100" class="mode-art-svg" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="normArtBlur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <mask id="normArtMask">
              <rect x="25" y="10" width="190" height="80" rx="16" fill="#ffffff" filter="url(#normArtBlur)" />
            </mask>
            <linearGradient id="normArtGridFade" x1="0" y1="62" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#00e5ff" stop-opacity="0.85" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="240" height="100" fill="#000000" mask="url(#normArtMask)" />
          <g stroke="url(#normArtGridFade)">
            <line x1="120" y1="62" x2="16" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="62" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="94" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="120" y2="100" stroke-width="1.3" stroke-opacity="0.9" />
            <line x1="120" y1="62" x2="146" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="178" y2="100" stroke-width="1" />
            <line x1="120" y1="62" x2="224" y2="100" stroke-width="1" />
            <line x1="84" y1="70" x2="156" y2="70" stroke-width="1" stroke-opacity="0.35" />
            <line x1="58" y1="79" x2="182" y2="79" stroke-width="1" stroke-opacity="0.55" />
            <line x1="28" y1="90" x2="212" y2="90" stroke-width="1" stroke-opacity="0.75" />
          </g>
          <line x1="20" y1="62" x2="220" y2="62" stroke="#00e5ff" stroke-width="1.2" stroke-opacity="0.45" />
          <g stroke="#00e5ff">
            <polygon points="120,56 80,10 160,10" stroke-width="1.6" stroke-linejoin="round" stroke-opacity="0.85" />
            <line x1="91" y1="23" x2="149" y2="23" stroke-width="1.1" stroke-opacity="0.5" />
            <line x1="98" y1="33" x2="142" y2="33" stroke-width="1.2" stroke-opacity="0.65" />
            <line x1="106" y1="43" x2="134" y2="43" stroke-width="1.3" stroke-opacity="0.8" />
          </g>
        </svg>
      `;
    }
  }

  const rulesBanner = document.getElementById('modeRulesBanner');
  if (rulesBanner) {
    if (currentLevelMode === 'overdrive') {
      rulesBanner.className = 'mode-rules-banner hardcore-rules';
      const hpHeartSvg = `<span style="display:inline-flex; align-items:center; vertical-align:middle; filter:drop-shadow(0 0 5px rgba(240,95,159,0.8)); margin:0 2px;"><svg width="13" height="12" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#f05f9f"/></svg></span>`;
      rulesBanner.innerHTML = `1 ${hpHeartSvg} BASE  —  1.2 SPEED & ENRAGED MOBS`;
    } else if (currentLevelMode === 'endless') {
      rulesBanner.className = 'mode-rules-banner endless-rules';
      const prismIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d946ef" stroke-width="2.2" stroke-linejoin="round" style="vertical-align: middle; display: inline-block; margin: 0 1px 2px 2px;"><polygon points="12 2 21 12 12 22 3 12" fill="rgba(217,70,239,.25)"/><polyline points="3 12 12 15 21 12"/><line x1="12" y1="22" x2="12" y2="22"/></svg>`;
      const diamondIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2" stroke-linejoin="round" style="vertical-align: middle; display: inline-block; margin: 0 1px 2px 1px;"><polygon points="6 3 18 3 22 9 12 22 2 9" fill="rgba(0,229,255,.25)"/><polyline points="2 9 12 13 22 9"/><line x1="12" y1="22" x2="12" y2="13"/></svg>`;
      rulesBanner.innerHTML = `Procedural Waves • Earn ${prismIcon} Prisms & ${diamondIcon} Diamonds`;
    } else {
      rulesBanner.className = 'mode-rules-banner normal-rules';
      const diamondIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2" stroke-linejoin="round" style="vertical-align: middle; display: inline-block; margin: 0 1px 2px 1px;"><polygon points="6 3 18 3 22 9 12 22 2 9" fill="rgba(0,229,255,.25)"/><polyline points="2 9 12 13 22 9"/><line x1="12" y1="22" x2="12" y2="13"/></svg>`;
      rulesBanner.innerHTML = `Standard Campaign Rules • Earn ${diamondIcon} Diamonds`;
    }
  }
}

function renderEndlessDashboardUI() {
  const valEl = document.getElementById('endlessRecordVal');
  const mapEl = document.getElementById('endlessMapText');
  const ticketEl = document.getElementById('endlessDeployTicketText');
  const fillEl = document.getElementById('highwayTrackFill');
  const thumbEl = document.getElementById('highwayThumbPin');
  const startEl = document.getElementById('highwayStartLabel');
  const currEl = document.getElementById('highwayCurrLabel');
  const endEl = document.getElementById('highwayEndLabel');
  const rewardEl = document.getElementById('highwayRewardBadge');

  const sec = currentLevelSection || 1;
  const bestWave = (typeof endlessBestWavesBySection !== 'undefined' && endlessBestWavesBySection[sec]) 
    ? endlessBestWavesBySection[sec] 
    : 0;
  if (valEl) valEl.textContent = `BEST : WAVE ${bestWave}`;

  const startWave = bestWave > 0 ? Math.floor(Math.max(0, bestWave - 1) / 10) * 10 + 1 : 1;
  const endWave = startWave + 9;
  const pct = bestWave >= startWave ? Math.min(100, Math.max(0, ((bestWave - startWave + 1) / 10) * 100)) : 0;

  if (startEl) startEl.textContent = startWave;
  if (currEl) currEl.textContent = `W${bestWave}`;
  if (endEl) endEl.textContent = endWave;

  if (fillEl) fillEl.style.width = `${pct}%`;
  if (thumbEl) thumbEl.style.left = `${pct}%`;

  if (rewardEl) {
    const prismReward = (endWave % 50 === 0) ? '+5' : '+1';
    rewardEl.innerHTML = `
      <span class="reward-val">${prismReward}</span>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d946ef" stroke-width="2" stroke-linejoin="round">
        <polygon points="12 2 21 12 12 22 3 12" fill="rgba(217,70,239,.4)"/>
      </svg>
    `;
  }

  if (mapEl) mapEl.textContent = `CHAPTER ${currentLevelSection}`;

  const prevBtn = document.getElementById('endlessNavPrev');
  const nextBtn = document.getElementById('endlessNavNext');
  
  if (prevBtn) {
    prevBtn.disabled = currentLevelSection <= 1;
  }
  if (nextBtn) {
    const nextSecUnlocked = (typeof devMode !== 'undefined' && devMode) || maxUnlockedLevel > currentLevelSection * LEVELS_PER_SECTION;
    nextBtn.disabled = currentLevelSection >= (typeof TOTAL_SECTIONS !== 'undefined' ? TOTAL_SECTIONS : 5) || !nextSecUnlocked;
  }

  if (ticketEl) {
    const status = (typeof getEndlessEntryStatus === 'function') ? getEndlessEntryStatus() : { text: 'FREE (1/1)' };
    let statusText = status.text ? status.text.toUpperCase() : 'FREE (1/1)';
    if (statusText.includes('REMAINING')) statusText = statusText.replace(' REMAINING', '');
    ticketEl.textContent = statusText;
  }

  // Обновляем видимость подсказки свайпа в Endless
  const swipeHint = document.getElementById('chapterSwipeHint');
  if (swipeHint && typeof currentLevelMode !== 'undefined' && currentLevelMode === 'endless') {
    const canSwipe = (maxUnlockedLevel > 15 || devMode) && typeof TOTAL_SECTIONS !== 'undefined' && TOTAL_SECTIONS > 1;
    swipeHint.classList.toggle('hidden', !canSwipe);
  }
}

function navEndlessLevel(dir) {
  const target = currentLevelSection + dir;
  if (target < 1 || (typeof TOTAL_SECTIONS !== 'undefined' && target > TOTAL_SECTIONS)) return;
  
  // Проверяем, открыта ли следующая глава (сектор) у игрока
  const isTargetUnlocked = (typeof devMode !== 'undefined' && devMode) || maxUnlockedLevel > (target - 1) * LEVELS_PER_SECTION;
  if (!isTargetUnlocked) {
    if (typeof showHintToast === 'function') showHintToast('Chapter locked!');
    return;
  }
  
  currentLevelSection = target;
  if (typeof sfx === 'function') sfx('click');
  renderEndlessDashboardUI();
}

window.navEndlessLevel = navEndlessLevel;

window.selectLevelMode = selectLevelMode;

function confirmStartEndlessRun() {
  if (!isEndlessUnlocked()) {
    if (typeof showHintToast === 'function') showHintToast('Complete Campaign Level 15 to unlock Endless Arena!');
    return;
  }

  if (!selectedLoadout || selectedLoadout.length === 0) {
    if (typeof showHintToast === 'function') showHintToast('Select at least 1 tower!');
    return;
  }

  const status = (typeof getEndlessEntryStatus === 'function') ? getEndlessEntryStatus() : { type: 'free', cost: 0 };

  const launch = () => {
    endlessDailyRunsUsed++;
    if (typeof saveGame === 'function') saveGame();
    if (typeof startEndlessMatch === 'function') startEndlessMatch();
  };

  if (status.type === 'free') {
    launch();
  } else if (status.type === 'ad') {
    if (!noAdsPurchased && typeof showAdPlaceholder === 'function') {
      showAdPlaceholder(launch, null);
    } else {
      launch();
    }
  } else if (status.type === 'diamonds') {
    if (diamonds < status.cost) {
      if (typeof showHintToast === 'function') showHintToast(`Need ${status.cost} Diamonds for entry!`);
      return;
    }
    diamonds -= status.cost;
    if (typeof updateDiamondUI === 'function') updateDiamondUI();
    launch();
  } else {
    launch();
  }
}
window.confirmStartEndlessRun = confirmStartEndlessRun;

// Global Exports
if (typeof getEndlessEntryStatus !== 'undefined') {
  window.getEndlessEntryStatus = getEndlessEntryStatus;
}

function renderLevelsGrid() {
  updateModeSwitcherUI();
  const levelsGrid = document.getElementById('levelsGrid');
  if (!levelsGrid) return;
  levelsGrid.innerHTML = '';

  const partLabel = document.getElementById('partNavLabel');
  const prevBtn = document.getElementById('partNavPrev');
  const nextBtn = document.getElementById('partNavNext');
  
  let nextSecUnlocked = false;
  if (devMode) {
      nextSecUnlocked = true;
  } else if (currentLevelMode === 'overdrive') {
      const reqLvl = currentLevelSection * LEVELS_PER_SECTION;
      nextSecUnlocked = !!overdriveClearedLevels[reqLvl];
  } else {
      nextSecUnlocked = maxUnlockedLevel > currentLevelSection * LEVELS_PER_SECTION;
  }

  if (partLabel) partLabel.textContent = `CHAPTER ${currentLevelSection}`;

  if (prevBtn) {
    const canGoPrev = currentLevelSection > 1;
    prevBtn.disabled = !canGoPrev;
  }
  if (nextBtn) {
    const canGoNext = currentLevelSection < TOTAL_SECTIONS && nextSecUnlocked;
    nextBtn.disabled = !canGoNext;
  }

  const swipeHint = document.getElementById('chapterSwipeHint');
  const canSwipe = (maxUnlockedLevel >= 11 || devMode) && typeof TOTAL_SECTIONS !== 'undefined' && TOTAL_SECTIONS > 1;
  if (swipeHint && currentLevelMode !== 'endless') {
    swipeHint.classList.toggle('hidden', !canSwipe);
  }

  const startLvl = (currentLevelSection - 1) * LEVELS_PER_SECTION + 1;
  const endLvl = currentLevelSection * LEVELS_PER_SECTION;

  for (let lvl = startLvl; lvl <= endLvl; lvl++) {
    const btn = document.createElement('button');

    if (currentLevelMode !== 'overdrive') {
      const isUnlocked = devMode || lvl <= maxUnlockedLevel;
      const earnedStars = levelStars[lvl] || 0;
      const isCleared = clearedLevels.includes(lvl) || earnedStars > 0;
      const isCurrent = lvl === maxUnlockedLevel && !isCleared;

      if (isUnlocked) {
        btn.className = 'level-card-btn' + (isCurrent ? ' current' : (isCleared ? ' cleared' : ''));
        btn.innerHTML = `
          <span class="level-num">${lvl}</span>
          <div class="level-card-stars">
            <span class="mini-star ${earnedStars >= 1 ? 'filled' : 'empty'}">★</span>
            <span class="mini-star ${earnedStars >= 2 ? 'filled' : 'empty'}">★</span>
            <span class="mini-star ${earnedStars >= 3 ? 'filled' : 'empty'}">★</span>
          </div>
        `;
        btn.onclick = () => startSpecificLevel(lvl);
      } else {
        btn.className = 'level-card-btn locked';
        btn.disabled = true;
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="#475569" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M 7,10 V 6 C 7,3.5 9,2 12,2 C 15,2 17,3.5 17,6 V 10" />
            <rect x="4" y="10" width="16" height="12" rx="3" fill="#080e1a" />
          </svg>
        `;
      }
    } else {
      const isOdCleared = !!overdriveClearedLevels[lvl];
      const isUnlockedInHC = devMode || isOdCleared || (lvl === 1) || !!overdriveClearedLevels[lvl - 1];
      const isCurrentOd = isUnlockedInHC && !isOdCleared;

      if (isUnlockedInHC) {
        btn.className = 'level-card-btn' + (isCurrentOd ? ' current' : (isOdCleared ? ' cleared' : ''));
        if (isOdCleared) {
          btn.innerHTML = `
            <span class="level-num">${lvl}</span>
            <div class="level-card-overdrive-badge filled" title="Hardcore Cleared">
              <span class="od-reward-tag" style="color:#ffd1f4;">+3</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d946ef" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 21 12 12 22 3 12" fill="rgba(217,70,239,.4)"/></svg>
              <span style="color:#2dd4bf; font-weight:bold; font-size:11px;">✓</span>
            </div>
          `;
        } else {
          btn.innerHTML = `
            <span class="level-num">${lvl}</span>
            <div class="level-card-overdrive-badge empty">
              <span class="od-reward-tag" style="color:#ffb3ea;">+3</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.8" stroke-linejoin="round"><polygon points="12 2 21 12 12 22 3 12" fill="#1a061c"/></svg>
            </div>
          `;
        }
        btn.onclick = () => startSpecificLevel(lvl);
      } else {
        btn.className = 'level-card-btn locked';
        btn.disabled = true;
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="#52274b" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M 7,10 V 6 C 7,3.5 9,2 12,2 C 15,2 17,3.5 17,6 V 10" />
            <rect x="4" y="10" width="16" height="12" rx="3" fill="#120412" />
          </svg>
        `;
      }
    }
    levelsGrid.appendChild(btn);
  }
}

let isDevModeActive = false;
let isDevExpanded = false;

// [UI113] Developer mode panel interface and visibility control.
function openDevMode() {
  isDevModeActive = true;
  devMode = true;
  window._maxThreadLag = 0;
  window._lastThreadLag = 0;
  const bar = document.getElementById('devBar');
  if (bar) bar.classList.remove('hidden');
  
  const goldHalf = document.getElementById('goldHalf');
  const hpHalf = document.getElementById('hpHalf');
  if (goldHalf) goldHalf.classList.add('interactive');
  if (hpHalf) hpHalf.classList.add('interactive');
  if (typeof initDevResourceHold === 'function') initDevResourceHold();

  const levelEl = document.getElementById('levelText');
  const waveEl = document.getElementById('waveText');
  if (levelEl) {
    levelEl.style.cursor = 'pointer';
    levelEl.onclick = devPromptLevelSelect;
  }
  if (waveEl) {
    waveEl.style.cursor = 'pointer';
    waveEl.onclick = devPromptWaveSelect;
  }
  
  updateDiamondUI();
  updatePrismUI();
}

function closeDevMode() {
  isDevModeActive = false;
  devMode = false;
  isDevExpanded = false;
  
  const bar = document.getElementById('devBar');
  if (bar) {
    bar.classList.add('hidden');
    bar.style.left = '';
    bar.style.top = '';
    bar.style.transform = '';
  }
  
  const pane = document.getElementById('devDetailsPane');
  if (pane) pane.classList.add('hidden');
  
  const btn = document.getElementById('devExpandBtn');
  if (btn) btn.textContent = '▾';

  const goldHalf = document.getElementById('goldHalf');
  const hpHalf = document.getElementById('hpHalf');
  if (goldHalf) goldHalf.classList.remove('interactive');
  if (hpHalf) hpHalf.classList.remove('interactive');

  const levelEl = document.getElementById('levelText');
  const waveEl = document.getElementById('waveText');
  if (levelEl) {
    levelEl.style.cursor = '';
    levelEl.onclick = null;
  }
  if (waveEl) {
    waveEl.style.cursor = '';
    waveEl.onclick = null;
  }
  setGameSpeed(1);

  window.devSubExpanded = { Game: false, Audio: false, Version: false };
  ['Game', 'Audio', 'Version'].forEach(k => {
    const b = document.getElementById('devSubBody' + k);
    const a = document.getElementById('devSubArrow' + k);
    if (b) b.classList.add('hidden');
    if (a) a.textContent = '▾';
  });

  updateDiamondUI();
  updatePrismUI();
}

function toggleDevPanelExpand() {
  isDevExpanded = !isDevExpanded;
  const pane = document.getElementById('devDetailsPane');
  const btn = document.getElementById('devExpandBtn');
  if (pane) {
    if (isDevExpanded) {
      pane.classList.remove('hidden');
      const trackEl = document.getElementById('devTrackTitle');
      if (trackEl && typeof MusicManager !== 'undefined' && MusicManager.currentTrack) {
        trackEl.textContent = MusicManager.currentTrack();
      }
    } else {
      pane.classList.add('hidden');
    }
  }
  if (btn) {
    btn.textContent = isDevExpanded ? '▴' : '▾';
  }
}

// Управление раскрывашками 2-го и 3-го уровней (Game / Audio / Version)
window.devSubExpanded = { Game: false, Audio: false, Version: false };
window.devMetricExpanded = {
  AudioHw: false,
  AudioDsp: false,
  AudioMem: false,
  VerManifest: true,
  VerDownload: false,
  VerPlugin: false,
  VerLogs: false
};

// 2-й уровень: открывает выбранный раздел и автоматически закрывает остальные два
function toggleDevSubSection(name) {
  if (!window.devSubExpanded) window.devSubExpanded = {};
  const willOpen = !window.devSubExpanded[name];

  ['Game', 'Audio', 'Version'].forEach(key => {
    const isNowOpen = (key === name) ? willOpen : false;
    window.devSubExpanded[key] = isNowOpen;
    const body = document.getElementById('devSubBody' + key);
    const arrow = document.getElementById('devSubArrow' + key);
    if (body) body.classList.toggle('hidden', !isNowOpen);
    if (arrow) arrow.textContent = isNowOpen ? '▴' : '▾';
  });

  if (name === 'Game' && willOpen) {
    const customSpawner = document.getElementById('devCustomSpawner');
    if (customSpawner) customSpawner.classList.remove('hidden');
  }
}

// 3-й уровень: переключает подгруппы метрик по очереди (внутри Audio или внутри Version)
function toggleDevMetricGroup(groupKey) {
  if (!window.devMetricExpanded) window.devMetricExpanded = {};
  const willOpen = !window.devMetricExpanded[groupKey];

  const isAudioGroup = groupKey.startsWith('Audio');
  const siblingKeys = isAudioGroup
    ? ['AudioHw', 'AudioDsp', 'AudioMem']
    : ['VerManifest', 'VerDownload', 'VerPlugin', 'VerLogs'];

  const domMap = {
    AudioHw: 'devAudioLogHw',
    AudioDsp: 'devAudioLogDsp',
    AudioMem: 'devAudioLogMem',
    VerManifest: 'devVerLogManifest',
    VerDownload: 'devVerLogDownload',
    VerPlugin: 'devVerLogPlugin',
    VerLogs: 'devVerLogHistory'
  };

  siblingKeys.forEach(k => {
    const openState = (k === groupKey) ? willOpen : false;
    window.devMetricExpanded[k] = openState;
    const contentEl = document.getElementById(domMap[k]);
    const arrowEl = document.getElementById('devMetricArrow' + k);
    if (contentEl) contentEl.classList.toggle('hidden', !openState);
    if (arrowEl) arrowEl.textContent = openState ? '▴' : '▾';
  });
}

// Мост для кнопки SPAWN (чинит сломанный спаунер)
function devSpawnCustomEnemies() {
  if (gameState !== 'PLAYING') {
    showHintToast('Start a level first to spawn enemies!');
    return;
  }
  if (typeof handleDevSpawnClick === 'function') {
    handleDevSpawnClick();
  }
}

// [UI114] Drag handler for developer control panel.
(function initDevBarDrag() {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  function onPointerDown(e) {
    if (['BUTTON', 'SELECT', 'INPUT', 'OPTION'].includes(e.target.tagName)) return;
    
    const bar = document.getElementById('devBar');
    if (!bar) return;

    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = bar.getBoundingClientRect();
    bar.style.transform = 'none';
    bar.style.left = `${rect.left}px`;
    bar.style.top = `${rect.top}px`;

    startX = clientX;
    startY = clientY;
    initialLeft = rect.left;
    initialTop = rect.top;

    window.addEventListener('mousemove', onPointerMove, { passive: false });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    const bar = document.getElementById('devBar');
    if (bar) {
      const nextX = Math.max(0, Math.min(window.innerWidth - bar.offsetWidth, initialLeft + dx));
      const nextY = Math.max(0, Math.min(window.innerHeight - bar.offsetHeight, initialTop + dy));
      bar.style.left = `${nextX}px`;
      bar.style.top = `${nextY}px`;
    }
  }

  function onPointerUp() {
    isDragging = false;
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('touchend', onPointerUp);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const bar = document.getElementById('devBar');
    if (bar) {
      bar.addEventListener('mousedown', onPointerDown);
      bar.addEventListener('touchstart', onPointerDown, { passive: true });
    }
  });
})();

function toggleDevMode(enabled) {
  if (enabled) openDevMode();
  else closeDevMode();
}


function refreshDevDropdowns() {
  ['devLevelSelect', 'devWaveSelect'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.dataset.pauseGuard) {
      el.dataset.pauseGuard = '1';
      el.addEventListener('focus', () => suppressBackgroundPause(1500));
      el.addEventListener('change', () => suppressBackgroundPause(1500));
      el.addEventListener('blur', () => suppressBackgroundPause());
    }
  });
  const lvlSelect = document.getElementById('devLevelSelect');
  if (!lvlSelect) return;
  lvlSelect.innerHTML = '';
  for (let l = 1; l <= TOTAL_LEVELS; l++) {
    const opt = document.createElement('option');
    opt.value = l;
    opt.textContent = `${l}`;
    if (l === currentLevel) opt.selected = true;
    lvlSelect.appendChild(opt);
  }

  const waveSelect = document.getElementById('devWaveSelect');
  if (!waveSelect) return;
  waveSelect.innerHTML = '';

  if (isEndlessMode) {
    const endlessMax = Math.max(wave + 20, 50, endlessBestWave + 10);
    for (let w = 1; w <= endlessMax; w++) {
      const opt = document.createElement('option');
      opt.value = w;
      opt.textContent = `${w}/∞`;
      if (w === wave) opt.selected = true;
      waveSelect.appendChild(opt);
    }
  } else {
    const lvlConfig = LEVELS_DATA[currentLevel];
    const maxW = lvlConfig ? lvlConfig.totalWaves : 10;
    for (let w = 1; w <= maxW; w++) {
      const opt = document.createElement('option');
      opt.value = w;
      opt.textContent = `${w}/${maxW}`;
      if (w === wave) opt.selected = true;
      waveSelect.appendChild(opt);
    }
  }
}

function devJumpToWave(targetWave) {
  const lvlConfig = LEVELS_DATA[currentLevel];
  const maxW = lvlConfig ? lvlConfig.totalWaves : 10;
  if (!isEndlessMode && (targetWave < 1 || targetWave > maxW)) return;
  if (isEndlessMode && targetWave < 1) return;

  enemies = [];
  projectiles = [];
  spawnQueue = [];
  waveInProgress = false;
  waveTimerActive = false;
  autoWaveTimeRemaining = 0;
  wave = targetWave;
  startWave();
}


const DEV_SPEED_STEPS = [0.5, 0.75, 0.9, 1, 1.25, 1.5, 2, 4, 8];

// [UI115] Time modulation speed levels and HUD controls.
function getHudAllowedSpeeds() {
  const tier = typeof timeModTier !== 'undefined' ? timeModTier : 0;
  if (tier >= 2) {
    return [0.5, 0.75, 0.9, 1.0, 1.25, 1.5, 2.0];
  } else if (tier >= 1) {
    return [0.9, 1.0, 1.25];
  }
  return [1.0];
}

function updateHudSpeedWidget() {
  const widget = document.getElementById('hudSpeedWidget');
  if (!widget) return;

  const isCombatPause = (gameState === 'PAUSED' && (typeof settingsPreviousSource === 'undefined' || settingsPreviousSource === 'combat' || settingsPreviousSource === 'pause'));
  const isBattle = (gameState === 'PLAYING' || isCombatPause);

  const showWidget = isBattle && ((typeof timeModTier !== 'undefined' && timeModTier > 0) || devMode);
  widget.classList.toggle('hidden', !showWidget);

  if (!showWidget) return;

  const curSpeed = typeof gameTimeScale !== 'undefined' ? gameTimeScale : 1.0;
  const valEl = document.getElementById('hudSpeedVal');
  if (valEl) {
    valEl.textContent = `${curSpeed}x`;
  }

  const allowed = devMode ? DEV_SPEED_STEPS : getHudAllowedSpeeds();
  let curIdx = allowed.indexOf(curSpeed);
  if (curIdx === -1) {
    curIdx = allowed.reduce((closest, val, idx) =>
      Math.abs(val - curSpeed) < Math.abs(allowed[closest] - curSpeed) ? idx : closest, 0);
  }

  const fasterBtn = document.getElementById('hudSpeedFasterBtn');
  const slowerBtn = document.getElementById('hudSpeedSlowerBtn');

  if (fasterBtn) {
    fasterBtn.disabled = curIdx >= allowed.length - 1;
    fasterBtn.classList.toggle('disabled', curIdx >= allowed.length - 1);
  }
  if (slowerBtn) {
    slowerBtn.disabled = curIdx <= 0;
    slowerBtn.classList.toggle('disabled', curIdx <= 0);
  }
}

function setGameSpeed(speed) {
  if (typeof gameTimeScale !== 'undefined') {
    gameTimeScale = speed;
  }
  // [UI115.01] Synchronize speed dropdown selectors.
  const selects = document.querySelectorAll('.dev-speed-floating, .dev-speed-select, #speedContainer, .dev-bar select');
  selects.forEach(s => {
    s.value = String(speed);
  });
  updateHudSpeedWidget();
}

function stepHudSpeed(direction) {
  const allowed = devMode ? DEV_SPEED_STEPS : getHudAllowedSpeeds();
  if (allowed.length <= 1) return;

  const curSpeed = typeof gameTimeScale !== 'undefined' ? gameTimeScale : 1.0;
  let curIdx = allowed.indexOf(curSpeed);
  if (curIdx === -1) {
    curIdx = allowed.reduce((closest, val, idx) =>
      Math.abs(val - curSpeed) < Math.abs(allowed[closest] - curSpeed) ? idx : closest, 0);
  }

  const nextIdx = Math.max(0, Math.min(allowed.length - 1, curIdx + direction));
  const newSpeed = allowed[nextIdx];
  if (newSpeed !== curSpeed) {
    setGameSpeed(newSpeed);
    try { sfx('tap'); } catch (err) {}
  }
}

function stepDevSpeed(direction) {
  const selects = document.querySelectorAll('.dev-speed-floating, .dev-speed-select, #speedContainer, .dev-bar select');
  if (!selects || selects.length === 0) return;

  const sel = selects[0];

  let curIndex = sel.selectedIndex;

  if (curIndex === -1 || isNaN(curIndex)) {
    const currentVal = parseFloat(sel.value) || (typeof gameTimeScale !== 'undefined' ? gameTimeScale : 1);
    curIndex = DEV_SPEED_STEPS.indexOf(currentVal);
    if (curIndex === -1) {
      curIndex = DEV_SPEED_STEPS.reduce((closest, val, idx) =>
        Math.abs(val - currentVal) < Math.abs(DEV_SPEED_STEPS[closest] - currentVal) ? idx : closest, 0);
    }
  }

  const nextIndex = Math.max(0, Math.min(DEV_SPEED_STEPS.length - 1, curIndex + direction));
  const newSpeed = DEV_SPEED_STEPS[nextIndex];

  selects.forEach(s => {
    s.selectedIndex = nextIndex;
    s.value = String(newSpeed);

    if (s.options && s.options[nextIndex]) {
      s.options[nextIndex].selected = true;
    }
  });

  setGameSpeed(newSpeed);
}

// [UI116] Interactive speed drum drag and scroll gesture controller.
(function initHudSpeedDrumGesture() {
  let isDragging = false;
  let startY = 0;
  let startSpeedIndex = 0;
  let allowedSpeeds = [1.0];
  let tipShown = false;

  function dismissTip() {
    tipShown = true;
    const dragTip = document.getElementById('hudDragTip');
    if (dragTip) dragTip.classList.remove('show');
  }

  function showTipIfNeeded() {
    if (tipShown) return;
    const widget = document.getElementById('hudSpeedWidget');
    const dragTip = document.getElementById('hudDragTip');
    if (widget && !widget.classList.contains('hidden') && dragTip) {
      dragTip.classList.add('show');
    }
  }

  setTimeout(showTipIfNeeded, 1500);

  function onPointerDown(e) {
    dismissTip();
    const drumEl = document.getElementById('hudSpeedDrum');
    if (!drumEl || !drumEl.contains(e.target)) return;

    allowedSpeeds = devMode ? DEV_SPEED_STEPS : getHudAllowedSpeeds();
    if (allowedSpeeds.length <= 1) return;

    isDragging = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    const currentSpeed = typeof gameTimeScale !== 'undefined' ? gameTimeScale : 1.0;

    let idx = allowedSpeeds.indexOf(currentSpeed);
    if (idx === -1) {
      idx = allowedSpeeds.reduce((closest, val, i) =>
        Math.abs(val - currentSpeed) < Math.abs(allowedSpeeds[closest] - currentSpeed) ? i : closest, 0);
    }
    startSpeedIndex = idx;

    drumEl.classList.add('dragging');

    window.addEventListener('mousemove', onPointerMove, { passive: false });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dy = startY - clientY;

    const stepPx = 30;
    const stepDelta = Math.round(dy / stepPx);

    const targetIdx = Math.max(0, Math.min(allowedSpeeds.length - 1, startSpeedIndex + stepDelta));
    const newSpeed = allowedSpeeds[targetIdx];

    if (newSpeed !== gameTimeScale) {
      setGameSpeed(newSpeed);
      if (typeof vibrate === 'function') vibrate('light');
      else if (navigator.vibrate) { try { navigator.vibrate(15); } catch(err){} }
    }
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;

    const drumEl = document.getElementById('hudSpeedDrum');
    if (drumEl) drumEl.classList.remove('dragging');

    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('touchend', onPointerUp);
  }

  function onWheel(e) {
    dismissTip();
    const drumEl = document.getElementById('hudSpeedDrum');
    if (!drumEl || !drumEl.contains(e.target)) return;
    e.preventDefault();
    stepHudSpeed(e.deltaY < 0 ? 1 : -1);
  }

  function setupListeners() {
    const drumEl = document.getElementById('hudSpeedDrum');
    if (drumEl) {
      drumEl.addEventListener('mousedown', onPointerDown);
      drumEl.addEventListener('touchstart', onPointerDown, { passive: true });
      drumEl.addEventListener('wheel', onWheel, { passive: false });
    }
    const fasterBtn = document.getElementById('hudSpeedFasterBtn');
    const slowerBtn = document.getElementById('hudSpeedSlowerBtn');
    if (fasterBtn) fasterBtn.addEventListener('click', dismissTip);
    if (slowerBtn) slowerBtn.addEventListener('click', dismissTip);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupListeners);
  } else {
    setupListeners();
  }
})();

function toggleLivePause() {
  isLivePaused = !isLivePaused;
  const btn = document.getElementById('livePauseBtn');
  if (btn) {
    if (isLivePaused) {
      btn.textContent = 'RESUME GAME';
      btn.classList.add('paused');
    } else {
      btn.textContent = 'PAUSE GAME';
      btn.classList.remove('paused');
    }
  }

  updateDailyBonusBtnVisibility();
}

function updateStartChapterLabel(show, text) {
  const el = document.getElementById('startChapterLabel');
  if (el) el.classList.add('hidden');
}

// [UI117] Navigation screen display and menu visibility controllers.

function updateDailyBonusBtnVisibility() {
  const btn = document.getElementById('dailyBonusQuickBtn');
  if (!btn) return;
  const startScreen = document.getElementById('startScreen');
  const isStartVisible = startScreen && !startScreen.classList.contains('hidden');

  const modals = [
    'settingsScreen', 'upgradesScreen', 'shopScreen', 'battlePassScreen',
    'dailyLoginModal', 'levelsScreen',
    'giveUpConfirmModal', 'gameCompletionModal',
    'milestoneScreen', 'victoryScreen', 'defeatScreen'
  ];

  const isAnyModalOpen = modals.some(id => {
    const el = document.getElementById(id);
    return el && !el.classList.contains('hidden');
  });

  if (isStartVisible && gameState === 'START' && !isAnyModalOpen) {
    btn.classList.remove('hidden');
  } else {
    btn.classList.add('hidden');
  }
}

function showStartScreen() {
  isEndlessMode = false;
  music('menu');
  if (reviveTimerInterval) { clearInterval(reviveTimerInterval); reviveTimerInterval = null; }
  document.getElementById('pauseScreen')?.classList.add('hidden');
  document.getElementById('levelsScreen').classList.add('hidden');
  document.getElementById('settingsScreen').classList.add('hidden');
  document.getElementById('upgradesScreen').classList.add('hidden');
  document.getElementById('victoryScreen').classList.add('hidden');
  document.getElementById('defeatScreen').classList.add('hidden');
  const revSc = document.getElementById('reviveScreen');
  if (revSc) revSc.classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');

  document.getElementById('econHpSplitBadge').classList.add('hidden');
  document.getElementById('levelWaveSplitBadge').classList.add('hidden');
  document.getElementById('hudRightGroup').classList.remove('hidden');

  updateStartChapterLabel(true);
  document.getElementById('controlsWrapper').classList.add('hidden');

  const waveBtn = document.getElementById('waveBtn');
  if (waveBtn) waveBtn.classList.add('hidden');

  
  
  const customSpawner = document.getElementById('devCustomSpawner');
  if (customSpawner) customSpawner.classList.add('hidden');

  const startSubTitle = document.querySelector('.start-sub-title');
  if (startSubTitle) {
    startSubTitle.style.textShadow = '0 0 14px rgba(2, 3, 8, 0.95), 0 2px 8px rgba(2, 3, 8, 0.95)';
  }
  const startMainTitle = document.querySelector('.start-main-title');
  if (startMainTitle) {
    startMainTitle.style.textShadow = '0 0 24px rgba(0, 229, 255, 0.9), 0 0 12px rgba(2, 3, 8, 0.95), 0 3px 10px rgba(2, 3, 8, 0.95)';
  }

  const l1 = MAP_CATALOG['L1'];
  if (l1) buildLevelGeometry(l1.path, l1.cols, l1.rows, l1.blocked);
  resizeCanvasAndCamera();
  gameState = 'START';
  updateHudSpeedWidget();
  updateUpgradeButtonsLock();
  updateMenuBadges();

  if (!hasAutoShownDailyLoginModalThisSession) {
    const hasCleared1Level = (maxUnlockedLevel >= 2) ||
                              (clearedLevels && clearedLevels.length >= 1) ||
                              (typeof hasClearedLevelBefore === 'function' && hasClearedLevelBefore(1)) ||
                              (typeof tutorialSeen !== 'undefined' && tutorialSeen.l1);
    const isNotClaimedToday = !checkDailyLoginState();
    const milestoneScr = document.getElementById('milestoneScreen');
    const isMilestoneHidden = milestoneScr ? milestoneScr.classList.contains('hidden') : true;
    const isNotDismissedThisSession = (typeof dailyLoginDismissedThisSession !== 'undefined') ? !dailyLoginDismissedThisSession : true;

    if (hasCleared1Level && isNotClaimedToday && isMilestoneHidden && isNotDismissedThisSession) {
      hasAutoShownDailyLoginModalThisSession = true;
      setTimeout(() => openDailyLoginModal(), 300);
    }
  }

  if (typeof warmUpNebulaAndHideLoader === 'function') {
    warmUpNebulaAndHideLoader();
  }
  
  syncTopHudVisibility();
  updateDailyBonusBtnVisibility();
}

function updateUpgradeButtonsLock() {
  const unlockLevel = getLoadoutStartLevel();
  const isUpgradesUnlocked = devMode || getLoadoutReferenceLevel() >= unlockLevel;
  const mainTechTreeIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none;"><path d="M12 21 v-5 l-4 -3.5 v-4 m4 7.5 l4 -3.5 v-4 m-4 7.5 v-8" /><circle cx="12" cy="21" r="1.5" fill="currentColor" stroke="none" /><circle cx="8" cy="8.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="16" cy="8.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" /></svg>`;
  const resTechTreeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-right: 4px;"><path d="M12 21 v-5 l-4 -3.5 v-4 m4 7.5 l4 -3.5 v-4 m-4 7.5 v-8" /><circle cx="12" cy="21" r="1.5" fill="currentColor" stroke="none" /><circle cx="8" cy="8.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="16" cy="8.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" /></svg>`;

  ['mainUpgradesBtn', 'victoryUpgradesBtn', 'defeatUpgradesBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.disabled = false;
    btn.classList.toggle('no-press-feedback', !isUpgradesUnlocked);
    btn.classList.toggle('btn-locked', !isUpgradesUnlocked);
    const isMain = id === 'mainUpgradesBtn';
    const activeIcon = isMain ? mainTechTreeIcon : resTechTreeIcon;
    btn.innerHTML = activeIcon + '<span>TECH TREE</span>';
  });
}

let settingsPreviousSource = 'start';
let settingsAccordionExpanded = false;
let devSettingsTapCount = 0;
let devSettingsTapTimer = null;

// [UI118] Settings accordion toggle and pause menu controller.
function toggleSettingsAccordion(forceState) {
  if (typeof forceState === 'boolean') {
    settingsAccordionExpanded = forceState;
  } else {
    settingsAccordionExpanded = !settingsAccordionExpanded;
  }

  const body = document.getElementById('settingsBody');
  const arrow = document.getElementById('settingsArrow');
  if (body) {
    body.classList.toggle('hidden', !settingsAccordionExpanded);
  }
  if (arrow) {
    arrow.textContent = settingsAccordionExpanded ? '▴' : '▾';
  }
}

function handleHudSettingsClick() {
  devSettingsTapCount++;
  if (devSettingsTapTimer) clearTimeout(devSettingsTapTimer);
  devSettingsTapTimer = setTimeout(() => {
    devSettingsTapCount = 0;
    devSettingsTapTimer = null;
  }, 1800);

  if (devSettingsTapCount >= 5) {
    devSettingsTapCount = 0;
    if (devSettingsTapTimer) {
      clearTimeout(devSettingsTapTimer);
      devSettingsTapTimer = null;
    }
    if (devMode) {
      if (typeof closeDevMode === 'function') closeDevMode();
    } else {
      if (typeof openDevMode === 'function') openDevMode();
    }
    return;
  }

  const settingsSc = document.getElementById('settingsScreen');
  const isSettingsOpen = settingsSc && !settingsSc.classList.contains('hidden');

  if (isSettingsOpen || gameState === 'PAUSED' || gameState === 'SETTINGS') {
    closeSettings();
    return;
  }

  if (gameState === 'PLAYING') {
    gameState = 'PAUSED';
    sfxStopBeams();
    showSettings('combat');
  } else {
    showSettings(gameState ? gameState.toLowerCase() : 'start');
  }
}

function showSettings(fromSource = 'start') {
  settingsPreviousSource = fromSource;
  if (fromSource === 'combat' || fromSource === 'pause') {
    musicSetDucked(true);
  }

  const isResultScreen = (fromSource === 'victory' || fromSource === 'defeat');
  const bgScreenId = fromSource === 'victory' ? 'victoryScreen' 
    : (fromSource === 'defeat' ? 'defeatScreen' 
    : (fromSource === 'levels' ? 'levelsScreen' 
    : (fromSource === 'shop' ? 'shopScreen' 
    : (fromSource === 'upgrades' ? 'upgradesScreen' : 'startScreen'))));

  ['startScreen', 'victoryScreen', 'defeatScreen', 'levelsScreen', 'shopScreen', 'upgradesScreen']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('screen-bg-only');
      if (id === bgScreenId && isResultScreen) {
        el.classList.remove('hidden');
        el.classList.add('screen-bg-only');
      } else if (id === bgScreenId) {
        el.classList.add('hidden');
      }
    });

  const settingsSc = document.getElementById('settingsScreen');
  if (settingsSc) settingsSc.classList.remove('hidden');
  const hudRightGroup = document.getElementById('hudRightGroup');
  if (hudRightGroup) hudRightGroup.classList.remove('hidden');

  const kickerEl = document.getElementById('settingsKicker');
  const titleEl = document.getElementById('settingsTitle');
  const combatActions = document.getElementById('settingsCombatActions');
  const backBtn = document.getElementById('settingsBackBtn');
  const loadoutAnchor = document.getElementById('loadoutAnchor-pause');
  const collapsibleWidget = document.getElementById('settingsCollapsible');

  if (fromSource === 'combat') {
    if (kickerEl) kickerEl.textContent = 'Game';
    if (titleEl) titleEl.textContent = 'Paused';
    if (combatActions) combatActions.classList.remove('hidden');
    if (backBtn) backBtn.classList.add('hidden');
    if (loadoutAnchor) loadoutAnchor.classList.remove('hidden');
    if (collapsibleWidget) collapsibleWidget.classList.remove('plain-mode');
    showLoadoutWidgetIn('loadoutAnchor-pause');
    toggleSettingsAccordion(false);
  } else {
    if (kickerEl) kickerEl.textContent = 'Game';
    if (titleEl) titleEl.textContent = 'Settings';
    if (combatActions) combatActions.classList.add('hidden');
    if (backBtn) backBtn.classList.remove('hidden');
    if (loadoutAnchor) loadoutAnchor.classList.add('hidden');
    if (collapsibleWidget) collapsibleWidget.classList.add('plain-mode');
    toggleSettingsAccordion(true);
  }

  const hpCheckbox = document.getElementById('settingShowHp');
  if (hpCheckbox) hpCheckbox.checked = !!settings.showEnemyHp;

  const dmgCheckbox = document.getElementById('settingShowDamage');
  if (dmgCheckbox) dmgCheckbox.checked = settings.showDamage !== false;

  const vibCheckbox = document.getElementById('settingVibration');
  if (vibCheckbox) vibCheckbox.checked = settings.vibrationEnabled !== false;

  updatePaletteSelectDropdown('settingPaletteSelect');

  applySfxVolume(settings.sfxVolume != null ? settings.sfxVolume : 100, false);
  applyMusicVolume(settings.musicVolume != null ? settings.musicVolume : 70, false);

  const versionLabel = document.getElementById('settingsVersionLabel');
  if (versionLabel) {
    const liveVersion = (window.OtaDiagnostics && window.OtaDiagnostics.localVersion && window.OtaDiagnostics.localVersion !== '—' && window.OtaDiagnostics.localVersion !== 'ERROR')
      ? window.OtaDiagnostics.localVersion
      : '1.36.37';
    versionLabel.textContent = `Version: ${liveVersion}`;
  }
  syncTopHudVisibility();
  updateDailyBonusBtnVisibility();
}

// [UI122] Synth Pass & Custom Neon Color Palette UI Handlers.
let bpPreviousSource = 'start';

function updateBpProgressUI() {
  const { tier, xpInTier, isMax, totalXp } = getBpTierInfo(bpXp);

  // Update tier text and progress bar in main menu Synth Pass widget
  const tierText = document.getElementById('startBpTierText');
  if (tierText) {
    tierText.textContent = `TIER ${tier}`;
  }

  const startFill = document.getElementById('startBpProgressFill');
  if (startFill) {
    const pct = isMax ? 100 : xpInTier;
    startFill.style.width = `${pct}%`;
  }

  updateMenuBadges();

  // Update BP Screen elements if open
  const bpScreen = document.getElementById('battlePassScreen');
  if (bpScreen && !bpScreen.classList.contains('hidden')) {
    renderBattlePassScreen();
  }
}

function updatePaletteSelectDropdown(selectId) {
  const selectEl = document.getElementById(selectId);
  if (!selectEl || typeof NEON_PALETTES === 'undefined') return;
  selectEl.innerHTML = '';

  const totalUnlocked = unlockedPalettes.length;
  const forceDisabled = totalUnlocked <= 1 && !devMode;

  Object.keys(NEON_PALETTES).forEach(pId => {
    const pal = NEON_PALETTES[pId];
    const isUnlocked = unlockedPalettes.includes(pId);
    const opt = document.createElement('option');
    opt.value = pId;
    if (isUnlocked) {
      opt.textContent = pal.name;
    } else {
      const hint = pal.unlockHint ? ` (${pal.unlockHint})` : '';
      opt.textContent = `🔒 ${pal.name}${hint}`;
    }
    if (pId === activePalette) opt.selected = true;
    if (!isUnlocked) opt.disabled = true;
    selectEl.appendChild(opt);
  });

  if (forceDisabled) {
    selectEl.disabled = true;
  } else {
    selectEl.disabled = false;
  }
}

function handleBpThemeClick(e) {
  const selectEl = document.getElementById('bpPaletteSelect');
  if (unlockedPalettes.length <= 1 && !devMode) {
    sfx('denied');
    showHintToast('You have only 1 Theme now. Unlock new tiers and buy premium to have more Themes.');
  }
}

function selectPalette(paletteId) {
  if (!unlockedPalettes.includes(paletteId) && !devMode) {
    sfx('denied');
    showHintToast('Palette locked in Synth Pass!');
    return;
  }
  if (!unlockedPalettes.includes(paletteId) && devMode) {
    unlockedPalettes.push(paletteId);
  }
  applyPaletteColors(paletteId);
  sfx('confirm');
  saveGame();
  updatePaletteSelectDropdown('settingPaletteSelect');
  updatePaletteSelectDropdown('bpPaletteSelect');
  showHintToast(`Active Theme: ${NEON_PALETTES[paletteId] ? NEON_PALETTES[paletteId].name : paletteId}`);
}

function showBattlePassScreen(fromSource = 'start') {
  bpPreviousSource = fromSource;
  const bgScreenId = (fromSource === 'victory') ? 'victoryScreen'
    : ((fromSource === 'defeat') ? 'defeatScreen' : 'startScreen');

  ['startScreen', 'victoryScreen', 'defeatScreen', 'levelsScreen', 'pauseScreen', 'settingsScreen', 'upgradesScreen', 'shopScreen']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('screen-bg-only');
      if (id === bgScreenId) {
        el.classList.remove('hidden');
        el.classList.add('screen-bg-only');
      } else {
        el.classList.add('hidden');
      }
    });

  const topHud = document.getElementById('topHud');
  if (topHud) topHud.classList.add('hidden');

  const bpScreen = document.getElementById('battlePassScreen');
  if (bpScreen) {
    const isResultBg = (bgScreenId === 'victoryScreen' || bgScreenId === 'defeatScreen');
    bpScreen.classList.toggle('from-result', isResultBg);
    bpScreen.classList.toggle('from-main', !isResultBg);
    bpScreen.classList.remove('hidden');
  }
  gameState = 'BATTLE_PASS';

  renderBattlePassScreen();

  updateDailyBonusBtnVisibility();
}

function closeBattlePassScreen() {
  const bpScreen = document.getElementById('battlePassScreen');
  if (bpScreen) bpScreen.classList.add('hidden');

  const topHud = document.getElementById('topHud');
  if (topHud) topHud.classList.remove('hidden');

  ['startScreen', 'victoryScreen', 'defeatScreen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('screen-bg-only');
  });

  if (bpPreviousSource === 'victory') {
    document.getElementById('victoryScreen').classList.remove('hidden');
    gameState = 'VICTORY';
  } else if (bpPreviousSource === 'defeat') {
    document.getElementById('defeatScreen').classList.remove('hidden');
    gameState = 'DEFEAT';
  } else {
    document.getElementById('startScreen').classList.remove('hidden');
    gameState = 'START';
  }
  updateBpProgressUI();
  
  syncTopHudVisibility();
  updateDailyBonusBtnVisibility();
}

function renderBattlePassScreen() {
  const dVal = document.getElementById('bpDiamondVal');
  if (dVal) dVal.textContent = diamonds;
  const pVal = document.getElementById('bpPrismVal');
  if (pVal) pVal.textContent = prisms;

  const { tier, xpInTier, isMax } = getBpTierInfo(bpXp);

  const badgeText = document.getElementById('bpTierBadgeText');
  if (badgeText) badgeText.textContent = `TIER ${tier} / 30`;

  const barFill = document.getElementById('bpXpBarFill');
  if (barFill) barFill.style.width = isMax ? '100%' : `${xpInTier}%`;

  const barText = document.getElementById('bpXpBarText');
  if (barText) barText.textContent = isMax ? 'XP: MAX (3000/3000)' : `XP: ${xpInTier} / 100`;

  const premBtn = document.getElementById('bpActivatePremBtn');
  if (premBtn) {
    if (bpPremiumPurchased) {
      premBtn.className = 'bp-action-btn bp-btn-premium owned';
      premBtn.innerHTML = '<span>PREMIUM UNLOCKED ✓</span>';
    } else {
      premBtn.className = 'bp-action-btn bp-btn-premium';
      premBtn.innerHTML = '<span>ACTIVATE PREMIUM ($2.99)</span>';
    }
  }

  const devBox = document.getElementById('bpDevControls');
  if (devBox) devBox.classList.toggle('hidden', !devMode);

  updatePaletteSelectDropdown('bpPaletteSelect');

  // Render 30 tier rows
  const listBody = document.getElementById('bpTierListBody');
  if (!listBody) return;
  enablePointerScroll(listBody);
  listBody.innerHTML = '';

  const diamondIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2"><polygon points="6 3 18 3 22 9 12 22 2 9" fill="rgba(0,229,255,.25)"/><polyline points="2 9 12 13 22 9"/><line x1="12" y1="22" x2="12" y2="13"/></svg>`;
  const prismIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d946ef" stroke-width="2.2" stroke-linejoin="round"><polygon points="12 2 21 12 12 22 3 12" fill="rgba(217,70,239,.25)"/><polyline points="3 12 12 15 21 12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`;

  BATTLE_PASS_TIERS.forEach(item => {
    const t = item.tier;
    const isUnlockedTier = tier >= t;
    const isCurrentTier = tier === t;

    const row = document.createElement('div');
    row.className = `bp-tier-row${isCurrentTier ? ' current-tier' : ''}`;

    // --- FREE CELL ---
    const freeCell = document.createElement('div');
    const isFreeClaimed = !!bpClaimedFree[t];
    freeCell.className = `bp-cell bp-cell-free${isFreeClaimed ? ' claimed' : ''}`;

    let freeTitle = '';
    const fr = item.freeReward;
    if (fr.type === 'diamonds') freeTitle = `+${fr.amount} ${diamondIcon}`;
    else if (fr.type === 'prisms') freeTitle = `+${fr.amount} ${prismIcon}`;
    else if (fr.type === 'ad_capsule') freeTitle = `Ad-Capsule (+2 ${prismIcon})`;
    else if (fr.title) freeTitle = fr.title.replace(/[\u{1F52E}🔮]/gu, prismIcon).replace(/[\u{1F48E}💎]/gu, diamondIcon);

    let freeBtnHtml = '';
    if (isFreeClaimed) {
      freeBtnHtml = `<button class="bp-cell-btn claimed-btn">CLAIMED ✓</button>`;
    } else if (isUnlockedTier) {
      if (fr.type === 'ad_capsule' && !noAdsPurchased) {
        freeBtnHtml = `<button class="bp-cell-btn ad-btn" onclick="claimBpFreeReward(${t})">CLAIM (AD)</button>`;
      } else {
        freeBtnHtml = `<button class="bp-cell-btn claim-btn" onclick="claimBpFreeReward(${t})">CLAIM</button>`;
      }
    } else {
      freeBtnHtml = `<button class="bp-cell-btn locked-btn">LOCKED</button>`;
    }

    freeCell.innerHTML = `<span class="bp-cell-title">${freeTitle}</span>${freeBtnHtml}`;

    // --- CENTER TIER NUMBER ---
    const numBox = document.createElement('div');
    numBox.className = 'bp-tier-num-box';
    numBox.innerHTML = `<span class="bp-tier-num">${t}</span><span class="bp-tier-status">${isUnlockedTier ? 'UNLOCKED' : 'LOCKED'}</span>`;

    // --- PREMIUM CELL ---
    const premCell = document.createElement('div');
    const isPremClaimed = !!bpClaimedPrem[t];
    premCell.className = `bp-cell bp-cell-prem${isPremClaimed ? ' claimed' : ''}`;

    let premTitle = '';
    const pr = item.premReward;
    if (pr.type === 'diamonds') premTitle = `+${pr.amount} ${diamondIcon}`;
    else if (pr.type === 'prisms') premTitle = `+${pr.amount} ${prismIcon}`;
    else if (pr.type === 'palette' || pr.type === 'perk' || pr.type === 'ultimate') {
      premTitle = pr.title ? pr.title.replace(/[\u{1F52E}🔮]/gu, prismIcon).replace(/[\u{1F48E}💎]/gu, diamondIcon) : '';
    }

    let premBtnHtml = '';
    if (isPremClaimed) {
      premBtnHtml = `<button class="bp-cell-btn claimed-btn">CLAIMED ✓</button>`;
    } else if (bpPremiumPurchased && isUnlockedTier) {
      premBtnHtml = `<button class="bp-cell-btn claim-btn" onclick="claimBpPremReward(${t})">CLAIM</button>`;
    } else if (!bpPremiumPurchased) {
      premBtnHtml = `<button class="bp-cell-btn locked-btn">PREMIUM</button>`;
    } else {
      premBtnHtml = `<button class="bp-cell-btn locked-btn">LOCKED</button>`;
    }

    premCell.innerHTML = `<span class="bp-cell-title">${premTitle}</span>${premBtnHtml}`;

    row.appendChild(freeCell);
    row.appendChild(numBox);
    row.appendChild(premCell);

    listBody.appendChild(row);
  });
}

function claimBpFreeReward(t) {
  const { tier } = getBpTierInfo(bpXp);
  if (tier < t) {
    showHintToast(`Reach Tier ${t} first!`);
    return;
  }
  if (bpClaimedFree[t]) return;

  const item = BATTLE_PASS_TIERS.find(i => i.tier === t);
  if (!item) return;
  const fr = item.freeReward;

  const executeClaim = () => {
    bpClaimedFree[t] = true;
    let toast = '';
    if (fr.type === 'diamonds') {
      diamonds += fr.amount;
      toast = `+${fr.amount} Diamonds claimed!`;
    } else if (fr.type === 'prisms') {
      prisms += fr.amount;
      toast = `+${fr.amount} Prisms claimed!`;
    } else if (fr.type === 'ad_capsule') {
      prisms += fr.prisms;
      toast = `Ad-Capsule: +${fr.prisms} Prisms claimed!`;
    } else if (fr.type === 'combo' || fr.paletteId || fr.type === 'palette') {
      if (fr.paletteId) {
        if (!unlockedPalettes.includes(fr.paletteId)) {
          unlockedPalettes.push(fr.paletteId);
        }
        applyPaletteColors(fr.paletteId);
      }
      if (fr.prisms) {
        prisms += fr.prisms;
      }
      if (fr.diamonds) {
        diamonds += fr.diamonds;
      }
      toast = fr.title ? `${fr.title} claimed!` : `Unlocked ${NEON_PALETTES[fr.paletteId] ? NEON_PALETTES[fr.paletteId].name : fr.paletteId}!`;
    }
    updateDiamondUI();
    updatePrismUI();
    saveGame();
    sfx('reward');
    renderBattlePassScreen();
    showHintToast(toast);
  };

  if (fr.type === 'ad_capsule' && !noAdsPurchased) {
    showAdPlaceholder(executeClaim, null);
  } else {
    executeClaim();
  }
}

function claimBpPremReward(t) {
  if (!bpPremiumPurchased) {
    showHintToast('Activate Premium Pass first!');
    return;
  }
  const { tier } = getBpTierInfo(bpXp);
  if (tier < t) {
    showHintToast(`Reach Tier ${t} first!`);
    return;
  }
  if (bpClaimedPrem[t]) return;

  const item = BATTLE_PASS_TIERS.find(i => i.tier === t);
  if (!item) return;
  const pr = item.premReward;

  bpClaimedPrem[t] = true;
  let toast = '';

  if (pr.type === 'diamonds') {
    diamonds += pr.amount;
    toast = `+${pr.amount} Diamonds claimed!`;
  } else if (pr.type === 'prisms') {
    prisms += pr.amount;
    toast = `+${pr.amount} Prisms claimed!`;
  } else if (pr.type === 'palette') {
    if (!unlockedPalettes.includes(pr.paletteId)) {
      unlockedPalettes.push(pr.paletteId);
    }
    applyPaletteColors(pr.paletteId);
    toast = `Unlocked Palette: ${NEON_PALETTES[pr.paletteId].name}!`;
  } else if (pr.type === 'perk') {
    toast = 'Unlocked Perk: Starting Reserve (+15% Gold)!';
  } else if (pr.type === 'ultimate') {
    if (!unlockedPalettes.includes(pr.paletteId)) {
      unlockedPalettes.push(pr.paletteId);
    }
    prisms += pr.prisms;
    diamonds += pr.diamonds;
    applyPaletteColors(pr.paletteId);
    toast = 'ULTIMATE REWARD CLAIMED! Blood Moon + 25 Prisms + 150 Diamonds';
  }

  updateDiamondUI();
  updatePrismUI();
  saveGame();
  sfx('reward');
  renderBattlePassScreen();
  showHintToast(toast);
}

function buyBpPremiumIAP() {
  if (bpPremiumPurchased) {
    showHintToast('Premium Pass already activated!');
    return;
  }

  const executePurchase = () => {
    bpPremiumPurchased = true;
    if (!unlockedPalettes.includes('cyber_gold')) {
      unlockedPalettes.push('cyber_gold');
    }
    saveGame();
    sfx('victory');
    renderBattlePassScreen();
    showHintToast('SYNTH PASS PREMIUM ACTIVATED!');
  };

  if (typeof showAdPlaceholder === 'function') {
    showAdPlaceholder(executePurchase, null);
  } else {
    executePurchase();
  }
}
window.buyBpPremiumIAP = buyBpPremiumIAP;

function buyBpTierWithDiamonds() {
  const { tier } = getBpTierInfo(bpXp);
  if (tier >= 30 && bpXp >= 3000) {
    showHintToast('Synth Pass already at Max Tier!');
    return;
  }
  if (diamonds < 30) {
    showHintToast('Not enough Diamonds! (30 required)');
    return;
  }
  diamonds -= 30;
  addBpXp(100);
  updateDiamondUI();
  sfx('confirm');
  renderBattlePassScreen();
  showHintToast('+1 Tier purchased (+100 XP)!');
}

function devAddBpXp(amount) {
  if (!devMode) return;
  addBpXp(amount);
  renderBattlePassScreen();
  showHintToast(`Dev: +${amount} BP XP added`);
}

function devToggleBpPremium() {
  if (!devMode) return;
  bpPremiumPurchased = !bpPremiumPurchased;
  if (bpPremiumPurchased && !unlockedPalettes.includes('cyber_gold')) {
    unlockedPalettes.push('cyber_gold');
  }
  saveGame();
  renderBattlePassScreen();
  showHintToast(`Dev: Premium Pass ${bpPremiumPurchased ? 'ON' : 'OFF'}`);
}

function closeSettings() {
  const settingsSc = document.getElementById('settingsScreen');
  if (settingsSc) settingsSc.classList.add('hidden');

  ['startScreen', 'victoryScreen', 'defeatScreen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('screen-bg-only');
  });

  if (settingsPreviousSource === 'combat' || settingsPreviousSource === 'pause') {
    musicSetDucked(false);
    gameState = 'PLAYING';
    lastTime = performance.now();
  } else if (settingsPreviousSource === 'victory') {
    const scr = document.getElementById('victoryScreen');
    if (scr) scr.classList.remove('hidden');
    gameState = 'VICTORY';
  } else if (settingsPreviousSource === 'defeat') {
    const scr = document.getElementById('defeatScreen');
    if (scr) scr.classList.remove('hidden');
    gameState = 'DEFEAT';
  } else if (settingsPreviousSource === 'levels') {
    const scr = document.getElementById('levelsScreen');
    if (scr) scr.classList.remove('hidden');
    gameState = 'LEVELS';
  } else if (settingsPreviousSource === 'upgrades') {
    const scr = document.getElementById('upgradesScreen');
    if (scr) scr.classList.remove('hidden');
    gameState = 'UPGRADES';
  } else if (settingsPreviousSource === 'shop') {
    const scr = document.getElementById('shopScreen');
    if (scr) scr.classList.remove('hidden');
    gameState = 'SHOP';
  } else {
    const scr = document.getElementById('startScreen');
    if (scr) scr.classList.remove('hidden');
    gameState = 'START';
    music('menu');
  }
  syncTopHudVisibility();
  updateHudSpeedWidget();
  updateDailyBonusBtnVisibility();
}

function toggleSettingHp(isChecked) { settings.showEnemyHp = isChecked; saveGameSoon(); }

function toggleSettingDamage(isChecked) { settings.showDamage = isChecked; saveGameSoon(); }

function toggleSettingVibration(isChecked) {
  settings.vibrationEnabled = isChecked;
  if (isChecked) {
    if (typeof vibrate === 'function') vibrate('medium');
    else if (navigator.vibrate) { try { navigator.vibrate(30); } catch(e){} }
  }
  saveGameSoon();
}

function applySfxVolume(pct, persist) {
  const v = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  settings.sfxVolume = v;
  settings.sfxEnabled = v > 0;
  sfxSetEnabled(settings.sfxEnabled);
  sfxSetVolume(v / 100);
  if (v === 0) sfxStopBeams();

  const slider = document.getElementById('settingSfxVol');
  if (slider && String(slider.value) !== String(v)) slider.value = v;
  if (slider) slider.classList.toggle('is-muted', v === 0);
  const label = document.getElementById('sfxVolLabel');
  if (label) {
    label.textContent = v === 0 ? 'OFF' : `${v}%`;
    label.classList.toggle('is-muted', v === 0);
  }
  if (persist) saveGameSoon();
}

function applyMusicVolume(pct, persist) {
  const v = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  settings.musicVolume = v;
  settings.musicEnabled = v > 0;
  musicSetEnabled(settings.musicEnabled);
  musicSetVolume(v / 100);

  const slider = document.getElementById('settingMusicVol');
  if (slider && String(slider.value) !== String(v)) slider.value = v;
  if (slider) slider.classList.toggle('is-muted', v === 0);
  const label = document.getElementById('musicVolLabel');
  if (label) {
    label.textContent = v === 0 ? 'OFF' : `${v}%`;
    label.classList.toggle('is-muted', v === 0);
  }
  if (persist) saveGameSoon();
}

function setSfxVolume(pct) { applySfxVolume(pct, true); }
function setMusicVolume(pct) { applyMusicVolume(pct, true); }

function toggleSettingPerf(isChecked) {
  perfMode = isChecked ? 'low' : 'high';
  settings.perfModeOverride = perfMode;
  perfDecided = true;
  saveGameSoon();
}

// [UI113.01] Level select horizontal swipe gesture handler.
(function initLevelSelectSwipeGesture() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isSwiping = false;
  let swipeTriggered = false;
  let isPointerDown = false;

  function onPointerDown(e) {
    if (gameState !== 'LEVELS') return;
    const levelsScreen = document.getElementById('levelsScreen');
    if (!levelsScreen || levelsScreen.classList.contains('hidden')) return;

    // Игнорируем только стрелки пагинации, переключатель режимов и кнопку выхода
    if (e.target && e.target.closest && e.target.closest('.part-nav-btn, .mode-3way-tab, .levels-main-menu-btn, .hud-gear-btn')) {
      isPointerDown = false;
      return;
    }

    isPointerDown = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    touchStartX = clientX;
    touchStartY = clientY;
    touchStartTime = performance.now();
    isSwiping = false;
    swipeTriggered = false;
  }

  function onPointerMove(e) {
    if (!isPointerDown || gameState !== 'LEVELS' || swipeTriggered || isNavigatingSection) return;
    if (!e.touches && e.buttons === 0) {
      isPointerDown = false;
      return;
    }

    const levelsScreen = document.getElementById('levelsScreen');
    if (!levelsScreen || levelsScreen.classList.contains('hidden')) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - touchStartX;
    const deltaY = clientY - touchStartY;
    const minDistance = 35;

    if (Math.abs(deltaX) >= minDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      swipeTriggered = true;
      isSwiping = true;
      isPointerDown = false;
      if (deltaX < 0) {
        navLevelSection(1);
      } else {
        navLevelSection(-1);
      }
    }
  }

  function onPointerUp(e) {
    if (!isPointerDown || gameState !== 'LEVELS') {
      isPointerDown = false;
      return;
    }
    isPointerDown = false;
    if (swipeTriggered) return;

    const levelsScreen = document.getElementById('levelsScreen');
    if (!levelsScreen || levelsScreen.classList.contains('hidden')) return;

    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    const deltaX = clientX - touchStartX;
    const deltaY = clientY - touchStartY;
    const duration = performance.now() - touchStartTime;

    const minDistance = 35;
    const maxDuration = 600;

    if (duration <= maxDuration && Math.abs(deltaX) >= minDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      swipeTriggered = true;
      isSwiping = true;
      if (deltaX < 0) {
        navLevelSection(1);
      } else {
        navLevelSection(-1);
      }
    }
  }

  function onClickCapture(e) {
    if (isSwiping) {
      e.stopPropagation();
      e.preventDefault();
      isSwiping = false;
    }
  }

  function setupListeners() {
    const levelsScreen = document.getElementById('levelsScreen');
    if (levelsScreen) {
      levelsScreen.addEventListener('touchstart', onPointerDown, { passive: true });
      levelsScreen.addEventListener('touchmove', onPointerMove, { passive: true });
      levelsScreen.addEventListener('touchend', onPointerUp, { passive: true });
      levelsScreen.addEventListener('touchcancel', () => { isPointerDown = false; }, { passive: true });
      levelsScreen.addEventListener('mousedown', onPointerDown);
      levelsScreen.addEventListener('mousemove', onPointerMove);
      levelsScreen.addEventListener('mouseup', onPointerUp);
      levelsScreen.addEventListener('mouseleave', () => { isPointerDown = false; });
      levelsScreen.addEventListener('click', onClickCapture, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupListeners);
  } else {
    setupListeners();
  }
})();

function showLevelSelect() {
  music('menu');
  if (reviveTimerInterval) { clearInterval(reviveTimerInterval); reviveTimerInterval = null; }
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('levelsScreen').classList.remove('hidden');

  document.getElementById('econHpSplitBadge').classList.add('hidden');
  document.getElementById('levelWaveSplitBadge').classList.add('hidden');
  document.getElementById('hudRightGroup').classList.remove('hidden');
  updateStartChapterLabel(false);
  document.getElementById('controlsWrapper').classList.add('hidden');

  const waveBtn = document.getElementById('waveBtn');
  if (waveBtn) waveBtn.classList.add('hidden');

  const customSpawner = document.getElementById('devCustomSpawner');
  if (customSpawner) customSpawner.classList.add('hidden');

  currentLevelSection = Math.min(TOTAL_SECTIONS, Math.max(1, Math.ceil(currentLevel / LEVELS_PER_SECTION)));
  if (typeof modeLevelSections !== 'undefined' && currentLevelMode) {
    modeLevelSections[currentLevelMode] = currentLevelSection;
  }
  renderLevelsGrid();
  showLoadoutWidgetIn('loadoutAnchor-levels');
  gameState = 'LEVELS';
  updateHudSpeedWidget();
  
  syncTopHudVisibility();
  updateDailyBonusBtnVisibility();
}

function giveUpMatch() {
  const confirmModal = document.getElementById('giveUpConfirmModal');
  if (confirmModal) {
    confirmModal.classList.remove('hidden');
  } else {
    confirmGiveUp();
  }
}

function cancelGiveUp() {
  const confirmModal = document.getElementById('giveUpConfirmModal');
  if (confirmModal) {
    confirmModal.classList.add('hidden');
  }
}

function confirmGiveUp() {
  const confirmModal = document.getElementById('giveUpConfirmModal');
  if (confirmModal) confirmModal.classList.add('hidden');

  if (reviveTimerInterval) { clearInterval(reviveTimerInterval); reviveTimerInterval = null; }
  const settingsSc = document.getElementById('settingsScreen');
  if (settingsSc) settingsSc.classList.add('hidden');
  const pauseSc = document.getElementById('pauseScreen');
  if (pauseSc) pauseSc.classList.add('hidden');

  if (typeof triggerDefeat === 'function') {
    triggerDefeat();
  } else {
    musicSetDucked(false);
    music('lose');
    sfx('defeat');
    gameState = 'DEFEAT';
    document.getElementById('defeatScreen').classList.remove('hidden');
    if (typeof replayDefeatFlash === 'function') replayDefeatFlash();
  }
}

function showLevelSelectFromGame() {
  const curCat = (typeof MusicManager !== 'undefined' && MusicManager.current) ? MusicManager.current() : null;
  if (curCat !== 'win' && curCat !== 'lose') {
    music('menu');
  }
  if (reviveTimerInterval) { clearInterval(reviveTimerInterval); reviveTimerInterval = null; }

  const settingsSc = document.getElementById('settingsScreen');
  if (settingsSc) settingsSc.classList.add('hidden');

  ['startScreen', 'victoryScreen', 'defeatScreen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('screen-bg-only');
  });

  const pauseSc = document.getElementById('pauseScreen');
  if (pauseSc) pauseSc.classList.add('hidden');
  const vicSc = document.getElementById('victoryScreen');
  if (vicSc) vicSc.classList.add('hidden');
  const defSc = document.getElementById('defeatScreen');
  if (defSc) defSc.classList.add('hidden');
  const upgSc = document.getElementById('upgradesScreen');
  if (upgSc) upgSc.classList.add('hidden');
  const revSc = document.getElementById('reviveScreen');
  if (revSc) revSc.classList.add('hidden');

  document.getElementById('levelsScreen').classList.remove('hidden');
  document.getElementById('econHpSplitBadge').classList.add('hidden');
  document.getElementById('levelWaveSplitBadge').classList.add('hidden');
  document.getElementById('hudRightGroup').classList.remove('hidden');
  updateStartChapterLabel(false);
  document.getElementById('controlsWrapper').classList.add('hidden');

  const waveBtn = document.getElementById('waveBtn');
  if (waveBtn) waveBtn.classList.add('hidden');

  const customSpawner = document.getElementById('devCustomSpawner');
  if (customSpawner) customSpawner.classList.add('hidden');
  
  currentLevelSection = Math.min(TOTAL_SECTIONS, Math.max(1, Math.ceil(currentLevel / LEVELS_PER_SECTION)));
  if (typeof modeLevelSections !== 'undefined' && currentLevelMode) {
    modeLevelSections[currentLevelMode] = currentLevelSection;
  }
  renderLevelsGrid();
  showLoadoutWidgetIn('loadoutAnchor-levels');
  gameState = 'LEVELS';
  updateHudSpeedWidget();
  
  syncTopHudVisibility();
  updateDailyBonusBtnVisibility();
}

// [UI119] Player loadout slot configuration and milestone sequence manager.

let loadoutWidgetExpanded = false;

function showLoadoutWidgetIn(anchorId) {
  const widget = document.getElementById('loadoutWidget');
  const anchor = document.getElementById(anchorId);
  if (!widget || !anchor) return;

  refreshLoadoutForProgress();

  if (getLoadoutReferenceLevel() < getLoadoutStartLevel()) {
    widget.classList.add('hidden');
    return;
  }

  anchor.appendChild(widget);
  widget.classList.remove('hidden');
  loadoutWidgetExpanded = false;
  const arrow = document.getElementById('loadoutArrow');
  if (arrow) arrow.textContent = '▾';
  renderLoadoutWidgetBody();
}

function toggleLoadoutWidgetExpanded() {
  loadoutWidgetExpanded = !loadoutWidgetExpanded;
  if (!loadoutWidgetExpanded) {
    refreshLoadoutForProgress();
  }
  const arrow = document.getElementById('loadoutArrow');
  if (arrow) {
    arrow.textContent = loadoutWidgetExpanded ? '▴' : '▾';
  }
  renderLoadoutWidgetBody();
}

function renderLoadoutWidgetBody() {
  const miniIcons = document.getElementById('loadoutWidgetMiniIcons');
  const expandedBox = document.getElementById('loadoutWidgetExpanded');
  const countEl = document.getElementById('loadoutWidgetCount');

  if (countEl) {
    countEl.textContent = `${selectedLoadout.length}/${LOADOUT_SIZE}`;
    countEl.classList.toggle('is-full', selectedLoadout.length >= LOADOUT_SIZE);
    countEl.classList.toggle('hidden', !loadoutWidgetExpanded);
  }

  if (!miniIcons || !expandedBox) return;

  if (loadoutWidgetExpanded) {
    miniIcons.innerHTML = '';
    expandedBox.classList.remove('hidden');
    renderLoadoutWidgetGrid();
  } else {
    const canonicalOrder = Object.keys(TOWER_CONFIGS);
    const orderedLoadout = canonicalOrder.filter(t => selectedLoadout.includes(t));
    miniIcons.innerHTML = orderedLoadout.map(t => {
      const col = (TOWER_CONFIGS[t] && TOWER_CONFIGS[t].color) || '#00e5ff';
      return `<span class="loadout-mini-icon" style="border-color:${col};">${TOWER_ICONS[t] || ''}</span>`;
    }).join('');
    expandedBox.classList.add('hidden');
  }
}

function renderLoadoutWidgetGrid() {
  const grid = document.getElementById('loadoutWidgetGrid');
  if (!grid) return;
  const pool = (typeof getPlayerUnlockedTowers === 'function')
    ? getPlayerUnlockedTowers()
    : ['gun'];

  const isFull = selectedLoadout.length >= LOADOUT_SIZE;
  grid.innerHTML = '';
  pool.forEach(type => {
    const conf = TOWER_CONFIGS[type];
    if (!conf) return;
    const isSelected = selectedLoadout.includes(type);
    const btn = document.createElement('div');
    btn.className = 'loadout-tower-btn'
      + (isSelected ? ' selected' : '')
      + (!isSelected && isFull ? ' blocked' : '');
    btn.innerHTML = `
      <div class="tower-btn-icon">${TOWER_ICONS[type] || ''}</div>
      <span class="tower-btn-title">${TOWER_NAMES[type] || type}</span>
    `;
    btn.onclick = (e) => { e.stopPropagation(); toggleLoadoutWidgetTower(type); };
    grid.appendChild(btn);
  });
}

function toggleLoadoutWidgetTower(type) {
  sfx('tap');
  const idx = selectedLoadout.indexOf(type);
  if (idx !== -1) {
    selectedLoadout.splice(idx, 1);
  } else {
    if (selectedLoadout.length >= LOADOUT_SIZE) {
      showHintToast(`Deselect a tower first (${LOADOUT_SIZE} max)`);
      return;
    }
    selectedLoadout.push(type);
  }
  renderLoadoutWidgetBody();
  saveGameSoon();
}

let milestoneSteps = [];
let milestoneIndex = 0;
let milestoneOnComplete = null;
let pendingUpgradeUnlockFx = false;
let pendingLoadoutRevealFx = false;

function buildMilestoneSteps(clearedLevel) {
  const steps = [];
  const sector = Math.ceil(clearedLevel / LEVELS_PER_SECTION);
  const newTowers = getNewlyUnlockedTowers(clearedLevel + 1);
  const upgradesUnlockLevel = getLoadoutStartLevel();
  const upgradesJustUnlocked = (clearedLevel + 1) === upgradesUnlockLevel;
  const loadoutJustUnlocked = upgradesJustUnlocked;

  if (clearedLevel < TOTAL_LEVELS) {
    if (clearedLevel === LEVELS_PER_SECTION) {
      steps.push({
        kicker: `Sector ${sector}`,
        title: 'Complete',
        body: `You've cleared all ${LEVELS_PER_SECTION} levels of the first sector.<br><br>` +
              `<b>Global Upgrades</b> are now unlocked \u2014 spend diamonds there to permanently ` +
              `strengthen every tower and your base, for every battle from here on.`
      });
    } else {
      steps.push({
        kicker: `Sector ${sector}`,
        title: 'Complete',
        body: `Sector ${sector} cleared. The next sector brings tougher enemies \u2014 and a new tower.`
      });
    }
  }

  newTowers.forEach(type => {
    steps.push({
      kicker: 'New Tower',
      title: TOWER_NAMES[type] || type,
      art: { type },
      body: TOWER_UNLOCK_BLURBS[type] || 'A new tower is now available in battle.'
    });
  });

  if (loadoutJustUnlocked) {
    steps.push({
      kicker: 'Choose Your',
      title: 'Loadout',
      body: `You now have more than ${LOADOUT_SIZE} towers \u2014 but only <b>${LOADOUT_SIZE}</b> can be ` +
            `taken into a battle.<br><br>Pick your three below. You can change them before every level.`,
      embed: 'loadout'
    });
  }
  return steps;
}

function showMilestoneSequence(clearedLevel, onComplete) {
  milestoneSteps = buildMilestoneSteps(clearedLevel);
  milestoneIndex = 0;
  milestoneOnComplete = onComplete;
  if (milestoneSteps.length === 0) {
    if (onComplete) onComplete();
    return;
  }
  document.getElementById('milestoneScreen').classList.remove('hidden');
  sfx('unlock');
  renderMilestoneStep();
}

function renderMilestoneStep() {
  const step = milestoneSteps[milestoneIndex];
  if (!step) return;
  const scr = document.getElementById('milestoneScreen');
  document.getElementById('milestoneKicker').textContent = step.kicker;
  document.getElementById('milestoneTitle').textContent = step.title;
  document.getElementById('milestoneBody').innerHTML = step.body || '';

  const art = document.getElementById('milestoneArt');
  if (step.art) {
    const conf = TOWER_CONFIGS[step.art.type];
    const col = (conf && conf.color) || '#00e5ff';
    art.innerHTML = `
      <div class="milestone-art-ring" style="border-color:${col}; box-shadow:0 0 30px ${col}66;">
        ${buildTowerIconSvg(step.art.type, 1, 58)}
      </div>`;
    art.classList.remove('hidden');
  } else {
    art.innerHTML = '';
    art.classList.add('hidden');
  }

  const embed = document.getElementById('milestoneEmbed');
  if (step.embed === 'loadout') {
    embed.classList.remove('hidden');
    renderMilestoneLoadoutGrid();
  } else {
    embed.classList.add('hidden');
  }

  scr.querySelectorAll('.seq-in, .milestone-art').forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
}

function renderMilestoneLoadoutGrid() {
  const grid = document.getElementById('milestoneLoadoutGrid');
  if (!grid) return;
  const ref = Math.min(getLoadoutReferenceLevel(), TOTAL_LEVELS);
  const pool = (LEVELS_DATA[ref] && LEVELS_DATA[ref].unlockedTowers) ? LEVELS_DATA[ref].unlockedTowers : ['gun'];
  const isFull = selectedLoadout.length >= LOADOUT_SIZE;
  grid.innerHTML = '';
  pool.forEach(type => {
    const conf = TOWER_CONFIGS[type];
    if (!conf) return;
    const isSelected = selectedLoadout.includes(type);
    const btn = document.createElement('div');
    btn.className = 'loadout-tower-btn'
      + (isSelected ? ' selected' : '')
      + (!isSelected && isFull ? ' blocked' : '');
    btn.innerHTML = `
      <div class="tower-btn-icon">${TOWER_ICONS[type] || ''}</div>
      <span class="tower-btn-title">${TOWER_NAMES[type] || type}</span>
    `;
    btn.onclick = (e) => {
      e.stopPropagation();
      toggleLoadoutWidgetTower(type);
      renderMilestoneLoadoutGrid();
    };
    grid.appendChild(btn);
  });
  const hint = document.getElementById('milestoneEmbedHint');
  if (hint) hint.textContent = `${selectedLoadout.length}/${LOADOUT_SIZE} selected \u2014 tap a selected tower to free a slot`;
}

function advanceMilestone() {
  milestoneIndex++;
  if (milestoneIndex < milestoneSteps.length) {
    renderMilestoneStep();
    return;
  }
  document.getElementById('milestoneScreen').classList.add('hidden');
  const done = milestoneOnComplete;
  milestoneOnComplete = null;
  milestoneSteps = [];
  if (done) done();
}

function showUpgradesScreen(fromSource) {
  const unlockLevel = getLoadoutStartLevel();
  const isUpgradesUnlocked = devMode || getLoadoutReferenceLevel() >= unlockLevel;
  if (!isUpgradesUnlocked) {
    showHintToast(`Will be available on Level ${unlockLevel}`);
    return;
  }

  if (!fromSource) {
    if (gameState === 'VICTORY') fromSource = 'victory';
    else if (gameState === 'DEFEAT') fromSource = 'defeat';
    else if (gameState === 'LEVELS' || !document.getElementById('levelsScreen').classList.contains('hidden')) fromSource = 'levels';
    else fromSource = 'main';
  }
  upgradesPreviousSource = fromSource;

  const bgScreenId = fromSource === 'victory' ? 'victoryScreen'
    : (fromSource === 'defeat' ? 'defeatScreen'
    : (fromSource === 'levels' ? 'levelsScreen' : 'startScreen'));

  ['startScreen', 'victoryScreen', 'pauseScreen', 'levelsScreen', 'settingsScreen', 'defeatScreen', 'reviveScreen']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('screen-bg-only');
      if (id === bgScreenId) {
        el.classList.remove('hidden');
        el.classList.add('screen-bg-only');
      } else {
        el.classList.add('hidden');
      }
    });

  const controlsWrapper = document.getElementById('controlsWrapper');
  if (controlsWrapper) controlsWrapper.classList.add('hidden');
  const waveBtn = document.getElementById('waveBtn');
  if (waveBtn) waveBtn.classList.add('hidden');
  const devSpawner = document.getElementById('devCustomSpawner');
  if (devSpawner) devSpawner.classList.add('hidden');

  const topHud = document.getElementById('topHud');
  if (topHud) topHud.classList.add('hidden');

  const upg = document.getElementById('upgradesScreen');
  const isResultBg = (bgScreenId === 'victoryScreen' || bgScreenId === 'defeatScreen');
  upg.classList.toggle('from-result', isResultBg);
  upg.classList.toggle('from-main', !isResultBg);
  upg.classList.remove('hidden');
  gameState = 'UPGRADES';
  updateHudSpeedWidget();
  renderUpgradeTree();

  updateDailyBonusBtnVisibility();
}

function closeUpgradesScreen() {
  document.getElementById('upgradesScreen').classList.add('hidden');
  
  const topHud = document.getElementById('topHud');
  if (topHud) topHud.classList.remove('hidden');

  ['startScreen', 'victoryScreen', 'defeatScreen', 'levelsScreen', 'pauseScreen', 'settingsScreen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('screen-bg-only');
  });

  if (upgradesPreviousSource === 'victory') {
    document.getElementById('victoryScreen').classList.remove('hidden');
    gameState = 'VICTORY';
  } else if (upgradesPreviousSource === 'defeat') {
    document.getElementById('defeatScreen').classList.remove('hidden');
    gameState = 'DEFEAT';
  } else if (upgradesPreviousSource === 'levels') {
    document.getElementById('levelsScreen').classList.remove('hidden');
    gameState = 'LEVELS';
  } else {
    document.getElementById('startScreen').classList.remove('hidden');
    gameState = 'START';
  }
  
  syncTopHudVisibility();
  updateDailyBonusBtnVisibility();
}

function showShopScreen(fromSource) {
  if (!fromSource) {
    if (gameState === 'VICTORY') fromSource = 'victory';
    else if (gameState === 'DEFEAT') fromSource = 'defeat';
    else fromSource = 'start';
  }
  shopPreviousSource = fromSource;

  const bgScreenId = fromSource === 'victory' ? 'victoryScreen'
    : (fromSource === 'defeat' ? 'defeatScreen' : 'startScreen');

  ['startScreen', 'victoryScreen', 'defeatScreen', 'levelsScreen', 'pauseScreen', 'settingsScreen', 'upgradesScreen']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('screen-bg-only');
      if (id === bgScreenId) {
        el.classList.remove('hidden');
        el.classList.add('screen-bg-only');
      } else {
        el.classList.add('hidden');
      }
    });

  const controlsWrapper = document.getElementById('controlsWrapper');
  if (controlsWrapper) controlsWrapper.classList.add('hidden');
  const waveBtn = document.getElementById('waveBtn');
  if (waveBtn) waveBtn.classList.add('hidden');
  const topHud = document.getElementById('topHud');
  if (topHud) topHud.classList.add('hidden');

  const shopEl = document.getElementById('shopScreen');
  const isResultBg = (bgScreenId === 'victoryScreen' || bgScreenId === 'defeatScreen');
  shopEl.classList.toggle('from-result', isResultBg);
  shopEl.classList.toggle('from-main', !isResultBg);
  shopEl.classList.remove('hidden');
  gameState = 'SHOP';

  updateHudSpeedWidget();
  renderShopScreen();

  updateDailyBonusBtnVisibility();
}

function closeShopScreen() {
  document.getElementById('shopScreen').classList.add('hidden');

  const topHud = document.getElementById('topHud');
  if (topHud) topHud.classList.remove('hidden');

  ['startScreen', 'victoryScreen', 'defeatScreen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('screen-bg-only');
  });

  if (shopPreviousSource === 'victory') {
    document.getElementById('victoryScreen').classList.remove('hidden');
    gameState = 'VICTORY';
  } else if (shopPreviousSource === 'defeat') {
    document.getElementById('defeatScreen').classList.remove('hidden');
    gameState = 'DEFEAT';
  } else {
    document.getElementById('startScreen').classList.remove('hidden');
    gameState = 'START';
  }

  syncTopHudVisibility();
  updateDailyBonusBtnVisibility();
}

function renderShopScreen() {
  checkDailyGiftReset();
  updateMenuBadges();
  const shopBody = document.getElementById('shopBodyList');
  if (shopBody) enablePointerScroll(shopBody);
  const diamondLabel = document.getElementById('shopDiamondVal');
  if (diamondLabel) diamondLabel.textContent = diamonds;
  const prismLabel = document.getElementById('shopPrismVal');
  if (prismLabel) prismLabel.textContent = prisms;

  const giftTitle = document.getElementById('dailyGiftTitleText');
  const giftSub = document.getElementById('dailyGiftSubText');
  const giftBtn = document.getElementById('dailyGiftClaimBtn');

if (giftTitle) {
    if (dailyGiftsClaimedCount === 0) {
      giftTitle.innerHTML = `+10 ${getDailyDiamondSvg(14)}`;
    } else if (dailyGiftsClaimedCount === 1) {
      giftTitle.innerHTML = `+15 ${getDailyDiamondSvg(14)}`;
    } else if (dailyGiftsClaimedCount === 2) {
      giftTitle.innerHTML = `+20 ${getDailyDiamondSvg(14)} + 1 ${getDailyPrismSvg(14)}`;
    } else {
      giftTitle.textContent = 'Daily Gifts Completed';
    }
  }

  if (giftSub) {
    if (dailyGiftsClaimedCount === 0) {
      giftSub.innerHTML = `Next pack: 10 ${getDailyDiamondSvg(12)} (1/3)`;
    } else if (dailyGiftsClaimedCount === 1) {
      giftSub.innerHTML = `Next pack: 15 ${getDailyDiamondSvg(12)} (2/3)`;
    } else if (dailyGiftsClaimedCount === 2) {
      giftSub.innerHTML = `Next pack: 20 ${getDailyDiamondSvg(12)} + 1 ${getDailyPrismSvg(12)}`;
    } else {
      giftSub.textContent = 'Claimed today: 3/3 packs';
    }
  }

  if (giftBtn) {
    if (dailyGiftsClaimedCount >= 3) {
      giftBtn.disabled = true;
      giftBtn.className = 'shop-item-btn shop-btn-claimed';
      giftBtn.innerHTML = '<span>CLAIMED</span>';
    } else if (dailyGiftsClaimedCount === 0 || noAdsPurchased) {
      giftBtn.disabled = false;
      giftBtn.className = 'shop-item-btn shop-btn-free';
      giftBtn.innerHTML = '<span>FREE</span>';
    } else {
      giftBtn.disabled = false;
      giftBtn.className = 'shop-item-btn shop-btn-ad';
      giftBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" style="flex:none; margin-right:4px;"><rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="10,9 16,12 10,15" fill="currentColor"/></svg><span>WATCH AD</span>';
    }
  }

  const synthBtn = document.getElementById('synthPrismBtn');
  if (synthBtn) {
    const hasEnoughDiamonds = diamonds >= 20;
    synthBtn.disabled = !hasEnoughDiamonds;
    synthBtn.className = `shop-item-btn shop-btn-buy shop-btn-exchange${hasEnoughDiamonds ? '' : ' dimmed'}`;
    synthBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${hasEnoughDiamonds ? '#00e5ff' : '#f04878'}" stroke-width="2.2" stroke-linejoin="round" style="flex:none;">
        <polygon points="6 3 18 3 22 9 12 22 2 9" fill="${hasEnoughDiamonds ? 'rgba(0,229,255,.25)' : 'rgba(240,72,120,.25)'}"/>
        <polyline points="2 9 12 13 22 9"/><line x1="12" y1="22" x2="12" y2="13"/>
      </svg>
      <span id="synthPrismCostVal" class="${hasEnoughDiamonds ? 'exchange-cost-val' : 'exchange-cost-val cost-red'}">20</span>
    `;
  }

  const deconstructBtn = document.getElementById('deconstructPrismBtn');
  if (deconstructBtn) {
    const isUnlocked = (typeof devMode !== 'undefined' && devMode) || (typeof maxUnlockedLevel !== 'undefined' && maxUnlockedLevel >= 31) || (typeof clearedLevels !== 'undefined' && clearedLevels.includes(30));
    if (!isUnlocked) {
      deconstructBtn.disabled = true;
      deconstructBtn.className = 'shop-item-btn shop-btn-buy locked-buy';
      deconstructBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-right:4px; opacity:0.7;">
          <path d="M 7,10 V 6 C 7,3.5 9,2 12,2 C 15,2 17,3.5 17,6 V 10" />
          <rect x="4" y="10" width="16" height="12" rx="3" fill="currentColor" fill-opacity="0.2" />
        </svg>
        <span style="font-size:10px; font-weight:800;">LVL 31</span>`;
    } else {
      const hasEnoughPrisms = prisms >= 1;
      deconstructBtn.disabled = !hasEnoughPrisms;
      deconstructBtn.className = `shop-item-btn shop-btn-buy shop-btn-prism shop-btn-exchange${hasEnoughPrisms ? '' : ' dimmed'}`;
      deconstructBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${hasEnoughPrisms ? '#d946ef' : '#f04878'}" stroke-width="2.2" stroke-linejoin="round" style="flex:none; filter:drop-shadow(0 0 4px ${hasEnoughPrisms ? 'rgba(217,70,239,0.5)' : 'rgba(240,72,120,0.5)'});">
          <polygon points="12 2 21 12 12 22 3 12" fill="${hasEnoughPrisms ? 'rgba(217,70,239,.3)' : 'rgba(240,72,120,.25)'}"/>
          <polyline points="3 12 12 15 21 12"/><line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
        <span id="deconstructPrismCostVal" class="${hasEnoughPrisms ? 'exchange-cost-val' : 'exchange-cost-val cost-red'}">1</span>
      `;
    }
  }

  const t1Btn = document.getElementById('timeModT1Btn');
  if (t1Btn) {
    if (timeModTier >= 1) {
      t1Btn.disabled = true;
      t1Btn.className = 'shop-item-btn shop-btn-claimed';
      t1Btn.innerHTML = '<span>OWNED</span>';
    } else {
      t1Btn.disabled = false;
      t1Btn.className = 'shop-item-btn shop-btn-buy';
      t1Btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2" stroke-linejoin="round" style="flex:none;"><polygon points="6 3 18 3 22 9 12 22 2 9" fill="rgba(0,229,255,.25)"/><polyline points="2 9 12 13 22 9"/><line x1="12" y1="22" x2="12" y2="13"/></svg><span>40</span>';
    }
  }

  const t2Btn = document.getElementById('timeModT2Btn');
  if (t2Btn) {
    if (timeModTier >= 2) {
      t2Btn.disabled = true;
      t2Btn.className = 'shop-item-btn shop-btn-claimed';
      t2Btn.innerHTML = '<span>OWNED</span>';
    } else if (timeModTier < 1) {
      t2Btn.disabled = false;
      t2Btn.className = 'shop-item-btn shop-btn-buy locked-buy';
      t2Btn.innerHTML = '<span style="font-size:11px; filter:grayscale(1) brightness(.7);">🔒</span><span style="font-size:10px;">TIER 1 REQUIRED</span>';
    } else {
      t2Btn.disabled = false;
      t2Btn.className = 'shop-item-btn shop-btn-buy';
      t2Btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2" stroke-linejoin="round" style="flex:none;"><polygon points="6 3 18 3 22 9 12 22 2 9" fill="rgba(0,229,255,.25)"/><polyline points="2 9 12 13 22 9"/><line x1="12" y1="22" x2="12" y2="13"/></svg><span>50</span>';
    }
  }

  const noAdsBtn = document.getElementById('noAdsBuyBtn');
  if (noAdsBtn) {
    if (noAdsPurchased) {
      noAdsBtn.disabled = true;
      noAdsBtn.className = 'shop-item-btn shop-btn-claimed';
      noAdsBtn.innerHTML = '<span>OWNED</span>';
    } else {
      noAdsBtn.disabled = false;
      noAdsBtn.className = 'shop-item-btn shop-btn-buy';
      noAdsBtn.innerHTML = '<span>$1.99</span>';
    }
  }
}

// --- Daily Login 7-Day Calendar Logic ---
function checkDailyLoginState() {
  const todayStr = getTodayDateString();
  return lastLoginClaimDate === todayStr;
}

function updateMenuBadges() {
  // 1. Daily Bonus badge
  const dailyBadge = document.getElementById('dailyBonusBadgeDot') || document.getElementById('dailyCalendarBadge');
  if (dailyBadge) {
    const isClaimedToday = checkDailyLoginState();
    dailyBadge.classList.toggle('hidden', isClaimedToday);
  }

  // 2. Synth Pass badge
  const bpBadge = document.getElementById('startBpBadgeDot');
  if (bpBadge) {
    let hasUnclaimed = false;
    if (typeof getBpTierInfo === 'function' && typeof BATTLE_PASS_TIERS !== 'undefined') {
      const { tier } = getBpTierInfo(bpXp);
      for (let t = 1; t <= tier; t++) {
        if (!bpClaimedFree[t]) { hasUnclaimed = true; break; }
        if (bpPremiumPurchased && !bpClaimedPrem[t]) { hasUnclaimed = true; break; }
      }
    }
    bpBadge.classList.toggle('hidden', !hasUnclaimed);
  }

  // 3. Gifts & Shop badge
  const shopBadge = document.getElementById('shopBadgeDot');
  if (shopBadge) {
    const hasUnclaimedGifts = (typeof dailyGiftsClaimedCount !== 'undefined') ? (dailyGiftsClaimedCount < 3) : false;
    shopBadge.classList.toggle('hidden', !hasUnclaimedGifts);
  }
}

function getDailyDiamondSvg(size = 20, opacity = 1) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linejoin="round"${opacity < 1 ? ` style="opacity:${opacity};"` : ''}><polygon points="6 3 18 3 22 9 12 22 2 9" fill="rgba(0,229,255,0.28)"/><polyline points="2 9 12 13 22 9"/><line x1="12" y1="22" x2="12" y2="13"/></svg>`;
}

function getDailyPrismSvg(size = 20, opacity = 1) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#d946ef" stroke-width="2" stroke-linejoin="round"${opacity < 1 ? ` style="opacity:${opacity};"` : ''}><polygon points="12 2 21 12 12 22 3 12" fill="rgba(217,70,239,0.35)"/><line x1="12" y1="2" x2="12" y2="22"/><polyline points="3 12 12 15 21 12" fill="none"/></svg>`;
}

function renderDailyLoginModal() {
  const grid = document.getElementById('dailyCalendarGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const isClaimedToday = checkDailyLoginState();
  const lastClaimedDay = isClaimedToday ? (loginStreakDay === 1 ? 7 : loginStreakDay - 1) : (loginStreakDay - 1);

  // Render Streak Track Header Widget
  const trackEl = document.getElementById('dailyStreakTrack');
  if (trackEl) {
    const activeStreakDay = isClaimedToday ? (loginStreakDay === 1 ? 7 : loginStreakDay - 1) : loginStreakDay;
    let trackNodesHtml = '';

    // Background Track Line
    trackNodesHtml += `<line x1="18" y1="16" x2="262" y2="16" stroke="#1e293b" stroke-width="2.5"/>`;

    // Progress line up to active streak day
    const activeX = 18 + (activeStreakDay - 1) * 40.66;
    if (activeX > 18) {
      trackNodesHtml += `<line x1="18" y1="16" x2="${activeX}" y2="16" stroke="#00e5ff" stroke-width="2.5"/>`;
    }

    for (let d = 1; d <= 7; d++) {
      const cx = 18 + (d - 1) * 40.66;
      let nodeClaimed = false;
      let nodeActive = false;

      if (isClaimedToday) {
        if (d <= lastClaimedDay || lastClaimedDay === 7) nodeClaimed = true;
      } else {
        if (d < loginStreakDay) nodeClaimed = true;
        else if (d === loginStreakDay) nodeActive = true;
      }

      if (d < 7) {
        if (nodeClaimed) {
          trackNodesHtml += `<circle cx="${cx}" cy="16" r="6" fill="#041a22" stroke="#00e5ff" stroke-width="1.8"/>`;
          trackNodesHtml += `<path d="M ${cx - 2.5},16 L ${cx - 0.5},18 L ${cx + 3},14" fill="none" stroke="#00e5ff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
        } else if (nodeActive) {
          trackNodesHtml += `<circle cx="${cx}" cy="16" r="8" fill="#2d083d" stroke="#d946ef" stroke-width="2.2"/>`;
          trackNodesHtml += `<circle cx="${cx}" cy="16" r="3" fill="#ffffff"/>`;
        } else {
          trackNodesHtml += `<circle cx="${cx}" cy="16" r="5" fill="#0b1324" stroke="#334155" stroke-width="1.5"/>`;
        }
      } else {
        if (nodeClaimed) {
          trackNodesHtml += `<polygon points="${cx},9 ${cx+7},16 ${cx},23 ${cx-7},16" fill="#041a22" stroke="#00e5ff" stroke-width="1.8"/>`;
          trackNodesHtml += `<path d="M ${cx - 2.5},16 L ${cx - 0.5},18 L ${cx + 3},14" fill="none" stroke="#00e5ff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
        } else if (nodeActive) {
          trackNodesHtml += `<polygon points="${cx},8 ${cx+8},16 ${cx},24 ${cx-8},16" fill="#2d083d" stroke="#d946ef" stroke-width="2.2"/>`;
          trackNodesHtml += `<circle cx="${cx}" cy="16" r="3" fill="#ffffff"/>`;
        } else {
          trackNodesHtml += `<polygon points="${cx},10 ${cx+6},16 ${cx},22 ${cx-6},16" fill="#1f0833" stroke="#ff2fd0" stroke-width="1.6"/>`;
        }
      }
    }

    trackEl.innerHTML = `
      <svg width="280" height="32" viewBox="0 0 280 32" style="display:block; margin:auto;">
        ${trackNodesHtml}
      </svg>
      <div class="daily-streak-sub">DAY ${activeStreakDay} OF 7</div>
    `;
  }

  // Render 7 Daily Reward Cards
  DAILY_LOGIN_REWARDS.forEach(item => {
    const d = item.day;
    const isDay7 = (d === 7);
    const card = document.createElement('div');

    let isClaimed = false;
    let isActive = false;
    let isFuture = false;

    if (isClaimedToday) {
      if (d <= lastClaimedDay || (lastClaimedDay === 7)) {
        isClaimed = true;
      } else {
        isFuture = true;
      }
    } else {
      if (d < loginStreakDay) {
        isClaimed = true;
      } else if (d === loginStreakDay) {
        isActive = true;
      } else {
        isFuture = true;
      }
    }

    const iconOpacity = isClaimed ? 0.35 : 1.0;

    if (isDay7) {
      card.className = `daily-card day7-card${isClaimed ? ' claimed' : ''}${isActive ? ' active' : ''}${isFuture ? ' future' : ''}`;

      let statusBadge = '';
      if (isClaimed) {
        statusBadge = `<div class="daily-check-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`;
      }

      card.innerHTML = `
        <div class="day7-left">
          <div class="day7-badge">GRAND BONUS</div>
          <div class="day7-title">DAY 7</div>
          ${statusBadge}
        </div>
        <div class="day7-right">
          <div class="day7-capsule diamond-capsule">
            ${getDailyDiamondSvg(18, iconOpacity)}
            <span class="day7-val">+50</span>
          </div>
          <span class="day7-plus">+</span>
          <div class="day7-capsule prism-capsule">
            ${getDailyPrismSvg(18, iconOpacity)}
            <span class="day7-val">+10</span>
          </div>
        </div>
      `;
    } else if (d === 5) {
      card.className = `daily-card day5-card${isClaimed ? ' claimed' : ''}${isActive ? ' active' : ''}${isFuture ? ' future' : ''}`;

      let topBadge = '';
      if (isActive) {
        topBadge = `<div class="daily-today-badge">TODAY</div>`;
      }

      let bottomBadge = '';
      if (isClaimed) {
        bottomBadge = `<div class="daily-check-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`;
      }

      card.innerHTML = `
        ${topBadge}
        <span class="daily-card-num">DAY 5</span>
        <div class="daily-dual-wrap">
          <div class="daily-dual-side">
            ${getDailyDiamondSvg(16, iconOpacity)}
            <span class="daily-dual-val">+40</span>
          </div>
          <span class="daily-dual-plus">+</span>
          <div class="daily-dual-side">
            ${getDailyPrismSvg(16, iconOpacity)}
            <span class="daily-dual-val">+2</span>
          </div>
        </div>
        ${bottomBadge}
      `;
    } else {
      card.className = `daily-card${isClaimed ? ' claimed' : ''}${isActive ? ' active' : ''}${isFuture ? ' future' : ''}`;

      let topBadge = '';
      if (isActive) {
        topBadge = `<div class="daily-today-badge">TODAY</div>`;
      }

      let rewardIcon = item.prisms > 0 ? getDailyPrismSvg(22, iconOpacity) : getDailyDiamondSvg(22, iconOpacity);
      let rewardValText = item.prisms > 0 ? `+${item.prisms}` : `+${item.diamonds}`;

      let bottomBadge = '';
      if (isClaimed) {
        bottomBadge = `<div class="daily-check-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`;
      }

      card.innerHTML = `
        ${topBadge}
        <span class="daily-card-num">DAY ${d}</span>
        <div class="daily-card-icon-wrap">${rewardIcon}</div>
        <span class="daily-card-val">${rewardValText}</span>
        ${bottomBadge}
      `;
    }

    grid.appendChild(card);
  });

  const normalBtn = document.getElementById('dailyLoginClaimNormalBtn');
  const doubleBtn = document.getElementById('dailyLoginClaimDoubleBtn');
  const doubleLabel = document.getElementById('dailyClaimDoubleLabel');
  const adIcon = document.getElementById('dailyDoubleAdIcon');

  if (isClaimedToday) {
    if (normalBtn) {
      normalBtn.disabled = true;
      normalBtn.innerHTML = '<span>CLAIMED TODAY</span>';
    }
    if (doubleBtn) {
      doubleBtn.disabled = true;
      doubleBtn.style.display = 'none';
    }
  } else {
    if (normalBtn) {
      normalBtn.disabled = false;
      normalBtn.innerHTML = '<span>CLAIM</span>';
    }
    if (doubleBtn) {
      doubleBtn.disabled = false;
      doubleBtn.style.display = 'flex';
      if (noAdsPurchased) {
        if (doubleLabel) doubleLabel.textContent = 'CLAIM x2 (FREE)';
        if (adIcon) {
          adIcon.style.display = 'inline-block';
          adIcon.outerHTML = `<svg id="dailyDoubleAdIcon" width="18" height="15" viewBox="0 0 24 20" fill="none" stroke="currentColor" style="flex:none; margin-right:6px; vertical-align:middle;"><rect x="2" y="3" width="20" height="14" rx="3" fill="none" stroke-width="1.8" opacity="0.85"/><polygon points="9.5,7 15.5,10 9.5,13" fill="currentColor" stroke="none" opacity="0.75"/><line x1="3" y1="18" x2="21" y2="2" stroke-width="2.2" stroke-linecap="round"/></svg>`;
        }
      } else {
        if (doubleLabel) doubleLabel.textContent = 'CLAIM x2';
        if (adIcon) {
          adIcon.style.display = 'inline-block';
          adIcon.outerHTML = `<svg id="dailyDoubleAdIcon" width="18" height="14" viewBox="0 0 24 24" style="flex:none; margin-right:6px;"><rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="10,9 16,12 10,15" fill="currentColor"/></svg>`;
        }
      }
    }
  }
}

function openDailyLoginModal() {
  const modal = document.getElementById('dailyLoginModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  renderDailyLoginModal();
  sfx('confirm');

  updateDailyBonusBtnVisibility();
}

function closeDailyLoginModal() {
  dailyLoginDismissedThisSession = true;
  const modal = document.getElementById('dailyLoginModal');
  if (modal) modal.classList.add('hidden');

  updateDailyBonusBtnVisibility();
}

function claimDailyLoginReward(isDouble) {
  if (checkDailyLoginState()) {
    showHintToast('Already claimed today!');
    return;
  }

  const currentReward = DAILY_LOGIN_REWARDS[loginStreakDay - 1];
  if (!currentReward) return;

  const executeGrantReward = () => {
    const mult = isDouble ? 2 : 1;
    const addDiamonds = currentReward.diamonds * mult;
    const addPrisms = currentReward.prisms * mult;

    diamonds += addDiamonds;
    prisms += addPrisms;
    lastLoginClaimDate = getTodayDateString();
    const claimedDay = loginStreakDay;
    loginStreakDay = (loginStreakDay % 7) + 1;

    updateDiamondUI();
    if (typeof updatePrismUI === 'function') updatePrismUI();
    saveGame();
    sfx('reward');

    updateMenuBadges();
    renderDailyLoginModal();

    let toastText = isDouble ? `x2 Bonus: ` : `Day ${claimedDay}: `;
    const parts = [];
    if (addDiamonds > 0) parts.push(`+${addDiamonds} Diamonds`);
    if (addPrisms > 0) parts.push(`+${addPrisms} Prisms`);
    toastText += parts.join(' ');
    showHintToast(toastText);

    closeDailyLoginModal();
  };

  if (isDouble && !noAdsPurchased) {
    showAdPlaceholder(executeGrantReward, null);
  } else {
    executeGrantReward();
  }
}

function renderVictoryStars(starsCount) {
  const row = document.getElementById('victoryStarsRow');
  if (!row) return;
  row.innerHTML = '';

if (isOverdriveMode) {
    const slot = document.createElement('span');
    slot.className = 'star-slot filled overdrive-victory-badge';
    setTimeout(() => sfx('star'), 160);
    slot.innerHTML = `
      <svg width="96" height="76" viewBox="0 0 48 38" fill="none" style="filter: drop-shadow(0 0 16px rgba(0, 229, 255, 0.95)) drop-shadow(0 0 32px rgba(240, 95, 159, 0.65));">
        <!-- Левая крошечная микро-звезда (полностью белая) -->
        <g transform="translate(1.5, 19.5) scale(0.18)">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" 
            fill="#ffffff" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #ffffff);"/>
        </g>

        <!-- Правая крошечная микро-звезда (полностью белая) -->
        <g transform="translate(42.5, 19.5) scale(0.18)">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" 
            fill="#ffffff" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #ffffff);"/>
        </g>

        <!-- Главная звезда: центр Розовый (#f05f9f), окаймление Бирюзовое (#00e5ff) -->
        <g transform="translate(12, 4) scale(1.0)">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" 
            fill="#f05f9f" stroke="#00e5ff" stroke-width="1.6" stroke-linejoin="round"/>
        </g>

        <!-- 3-я микро-звезда по центру поверх основной звезды (полностью белая) -->
        <g transform="translate(21.8, 14.5) scale(0.18)">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" 
            fill="#ffffff" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" style="filter: drop-shadow(0 0 6px #ffffff);"/>
        </g>
      </svg>`;
    row.appendChild(slot);
    return;
  }

  for (let s = 1; s <= 3; s++) {
    const isFilled = s <= starsCount;
    const slot = document.createElement('span');
    slot.className = `star-slot ${isFilled ? 'filled' : 'empty'}`;
    if (isFilled) setTimeout(() => sfx('star'), 160 + (s - 1) * 180);
    slot.innerHTML = `
      <svg viewBox="0 0 24 24">
        <polygon points="12,2 15.1,8.6 22,9.6 17,14.6 18.2,21.6 12,18.3 5.8,21.6 7,14.6 2,9.6 8.9,8.6"
          fill="${isFilled ? '#f59e0b' : 'rgba(16,21,40,.7)'}"
          stroke="${isFilled ? '#f59e0b' : '#334155'}"
          stroke-width="1.8"
          stroke-linejoin="round" />
      </svg>`;
    row.appendChild(slot);
  }
}

function isOverCancelZone(clientX, clientY) {
  if (clientX === undefined || clientY === undefined) return false;
  const wrapper = document.getElementById('controlsWrapper');
  if (!wrapper || wrapper.classList.contains('hidden')) return false;
  const rect = wrapper.getBoundingClientRect();
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function showCancelZoneVisual(show) {
  const overlay = document.getElementById('cancelZoneOverlay');
  const buildPanel = document.getElementById('buildPanel');
  if (show) {
    if (overlay) overlay.classList.remove('hidden');
    if (buildPanel) buildPanel.classList.add('drag-hidden');
  } else {
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.classList.remove('hovered');
    }
    if (buildPanel) buildPanel.classList.remove('drag-hidden');
  }
}

function updateCancelZoneHover(clientX, clientY) {
  const overlay = document.getElementById('cancelZoneOverlay');
  if (!overlay || overlay.classList.contains('hidden')) return;
  if (isOverCancelZone(clientX, clientY)) {
    overlay.classList.add('hovered');
  } else {
    overlay.classList.remove('hovered');
  }
}

canvas.addEventListener('touchstart', (e) => {
  if (gameState !== 'PLAYING') return;
  if (e.touches.length === 1 && !draggingTower) {
    isPanning = true;
    panStartTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    panStartCam = { x: camX, y: camY };
  } else if (e.touches.length === 2) {
    isPanning = false;
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    initialPinchZoom = camZoom;
    pinchCenterWorld = screenToWorld((t1.clientX + t2.clientX) / 2, (t1.clientY + t2.clientY) / 2);
  }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1 && isPanning) {
    const dx = e.touches[0].clientX - panStartTouch.x;
    const dy = e.touches[0].clientY - panStartTouch.y;
    if (camZoom > baseZoom * 1.01) {
      camX = panStartCam.x + dx;
      camY = panStartCam.y + dy;
      clampCamera();
    }
  } else if (e.touches.length === 2 && initialPinchDist) {
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    const curDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    camZoom = Math.min(maxZoom, Math.max(minZoom, initialPinchZoom * (curDist / initialPinchDist)));
    const centerScreen = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
    camX = centerScreen.x - pinchCenterWorld.x * camZoom;
    camY = centerScreen.y - pinchCenterWorld.y * camZoom;
    clampCamera();
  }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) initialPinchDist = null;
  if (e.touches.length === 0) isPanning = false;
});

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyR' || e.key === 'r' || e.key === 'R')) {
    if (gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'VICTORY' || gameState === 'DEFEAT') {
      e.preventDefault();
      retryLevel();
      return;
    }
  }

  if (e.code === 'Space' && gameState === 'PLAYING') {
    mouseSpacePressed = true;
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    mouseSpacePressed = false;
    isMousePanning = false;
  }
});

canvas.addEventListener('mousedown', (e) => {
  if (gameState !== 'PLAYING') return;
  if (e.button === 1 || (e.button === 0 && mouseSpacePressed)) {
    isMousePanning = true;
    panStartMouse = { x: e.clientX, y: e.clientY };
    panStartCam = { x: camX, y: camY };
    e.preventDefault();
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isMousePanning) return;
  const dx = e.clientX - panStartMouse.x;
  const dy = e.clientY - panStartMouse.y;
  camX = panStartCam.x + dx;
  camY = panStartCam.y + dy;
  clampCamera();
});

canvas.addEventListener('mouseup', () => {
  isMousePanning = false;
});

canvas.addEventListener('wheel', (e) => {
  if (gameState !== 'PLAYING') return;
  e.preventDefault();
  const mouseWorld = screenToWorld(e.clientX, e.clientY);
  const zoomSpeed = 0.15;
  camZoom = Math.min(maxZoom, Math.max(minZoom, camZoom * (1 - (e.deltaY > 0 ? zoomSpeed : -zoomSpeed))));
  camX = e.clientX - mouseWorld.x * camZoom;
  camY = e.clientY - mouseWorld.y * camZoom;
  clampCamera();
}, { passive: false });

let hintToastTimer = null;
function showHintToast(message) {
  const el = document.getElementById('hintToast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('visible');
  if (hintToastTimer) clearTimeout(hintToastTimer);
  hintToastTimer = setTimeout(() => { el.classList.remove('visible'); }, 2000);
}

// [UI120] Tower selection, build panel UI and inspection state controller.
function initBuildPanel() {
  const panel = document.getElementById('buildPanel');
  if (!panel || typeof TOWER_CONFIGS === 'undefined') return;
  panel.querySelectorAll('.tower-btn').forEach(b => b.remove());

  const canonicalOrder = Object.keys(TOWER_CONFIGS);
  const pool = getBuildPanelPool(currentLevel);
  const towerTypes = canonicalOrder.filter(t => pool.includes(t));

  towerTypes.forEach(type => {
    const conf = TOWER_CONFIGS[type];
    const btn = document.createElement('div');
    btn.className = 'tower-btn';
    btn.id = `btn-${type}`;
    btn.setAttribute('data-type', type);
    btn.innerHTML = `
      <div class="tower-btn-top-row">
        <div class="tower-btn-icon">
          ${TOWER_ICONS[type] || ''}
        </div>
        <span class="cost">
          <span class="cost-icon">
            <svg width="12" height="12" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#ff9100" /><text x="12" y="17.5" font-size="16" font-weight="900" fill="#000000" text-anchor="middle" font-family="Montserrat, sans-serif">$</text></svg>
          </span>
          ${conf.cost}
        </span>
      </div>
      <span class="tower-btn-title">${TOWER_NAMES[type] || type}</span>
    `;

    btn.addEventListener('mousedown', (e) => {
      if (gameState !== 'PLAYING') return;
      if (!isTowerActiveThisLevel(type)) {
        showHintToast(`Will be available on Level ${getTowerUnlockLevel(type)}`);
        return;
      }
      if (gold < TOWER_CONFIGS[type].cost || btn.classList.contains('disabled')) return;
      const worldPos = screenToWorld(e.clientX, e.clientY);
      draggingTower = { type: type, worldX: worldPos.x, worldY: worldPos.y, isTouch: false };
      showCancelZoneVisual(true);
    });

    btn.addEventListener('touchstart', (e) => {
      if (gameState !== 'PLAYING') return;
      if (!isTowerActiveThisLevel(type)) {
        showHintToast(`Will be available on Level ${getTowerUnlockLevel(type)}`);
        e.preventDefault();
        return;
      }
      if (gold < TOWER_CONFIGS[type].cost || btn.classList.contains('disabled')) return;
      const touch = e.touches[0];
      const worldPos = screenToWorld(touch.clientX, touch.clientY - TOUCH_OFFSET_Y);
      draggingTower = { type: type, worldX: worldPos.x, worldY: worldPos.y, isTouch: true };
      showCancelZoneVisual(true);
      e.preventDefault();
    }, { passive: false });

    panel.appendChild(btn);
  });
}

window.addEventListener('mousemove', (e) => {
  if (!draggingTower) return;
  const worldPos = screenToWorld(e.clientX, e.clientY);
  draggingTower.worldX = worldPos.x;
  draggingTower.worldY = worldPos.y;
  updateCancelZoneHover(e.clientX, e.clientY);
});

window.addEventListener('touchmove', (e) => {
  if (!draggingTower || e.touches.length > 1) return;
  const touch = e.touches[0];
  const worldPos = screenToWorld(touch.clientX, touch.clientY - TOUCH_OFFSET_Y);
  draggingTower.worldX = worldPos.x;
  draggingTower.worldY = worldPos.y;
  updateCancelZoneHover(touch.clientX, touch.clientY);
}, { passive: false });

window.addEventListener('mouseup', (e) => {
  if (draggingTower) handleDrop(draggingTower.worldX, draggingTower.worldY, e.clientX, e.clientY);
});

window.addEventListener('touchend', (e) => {
  if (draggingTower) {
    let cx, cy;
    if (e.changedTouches && e.changedTouches.length > 0) {
      cx = e.changedTouches[0].clientX;
      cy = e.changedTouches[0].clientY;
    }
    handleDrop(draggingTower.worldX, draggingTower.worldY, cx, cy);
  }
});

canvas.addEventListener('click', (e) => {
  if (gameState !== 'PLAYING' || isPanning) return;
  const worldPos = screenToWorld(e.clientX, e.clientY);
  const c = Math.floor(worldPos.x / TILE_SIZE);
  const r = Math.floor(worldPos.y / TILE_SIZE);
  const clickedTower = towers.find(t => t.c === c && t.r === r);
  if (clickedTower) {
    selectTower(clickedTower);
  } else {
    deselectTower();
  }
});

function armSellConfirm() {
  sellConfirmArmed = true;
  if (sellConfirmTimer) clearTimeout(sellConfirmTimer);
  sellConfirmTimer = setTimeout(() => {
    sellConfirmArmed = false;
    sellConfirmTimer = null;
    updateInspectUI();
  }, 3000);
  updateInspectUI();
}

function resetSellConfirm() {
  sellConfirmArmed = false;
  if (sellConfirmTimer) { clearTimeout(sellConfirmTimer); sellConfirmTimer = null; }
}

function selectTower(tower) {
  selectedTower = tower;
  resetSellConfirm();
  document.getElementById('buildPanel').classList.add('hidden');
  document.getElementById('inspectPanel').classList.remove('hidden');
  updateInspectUI();

  if (tutorialActive && tutorialLevel === 2 && tutorialStep === 0) {
    tutorialStep = 1;
  }
}

function deselectTower() {
  selectedTower = null;
  resetSellConfirm();
  document.getElementById('inspectPanel').classList.add('hidden');
  document.getElementById('buildPanel').classList.remove('hidden');

  if (tutorialActive && tutorialLevel === 2 && tutorialStep === 1) {
    tutorialStep = 0;
  } else if (tutorialActive && tutorialLevel === 2 && tutorialStep === 2) {
    completeTutorial(2);
  }
}

function updateInspectUI() {
  if (!selectedTower) return;
  const t = selectedTower;
  const lvlConfig = LEVELS_DATA[currentLevel];
  const isL1FirstTime = (currentLevel === 1 && !isEndlessMode && !isOverdriveMode && !hasClearedLevelBefore(1) && !devMode);
  const canUpgradeLevel = !(lvlConfig && lvlConfig.canUpgrade === false && isL1FirstTime);

  const iconBox = document.getElementById('inspectIconBox');
  if (iconBox) {
    iconBox.innerHTML = buildTowerIconSvg(t.type, t.level || 1, 18) || '';
    iconBox.style.borderColor = t.color || '#00e5ff';
    iconBox.style.boxShadow = `0 0 10px ${t.color || '#00e5ff'}55`;
  }

  const nameEl = document.getElementById('inspectName');
  if (nameEl) nameEl.textContent = TOWER_NAMES[t.type] || t.type;

  const lvlTextEl = document.getElementById('inspectLvlText');
  if (lvlTextEl) {
    lvlTextEl.textContent = `LVL ${t.level || 1}`;
  }

  for (let lvl = 1; lvl <= 3; lvl++) {
    const seg = document.getElementById(`lvlBar${lvl}`);
    if (seg) {
      if (lvl <= t.level) {
        seg.classList.add('active');
        seg.style.background = t.color || '#00e5ff';
        seg.style.boxShadow = `0 0 5px ${t.color || '#00e5ff'}99`;
      } else {
        seg.classList.remove('active');
        seg.style.background = 'rgba(140, 200, 255, 0.2)';
        seg.style.boxShadow = 'none';
      }
    }
  }

  const upgCost = getUpgradeCost(t.type, t.level);
  const upgBtn = document.getElementById('inspectUpgradeBtn');
  const upgValEl = document.getElementById('inspectUpgradeCostVal');
  const upgIconEl = document.getElementById('inspectUpgradeCostIcon');
  const upgStatusEl = document.getElementById('inspectUpgradeStatus');
  const sellValTextEl = document.getElementById('inspectSellValText');
  const sellTitleEl = document.getElementById('inspectSellTitle');

  if (!canUpgradeLevel) {
    upgBtn.disabled = true;
    if (upgValEl) upgValEl.textContent = '';
    if (upgIconEl) upgIconEl.style.display = 'none';
    if (upgStatusEl) upgStatusEl.textContent = 'LOCKED';
  } else if (t.level >= 3) {
    upgBtn.disabled = true;
    if (upgValEl) upgValEl.textContent = '';
    if (upgIconEl) upgIconEl.style.display = 'none';
    if (upgStatusEl) upgStatusEl.textContent = 'MAX';
  } else {
    const canAfford = gold >= upgCost;
    upgBtn.disabled = !canAfford;
    if (upgValEl) {
      upgValEl.textContent = `${upgCost}`;
      upgValEl.style.color = canAfford ? '#ffffff' : '#f05f9f';
    }
    if (upgIconEl) upgIconEl.style.display = 'inline-flex';
    if (upgStatusEl) upgStatusEl.textContent = 'UPGRADE';
  }

  const refund = Math.floor(t.totalInvested * 0.7);
  const sellBtn = document.getElementById('inspectSellBtn');
  const sellIconEl = sellBtn ? sellBtn.querySelector('.cost-icon') : null;
  if (sellConfirmArmed) {
    if (sellBtn) sellBtn.classList.add('confirm-armed');
    if (sellTitleEl) sellTitleEl.textContent = 'CONFIRM?';
    if (sellValTextEl) sellValTextEl.textContent = `+${refund}`;
    if (sellIconEl) sellIconEl.style.display = 'none';
  } else {
    if (sellBtn) sellBtn.classList.remove('confirm-armed');
    if (sellTitleEl) sellTitleEl.textContent = 'SELL';
    if (sellValTextEl) sellValTextEl.textContent = `${refund}`;
    if (sellIconEl) sellIconEl.style.display = '';
  }
}

function updateWaveCircle(dt) {
  const progEl = el('waveCircleProg');
  if (!progEl) return;
  const circumference = 207.35;
  let p = 0;
  let isCountdown = false;

  const lvlConfig = LEVELS_DATA[currentLevel];
  let totalDelay = 5.0;
  let baseBonus = 15;

  if (lvlConfig && lvlConfig.waves) {
    const currentWaveObj = lvlConfig.waves.find(w => w.wave === wave);
    if (currentWaveObj) {
      if (currentWaveObj.delayAfter !== undefined) {
        totalDelay = currentWaveObj.delayAfter;
      }
      if (currentWaveObj.earlyBonus !== undefined) {
        baseBonus = currentWaveObj.earlyBonus;
      }
    }
  }

  if (waveTimerActive && autoWaveTimeRemaining > 0) {
    p = totalDelay > 0 ? Math.max(0, Math.min(1, autoWaveTimeRemaining / totalDelay)) : 0;
    isCountdown = true;
  } else if (waveInProgress) {
    p = (spawnQueue.length === 0) ? 1.0 : Math.max(0, Math.min(1, waveSpawnElapsedTime / waveTotalSpawnTime));
  }

  if (p > 0.005) {
    progEl.style.opacity = '1';
    progEl.style.strokeDashoffset = (circumference * (1 - p)).toFixed(2);
  } else {
    progEl.style.opacity = '0';
    progEl.style.strokeDashoffset = circumference.toFixed(2);
  }
  progEl.classList.toggle('counting-down', isCountdown);

  const bonusEl = el('waveGoBonus');
  const bonusValEl = el('waveGoBonusVal');
  if (!bonusEl || !bonusValEl) return;

  if (typeof isEndlessMode !== 'undefined' && isEndlessMode) {
    baseBonus = 15 + Math.floor(wave * 1.5);
  }

  const maxW = (lvlConfig && lvlConfig.totalWaves) || 10;
  let bonus = 0;
  if (isCountdown && ((typeof isEndlessMode !== 'undefined' && isEndlessMode) || wave < maxW)) {
    const moneyMultiplier = 1 + getUpgradeEffectiveLevel('base_gold') * 0.05;
    const fractionSaved = totalDelay > 0 ? Math.min(1, Math.max(0, autoWaveTimeRemaining / totalDelay)) : 0;
    bonus = Math.round(fractionSaved * baseBonus * moneyMultiplier);
  }

  bonusValEl.textContent = bonus > 0 ? bonus : '0';
  bonusEl.classList.toggle('visible', bonus > 0);
}

// [UI121] Main UI frame update and HUD sync loop.
function updateUI() {
  const lvlConfig = LEVELS_DATA[currentLevel];
  const maxW = lvlConfig ? lvlConfig.totalWaves : 10;

  document.getElementById('goldVal').textContent = formatResourceVal(gold);
  document.getElementById('hpVal').textContent = formatResourceVal(baseHp);
  if (typeof isEndlessMode !== 'undefined' && isEndlessMode) {
    document.getElementById('levelText').textContent = `${currentLevelSection || 1}`;
    document.getElementById('waveText').textContent = `${wave}/∞`;
  } else {
    document.getElementById('levelText').textContent = `${currentLevel}`;
    document.getElementById('waveText').textContent = `${Math.min(wave, maxW)}/${maxW}`;
  }

  syncTopHudVisibility();

  for (let key in TOWER_CONFIGS) {
    const btn = document.getElementById(`btn-${key}`);
    if (btn) {
      const isUnlocked = isTowerActiveThisLevel(key);
      const affordable = gold >= TOWER_CONFIGS[key].cost;
      if (!isUnlocked) {
        btn.className = 'tower-btn locked disabled';
      } else if (!affordable) {
        btn.className = 'tower-btn disabled';
      } else {
        btn.className = 'tower-btn ready';
      }
    }
  }

  const waveBtn = document.getElementById('waveBtn');
  if (waveBtn) {
    waveBtn.disabled = (waveInProgress || spawnQueue.length > 0 || (!(typeof isEndlessMode !== 'undefined' && isEndlessMode) && wave >= maxW));
  }

  updateHudSpeedWidget();

  if (selectedTower) updateInspectUI();
}

function createFloatingDamage(x, y, damage, color = '#f05f9f') {
  if (typeof settings !== 'undefined' && settings.showDamage === false) return;
  const dmgVal = typeof damage === 'number' ? Math.round(damage) : damage;
  if (!dmgVal || dmgVal <= 0) return;

  pushParticle({
    x: x + (Math.random() - 0.5) * 12,
    y: y - 8 + (Math.random() - 0.5) * 6,
    vx: (Math.random() - 0.5) * 18,
    vy: -28 - Math.random() * 22,
    text: `-${dmgVal}`,
    color: color,
    life: 0.65,
    maxLife: 0.65,
    isText: true
  });
}

function createDamageShards(x, y, color, damage = 16, isDeath = false) {
  const count = isDeath ? (perfMode === 'low' ? 5 : 8) : Math.max(1, Math.min(3, Math.ceil(damage / 25)));
  const baseSize = isDeath ? 7.5 : Math.max(3.2, Math.min(6.0, 2.2 + damage * 0.06));

  for (let i = 0; i < count; i++) {
    const angle = (isDeath ? (i * (Math.PI * 2 / count)) : Math.random() * Math.PI * 2) + (Math.random() - 0.5) * 0.5;
    const speed = isDeath ? (60 + Math.random() * 120) : (30 + Math.random() * 80);
    const sz = baseSize * (0.75 + Math.random() * 0.55);

    const shapeType = Math.floor(Math.random() * 3);
    let pts;

    if (shapeType === 0) {
      pts = [
        { x: -sz * 0.6, y: -sz * 0.3 },
        { x: sz * 0.8, y: -sz * 0.1 },
        { x: (Math.random() - 0.5) * sz * 0.5, y: sz * 0.7 }
      ];
    } else if (shapeType === 1) {
      pts = [
        { x: -sz * 0.5, y: -sz * 0.5 },
        { x: sz * 0.6, y: -sz * 0.4 },
        { x: sz * 0.4, y: sz * 0.6 },
        { x: -sz * 0.5, y: sz * 0.4 }
      ];
    } else {
      pts = [
        { x: -sz * 0.8, y: -sz * 0.2 },
        { x: sz * 0.9, y: -sz * 0.15 },
        { x: sz * 0.6, y: sz * 0.25 },
        { x: -sz * 0.7, y: sz * 0.2 }
      ];
    }

    pushParticle({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: color || '#00e5ff',
      radius: sz,
      pts: pts,
      angle: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 14,
      life: isDeath ? (0.35 + Math.random() * 0.2) : (0.22 + Math.random() * 0.14),
      maxLife: isDeath ? 0.55 : 0.36,
      isShard: true
    });
  }
}

function createImpactSmoke(x, y, size = 10) {
  if (perfMode === 'low' && Math.random() < 0.4) return;
  const sAngle = Math.random() * Math.PI * 2;
  const sSpeed = 8 + Math.random() * 14;
  pushParticle({
    x: x + (Math.random() - 0.5) * 6,
    y: y + (Math.random() - 0.5) * 6,
    vx: Math.cos(sAngle) * sSpeed,
    vy: Math.sin(sAngle) * sSpeed - 8,
    radius: size * (0.8 + Math.random() * 0.4),
    color: '#ffffff',
    life: 0.35 + Math.random() * 0.15,
    maxLife: 0.5,
    isSmoke: true
  });
}

function createSparks(x, y, color1, count = 6, color2 = null) {
  createDamageShards(x, y, color1, count * 5, false);
}

function createSteamPuff(x, y) {
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.0;
  const speed = 12 + Math.random() * 16;
  pushParticle({
    x: x + (Math.random() - 0.5) * 7,
    y: y + (Math.random() - 0.5) * 3,
    vx: Math.cos(angle) * speed * 0.35,
    vy: Math.sin(angle) * speed,
    color: '#e2e8f0',
    radius: 3 + Math.random() * 3,
    life: 0.55 + Math.random() * 0.4,
    maxLife: 0.95,
    isSteam: true
  });
}

function createExplosion(x, y, radius, color1 = '#ff9100', color2 = null, kind = 'standard') {
  const c1 = color1;
  const c2 = color2 || (kind === 'mortar' ? '#f05f9f' : '#00e5ff');
  const isMortar = (kind === 'mortar');
  const isBoss = (kind === 'boss');

  if (isMortar) {
    pushParticle({
      x, y, vx: 0, vy: 0,
      color: c1,
      radius: radius * 0.75,
      life: 0.15, maxLife: 0.15,
      isGlowHalo: true,
      alphaMult: 0.35
    });

    createShockwave(x, y, radius * 0.75, '#ffaa44');

    const count = perfMode === 'low' ? 3 : 5;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 180;
      pushParticle({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: (i % 2 === 0 ? c1 : c2),
        radius: 2.8 + Math.random() * 2.2,
        life: 0.30 + Math.random() * 0.18,
        maxLife: 0.48,
        isStreak: true,
        angle: angle
      });
    }

    const smokeCount = perfMode === 'low' ? 4 : 8;
    for (let s = 0; s < smokeCount; s++) {
      const sAngle = Math.random() * Math.PI * 2;
      const sDist = Math.random() * radius * 0.55;
      const sSpeed = 12 + Math.random() * 28;
      pushParticle({
        x: x + Math.cos(sAngle) * sDist,
        y: y + Math.sin(sAngle) * sDist,
        vx: Math.cos(sAngle) * sSpeed,
        vy: Math.sin(sAngle) * sSpeed - (10 + Math.random() * 15),
        radius: 16 + Math.random() * 14,
        color: '#ffffff',
        life: 0.65 + Math.random() * 0.35,
        maxLife: 1.0,
        isSmoke: true
      });
    }
    return;
  }

  pushParticle({
    x, y, vx: 0, vy: 0,
    color: c1,
    radius: radius * (isBoss ? 1.4 : 0.9),
    life: 0.18, maxLife: 0.18,
    isGlowHalo: true,
    alphaMult: isBoss ? 0.6 : 0.4
  });

  createShockwave(x, y, radius * 0.8, '#ffffff');

  const count = perfMode === 'low' ? 8 : 14;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 120;
    pushParticle({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: (i % 2 === 0 ? c1 : c2),
      radius: 3.0 + Math.random() * 2.5,
      life: 0.30 + Math.random() * 0.2,
      maxLife: 0.5,
      isStreak: false
    });
  }

  if (isBoss) {
    for (let s = 0; s < 8; s++) {
      const sAngle = Math.random() * Math.PI * 2;
      const sSpeed = 8 + Math.random() * 22;
      pushParticle({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(sAngle) * sSpeed,
        vy: Math.sin(sAngle) * sSpeed - 4,
        radius: 14 + Math.random() * 8,
        life: 0.75 + Math.random() * 0.3,
        maxLife: 1.05,
        isSmoke: true
      });
    }
  }
}

function createRailBeamFx(x1, y1, x2, y2, color) {
  const beamColor = color || (typeof TOWER_CONFIGS !== 'undefined' && TOWER_CONFIGS.railgun ? TOWER_CONFIGS.railgun.color : '#a275df');
  lightningBolts.push({
    x1, y1, x2, y2,
    isRail: true,
    life: 0.35,
    maxLife: 0.35,
    hasDealtDamage: true,
    color: beamColor
  });
}

function createShockwave(x, y, maxRadius, color) {
  shockwaves.push({ x, y, maxRadius, color, duration: 0.32, elapsed: 0 });
}

// [UI207] Math and random generator utilities for procedural background generation.

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

// [UI207.01] 2D Perlin Noise permutation table and gradient sampler.
const perlin = (function () {
  const rnd = mulberry32(1337);
  const perm = [];
  for (let i = 0; i < 256; i++) perm.push(i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = perm[i]; perm[i] = perm[j]; perm[j] = t;
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const GX = [1, -1, 1, -1, 1, -1, 0, 0];
  const GY = [1, 1, -1, -1, 0, 0, 1, -1];
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);

  return function (x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const X = xi & 255, Y = yi & 255;
    const aa = p[p[X] + Y] & 7;
    const ab = p[p[X] + Y + 1] & 7;
    const ba = p[p[X + 1] + Y] & 7;
    const bb = p[p[X + 1] + Y + 1] & 7;
    const u = fade(xf), v = fade(yf);
    const g00 = GX[aa] * xf + GY[aa] * yf;
    const g10 = GX[ba] * (xf - 1) + GY[ba] * yf;
    const g01 = GX[ab] * xf + GY[ab] * (yf - 1);
    const g11 = GX[bb] * (xf - 1) + GY[bb] * (yf - 1);
    const x1 = g00 + u * (g10 - g00);
    const x2 = g01 + u * (g11 - g01);
    return x1 + v * (x2 - x1);
  };
})();

function fbm(x, y, oct) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) {
    s += a * perlin(x * f, y * f);
    f *= 2.03; a *= 0.5;
  }
  return s;
}

function ridged(x, y, oct) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) {
    let n = 1 - Math.abs(perlin(x * f, y * f));
    n *= n;
    s += a * n;
    f *= 2.03; a *= 0.5;
  }
  return s;
}


// [UI208] Cosmic nebula and baked starfield texture renderer.

const NEBULA_DENSITY = 1.0;        // Overall nebula brightness and density (0.7 - 1.6).

// [UI208.01] Nebula color clusters aligned with logo gradient (pink-purple left, cyan right, muted bottom).
const NEBULA_CLUSTERS = [
  // Top-left cluster (pink-purple).
  { cx: 0.22, cy: 0.22, scale: 0.42, angle: 0.38, aspect: 0.64, intensity: 1.0,
    base: [0.34, 0.14, 0.58], hot: [0.95, 0.38, 0.88] },
  // Top-right cluster (cyan).
  { cx: 0.78, cy: 0.20, scale: 0.40, angle: -0.38, aspect: 0.65, intensity: 1.0,
    base: [0.04, 0.38, 0.62], hot: [0.25, 0.94, 0.96] },
  // Bottom-left cluster (muted pink-purple background).
  { cx: 0.20, cy: 0.76, scale: 0.45, angle: -0.28, aspect: 0.70, intensity: 0.52,
    base: [0.28, 0.10, 0.48], hot: [0.82, 0.30, 0.78] },
  // Bottom-right cluster (muted cyan background).
  { cx: 0.80, cy: 0.74, scale: 0.44, angle: 0.32, aspect: 0.70, intensity: 0.52,
    base: [0.04, 0.32, 0.50], hot: [0.20, 0.85, 0.88] }
];

// Noise offsets for randomized nebula structure per session.
const NEB_OFF = [Math.random() * 200, Math.random() * 200];

let nebulaCache = null;
let nebulaCacheKey = '';

// [UI209] Starfield parameters and sprite generation.
// Static starfield is baked directly into the background texture once at boot, while a small subset twinkles dynamically.
const BAKED_STAR_COUNT = 1620;
const TWINKLE_STAR_COUNT = 160;
const TWINKLE_STAR_COUNT_LOW = 65;
const STAR_NEBULA_SHARE = 0.5;

// Star temperature color tints (blue -> white -> yellow -> orange -> red).
const STAR_TINTS = [
  { rgb: [155, 176, 255], w: 0.08 },
  { rgb: [202, 215, 255], w: 0.17 },
  { rgb: [248, 247, 255], w: 0.30 },
  { rgb: [255, 244, 234], w: 0.25 },
  { rgb: [255, 210, 161], w: 0.15 },
  { rgb: [255, 180, 130], w: 0.05 }
];

// Star size and brightness classes (sigma in CSS pixels).
const STAR_CLASSES = [
  { sigma: 0.50, halo: 0.00, spike: 0.00, len: 0,  alpha: [0.25, 0.55] },
  { sigma: 0.65, halo: 0.04, spike: 0.00, len: 0,  alpha: [0.40, 0.70] },
  { sigma: 0.85, halo: 0.08, spike: 0.00, len: 0,  alpha: [0.55, 0.85] },
  { sigma: 1.05, halo: 0.14, spike: 0.00, len: 0,  alpha: [0.75, 1.00] },
  { sigma: 1.25, halo: 0.20, spike: 0.35, len: 12, alpha: [0.90, 1.00] }
];

let synthStars = [];
let lastStarUpdateTime = performance.now();

function pickTint() {
  let r = Math.random();
  for (let i = 0; i < STAR_TINTS.length; i++) {
    r -= STAR_TINTS[i].w;
    if (r <= 0) return i;
  }
  return 2;
}

function pickNebulaStarPosition() {
  const idx = Math.random() < 0.75
    ? (Math.random() < 0.5 ? 0 : 1)
    : (Math.random() < 0.5 ? 2 : 3);
  const cluster = NEBULA_CLUSTERS[idx] || NEBULA_CLUSTERS[0];
  const lx = randn() * 0.45 * cluster.scale;
  const ly = randn() * 0.45 * cluster.scale * cluster.aspect;
  const cs = Math.cos(cluster.angle), sn = Math.sin(cluster.angle);
  let x = cluster.cx + lx * cs - ly * sn;
  let y = cluster.cy + lx * sn + ly * cs;
  return { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
}

function renderNebulaCache(w, h, dpr) {
  const isLowPerf = (typeof perfMode !== 'undefined' && perfMode === 'low');
  const effectiveDpr = isLowPerf ? Math.min(1.0, dpr) : dpr;
  const pw = Math.max(1, Math.round(w * effectiveDpr));
  const ph = Math.max(1, Math.round(h * effectiveDpr));
  const S = Math.min(w, h);

  const off = document.createElement('canvas');
  off.width = pw;
  off.height = ph;
  const c = off.getContext('2d');
  const img = c.createImageData(pw, ph);
  const d = img.data;

  const cl = NEBULA_CLUSTERS.map(cluster => ({
    c: cluster,
    cx: cluster.cx * w,
    cy: cluster.cy * h,
    R: cluster.scale * S,
    cs: Math.cos(cluster.angle),
    sn: Math.sin(cluster.angle),
    intensity: cluster.intensity !== undefined ? cluster.intensity : 1.0
  }));
  const env = new Float32Array(cl.length);

  const octMain = isLowPerf ? 4 : 5;
  const octRidge = isLowPerf ? 3 : 4;

  // Прямой расчет 1:1 по пикселям экрана без даунскейла и размывающего апскейла
  for (let Y = 0; Y < ph; Y++) {
    const py = (Y + 0.5) / effectiveDpr;
    const t = py / h;
    let bgR, bgG, bgB;
    if (t < 0.5) {
      const q = t / 0.5;
      bgR = 6 + (5 - 6) * q;
      bgG = 9 + (7 - 9) * q;
      bgB = 20 + (17 - 20) * q;
    } else {
      const q = (t - 0.5) / 0.5;
      bgR = 5 + (2 - 5) * q;
      bgG = 7 + (3 - 7) * q;
      bgB = 17 + (8 - 17) * q;
    }

    for (let X = 0; X < pw; X++) {
      const px = (X + 0.5) / effectiveDpr;

      let maxEnv = 0;
      for (let i = 0; i < cl.length; i++) {
        const q = cl[i];
        const dx = (px - q.cx) / q.R;
        const dy = (py - q.cy) / q.R;
        const rx = dx * q.cs + dy * q.sn;
        const ry = -dx * q.sn + dy * q.cs;
        const sx = 0.85, sy = 0.85 * q.c.aspect;
        const e = Math.exp(-(rx * rx) / (sx * sx) - (ry * ry) / (sy * sy)) * q.intensity;
        env[i] = e;
        if (e > maxEnv) maxEnv = e;
      }

      let nr = 0, ng = 0, nb = 0;

      if (maxEnv > 0.01) {
        const u = px / S, v = py / S;

        const wx = u + 0.55 * fbm(u * 1.4 + NEB_OFF[0], v * 1.4 + NEB_OFF[1], 3);
        const wy = v + 0.55 * fbm(u * 1.4 + NEB_OFF[1] + 31.7, v * 1.4 + NEB_OFF[0] + 17.3, 3);

        const dustN = 0.5 + 1.1 * fbm(wx * 2.2 + 91.3, wy * 2.2 + 47.9, 4);
        const dust = smoothstep(0.52, 0.78, dustN);

        for (let i = 0; i < cl.length; i++) {
          const e = env[i];
          if (e < 0.01) continue;
          const q = cl[i].c;
          const offShift = i * 53.7;

          const n01 = 0.5 + 1.1 * fbm(wx * 3.0 + offShift, wy * 3.0 + offShift * 0.7, octMain);
          const dens = smoothstep(0.28, 0.82, n01);
          const fil = Math.pow(clamp01(ridged(wx * 3.6 + offShift + 7.1, wy * 3.6 + offShift - 3.9, octRidge) * 1.7), 1.4);

          let I = e * (0.28 + 0.95 * dens) * (0.5 + 0.95 * fil);
          I *= 1 - 0.7 * dust * Math.min(1, e * 3);

          const hotK = I * I * I * 0.6;
          nr += (q.base[0] * I + q.hot[0] * hotK) * 0.8;
          ng += (q.base[1] * I + q.hot[1] * hotK) * 0.8;
          nb += (q.base[2] * I + q.hot[2] * hotK) * 0.8;
        }
      }

      const tr = 1 - Math.exp(-nr * NEBULA_DENSITY);
      const tg = 1 - Math.exp(-ng * NEBULA_DENSITY);
      const tb = 1 - Math.exp(-nb * NEBULA_DENSITY);

      let r = bgR + tr * 255 * (1 - bgR / 255);
      let g = bgG + tg * 255 * (1 - bgG / 255);
      let b = bgB + tb * 255 * (1 - bgB / 255);

      const vr = Math.hypot(px - w * 0.5, py - h * 0.45) / (w * 0.85);
      const vt = smoothstep(0.35, 1.0, vr) * 0.9;
      r = r * (1 - vt) + 2 * vt;
      g = g * (1 - vt) + 3 * vt;
      b = b * (1 - vt) + 8 * vt;

      const nGrain = (Math.random() + Math.random() - 1) * 1.6;
      const o = (Y * pw + X) * 4;
      d[o]     = Math.min(255, Math.max(0, r + nGrain));
      d[o + 1] = Math.min(255, Math.max(0, g + nGrain));
      d[o + 2] = Math.min(255, Math.max(0, b + nGrain));
      d[o + 3] = 255;
    }
  }

  // Микро-звездная пыль
  const dustCount = Math.floor(pw * ph / 700);
  for (let i = 0; i < dustCount; i++) {
    const X = Math.floor(Math.random() * pw);
    const Y = Math.floor(Math.random() * ph);
    const o = (Y * pw + X) * 4;
    const v = 10 + Math.pow(Math.random(), 3) * 70;
    d[o]     += v * 0.85;
    d[o + 1] += v * 0.92;
    d[o + 2] += v;
  }

  c.putImageData(img, 0, 0);

  // Впекание статических звезд строго в сетку 1:1
  const bakeRand = mulberry32(4242);
  c.save();
  c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < BAKED_STAR_COUNT; i++) {
    const inNeb = bakeRand() < STAR_NEBULA_SHARE;
    let sx, sy;
    if (inNeb) {
      const idx = bakeRand() < 0.75
        ? (bakeRand() < 0.5 ? 0 : 1)
        : (bakeRand() < 0.5 ? 2 : 3);
      const cluster = NEBULA_CLUSTERS[idx] || NEBULA_CLUSTERS[0];
      const u1 = Math.max(1e-6, bakeRand()), u2 = bakeRand();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
      const lx = z0 * 0.45 * cluster.scale;
      const ly = z1 * 0.45 * cluster.scale * cluster.aspect;
      const cs = Math.cos(cluster.angle), sn = Math.sin(cluster.angle);
      sx = Math.min(1, Math.max(0, cluster.cx + lx * cs - ly * sn));
      sy = Math.min(1, Math.max(0, cluster.cy + lx * sn + ly * cs));
    } else {
      sx = bakeRand();
      sy = bakeRand();
    }

    const u = bakeRand();
    const cls = u < 0.56 ? 0 : u < 0.82 ? 1 : u < 0.94 ? 2 : u < 0.988 ? 3 : 4;
    const aR = STAR_CLASSES[cls].alpha;
    const alpha = (aR[0] + bakeRand() * (aR[1] - aR[0])) * 0.88;

    let tr = bakeRand(), tintIdx = 2;
    for (let t = 0; t < STAR_TINTS.length; t++) {
      tr -= STAR_TINTS[t].w;
      if (tr <= 0) { tintIdx = t; break; }
    }

    const px = Math.round(sx * pw);
    const py = Math.round(sy * ph);
    c.globalAlpha = alpha;

    let bakeBrightness;
    if (cls >= 4) bakeBrightness = '#ffffff';
    else if (cls >= 3) bakeBrightness = '#e2e8f0';
    else if (cls >= 2) bakeBrightness = '#cbd5e1';
    else if (cls >= 1) bakeBrightness = '#94a3b8';
    else bakeBrightness = '#64748b';

    c.fillStyle = bakeBrightness;
    c.fillRect(px, py, 1, 1);
  }
  c.restore();

  return off;
}

function getDpr() {
  if (typeof window !== 'undefined' && window.devicePixelRatio) {
    return window.devicePixelRatio;
  }
  return 1;
}

function isMenuSceneActive() {
  const isUpgradesFromCombat = (typeof gameState !== 'undefined' && gameState === 'UPGRADES' && (typeof upgradesPreviousSource !== 'undefined' && (upgradesPreviousSource === 'victory' || upgradesPreviousSource === 'defeat')));
  const isSettingsFromCombat = (typeof gameState !== 'undefined' && gameState === 'SETTINGS' && (typeof settingsPreviousSource !== 'undefined' && settingsPreviousSource === 'pause'));
  const isShopFromCombat = (typeof gameState !== 'undefined' && gameState === 'SHOP' && (typeof shopPreviousSource !== 'undefined' && (shopPreviousSource === 'victory' || shopPreviousSource === 'defeat')));

  return (typeof gameState !== 'undefined' && (gameState === 'START' || gameState === 'LEVELS' || gameState === 'UPGRADES' || gameState === 'SHOP' || gameState === 'BATTLE_PASS')) &&
         !isUpgradesFromCombat && !isSettingsFromCombat && !isShopFromCombat;
}

let combatDimAlpha = 0;
let lastDimUpdateTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

function drawCosmicNebulaBackground(w, h, customDim = null) {
  const dpr = getDpr();
  const isLowPerf = (typeof perfMode !== 'undefined' && perfMode === 'low') ? 'low' : 'high';
  const key = Math.round(w) + 'x' + Math.round(h) + '@' + dpr + '_' + isLowPerf;
  if (!nebulaCache || nebulaCacheKey !== key) {
    nebulaCache = renderNebulaCache(w, h, dpr);
    nebulaCacheKey = key;
  }
  
  // Отрисовка кэша туманности с отключением фильтрации
  ctx.save();
  ctx.imageSmoothingEnabled = false; // Отключает замыливание пикселей при наложении
  ctx.drawImage(nebulaCache, 0, 0, w, h);
  ctx.restore();

  // Плавное динамическое затемнение в бою (сохраняем оригинальную логику)
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const dt = Math.min((now - lastDimUpdateTime) / 1000, 0.1);
  lastDimUpdateTime = now;

  const targetDim = customDim !== null ? customDim : (isMenuSceneActive() ? 0 : 0.48);
  if (combatDimAlpha < targetDim) {
    combatDimAlpha = Math.min(targetDim, combatDimAlpha + dt * 1.5);
  } else if (combatDimAlpha > targetDim) {
    combatDimAlpha = Math.max(targetDim, combatDimAlpha - dt * 2.0);
  }

  if (combatDimAlpha > 0.001) {
    ctx.save();
    ctx.fillStyle = `rgba(2, 3, 10, ${combatDimAlpha})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

let initialLoaderHidden = false;

function warmUpNebulaAndHideLoader() {
  if (initialLoaderHidden) return;
  initialLoaderHidden = true;

  const loader = document.getElementById('initialLoadingScreen');
  const barFill = document.getElementById('initialProgressBarFill');

  const setProgress = (pct) => {
    if (barFill) barFill.style.width = pct + '%';
  };

  // Вспомогательная функция: ставит процент и ждёт, пока браузер реально отрисует кадр + анимацию
  const stepWait = (pct, delayMs = 140) => new Promise(resolve => {
    requestAnimationFrame(() => {
      setProgress(pct);
      requestAnimationFrame(() => {
        setTimeout(resolve, delayMs);
      });
    });
  });

  (async () => {
    try {
      const dpr = getDpr();
      const w = (typeof canvas !== 'undefined' && canvas) ? (canvas.width / dpr || window.innerWidth) : window.innerWidth;
      const h = (typeof canvas !== 'undefined' && canvas) ? (canvas.height / dpr || window.innerHeight) : window.innerHeight;

      // Шаг 1: Сразу показываем 20%, даём полоске плавно тронуться с места
      await stepWait(20, 120);

      // Шаг 2: Генерируем тяжелый кэш туманности и звёзд
      if (typeof canvas !== 'undefined' && canvas) {
        drawCosmicNebulaBackground(w, h);
      }
      // После генерации двигаем полоску до 55% и даём браузеру её отрисовать
      await stepWait(55, 150);

      // Шаг 3: Генерируем кэш неонового треугольника
      const horizonY = h * 0.44;
      if (typeof renderTriangleLogoCache === 'function') {
        const isLowPerf = (typeof perfMode !== 'undefined' && perfMode === 'low') ? 'low' : 'high';
        const key = Math.round(w) + 'x' + Math.round(horizonY) + '@' + dpr + '_' + isLowPerf;
        if (!triangleLogoCache || triangleLogoCacheKey !== key) {
          triangleLogoCache = renderTriangleLogoCache(w, horizonY, dpr);
          triangleLogoCacheKey = key;
        }
      }
      // Двигаем полоску до 85%
      await stepWait(85, 140);

      // Шаг 4: Прогреваем шейдеры полным кадром сцены меню
      if (typeof drawSynthWavePerspectiveScene === 'function') {
        drawSynthWavePerspectiveScene(performance.now());
      }
      // Доводим полоску до 100%
      await stepWait(100, 200);

    } catch (e) {
      console.warn('Pre-warm scene failed:', e);
      setProgress(100);
    }

    // Плавно растворяем загрузочный экран
    if (loader) {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 360);
    }
  })();
}

// [UI211] Lightweight dynamic twinkling star overlay.

function createStar(randomizeLife = false, inNebula = false) {
  const maxLife = Math.random() * 16.0 + 10.0;

  // Dynamic star instances with phase-offset twinkling.
  const u = Math.random();
  const cls = u < 0.25 ? 0 : u < 0.55 ? 1 : u < 0.82 ? 2 : u < 0.95 ? 3 : 4;
  const aR = STAR_CLASSES[cls].alpha;

  const pos = inNebula ? pickNebulaStarPosition() : { x: Math.random(), y: Math.random() };

  return {
    x: pos.x,
    y: pos.y,
    cls: cls,
    tint: pickTint(),
    baseAlpha: aR[0] + Math.random() * (aR[1] - aR[0]),
    twinkleSpeed: Math.random() * 1.6 + 0.7,
    twinklePhase: Math.random() * Math.PI * 2,
    life: randomizeLife ? Math.random() * maxLife : 0,
    maxLife: maxLife
  };
}

function initSynthStars() {
  synthStars = [];
  for (let i = 0; i < TWINKLE_STAR_COUNT; i++) {
    synthStars.push(createStar(true, Math.random() < STAR_NEBULA_SHARE));
  }
}
initSynthStars();

function updateAndDrawStars(w, h, now) {
  const dt = Math.min((now - lastStarUpdateTime) / 1000, 0.1);
  lastStarUpdateTime = now;
  const time = now / 1000;

  const isLowPerf = (typeof perfMode !== 'undefined' && perfMode === 'low');
  const activeCount = isLowPerf ? Math.min(synthStars.length, TWINKLE_STAR_COUNT_LOW) : synthStars.length;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < activeCount; i++) {
    const star = synthStars[i];
    star.life += dt;
    if (star.life >= star.maxLife) {
      synthStars[i] = createStar(false, Math.random() < STAR_NEBULA_SHARE);
      continue;
    }

    const lifeProgress = star.life / star.maxLife;
    const fade = Math.min(1, Math.sin(lifeProgress * Math.PI) * 3);

    // Выразительное мерцание (в битве приглушаем яркость на 45%)
    const combatStarMult = isMenuSceneActive() ? 1.0 : 0.55;
    const twinkle = 0.55 + 0.45 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
    const alpha = star.baseAlpha * twinkle * fade * combatStarMult;
    if (alpha <= 0.02) continue;

    // Выравниваем координаты строго по физическим пикселям экрана (устраняет расфокус)
    const px = Math.round(star.x * w);
    const py = Math.round(star.y * h);

    ctx.globalAlpha = alpha;

    // Градация цвета/яркости по классу звезды (от глубокого серого до чистого белого)
    let starBrightness;
    if (star.cls >= 4) {
      starBrightness = '#ffffff'; // Максимально яркая звезда
    } else if (star.cls >= 3) {
      starBrightness = '#e2e8f0'; // Яркая белая
    } else if (star.cls >= 2) {
      starBrightness = '#cbd5e1'; // Светло-серая
    } else if (star.cls >= 1) {
      starBrightness = '#94a3b8'; // Умеренно-серая
    } else {
      starBrightness = '#64748b'; // Далекая тусклая фоновая звезда
    }

    ctx.fillStyle = starBrightness;
    ctx.fillRect(px, py, 1, 1);
  }
  ctx.restore();
}

let triangleLogoCache = null;
let triangleLogoCacheKey = '';

function renderTriangleLogoCache(w, horizonY, dpr) {
  const isLowPerf = (typeof perfMode !== 'undefined' && perfMode === 'low');
  const effDpr = isLowPerf ? Math.min(1.25, dpr) : dpr;

  const pad = 70;
  const ch = Math.ceil(horizonY + pad);
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.round(w * effDpr));
  off.height = Math.max(1, Math.round(ch * effDpr));
  const c = off.getContext('2d');
  c.scale(effDpr, effDpr);

  const cx = w * 0.5;
  const tipY = horizonY - 24;
  // Опускаем верхнюю грань на 16px (1/3 высоты кнопки меню)
  const topY = Math.max(98, horizonY * 0.26);
  const halfW = Math.min(w * 0.35, (tipY - topY) * 0.65);

  const A = { x: cx,         y: tipY };   // Bottom tip.
  const B = { x: cx - halfW, y: topY };   // Top-left corner.
  const C = { x: cx + halfW, y: topY };   // Top-right corner.

  // Inscribed circle radius for equidistant contour scaling.
  const sa = Math.hypot(B.x - C.x, B.y - C.y);
  const sb = Math.hypot(A.x - C.x, A.y - C.y);
  const sc = Math.hypot(A.x - B.x, A.y - B.y);
  const per = sa + sb + sc;
  const inX = (sa * A.x + sb * B.x + sc * C.x) / per;
  const inY = (sa * A.y + sb * B.y + sc * C.y) / per;
  const inR = (halfW * (tipY - topY)) / (per / 2);

  const triPath = (offset) => {
    const k = 1 + offset / inR;
    const p = v => ({ x: inX + (v.x - inX) * k, y: inY + (v.y - inY) * k });
    const a = p(A), b = p(B), d = p(C);
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x, b.y);
    c.lineTo(d.x, d.y);
    c.closePath();
  };

  // Horizontal gradient: pink-purple left to cyan right.
  const makeGrad = (lighten) => {
    const g = c.createLinearGradient(B.x - 20, 0, C.x + 20, 0);
    if (lighten) {
      g.addColorStop(0.00, '#ff8be8');
      g.addColorStop(0.45, '#d9b8ff');
      g.addColorStop(1.00, '#b8fff6');
    } else {
      g.addColorStop(0.00, '#ff2fd0');
      g.addColorStop(0.45, '#9a4dff');
      g.addColorStop(1.00, '#00f0d8');
    }
    return g;
  };

  // [UI212.01] Soft atmospheric vertex glow pass.
  c.save();
  c.globalCompositeOperation = 'lighter';

  // Top-left vertex haze.
  const cornerR = halfW * 0.42;
  const bGlow = c.createRadialGradient(B.x, B.y, 0, B.x, B.y, cornerR);
  bGlow.addColorStop(0.0, 'rgba(255, 47, 208, 0.20)');
  bGlow.addColorStop(0.4, 'rgba(154, 77, 255, 0.08)');
  bGlow.addColorStop(1.0, 'rgba(154, 77, 255, 0)');
  c.fillStyle = bGlow;
  c.beginPath();
  c.arc(B.x, B.y, cornerR, 0, Math.PI * 2);
  c.fill();

  // Top-right vertex haze.
  const cGlow = c.createRadialGradient(C.x, C.y, 0, C.x, C.y, cornerR);
  cGlow.addColorStop(0.0, 'rgba(0, 240, 216, 0.20)');
  cGlow.addColorStop(0.4, 'rgba(0, 210, 255, 0.08)');
  cGlow.addColorStop(1.0, 'rgba(0, 210, 255, 0)');
  c.fillStyle = cGlow;
  c.beginPath();
  c.arc(C.x, C.y, cornerR, 0, Math.PI * 2);
  c.fill();
  
  c.restore();

  // [UI212.02] Multi-layered Gaussian glow contour stroke renderer.
  const GLOW_FALLOFF = [
    { mult: 9.5, alpha: 0.012 },
    { mult: 7.8, alpha: 0.016 },
    { mult: 6.3, alpha: 0.022 },
    { mult: 5.0, alpha: 0.030 },
    { mult: 3.9, alpha: 0.042 },
    { mult: 3.0, alpha: 0.058 },
    { mult: 2.3, alpha: 0.075 },
    { mult: 1.7, alpha: 0.095 },
    { mult: 1.3, alpha: 0.120 }
  ];

  const neonTriSoft = (offset, width, lighten, strength) => {
    c.save();
    c.lineJoin = 'round';
    c.lineCap = 'round';

    const glowGrad = makeGrad(false);
    const coreGrad = makeGrad(lighten);

    // Outer soft halo falloff.
    c.globalCompositeOperation = 'lighter';
    c.strokeStyle = glowGrad;
    for (let i = 0; i < GLOW_FALLOFF.length; i++) {
      const layer = GLOW_FALLOFF[i];
      c.globalAlpha = layer.alpha * strength;
      c.lineWidth = width * layer.mult;
      triPath(offset);
      c.stroke();
    }

    // Primary neon core tube.
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 0.94;
    c.strokeStyle = coreGrad;
    c.lineWidth = width;
    triPath(offset);
    c.stroke();

    // Incandescent white inner core.
    c.globalCompositeOperation = 'lighter';
    c.globalAlpha = 0.62 * strength;
    c.strokeStyle = '#ffffff';
    c.lineWidth = width * 0.36;
    triPath(offset);
    c.stroke();

    c.restore();
  };

  // Render nested neon triangle contours into offscreen cache.
  neonTriSoft(-inR * 0.40, 4.2, false, 0.90);
  neonTriSoft(-14,         4.8, false, 0.95);
  neonTriSoft(0,           5.2, true,  1.15);

  return { canvas: off, height: ch };
}

function drawSynthWaveTriangleLogo5C(w, horizonY, time) {
  const dpr = getDpr();
  const isLowPerf = (typeof perfMode !== 'undefined' && perfMode === 'low') ? 'low' : 'high';
  const key = Math.round(w) + 'x' + Math.round(horizonY) + '@' + dpr + '_' + isLowPerf;

  if (!triangleLogoCache || triangleLogoCacheKey !== key) {
    triangleLogoCache = renderTriangleLogoCache(w, horizonY, dpr);
    triangleLogoCacheKey = key;
  }

  // Subtle brightness pulsation with single draw call overhead.
  const flicker = 0.95 + 0.05 * Math.sin(time * 9.0) * Math.sin(time * 2.3 + 1.0);
  ctx.save();
  ctx.globalAlpha = flicker;
  ctx.drawImage(triangleLogoCache.canvas, 0, 0, w, triangleLogoCache.height);
  ctx.restore();
}

// [UI213] Multi-pass neon horizon beam renderer.
function drawSynthWaveHorizonBeam(w, horizonY, time) {
  const cx = w * 0.5;
  const pulse = 0.95 + 0.05 * Math.sin(time * 3.2);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // [UI213.01] Vertical exponential bloom gradient pass.
  const bloomR = 46;
  const vBloom = ctx.createLinearGradient(0, horizonY - bloomR, 0, horizonY + bloomR);
  vBloom.addColorStop(0.00, 'rgba(140, 80, 255, 0)');
  vBloom.addColorStop(0.22, `rgba(140, 80, 255, ${0.03 * pulse})`);
  vBloom.addColorStop(0.36, `rgba(150, 100, 255, ${0.10 * pulse})`);
  vBloom.addColorStop(0.45, `rgba(170, 180, 255, ${0.24 * pulse})`);
  vBloom.addColorStop(0.50, `rgba(220, 245, 255, ${0.42 * pulse})`);
  vBloom.addColorStop(0.55, `rgba(0, 229, 255, ${0.24 * pulse})`);
  vBloom.addColorStop(0.64, `rgba(0, 229, 255, ${0.10 * pulse})`);
  vBloom.addColorStop(0.78, `rgba(0, 229, 255, ${0.03 * pulse})`);
  vBloom.addColorStop(1.00, 'rgba(0, 229, 255, 0)');
  ctx.fillStyle = vBloom;
  ctx.fillRect(0, horizonY - bloomR, w, bloomR * 2);

  // [UI213.02] Lateral atmospheric glow cushions (pink-purple left, cyan right).
  const sideRx = w * 0.46;
  const sideRy = 26;

  // Left pink-purple soft bloom.
  ctx.save();
  ctx.translate(w * 0.27, horizonY);
  ctx.scale(1, sideRy / sideRx);
  const leftGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, sideRx);
  leftGlow.addColorStop(0.00, `rgba(255, 47, 208, ${0.38 * pulse})`);
  leftGlow.addColorStop(0.35, `rgba(168, 85, 247, ${0.18 * pulse})`);
  leftGlow.addColorStop(0.70, `rgba(140, 60, 220, ${0.05 * pulse})`);
  leftGlow.addColorStop(1.00, 'rgba(140, 60, 220, 0)');
  ctx.fillStyle = leftGlow;
  ctx.beginPath();
  ctx.arc(0, 0, sideRx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right cyan soft bloom.
  ctx.save();
  ctx.translate(w * 0.73, horizonY);
  ctx.scale(1, sideRy / sideRx);
  const rightGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, sideRx);
  rightGlow.addColorStop(0.00, `rgba(0, 240, 216, ${0.38 * pulse})`);
  rightGlow.addColorStop(0.35, `rgba(0, 210, 255, ${0.18 * pulse})`);
  rightGlow.addColorStop(0.70, `rgba(0, 160, 230, ${0.05 * pulse})`);
  rightGlow.addColorStop(1.00, 'rgba(0, 160, 230, 0)');
  ctx.fillStyle = rightGlow;
  ctx.beginPath();
  ctx.arc(0, 0, sideRx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // [UI213.03] Tight horizontal beam glow.
  const tightR = 7;
  const tightBloom = ctx.createLinearGradient(0, horizonY - tightR, 0, horizonY + tightR);
  tightBloom.addColorStop(0.00, 'rgba(255, 255, 255, 0)');
  tightBloom.addColorStop(0.30, `rgba(200, 170, 255, ${0.28 * pulse})`);
  tightBloom.addColorStop(0.50, `rgba(255, 255, 255, ${0.75 * pulse})`);
  tightBloom.addColorStop(0.70, `rgba(120, 245, 255, ${0.28 * pulse})`);
  tightBloom.addColorStop(1.00, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = tightBloom;
  ctx.fillRect(0, horizonY - tightR, w, tightR * 2);

  // [UI213.04] Primary neon beam core stroke.
  const hBeamGrad = ctx.createLinearGradient(0, 0, w, 0);
  hBeamGrad.addColorStop(0.00, 'rgba(255, 47, 208, 0.05)');
  hBeamGrad.addColorStop(0.16, '#ff2fd0');
  hBeamGrad.addColorStop(0.42, '#a855f7');
  hBeamGrad.addColorStop(0.50, '#ffffff');
  hBeamGrad.addColorStop(0.58, '#00e5ff');
  hBeamGrad.addColorStop(0.84, '#00f0d8');
  hBeamGrad.addColorStop(1.00, 'rgba(0, 240, 216, 0.05)');

  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = hBeamGrad;
  ctx.globalAlpha = 0.95 * pulse;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(w, horizonY);
  ctx.stroke();

  // [UI213.05] Incandescent white beam center line.
  const coreGrad = ctx.createLinearGradient(0, 0, w, 0);
  coreGrad.addColorStop(0.00, 'rgba(255, 255, 255, 0)');
  coreGrad.addColorStop(0.12, 'rgba(255, 230, 252, 0.80)');
  coreGrad.addColorStop(0.50, 'rgba(255, 255, 255, 1)');
  coreGrad.addColorStop(0.88, 'rgba(220, 255, 252, 0.80)');
  coreGrad.addColorStop(1.00, 'rgba(255, 255, 255, 0)');

  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = coreGrad;
  ctx.globalAlpha = 0.95 * pulse;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(w, horizonY);
  ctx.stroke();

  // [UI213.06] Anamorphic center flare under triangle vertex.
  const flareW = Math.min(w * 0.36, 220);
  const flareH = 18;
  ctx.save();
  ctx.translate(cx, horizonY);
  ctx.scale(1, flareH / flareW);
  const centerFlare = ctx.createRadialGradient(0, 0, 0, 0, 0, flareW);
  centerFlare.addColorStop(0.00, `rgba(255, 255, 255, ${0.65 * pulse})`);
  centerFlare.addColorStop(0.25, `rgba(215, 185, 255, ${0.30 * pulse})`);
  centerFlare.addColorStop(0.60, `rgba(0, 229, 255, ${0.10 * pulse})`);
  centerFlare.addColorStop(1.00, 'rgba(0, 229, 255, 0)');
  ctx.fillStyle = centerFlare;
  ctx.beginPath();
  ctx.arc(0, 0, flareW, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

//------------------------------------------------------------
// [UI200] Synthwave background perspective grid scene renderer.
function drawSynthWavePerspectiveScene(now) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const time = now / 1000;
  const horizonY = h * 0.44;
  const floorH = h - horizonY;
  const vpX = w * 0.5;

  drawCosmicNebulaBackground(w, h);
  updateAndDrawStars(w, h, now);

  ctx.save();

  // Semi-transparent perspective plane background.
  const planeGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  planeGrad.addColorStop(0, 'rgba(16, 26, 52, 0.06)');
  planeGrad.addColorStop(0.35, 'rgba(16, 26, 52, 0.18)');
  planeGrad.addColorStop(1, 'rgba(12, 20, 42, 0.34)');
  ctx.fillStyle = planeGrad;
  ctx.fillRect(0, horizonY, w, floorH);

  ctx.beginPath();
  ctx.rect(0, horizonY, w, floorH);
  ctx.clip();

  setGlow('#00e5ff', 5);

  const horizCount = 14;
  const bottomStep = Math.max(34, (floorH / horizCount) * 1.5);
  const targetBottomCellWidth = bottomStep * 1.1;
  const numLines = Math.ceil((w * 1.4) / targetBottomCellWidth);

  ctx.lineWidth = 1.0;
  ctx.strokeStyle = 'rgba(125, 165, 255, 0.35)';
  for (let i = -numLines; i <= numLines; i++) {
    const bottomX = vpX + (i + 0.5) * targetBottomCellWidth;
    const topX = vpX + (i + 0.5) * (targetBottomCellWidth * 0.32);
    ctx.beginPath();
    ctx.moveTo(topX, horizonY);
    ctx.lineTo(bottomX, h);
    ctx.stroke();
  }

  const roadTopHalfW = targetBottomCellWidth * 0.16;
  const roadBottomHalfW = targetBottomCellWidth * 0.50;

  ctx.fillStyle = 'rgba(16, 26, 52, 0.22)';
  ctx.beginPath();
  ctx.moveTo(vpX - roadTopHalfW, horizonY);
  ctx.lineTo(vpX + roadTopHalfW, horizonY);
  ctx.lineTo(vpX + roadBottomHalfW, h);
  ctx.lineTo(vpX - roadBottomHalfW, h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(0, 229, 255, 0.20)';
  ctx.lineWidth = 2.6;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(vpX - roadTopHalfW, horizonY);
  ctx.lineTo(vpX - roadBottomHalfW, h);
  ctx.moveTo(vpX + roadTopHalfW, horizonY);
  ctx.lineTo(vpX + roadBottomHalfW, h);
  ctx.stroke();

  ctx.save();
  ctx.strokeStyle = 'rgba(165, 243, 252, 0.88)';
  setGlow('#00e5ff', 6);
  ctx.lineWidth = 1.8;
  // [UI200.01] Perspective track edge and grid ray rendering pass.
  ctx.setLineDash([12, 10]);
  ctx.lineDashOffset = (time * 36);

  ctx.beginPath();
  ctx.moveTo(vpX - roadTopHalfW, horizonY);
  ctx.lineTo(vpX - roadBottomHalfW, h);
  ctx.moveTo(vpX + roadTopHalfW, horizonY);
  ctx.lineTo(vpX + roadBottomHalfW, h);
  ctx.stroke();
  ctx.restore();

  const gridOffset = (time * 0.42) % 1;
  for (let j = 0; j < horizCount; j++) {
    const progress = (j + gridOffset) / horizCount;
    const currentY = horizonY + Math.pow(progress, 1.95) * floorH;
    const alpha = Math.min(0.38, 0.08 + progress * 0.35);
    ctx.strokeStyle = `rgba(125, 165, 255, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(w, currentY);
    ctx.stroke();
  }

  const scoutColor = '#ff9100';
  const scoutGlow = '#ffaa33';
  const mobCycleDuration = 13.5;
  const mobLinearProgress = (time % mobCycleDuration) / mobCycleDuration;
  const u = 1 - mobLinearProgress;

  const mobY = horizonY + Math.pow(u, 1.95) * floorH;
  const mobScale = 0.2 + 0.8 * u;
  const scoutBaseR = 12 * mobScale;
  const mobFade = Math.min(1, Math.min(u / 0.15, (1 - u) / 0.12));

  ctx.save();
  ctx.translate(vpX, mobY);
  ctx.globalAlpha = Math.max(0, mobFade);

  ctx.rotate(-Math.PI / 2);

  setGlow(scoutGlow, 8 * mobScale);
  ctx.fillStyle = 'rgba(255, 170, 51, 0.32)';
  ctx.strokeStyle = scoutColor;
  ctx.lineWidth = 1.8 * mobScale;

  ctx.beginPath();
  const R = scoutBaseR * 1.25;
  ctx.moveTo(R, 0);
  ctx.lineTo(-R * 0.5, R * 0.866);
  ctx.lineTo(-R * 0.5, -R * 0.866);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  ctx.restore();

  // Render neon horizon beam and synthwave triangle logo.
  drawSynthWaveHorizonBeam(w, horizonY, time);
  drawSynthWaveTriangleLogo5C(w, horizonY, time);
}

function drawChevron(centerX, centerY, angle, size, color, glowColor) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (glowColor) {
    setGlow(glowColor, 8);
  }
  ctx.beginPath();
  ctx.moveTo(-size * 0.8, -size);
  ctx.lineTo(size * 0.9, 0);
  ctx.lineTo(-size * 0.8, size);
  ctx.stroke();
  ctx.restore();
}

function drawPathPortals() {
  if (!activePathTiles || activePathTiles.length < 2) return;
  const startTile = activePathTiles[0];
  const nextTile = activePathTiles[1];
  const spawnX = startTile.c * TILE_SIZE;
  const spawnY = startTile.r * TILE_SIZE;
  const spawnAngle = Math.atan2(nextTile.r - startTile.r, nextTile.c - startTile.c);

  const spawnOffsets = [-14, 0, 14];
  spawnOffsets.forEach(off => {
    const px = spawnX + 35 + Math.cos(spawnAngle) * off;
    const py = spawnY + 35 + Math.sin(spawnAngle) * off;
    drawChevron(px, py, spawnAngle, 13, '#00f0ff', '#00f0ff');
  });

  const prevTile = activePathTiles[activePathTiles.length - 2];
  const endTile = activePathTiles[activePathTiles.length - 1];
  const baseX = endTile.c * TILE_SIZE;
  const baseY = endTile.r * TILE_SIZE;
  const baseAngle = Math.atan2(endTile.r - prevTile.r, endTile.c - prevTile.c);

  const baseOffsets = [-14, 0, 14];
  baseOffsets.forEach(off => {
    const px = baseX + 35 + Math.cos(baseAngle) * off;
    const py = baseY + 35 + Math.sin(baseAngle) * off;
    drawChevron(px, py, baseAngle, 13, '#f05f9f', '#f05f9f');
  });
}

function renderCellRails(cell) {
  if (!cell.isTurn && cell.rails) {
    ctx.beginPath();
    ctx.moveTo(cell.rails[0].x1, cell.rails[0].y1);
    ctx.lineTo(cell.rails[0].x2, cell.rails[0].y2);
    ctx.moveTo(cell.rails[1].x1, cell.rails[1].y1);
    ctx.lineTo(cell.rails[1].x2, cell.rails[1].y2);
    ctx.stroke();
  } else if (cell.isTurn && cell.turnPivot) {
    ctx.beginPath();
    ctx.arc(cell.turnPivot.x, cell.turnPivot.y, cell.turnRadii[0], cell.turnAngles.start, cell.turnAngles.end, cell.turnAngles.anticlockwise);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cell.turnPivot.x, cell.turnPivot.y, cell.turnRadii[1], cell.turnAngles.start, cell.turnAngles.end, cell.turnAngles.anticlockwise);
    ctx.stroke();
  }
}

let battlePathAlpha = 1.0;
let lastPathTime = performance.now();
let battleStartedOnce = false;

// [UI201] Dynamic track flow and animated path rails pass.
function drawPathRails(now) {
  if (!pathCells || pathCells.length <= 2) return;
  const totalCells = pathCells.length;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = 'rgba(0, 229, 255, 0.18)';
  ctx.lineWidth = 3.5;
  ctx.setLineDash([]);
  for (let i = 1; i < totalCells - 1; i++) {
    renderCellRails(pathCells[i]);
  }

  const curTime = (typeof now === 'number' && now > 0) ? now : performance.now();
  const dt = Math.min((curTime - (lastPathTime || curTime)) / 1000, 0.1);
  lastPathTime = curTime;

  const isBattleActive = (typeof waveInProgress !== 'undefined' && waveInProgress) || 
                         (typeof enemies !== 'undefined' && enemies.length > 0);

  if (isBattleActive) {
    battleStartedOnce = true;
  }

  if (battleStartedOnce || isBattleActive) {
    if (battlePathAlpha > 0) {
      battlePathAlpha = Math.max(0, battlePathAlpha - dt * 0.5);
    }
  } else {
    battlePathAlpha = 1.0;
  }

  if (battlePathAlpha > 0.005) {
    ctx.strokeStyle = `rgba(165, 243, 252, ${0.90 * battlePathAlpha})`;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([12, 10]);

    ctx.lineDashOffset = -((curTime / 1000) * 36);

    for (let i = 1; i < totalCells - 1; i++) {
      renderCellRails(pathCells[i]);
    }
  }

  ctx.restore();
}

// [UI202] Tower vector glyph sprite and model geometry renderer.
function drawTowerGlyphOps(ops, color, isDisabled, isCooling) {
  const fillOf = (f) => {
    if (f === 'd') return TOWER_GLYPH_DARK;
    return isDisabled ? '#475569' : color;
  };
  ops.forEach(op => {
    if (op.t === 'rect') {
      ctx.beginPath();
      if (op.r) ctx.roundRect(op.x, op.y, op.w, op.h, op.r);
      else ctx.rect(op.x, op.y, op.w, op.h);
      ctx.fillStyle = fillOf(op.f);
      ctx.fill();
      if (op.s) { ctx.strokeStyle = fillOf(op.s); ctx.lineWidth = op.sw || 1; ctx.stroke(); }
    } else if (op.t === 'poly' || op.t === 'bolt') {
      ctx.save();
      if (op.t === 'bolt') {
        ctx.translate(op.cx, 0);
        ctx.rotate(op.rot * Math.PI / 180);
        ctx.scale(op.scale, op.scale);
      }
      ctx.beginPath();
      ctx.moveTo(op.pts[0], op.pts[1]);
      for (let i = 2; i < op.pts.length; i += 2) ctx.lineTo(op.pts[i], op.pts[i + 1]);
      ctx.closePath();
      ctx.fillStyle = fillOf(op.f);
      ctx.fill();
      ctx.restore();
    } else if (op.t === 'circle') {
      ctx.beginPath();
      ctx.arc(op.cx, op.cy, op.r, 0, Math.PI * 2);
      ctx.fillStyle = fillOf(op.f);
      ctx.fill();
    } else if (op.t === 'pline') {
      ctx.beginPath();
      ctx.moveTo(op.pts[0], op.pts[1]);
      for (let i = 2; i < op.pts.length; i += 2) ctx.lineTo(op.pts[i], op.pts[i + 1]);
      ctx.strokeStyle = isDisabled ? '#475569' : (isCooling ? '#64748b' : color);
      ctx.lineWidth = op.sw;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  });
}

function drawTowerModel(type, angle, color, level = 1, glow = '#00e5ff', isDisabled = false, isCooling = false, isShooting = false, heatProgress = 0) {
  ctx.save();
  if (isDisabled) ctx.globalAlpha = 0.45;

  const spec = TOWER_GLYPH_SPECS[type];
  const lvl = Math.max(1, Math.min(3, level));
  const ringColor = isDisabled ? '#64748b' : glow;

  const radGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 32);
  radGrad.addColorStop(0, glow + '66');
  radGrad.addColorStop(0.6, glow + '1a');
  radGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = TOWER_GLYPH_DARK;
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fill();

  setGlow(isDisabled ? 'transparent' : glow, isShooting ? 8 : 6);
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha *= 0.35;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = isDisabled ? 0.45 : 1;

  ctx.lineWidth = 1.6;
  TOWER_GLYPH_RINGS[lvl].forEach(r => {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  const effectiveAngle = (type === 'stasis') ? 0 : angle;
  ctx.rotate(effectiveAngle);

  if (spec) {
    const fore = spec.elevationDeg ? Math.cos(spec.elevationDeg * Math.PI / 180) : 1;
    if (spec.elevationDeg) {
      ctx.save();
      ctx.globalAlpha *= 0.35;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(6, 3, 11, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.scale(fore, 1);
    }
    drawTowerGlyphOps(spec.barrel, color, isDisabled, isCooling);
    if (spec.elevationDeg) {
      ctx.restore();
      if (spec.muzzle) {
        const mx = spec.muzzle.atX * fore;
        ctx.beginPath();
        ctx.ellipse(mx, 0, spec.muzzle.rx, spec.muzzle.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = TOWER_GLYPH_DARK;
        ctx.fill();
        ctx.strokeStyle = isDisabled ? '#475569' : color;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    }
  }

  setGlow(isDisabled ? 'transparent' : glow, 8);
  if (spec && spec.flakes) {
    ctx.strokeStyle = isDisabled ? '#475569' : color;
    ctx.lineCap = 'round';
    TOWER_GLYPH_FLAKES[lvl].forEach(fl => {
      ctx.save();
      ctx.translate(fl.cx, fl.cy);
      ctx.scale(fl.scale, fl.scale);
      ctx.lineWidth = fl.sw;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(5, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }
      ctx.restore();
    });
  } else {
    ctx.fillStyle = isDisabled ? '#475569' : color;
    TOWER_GLYPH_CORES[lvl].forEach(d => {
      ctx.beginPath();
      ctx.arc(d.cx, d.cy, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.rotate(-effectiveAngle);

  if (type === 'melter' && heatProgress > 0) {
    const ringR = 13;
    const clampedHeat = Math.max(0, Math.min(1, heatProgress));
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.65)';
    ctx.lineWidth = 3;
    ctx.arc(0, 0, ringR, 0, Math.PI * 2);
    ctx.stroke();

    const isOverheated = clampedHeat >= 0.999;
    const heatColor = isOverheated ? '#ffffff' : (isCooling ? '#fb923c' : '#f05f9f');
    ctx.beginPath();
    ctx.strokeStyle = heatColor;
    setGlow(heatColor, isOverheated ? 8 : 5);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.rotate(-Math.PI / 2);
    ctx.arc(0, 0, ringR, 0, Math.PI * 2 * clampedHeat);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// [UI203] Enemy model vector graphics and health bar renderer.
function drawEnemyModel(e, showHpBar = true) {
  if (!e || typeof e.x !== 'number' || typeof e.y !== 'number') return;

  ctx.save();
  ctx.translate(e.x, e.y);

  if (e.isElite) {
    ctx.save();
    const eRad = e.radius || 12;
    const col1 = e.glow || e.color || '#00e5ff';
    const col2 = '#f04878';

    ctx.strokeStyle = col1;
    ctx.lineWidth = 2.2;
    if (typeof setGlow === 'function') setGlow(col1, 8);
    ctx.beginPath();
    ctx.arc(0, 0, eRad * 1.35, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = col2;
    ctx.lineWidth = 2.0;
    if (typeof setGlow === 'function') setGlow(col2, 10);
    ctx.beginPath();
    ctx.arc(0, 0, eRad * 1.62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

if (e.isEnraged) {
    ctx.save();
    const pulse = (Math.sin(performance.now() * 0.012) + 1) / 2;
    const rad = (e.radius || 12) * (1.22 + pulse * 0.16);
    ctx.strokeStyle = pulse > 0.5 ? '#f04878' : '#ffffff';
    ctx.lineWidth = 2.4 + pulse * 1.6;
    if (typeof setGlow === 'function') setGlow('#f04878', 10 + pulse * 8);

    const shape = e.shape || 'circle';
    ctx.beginPath();

    if (shape === 'circle') {
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
    } else if (shape === 'triangle') {
      ctx.rotate(e.angle || 0);
      const R = rad * 1.2;
      ctx.moveTo(R, 0);
      ctx.lineTo(-R * 0.5, R * 0.866);
      ctx.lineTo(-R * 0.5, -R * 0.866);
      ctx.closePath();
      ctx.rotate(-(e.angle || 0));
    } else if (shape === 'trapezoid' || shape === 'triangle_inverted') {
      ctx.rotate(e.angle || 0);
      ctx.moveTo(rad * 1.2, -rad * 0.4);
      ctx.lineTo(rad * 1.2, rad * 0.4);
      ctx.lineTo(-rad * 0.8, rad * 0.9);
      ctx.lineTo(-rad * 0.8, -rad * 0.9);
      ctx.closePath();
      ctx.rotate(-(e.angle || 0));
    } else if (shape === 'kite') {
      ctx.rotate(e.angle || 0);
      ctx.moveTo(rad * 1.4, 0);
      ctx.lineTo(0, -rad * 0.9);
      ctx.lineTo(-rad * 1.1, 0);
      ctx.lineTo(0, rad * 0.9);
      ctx.closePath();
      ctx.rotate(-(e.angle || 0));
    } else if (shape === 'square') {
      const s = rad * 1.5;
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-s / 2, -s / 2, s, s, 3);
      } else {
        ctx.rect(-s / 2, -s / 2, s, s);
      }
    } else if (shape === 'diamond') {
      ctx.moveTo(0, -rad * 1.3);
      ctx.lineTo(rad * 1.1, 0);
      ctx.lineTo(0, rad * 1.3);
      ctx.lineTo(-rad * 1.1, 0);
      ctx.closePath();
    } else if (shape === 'hexagon') {
      for (let hx = 0; hx < 6; hx++) {
        const a = (hx * Math.PI) / 3;
        const hxX = Math.cos(a) * rad * 1.15;
        const hxY = Math.sin(a) * rad * 1.15;
        if (hx === 0) ctx.moveTo(hxX, hxY); else ctx.lineTo(hxX, hxY);
      }
      ctx.closePath();
    } else if (shape === 'octagon') {
      for (let oc = 0; oc < 8; oc++) {
        const a = (oc * Math.PI) / 4;
        const ocX = Math.cos(a) * rad * 1.2;
        const ocY = Math.sin(a) * rad * 1.2;
        if (oc === 0) ctx.moveTo(ocX, ocY); else ctx.lineTo(ocX, ocY);
      }
      ctx.closePath();
    } else {
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
    }

    ctx.stroke();
    ctx.restore();
  }

  const isBlinkerShielded = (e.type === 'blinker' || e.type === 'chronos_warp') && e.isShielded;
  const renderColor = e.isEnraged ? '#f04878' : (isBlinkerShielded ? '#64748b' : (e.color || '#00e5ff'));

  if (isBlinkerShielded) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, (e.radius || 12) * 1.45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const isHeavyMob = e.isBoss || e.isMiniBoss || isBlinkerShielded;

  if (!isHeavyMob && typeof getEnemyShapeSprite === 'function') {
    const spr = getEnemyShapeSprite(e.shape || 'circle', renderColor, e.radius || 12, e.glow);
    if (spr && spr.canvas) {
      const needsRotation = (e.shape === 'triangle' || e.shape === 'trapezoid' || e.shape === 'triangle_inverted' || e.shape === 'kite');
      if (needsRotation && typeof e.angle === 'number') {
        ctx.rotate(e.angle);
        ctx.drawImage(spr.canvas, -spr.half, -spr.half);
        ctx.rotate(-e.angle);
      } else {
        ctx.drawImage(spr.canvas, -spr.half, -spr.half);
      }
    }
  } else {
    const rad = e.radius || 16;
    const glowColor = e.glow || renderColor;
    const glowGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, rad * 2.5);
    glowGrad.addColorStop(0, glowColor + (e.isBoss ? '88' : '66'));
    glowGrad.addColorStop(0.5, glowColor + (e.isBoss ? '30' : '20'));
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rad * 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    if (isBlinkerShielded) ctx.globalAlpha = 0.52;

    const strokeW = e.isBoss ? 5.0 : 3.6;
    ctx.fillStyle = isBlinkerShielded ? '#334155' : glowColor + (e.isBoss ? '33' : '22');
    ctx.strokeStyle = renderColor;
    ctx.lineWidth = strokeW;
    if (typeof setGlow === 'function') {
      setGlow(isBlinkerShielded ? 'transparent' : glowColor, isBlinkerShielded ? 0 : 8);
    }


    if (e.shape === 'circle' || !e.shape) {
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    } else if (e.shape === 'triangle') {
      ctx.rotate(e.angle || 0);
      const R = rad * 1.2;
      ctx.beginPath();
      ctx.moveTo(R, 0);
      ctx.lineTo(-R * 0.5, R * 0.866);
      ctx.lineTo(-R * 0.5, -R * 0.866);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.rotate(-(e.angle || 0));
    } else if (e.shape === 'trapezoid' || e.shape === 'triangle_inverted') {
      ctx.rotate(e.angle || 0);
      ctx.beginPath();
      ctx.moveTo(rad * 1.2, -rad * 0.4);
      ctx.lineTo(rad * 1.2, rad * 0.4);
      ctx.lineTo(-rad * 0.8, rad * 0.9);
      ctx.lineTo(-rad * 0.8, -rad * 0.9);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.rotate(-(e.angle || 0));
    } else if (e.shape === 'kite') {
      ctx.rotate(e.angle || 0);
      ctx.beginPath();
      ctx.moveTo(rad * 1.4, 0);
      ctx.lineTo(0, -rad * 0.9);
      ctx.lineTo(-rad * 1.1, 0);
      ctx.lineTo(0, rad * 0.9);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.rotate(-(e.angle || 0));
    } else if (e.shape === 'square') {
      const s = rad * 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-s/2, -s/2, s, s, 3);
      } else {
        ctx.rect(-s/2, -s/2, s, s);
      }
      ctx.fill(); ctx.stroke();
    } else if (e.shape === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(0, -rad * 1.3); ctx.lineTo(rad * 1.1, 0);
      ctx.lineTo(0, rad * 1.3); ctx.lineTo(-rad * 1.1, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (e.shape === 'hexagon') {
      ctx.beginPath();
      for (let hx = 0; hx < 6; hx++) {
        const a = (hx * Math.PI) / 3;
        const hxX = Math.cos(a) * rad * 1.15;
        const hxY = Math.sin(a) * rad * 1.15;
        if (hx === 0) ctx.moveTo(hxX, hxY); else ctx.lineTo(hxX, hxY);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (e.shape === 'octagon') {
      ctx.beginPath();
      for (let oc = 0; oc < 8; oc++) {
        const a = (oc * Math.PI) / 4;
        const ocX = Math.cos(a) * rad * 1.2;
        const ocY = Math.sin(a) * rad * 1.2;
        if (oc === 0) ctx.moveTo(ocX, ocY); else ctx.lineTo(ocX, ocY);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    ctx.restore();
  }

  if (e.slowTimer > 0) {
    ctx.save();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('❄', (e.radius || 12) * 0.85, -(e.radius || 12) * 0.85);
    ctx.restore();
  }

  if (e.dashLineMoving) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle || 0);
    ctx.strokeStyle = e.glow || '#fb923c';
    ctx.lineWidth = 4;
    if (typeof setGlow === 'function') setGlow(e.color || '#f97316', 12);
    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.restore();
  }

  if (e.teleportFlashTimer > 0) {
    const prog = e.teleportFlashTimer / 0.35;
    ctx.save();
    ctx.strokeStyle = e.glow || "#fb923c";
    ctx.lineWidth = 4;
    if (typeof setGlow === "function") setGlow(e.glow || "#fb923c", 16 * prog);
    ctx.beginPath();
    ctx.arc(0, 0, (e.radius || 17) * (1.2 + (1.0 - prog) * 0.6), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // [UI203.01] Enemy health bar status indicator pass.
  if (showHpBar && typeof settings !== 'undefined' && settings.showEnemyHp && (e.isBoss || e.isMiniBoss || (e.hp < e.maxHp))) {
    ctx.shadowBlur = 0;
    const rad = e.radius || 12;
    const barW = Math.max(22, rad * 2.2);
    const barH = e.isBoss ? 5 : (e.isMiniBoss ? 4 : 3);
    const hpPct = Math.max(0, e.hp / (e.maxHp || 1));
    const barY = -rad - (e.isBoss ? 14 : (e.isMiniBoss ? 12 : 8));

    ctx.fillStyle = 'rgba(7, 10, 20, 0.9)';
    ctx.fillRect(-barW/2, barY, barW, barH);
    ctx.fillStyle = e.isBoss ? (e.color || '#f05f9f') : (hpPct > 0.5 ? '#00e5ff' : '#ff9100');
    ctx.fillRect(-barW/2, barY, barW * hpPct, barH);
  }

  ctx.restore();
}

// [UI204] Jagged lightning path generator and beam renderer.
function drawJaggedLightning(x1, y1, x2, y3, color, alpha, progress = 1.0) {
  const fullDist = Math.hypot(x2 - x1, y3 - y1);
  if (fullDist <= 0 || progress <= 0) return;

  const currentDist = fullDist * Math.min(1.0, progress);
  const dirX = (x2 - x1) / fullDist;
  const dirY = (y3 - y1) / fullDist;
  const endX = x1 + dirX * currentDist;
  const endY = y1 + dirY * currentDist;

  const segments = Math.max(5, Math.floor(currentDist / 12));
  const normalX = -dirY;
  const normalY = dirX;

  const points = [{ x: x1, y: y1 }];
  const dx = (endX - x1) / segments;
  const dy = (endY - y1) / segments;

  for (let s = 1; s < segments; s++) {
    const jitter = (Math.random() - 0.5) * 22;
    points.push({
      x: x1 + dx * s + normalX * jitter,
      y: y1 + dy * s + normalY * jitter
    });
  }
  points.push({ x: endX, y: endY });

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = color || '#00ffcc';
  setGlow('#00e5ff', 8);
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = '#ffffff';
  setGlow('#00e5ff', 6);
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  if (points.length >= 4) {
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.85)';
    const numForks = Math.min(3, Math.floor(points.length / 3));
    for (let f = 0; f < numForks; f++) {
      const idx = 1 + Math.floor(Math.random() * (points.length - 2));
      const pt = points[idx];
      const forkAngle = Math.atan2(dirY, dirX) + (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.7);
      const forkLen = 8 + Math.random() * 14;
      const forkMidX = pt.x + Math.cos(forkAngle) * (forkLen * 0.5) + (Math.random() - 0.5) * 6;
      const forkMidY = pt.y + Math.sin(forkAngle) * (forkLen * 0.5) + (Math.random() - 0.5) * 6;
      const forkEndX = pt.x + Math.cos(forkAngle) * forkLen;
      const forkEndY = pt.y + Math.sin(forkAngle) * forkLen;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(forkMidX, forkMidY);
      ctx.lineTo(forkEndX, forkEndY);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// [UI205] Master gameplay canvas graphics rendering pipeline.
let reviveStartTime = 0; // Добавляем глобальную переменную для трекинга начала отсчета

function render(now) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Плавное обновление кольца таймера возрождения
  if (gameState === 'DEFEAT' && reviveTimerInterval) {
    const progressEl = document.getElementById('reviveTimerProgress');
    if (progressEl) {
      if (reviveStartTime === 0) reviveStartTime = now;
      const elapsed = (now - reviveStartTime) / 1000;
      const fraction = Math.max(0, 1 - (elapsed / 3)); // От 1 до 0 за 3 секунды
      const totalDash = 276.46;
      progressEl.style.strokeDashoffset = (totalDash * (1 - fraction)).toFixed(2);
    }
  } else {
    reviveStartTime = 0; // Сбрасываем, если мы вышли из окна ревайва
  }

  if (perfProfiler.accum.frames > 30) {
    const f = perfProfiler.accum.frames;
    const s = (perfProfiler.accum.sim / f).toFixed(1);
    const t = (perfProfiler.accum.towers / f).toFixed(1);
    const m = (perfProfiler.accum.drawMobs / f).toFixed(1);
    const fx = (perfProfiler.accum.drawFx / f).toFixed(1);
    perfProfiler.report = `Sim:${s}ms | Tow:${t}ms | Mobs:${m}ms | Fx:${fx}ms`;
    
    const badge = document.getElementById('devFpsBadge');
    if (badge) {
      badge.title = perfProfiler.report;
    }
    perfProfiler.accum = { sim: 0, towers: 0, drawMobs: 0, drawFx: 0, frames: 0 };
  }
  perfProfiler.accum.frames++;

  if (isDevModeActive) {
    if (!window._fpsLastTime) {
      window._fpsLastTime = now;
      window._fpsFrames = 0;
    }
    window._fpsFrames++;
    if (now - window._fpsLastTime >= 500) {
      const currentFps = Math.round((window._fpsFrames * 1000) / (now - window._fpsLastTime));
      const badge = document.getElementById('devFpsBadge');
      if (badge) {
        badge.textContent = `FPS: ${currentFps}`;
        badge.style.color = currentFps >= 50 ? '#39ff14' : (currentFps >= 30 ? '#ffb703' : '#f05f9f');
      }
      window._fpsFrames = 0;
      window._fpsLastTime = now;

      if (isDevExpanded) {
        const trackEl = document.getElementById('devTrackTitle');
        if (trackEl && typeof MusicManager !== 'undefined' && MusicManager.currentTrack) {
          trackEl.textContent = MusicManager.currentTrack();
        }

        if (typeof SFX !== 'undefined' && typeof SFX.getAudioMetrics === 'function') {
          const m = SFX.getAudioMetrics();
          const stateStr = m.state || window._audioCtxState || 'closed';
          const suspendsStr = window._audioCtxStateStalls || 0;
          const srStr = (m.sampleRate || 0) + ' Hz';
          const baseLatStr = (m.baseLatency ? m.baseLatency.toFixed(3) : '0.000') + 's';
          const outLatStr = (typeof m.outputLatency === 'number' && m.outputLatency > 0)
            ? m.outputLatency.toFixed(3) + 's'
            : 'N/A';

          const peakStr = m.peakVolume !== undefined ? m.peakVolume.toFixed(3) : '0.000';
          const dcStr = m.dcOffset !== undefined ? m.dcOffset.toFixed(4) : '0.0000';
          const activeNodesStr = window._activeMusicNodeCount || 0;

          const maxLagStr = (window._maxThreadLag || 0) + ' ms';
          const lastLagStr = (window._lastThreadLag || 0) + ' ms';
          const heapMB = getJSHeapSizeMB();
          const heapStr = heapMB !== null ? heapMB.toFixed(1) + ' MB' : 'N/A';

          const hwEl = document.getElementById('devAudioLogHw');
          if (hwEl) {
            hwEl.textContent =
              `State   : ${stateStr}\n` +
              `Stalls  : ${suspendsStr}\n` +
              `Rate    : ${srStr}\n` +
              `Latency : ${baseLatStr} / ${outLatStr}`;
          }

          const dspEl = document.getElementById('devAudioLogDsp');
          if (dspEl) {
            dspEl.textContent =
              `Peak Vol: ${peakStr}\n` +
              `DC Offs : ${dcStr}\n` +
              `Nodes   : ${activeNodesStr}`;
          }

          const memEl = document.getElementById('devAudioLogMem');
          if (memEl) {
            memEl.textContent =
              `Max Lag : ${maxLagStr}\n` +
              `Last Lag: ${lastLagStr}\n` +
              `JS Heap : ${heapStr}`;
          }
        }

        if (window.OtaDiagnostics) {
          const d = window.OtaDiagnostics;

          const verManifestEl = document.getElementById('devVerLogManifest');
          if (verManifestEl) {
            verManifestEl.textContent =
              `Step   : ${d.step}\n` +
              `Our Ver: ${d.localVersion}\n` +
              `Fetch  : ${d.remoteFetchStatus}\n` +
              `Rem Ver: ${d.remoteVersion}\n` +
              `Update?: ${d.updateNeeded}`;
          }

		  const verDlEl = document.getElementById('devVerLogDownload');
          if (verDlEl) {
            verDlEl.textContent =
              `T1 Fetch: ${d.triageT1Fetch || '—'}\n` +
              `T2 FS DL: ${d.triageT2FsDl || '—'}\n` +
              `T3 LocUp: ${d.triageT3LocalUpd || '—'}\n` +
              `T4 DirUp: ${d.triageT4DirectUpd || '—'}\n` +
              `Next    : ${d.nextQueueStatus}\n` +
              `Error   : ${d.lastError}`;
          }

          const verPluginEl = document.getElementById('devVerLogPlugin');
          if (verPluginEl) {
            verPluginEl.textContent =
              `Plugin : ${d.pluginAvailable ? 'YES' : 'NO'} (${d.notifyReadyStatus})\n` +
              `Net    : ${d.networkConnected}\n` +
              `Active : ${d.activeBundleInfo}\n` +
              `Stored : ${d.downloadedBundlesList}\n` +
              `Zip URL: ${d.bundleUrl}`;
          }

          const verLogsEl = document.getElementById('devVerLogHistory');
          if (verLogsEl) {
            verLogsEl.textContent = d.logs.length ? d.logs.join('\n') : 'No logs yet';
          }
        }
      }
    }
  }

  if (isMenuSceneActive()) {
    drawSynthWavePerspectiveScene(now);
    return;
  }

  drawCosmicNebulaBackground(window.innerWidth, window.innerHeight);
  updateAndDrawStars(window.innerWidth, window.innerHeight, now);

  // Атмосферная цветовая вуаль режима для фона боя
  if (typeof isEndlessMode !== 'undefined' && isEndlessMode) {
    ctx.save();
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Фиолетовый градиент для Endless Arena (в тон призмам #d946ef)
    const endlessTint = ctx.createRadialGradient(w * 0.5, h * 0.35, 10, w * 0.5, h * 0.45, Math.max(w, h) * 0.75);
    endlessTint.addColorStop(0, 'rgba(110, 15, 140, 0.28)');
    endlessTint.addColorStop(0.5, 'rgba(55, 8, 75, 0.18)');
    endlessTint.addColorStop(1, 'rgba(4, 5, 14, 0.05)');
    ctx.fillStyle = endlessTint;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  } else if (typeof isOverdriveMode !== 'undefined' && isOverdriveMode) {
    ctx.save();
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Розовато-бордовый градиент для Hardcore (в тон жизням #f05f9f)
    const hardcoreTint = ctx.createRadialGradient(w * 0.5, h * 0.35, 10, w * 0.5, h * 0.45, Math.max(w, h) * 0.75);
    hardcoreTint.addColorStop(0, 'rgba(120, 10, 60, 0.26)');
    hardcoreTint.addColorStop(0.5, 'rgba(60, 5, 30, 0.16)');
    hardcoreTint.addColorStop(1, 'rgba(4, 5, 14, 0.05)');
    ctx.fillStyle = hardcoreTint;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  let shakeX = 0;
  let shakeY = 0;
  
  if (typeof cameraShakeTimer !== 'undefined' && cameraShakeTimer > 0) {
    shakeX = (Math.random() - 0.5) * cameraShakeIntensity;
    shakeY = (Math.random() - 0.5) * cameraShakeIntensity;
  }

  ctx.save();
  ctx.translate(camX + shakeX, camY + shakeY);
  ctx.scale(camZoom, camZoom);

  if (offscreenGridDirty || !offscreenGridCanvas) {
    updateOffscreenGrid();
  }
  ctx.drawImage(offscreenGridCanvas, 0, 0);

  drawPathRails(now);
  drawPathPortals();

  towers.forEach(t => {
    if (t.type === 'stasis') {
      ctx.save();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.07)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  });

  enemies.forEach(e => {
    if (e.type === 'emp_bomber' || e.type === 'emp_overlord') {
      const effectRadius = e.type === 'emp_overlord' ? 180 : 110;
      ctx.save();
      ctx.fillStyle = 'rgba(240, 95, 159, 0.07)';
      ctx.strokeStyle = 'rgba(240, 95, 159, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, effectRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  });

  if (selectedTower) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(selectedTower.x, selectedTower.y, selectedTower.range, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.fillRect(selectedTower.c * TILE_SIZE, selectedTower.r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
    ctx.strokeRect(selectedTower.c * TILE_SIZE, selectedTower.r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.restore();
  }

  towers.forEach(t => {
    ctx.save();
    ctx.translate(t.x, t.y);
    const isCooling = (t.type === 'melter' && t.melterCoolingTimer > 0);
    const isTeslaShooting = (t.type === 'tesla' && lightningBolts.some(lb => lb.x1 === t.x && lb.life > 0.04));
    const melterRampT = (t.type === 'melter') ? (t.melterRampTime || TOWER_CONFIGS.melter.rampTime || 4.0) : 4.0;
    const meltHeatProgress = (t.type === 'melter')
      ? (isCooling ? (t.melterCoolingTimer / melterRampT) : Math.min(1, (t.melterFireTimer || 0) / melterRampT))
      : 0;
    drawTowerModel(t.type, t.angle, t.color, t.level, t.glow, t.disabledTimer > 0, isCooling, isTeslaShooting, meltHeatProgress);

    if (t.disabledTimer > 0) {
      ctx.save();
      ctx.translate(16, -16);
      ctx.fillStyle = '#0a0e1c';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f05f9f';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.strokeStyle = '#f05f9f';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(1, -4);
      ctx.lineTo(-3, 1);
      ctx.lineTo(0, 1);
      ctx.lineTo(-1, 4);
      ctx.lineTo(3, -1);
      ctx.lineTo(0, -1);
      ctx.closePath();
      ctx.fillStyle = '#f05f9f';
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    if (t.type === 'laser' && t.target && t.isLockedOn && t.disabledTimer <= 0) {
      const muzzleX = t.x + Math.cos(t.angle) * 24;
      const muzzleY = t.y + Math.sin(t.angle) * 24;
      ctx.save();
      setGlow('#f05f9f', 8);
      ctx.beginPath();
      ctx.moveTo(muzzleX, muzzleY);
      ctx.lineTo(t.target.x, t.target.y);
      ctx.strokeStyle = '#f05f9f';
      ctx.lineWidth = 3.5 + Math.sin(Date.now() * 0.02) * 1.5;
      ctx.stroke();
      ctx.restore();
    }

  // [UI205.01] Railgun laser beam visual pass.
    if (t.type === 'melter' && t.target && t.isLockedOn && t.disabledTimer <= 0 && t.melterCoolingTimer <= 0) {
      const muzzleX = t.x + Math.cos(t.angle) * 24;
      const muzzleY = t.y + Math.sin(t.angle) * 24;
      const beamW = 3.5;
      ctx.save();
      setGlow('#e477a3', 8);
      ctx.beginPath();
      ctx.moveTo(muzzleX, muzzleY);
      ctx.lineTo(t.target.x, t.target.y);
      ctx.strokeStyle = '#e85268';
      ctx.lineWidth = beamW;
      ctx.stroke();
      ctx.restore();
    }
  });

  const viewLeft = -camX / camZoom - TILE_SIZE;
  const viewTop = -camY / camZoom - TILE_SIZE;
  const viewRight = (window.innerWidth - camX) / camZoom + TILE_SIZE;
  const viewBottom = (window.innerHeight - camY) / camZoom + TILE_SIZE;

  const _tMobsStart = performance.now();

  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (e.x < viewLeft || e.x > viewRight || e.y < viewTop || e.y > viewBottom) continue;
    drawEnemyModel(e);
  }

  if (window.perfProfiler) perfProfiler.accum.drawMobs += (performance.now() - _tMobsStart);

  projectiles.forEach(p => {
    ctx.save();
    if (p.type === 'bullet') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      ctx.fillStyle = p.color || '#00e5ff';
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    } else if (p.type === 'mortar_shell') {
      const tProg = Math.max(0, Math.min(1, p.elapsed / p.duration));
      const apex = p.arcApex || 45;
      const heightOffset = 4 * apex * tProg * (1 - tProg);
      const shadowScale = 1 - 0.45 * (heightOffset / Math.max(1, apex));
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 5 * shadowScale, 2.6 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ff9100';
      setGlow('#ff9100', 8);
      ctx.beginPath();
      ctx.arc(p.x, p.y - heightOffset, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  lightningBolts.forEach(lb => {
    if (lb.delay && lb.delay > 0) return;
    const alpha = lb.life / lb.maxLife;
    if (lb.isRail) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const railGlowColor = lb.color || '#a275df';

      ctx.strokeStyle = railGlowColor;
      setGlow(railGlowColor, 12);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(lb.x1, lb.y1);
      ctx.lineTo(lb.x2, lb.y2);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      setGlow('#ffffff', 6);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(lb.x1, lb.y1);
      ctx.lineTo(lb.x2, lb.y2);
      ctx.stroke();

      ctx.restore();
    } else {
      const prog = lb.travelTime ? Math.min(1.0, (lb.elapsed || 0) / lb.travelTime) : 1.0;
      drawJaggedLightning(lb.x1, lb.y1, lb.x2, lb.y2, lb.color || '#00ffcc', alpha, prog);
    }
  });

  shockwaves.forEach(sw => {
    const prog = sw.elapsed / sw.duration;
    const currentR = sw.maxRadius * Math.sin(prog * (Math.PI / 2));
    ctx.save();
    ctx.strokeStyle = sw.color;
    ctx.globalAlpha = Math.max(0, 1 - prog);
    setGlow(sw.color, 8);
    ctx.lineWidth = 2.5 * (1 - prog);
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, currentR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  const _tFxStart = performance.now();
  
  // [UI205.02] Particle pass 1: Concentric smoke and steam.
  ctx.globalCompositeOperation = 'source-over';
  const smokeSprite = typeof getSmokeSprite === 'function' ? getSmokeSprite() : null;

  for (let i = 0; i < particles.length; i++) {
    const pt = particles[i];
    if (!pt.isSmoke && !pt.isSteam) continue;

    const rawProg = Math.max(0, Math.min(1, pt.life / pt.maxLife));
    if (pt.isSmoke && smokeSprite) {
      let smokeAlpha = rawProg > 0.85 ? (1.0 - rawProg) / 0.15 : rawProg / 0.85;
      ctx.globalAlpha = Math.max(0, Math.min(0.6, smokeAlpha * 0.6));
      const currentR = pt.radius * (1.0 + (1.0 - rawProg) * 1.3);
      ctx.drawImage(smokeSprite, pt.x - currentR, pt.y - currentR, currentR * 2, currentR * 2);
    } else if (pt.isSteam) {
      const growProg = 1.0 - rawProg;
      ctx.globalAlpha = rawProg * 0.45;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius * (0.6 + growProg * 0.9), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.0;
  for (let i = 0; i < particles.length; i++) {
    const pt = particles[i];
  // [UI205.03] Particle pass 2: Glass shards and debris.
    if (!pt.isShard) continue;

    const rawProg = Math.max(0, Math.min(1, pt.life / pt.maxLife));
    pt.angle = (pt.angle || 0) + (pt.vRot || 0) * 0.016;
    ctx.globalAlpha = Math.min(1.0, rawProg * 1.4);

    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.rotate(pt.angle);
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    if (pt.pts && pt.pts.length >= 3) {
      ctx.moveTo(pt.pts[0].x, pt.pts[0].y);
      for (let k = 1; k < pt.pts.length; k++) {
        ctx.lineTo(pt.pts[k].x, pt.pts[k].y);
      }
    } else {
      ctx.rect(-pt.radius / 2, -pt.radius / 2, pt.radius, pt.radius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // [UI205.04] Particle pass 3: Energy sparks and glow halos.
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < particles.length; i++) {
    const pt = particles[i];
    if (pt.isSmoke || pt.isSteam || pt.isShard) continue;

    const rawProg = Math.max(0, Math.min(1, pt.life / pt.maxLife));
    const easeProg = rawProg * rawProg;

    if (pt.isFlash && typeof getGlowSprite === 'function') {
      ctx.globalAlpha = rawProg;
      const sprite = getGlowSprite(pt.color || '#ffffff');
      const r = pt.radius * (1.1 - (1.0 - rawProg) * 0.3);
      ctx.drawImage(sprite, pt.x - r, pt.y - r, r * 2, r * 2);
    } else if (pt.isGlowHalo && typeof getGlowSprite === 'function') {
      ctx.globalAlpha = rawProg * (pt.alphaMult || 0.4);
      const glowSprite = getGlowSprite(pt.color || '#ff9100');
      ctx.drawImage(glowSprite, pt.x - pt.radius, pt.y - pt.radius, pt.radius * 2, pt.radius * 2);
    } else if (pt.isStreak) {
      ctx.globalAlpha = rawProg * 0.85;
      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(Math.atan2(pt.vy, pt.vx));
      const len = pt.radius * (1.4 + easeProg * 2.2);
      const width = Math.max(1.2, pt.radius * easeProg * 0.5);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, len, width, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.globalAlpha = rawProg;
      const sprite = getNeonDiscSprite(pt.color || '#00e5ff');
      const curRadius = pt.radius * (0.4 + easeProg * 0.6);
      ctx.drawImage(sprite, pt.x - curRadius, pt.y - curRadius, curRadius * 2, curRadius * 2);
    }
  }

  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < particles.length; i++) {
    const pt = particles[i];
  // [UI205.05] Particle pass 4: Floating combat text.
    if (!pt.isText) continue;

    const rawProg = Math.max(0, Math.min(1, pt.life / pt.maxLife));
    ctx.globalAlpha = rawProg > 0.3 ? 1.0 : rawProg / 0.3;
    ctx.font = '900 12px Montserrat, sans-serif';
    ctx.fillStyle = pt.color || '#f05f9f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(pt.text, pt.x, pt.y);
    ctx.shadowBlur = 0;
  }

  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;

  if (window.perfProfiler) perfProfiler.accum.drawFx += (performance.now() - _tFxStart);

  if (draggingTower) {
    const c = Math.floor(draggingTower.worldX / TILE_SIZE);
    const r = Math.floor(draggingTower.worldY / TILE_SIZE);
    const isValidCell = c >= 0 && c < COLS && r >= 0 && r < ROWS;
    const canBuild = isValidCell && grid[r][c] === 0;
    const conf = TOWER_CONFIGS[draggingTower.type];

    if (isValidCell) {
      ctx.fillStyle = canBuild ? 'rgba(0, 229, 255, 0.2)' : 'rgba(240, 95, 159, 0.3)';
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = canBuild ? '#00e5ff' : '#f05f9f';
      ctx.lineWidth = 2;
      ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    ctx.beginPath();
    ctx.arc(draggingTower.worldX, draggingTower.worldY, conf.range, 0, Math.PI * 2);
    ctx.strokeStyle = canBuild ? 'rgba(0, 229, 255, 0.45)' : 'rgba(240, 95, 159, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.translate(draggingTower.worldX, draggingTower.worldY);
    drawTowerModel(draggingTower.type, 0, conf.color, 1, conf.glow);
    ctx.restore();
  }

ctx.restore();

  updateTutorialOverlay(now);
}

if (typeof window !== 'undefined') {
  initDevResourceHold();
}

function toggleTacticalTips() {
  const body = document.getElementById('tacticalTipsBody');
  const arrow = document.getElementById('tacticalTipsArrow');
  const preview = document.getElementById('tacticalTipsPreview');
  if (!body) return;
  if (body.classList.contains('hidden')) {
    body.classList.remove('hidden');
    if (arrow) arrow.textContent = '▴';
    if (preview) preview.classList.add('hidden');
  } else {
    body.classList.add('hidden');
    if (arrow) arrow.textContent = '▾';
    if (preview) preview.classList.remove('hidden');
  }
}
window.toggleTacticalTips = toggleTacticalTips;

// [UI206] Listener to intercept Back button on Android.
document.addEventListener('DOMContentLoaded', () => {
  if (window.Capacitor && window.Capacitor.Plugins) {
    if (window.Capacitor.Plugins.StatusBar) {
      window.Capacitor.Plugins.StatusBar.hide().catch(err => console.warn('StatusBar error:', err));
    }
  }
});