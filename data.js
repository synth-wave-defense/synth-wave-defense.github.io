// [XYZ200] Game configuration data: campaign constants, upgrade branch specifications, tower definitions, enemy parameters, map catalog, and level generator.

if (typeof console !== 'undefined') {
  console.log('[data.js] Loading game data...');
}

// [XYZ201] Campaign Constants & Meta Upgrade Branches: Defines campaign structure and purchasable tech tree branches for towers and base.
const TOTAL_LEVELS = 50;
const LEVELS_PER_SECTION = 10;
const TOTAL_SECTIONS = 5;

const UPGRADE_BRANCH_SPECS = {
  towers: [
    { title: 'Gatling', icon: 'gun', branches: [{ key: 'gun_power', name: 'Power', stepVal: 8, unit: '%', prefix: '+' }] },
    { title: 'Laser', icon: 'laser', branches: [{ key: 'laser_power', name: 'Power', stepVal: 8, unit: '%', prefix: '+' }] },
    { title: 'Mortar', icon: 'mortar', branches: [{ key: 'mortar_power', name: 'Power', stepVal: 8, unit: '%', prefix: '+' }] },
    { title: 'Tesla', icon: 'tesla', branches: [{ key: 'tesla_power', name: 'Power', stepVal: 5, unit: '%', prefix: '+' }] },
    { title: 'Stasis', icon: 'stasis', branches: [{ key: 'stasis_power', name: 'Power', stepVal: 5, unit: '%', prefix: '+' }] },
    { title: 'Melter', icon: 'melter', branches: [{ key: 'melter_power', name: 'Power', stepVal: 5, unit: '%', prefix: '+' }] },
    { title: 'Railgun', icon: 'railgun', branches: [{ key: 'railgun_power', name: 'Power', stepVal: 8, unit: '%', prefix: '+' }] }
  ],
  base: [
    {
      title: 'Base',
      branches: [
        { key: 'base_hp', name: 'Base HP', stepVal: 1, unit: ' HP', prefix: '+' },
        { key: 'base_gold', name: 'Bounty', stepVal: 5, unit: '%', prefix: '+' }
      ]
    }
  ]
};

const upgradeTreeData = {
  gun_power: 0, laser_power: 0, mortar_power: 0, tesla_power: 0,
  stasis_power: 0, melter_power: 0, railgun_power: 0,
  base_hp: 0, base_gold: 0
};

const TOWER_NAMES = {
  gun: 'Gatling',
  laser: 'Laser',
  mortar: 'Mortar',
  tesla: 'Tesla',
  stasis: 'Stasis',
  melter: 'Melter',
  railgun: 'Railgun'
};

// [XYZ202] Tower Visual Geometry: Geometric rendering specs for tower turrets, barrels, and levels.
const TOWER_GLYPH_DARK = '#0a0e1c';

const TOWER_GLYPH_SPECS = {
  gun:     { barrel: [ { t: 'rect', x: 9, y: -5, w: 15, h: 2.6, r: 1.3, f: 'c' },
                       { t: 'rect', x: 9, y: 2.4, w: 15, h: 2.6, r: 1.3, f: 'c' } ] },
  laser:   { barrel: [ { t: 'poly', pts: [9, -5.5, 25, -1.6, 25, 1.6, 9, 5.5], f: 'c' } ] },
  mortar:  { elevationDeg: 55,
             barrel: [ { t: 'rect', x: 9, y: -6, w: 14, h: 12, r: 3, f: 'c' } ],
             muzzle: { atX: 23, rx: 3.0, ry: 5.2 } },
  tesla:   { barrel: [ { t: 'rect', x: 9, y: -7.5, w: 19, h: 15, r: 3, f: 'd', s: 'c', sw: 1.6 },
                       { t: 'bolt', cx: 18.5, rot: 90, scale: 0.62,
                         pts: [2.5, -12, -6.5, 1.5, -0.5, 1.5, -3.5, 12, 7, -2.5, 1, -2.5], f: 'c' } ] },
  stasis:  { barrel: [], flakes: true },
  melter:  { barrel: [ { t: 'pline', pts: [9, -7, 22, 0, 9, 7], sw: 2.6 },
                       { t: 'circle', cx: 24, cy: 0, r: 2.6, f: 'c' } ] },
  railgun: { barrel: [ { t: 'rect', x: 9, y: -2.2, w: 19, h: 4.4, f: 'c', s: 'd', sw: 1 },
                       { t: 'rect', x: 12, y: -6, w: 2.8, h: 12, r: 1, f: 'c', s: 'd', sw: 1 },
                       { t: 'rect', x: 18, y: -6, w: 2.8, h: 12, r: 1, f: 'c', s: 'd', sw: 1 } ] }
};

const TOWER_GLYPH_RINGS = { 1: [], 2: [22], 3: [22, 26] };
const TOWER_GLYPH_CORES = {
  1: [{ cx: 0, cy: 0, r: 3.2 }],
  2: [{ cx: 0, cy: -4.2, r: 3 }, { cx: 0, cy: 4.2, r: 3 }],
  3: [{ cx: -3.4, cy: -4.2, r: 3 }, { cx: -3.4, cy: 4.2, r: 3 }, { cx: 4.2, cy: 0, r: 3 }]
};
const TOWER_GLYPH_FLAKES = {
  1: [{ cx: 0, cy: 0, scale: 1.0, sw: 1.9 }],
  2: [{ cx: 0, cy: -4.5, scale: 0.95, sw: 2.0 }, { cx: 0, cy: 5, scale: 0.95, sw: 2.0 }],
  3: [{ cx: -3.5, cy: -5, scale: 0.85, sw: 2.24 }, { cx: -4, cy: 5.5, scale: 0.85, sw: 2.24 },
      { cx: 5.5, cy: 0.5, scale: 0.85, sw: 2.24 }]
};

// [XYZ202.01] Tower SVG Generator: Generates standalone SVG strings for tower icons across UI surfaces.
function buildTowerIconSvg(type, level = 1, size = 28, angleDeg = 0) {
  const spec = TOWER_GLYPH_SPECS[type];
  const conf = TOWER_CONFIGS[type];
  if (!spec || !conf) return '';
  const c = conf.color;
  const lvl = Math.max(1, Math.min(3, level));
  const fillOf = (f) => (f === 'd' ? TOWER_GLYPH_DARK : c);

  let out = `<svg width="${size}" height="${size}" viewBox="-32 -32 64 64">`;
  out += `<circle cx="0" cy="0" r="17" fill="none" stroke="${c}" stroke-width="1.6"/>`;
  out += `<circle cx="0" cy="0" r="11" fill="none" stroke="${c}" stroke-width="1" opacity=".35"/>`;
  TOWER_GLYPH_RINGS[lvl].forEach(r => {
    out += `<circle cx="0" cy="0" r="${r}" fill="none" stroke="${c}" stroke-width="1.6"/>`;
  });

  const rot = angleDeg ? ` transform="rotate(${angleDeg})"` : '';
  out += `<g${rot}>`;
  const fore = spec.elevationDeg ? Math.cos(spec.elevationDeg * Math.PI / 180) : 1;
  if (spec.elevationDeg) out += `<g transform="scale(${fore.toFixed(3)},1)">`;
  spec.barrel.forEach(op => {
    const stroke = op.s ? ` stroke="${fillOf(op.s)}" stroke-width="${op.sw || 1}"` : '';
    if (op.t === 'rect') {
      out += `<rect x="${op.x}" y="${op.y}" width="${op.w}" height="${op.h}"${op.r ? ` rx="${op.r}"` : ''} fill="${fillOf(op.f)}"${stroke}/>`;
    } else if (op.t === 'poly') {
      out += `<polygon points="${op.pts.join(' ')}" fill="${fillOf(op.f)}"${stroke}/>`;
    } else if (op.t === 'circle') {
      out += `<circle cx="${op.cx}" cy="${op.cy}" r="${op.r}" fill="${fillOf(op.f)}"${stroke}/>`;
    } else if (op.t === 'pline') {
      out += `<polyline points="${op.pts.join(' ')}" fill="none" stroke="${c}" stroke-width="${op.sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
    } else if (op.t === 'bolt') {
      out += `<g transform="translate(${op.cx},0) rotate(${op.rot}) scale(${op.scale})"><polygon points="${op.pts.join(' ')}" fill="${fillOf(op.f)}"/></g>`;
    }
  });
  if (spec.elevationDeg) {
    out += `</g>`;
    if (spec.muzzle) {
      const mx = spec.muzzle.atX * fore;
      out += `<ellipse cx="${mx.toFixed(2)}" cy="0" rx="${spec.muzzle.rx}" ry="${spec.muzzle.ry}" fill="${TOWER_GLYPH_DARK}" stroke="${c}" stroke-width="1.6"/>`;
    }
  }
  if (spec.flakes) {
    TOWER_GLYPH_FLAKES[lvl].forEach(fl => {
      out += `<g transform="translate(${fl.cx},${fl.cy}) scale(${fl.scale})" stroke="${c}" stroke-width="${fl.sw}" stroke-linecap="round">`;
      out += `<line x1="-5" y1="0" x2="5" y2="0"/><line x1="-5" y1="0" x2="5" y2="0" transform="rotate(60)"/><line x1="-5" y1="0" x2="5" y2="0" transform="rotate(120)"/></g>`;
    });
  } else {
    TOWER_GLYPH_CORES[lvl].forEach(d => {
      out += `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="${c}"/>`;
    });
  }
  out += `</g></svg>`;
  return out;
}

// [XYZ203] Tower Configurations: Base costs, range, attack metrics, upgrade multipliers, and milestone unlocked blurbs.
const TOWER_CONFIGS = {
  gun: { cost: 50, range: 165, damage: 16, fireRate: 0.52, color: '#00e5ff', glow: '#00e5ff', type: 'projectile', costMultiplier: 1.3, damageMultiplier: 1.7, rateMultiplier: 0.8, rangeMultiplier: 1.1, powerDmg: 0.08, powerRate: 0.06, powerRange: 0.04 },
  laser: { cost: 70, range: 150, dps: 48, color: '#f05f9f', glow: '#f05f9f', type: 'beam', costMultiplier: 1.3, damageMultiplier: 1.85, rangeMultiplier: 1.1, powerDmg: 0.08, powerRate: 0.06, powerRange: 0.04 },
  mortar: { cost: 85, range: 195, damage: 32, splash: 80, fireRate: 1.5, color: '#ff9100', glow: '#ff9100', type: 'mortar', costMultiplier: 1.3, damageMultiplier: 1.6, rateMultiplier: 0.9, rangeMultiplier: 1.1, powerDmg: 0.08, powerRate: 0.06, powerRange: 0.04 },
  tesla: { cost: 75, range: 145, damage: 22, chainTargets: 3, jumpRadius: 90, fireRate: 0.85, color: '#00ffcc', glow: '#00ffcc', type: 'chain', costMultiplier: 1.3, damageMultiplier: 1.55, rateMultiplier: 0.85, rangeMultiplier: 1.1, powerDmg: 0.05, powerRate: 0.04, powerRange: 0.03 },
  stasis: { 
    cost: 65, 
    range: 115,
    damage: 0, 
    fireRate: 1.6,
    slowFactor: 0.30,
    slowDuration: 1.4,
    color: '#38bdf8', glow: '#38bdf8', type: 'stasis', 
    costMultiplier: 1.3, 
    damageMultiplier: 1.0, 
    rateMultiplier: 0.88,
    rangeMultiplier: 1.15,
    powerRange: 0.05, powerSlow: 0.04, powerDuration: 0.06 
  },
  melter: { 
    cost: 95, 
    range: 140, 
    baseDps: 10, 
    rampCap: 40, 
    rampTime: 4.0, 
    cooldownTime: 4.0,
    color: '#e85268', glow: '#e477a3', type: 'melter', 
    costMultiplier: 1.35, 
    damageMultiplier: 1.55, 
    rangeMultiplier: 1.1, 
    powerDmg: 0.05, powerRate: 0.05, powerRange: 0.03 
  },
  railgun: { cost: 115, range: 220, damage: 120, fireRate: 2.2, color: '#a275df', glow: '#b57fdd', type: 'railgun', costMultiplier: 1.35, damageMultiplier: 1.5, rangeMultiplier: 1.1, powerDmg: 0.10, powerRate: 0.06, powerRange: 0.04 }
};

const TOWER_ICONS = {
  gun: buildTowerIconSvg('gun'),
  laser: buildTowerIconSvg('laser'),
  mortar: buildTowerIconSvg('mortar'),
  tesla: buildTowerIconSvg('tesla'),
  stasis: buildTowerIconSvg('stasis'),
  melter: buildTowerIconSvg('melter'),
  railgun: buildTowerIconSvg('railgun')
};

const TOWER_UNLOCK_BLURBS = {
  gun: 'Reliable single-target fire. Cheap, accurate, good against steady lines of enemies.',
  laser: 'Locks onto one target and burns it down. Excellent against slow, heavily armoured units.',
  mortar: 'Lobs shells that explode on impact. Strong against tight groups \u2014 but slow, and useless against spread-out swarms.',
  tesla: 'Chains lightning between nearby enemies. The answer to swarms: one shot can clear a whole clump at once.',
  stasis: 'Deals no damage \u2014 it slows everything in range instead, buying your other towers precious extra seconds.',
  melter: 'Heats up the longer it holds one target, ramping to devastating damage. Loses all heat the moment it switches.',
  railgun: 'Fires a piercing beam down a straight line, hitting every enemy it crosses. Slow, but devastating in long corridors.'
};

const UPGRADE_STEPS_PER_SECTOR = 2;
const UPGRADE_STEP_COSTS = [6, 7, 8, 9, 10, 11, 12, 13, 15, 19];

// [XYZ203.01] Tower Target Lock-on Specs: Lock-on delay constants and targeted tower classification.
const LOCK_ON_DELAY_LIGHT = 0.1;
const LOCK_ON_DELAY_HEAVY = 0.5;
const LOCKED_TARGET_TOWERS = ['laser', 'melter'];
const MORTAR_BASE_TRAVEL_TIME = 1.0;

// [XYZ204] Enemy Configurations: Base stats, shapes, speeds, bounties, and swarm clump parameters.
const SWARM_CLUMP_SIZE = 10;
const SWARM_CLUMP_SIZE_DEBUT = 8;
const SWARM_DEBUT_LEVEL = 11;
function swarmClumpSizeFor(lvl) {
  return lvl === SWARM_DEBUT_LEVEL ? SWARM_CLUMP_SIZE_DEBUT : SWARM_CLUMP_SIZE;
}
const SWARM_CLUMP_INTERVAL = 0.03;
const SWARM_CLUMP_GAP = 3.2;
const SWARM_BOUNTY_SCALE = 0.62;

function swarmClumpsFor(lvl, w) {
  return Math.min(4, 2 + Math.floor(Math.max(0, lvl - 11) / 10) + (w > 5 ? 1 : 0));
}

const ENEMY_CONFIGS = {
  grunt: { shape: 'circle', color: '#f05f9f', glow: '#f05f9f', size: 11, baseSpeed: 55, baseHp: 40, baseBounty: 7 },
  scout: { shape: 'triangle', color: '#ff9100', glow: '#ffaa33', size: 11, baseSpeed: 110, baseHp: 24, baseBounty: 6 },
  tank:  { shape: 'square', color: '#a06fdc', glow: '#825cc2', size: 13, baseSpeed: 38, baseHp: 100, baseBounty: 12 },
  swarm: { shape: 'diamond', color: '#00ffcc', glow: '#00ffcc', size: 8, baseSpeed: 170, baseHp: 16, baseBounty: 3 },
  blinker: { shape: 'hexagon', color: '#3b82f6', glow: '#60a5fa', size: 12, baseSpeed: 62, baseHp: 65, baseBounty: 8 },
  goliath: { shape: 'octagon', color: '#8964c4', glow: '#7050a4', size: 15, baseSpeed: 30, baseHp: 260, baseBounty: 18 },
  emp_bomber: { shape: 'triangle_inverted', color: '#38bdf8', glow: '#f05f9f', size: 13, baseSpeed: 40, baseHp: 170, baseBounty: 14 },
  hive_empress: { shape: 'diamond', color: '#00ffcc', glow: '#00ffcc', size: 15, baseSpeed: 38, baseHp: 2200, baseBounty: 60 },
  chronos_warp: { shape: 'hexagon', color: '#3b82f6', glow: '#60a5fa', size: 16, baseSpeed: 40, baseHp: 4200, baseBounty: 85 },
  titan_core: { shape: 'octagon', color: '#f97316', glow: '#fb923c', size: 17, baseSpeed: 28, baseHp: 5800, baseBounty: 110 },
  emp_overlord: { shape: 'triangle_inverted', color: '#38bdf8', glow: '#f05f9f', size: 17, baseSpeed: 30, baseHp: 7200, baseBounty: 140 }
};

// [XYZ205] Map Catalog: Grid dimensions, tile paths, and obstacle locations for campaign levels.
const MAP_CATALOG = {
  L1: { name: "Straight Path", cols: 5, rows: 7, path: [{c: 2, r: 0}, {c: 2, r: 6}] },
  L2: { name: "First Turn", cols: 6, rows: 6, path: [{c: 4, r: 1}, {c: 4, r: 4}, {c: 1, r: 4}] },
  L3: { name: "Double Zigzag", cols: 6, rows: 7, path: [{c: 3, r: 0}, {c: 3, r: 2}, {c: 2, r: 2}, {c: 2, r: 6}] },
  L4: { name: "Centered Angle", cols: 7, rows: 7, path: [{c: 4, r: 0}, {c: 4, r: 3}, {c: 2, r: 3}, {c: 2, r: 6}] },
  L5: { name: "Side Runner", cols: 7, rows: 8, path: [{c: 1, r: 0}, {c: 1, r: 6}, {c: 3, r: 6}, {c: 3, r: 5}, {c: 5, r: 5}] },
  L6: { name: "Twin Bend", cols: 5, rows: 8, path: [{c: 3, r: 0}, {c: 3, r: 6}, {c: 1, r: 6}, {c: 1, r: 0}] },
  L7: { name: "Smooth Curve", cols: 7, rows: 8, path: [{c: 0, r: 6}, {c: 6, r: 6}, {c: 6, r: 3}, {c: 3, r: 3}, {c: 3, r: 0}] },
  L8: { name: "Loop Start", cols: 8, rows: 7, path: [{c: 1, r: 6}, {c: 1, r: 0}, {c: 6, r: 0}, {c: 6, r: 6}] },
  L9: { name: "Mirror Path", cols: 6, rows: 9, path: [{c: 0, r: 3}, {c: 2, r: 3}, {c: 2, r: 7}, {c: 4, r: 7}, {c: 4, r: 0}] },
  L10: { name: "Prime Boss", cols: 7, rows: 9, path: [{c: 3, r: 8}, {c: 3, r: 1}, {c: 1, r: 1}, {c: 1, r: 3}, {c: 6, r: 3}] },
  L11: { name: "Canyon Run", cols: 7, rows: 10, path: [{c: 6, r: 9}, {c: 0, r: 9}, {c: 0, r: 0}] },
  L12: { name: "Wall Trace", cols: 7, rows: 10, path: [{c: 6, r: 0}, {c: 6, r: 9}, {c: 0, r: 9}, {c: 0, r: 7}, {c: 1, r: 7}, {c: 1, r: 6}, {c: 2, r: 6}, {c: 2, r: 5}, {c: 3, r: 5}, {c: 3, r: 4}, {c: 4, r: 4}, {c: 4, r: 0}] },
  L13: { name: "Spiral In", cols: 7, rows: 10, path: [{c: 6, r: 9}, {c: 6, r: 5}, {c: 0, r: 5}, {c: 0, r: 3}, {c: 6, r: 3}, {c: 6, r: 0}] },
  L14: { name: "Crossroads", cols: 7, rows: 11, path: [{c: 0, r: 10}, {c: 0, r: 0}, {c: 6, r: 0}, {c: 6, r: 10}, {c: 2, r: 10}] },
  L15: { name: "Pocket Maze", cols: 4, rows: 11, path: [{c: 1, r: 10}, {c: 1, r: 2}, {c: 0, r: 2}, {c: 0, r: 0}, {c: 3, r: 0}, {c: 3, r: 2}, {c: 2, r: 2}, {c: 2, r: 10}] },
  L16: { name: "Offset Line", cols: 7, rows: 11, path: [{c: 0, r: 10}, {c: 6, r: 10}, {c: 6, r: 0}, {c: 0, r: 0}, {c: 0, r: 6}, {c: 4, r: 6}, {c: 4, r: 2}, {c: 2, r: 2}, {c: 2, r: 4}, {c: 3, r: 4}] },
  L17: { name: "Fold Twice", cols: 7, rows: 11, path: [{c: 6, r: 10}, {c: 0, r: 10}, {c: 0, r: 6}, {c: 6, r: 6}, {c: 6, r: 4}, {c: 0, r: 4}, {c: 0, r: 0}, {c: 6, r: 0}] },
  L18: { name: "Flow Pattern", cols: 7, rows: 11, path: [{c: 0, r: 0}, {c: 0, r: 4}, {c: 1, r: 4}, {c: 1, r: 6}, {c: 0, r: 6}, {c: 0, r: 10}, {c: 6, r: 10}, {c: 6, r: 6}, {c: 5, r: 6}, {c: 5, r: 4}, {c: 6, r: 4}, {c: 6, r: 0}] },
  L19: { name: "Loop Pocket", cols: 7, rows: 11, path: [{c: 6, r: 10}, {c: 0, r: 10}, {c: 0, r: 4}, {c: 6, r: 4}, {c: 6, r: 7}, {c: 2, r: 7}, {c: 2, r: 0}] },
  L20: { name: "Echo Boss", cols: 7, rows: 11, path: [{c: 6, r: 10}, {c: 5, r: 10}, {c: 5, r: 9}, {c: 4, r: 9}, {c: 4, r: 8}, {c: 3, r: 8}, {c: 3, r: 7}, {c: 2, r: 7}, {c: 2, r: 6}, {c: 1, r: 6}, {c: 1, r: 5}, {c: 0, r: 5}, {c: 0, r: 4}, {c: 1, r: 4}, {c: 1, r: 3}, {c: 2, r: 3}, {c: 2, r: 2}, {c: 3, r: 2}, {c: 3, r: 1}, {c: 4, r: 1}, {c: 4, r: 0}, {c: 5, r: 0}] },
  L21: { name: "Corridor East", cols: 7, rows: 12, path: [{c: 6, r: 11}, {c: 6, r: 7}, {c: 1, r: 7}, {c: 1, r: 9}, {c: 4, r: 9}, {c: 4, r: 10}, {c: 0, r: 10}, {c: 0, r: 5}, {c: 6, r: 5}, {c: 6, r: 0}, {c: 2, r: 0}, {c: 2, r: 2}, {c: 4, r: 2}, {c: 4, r: 3}, {c: 0, r: 3}, {c: 0, r: 0}] },
  L22: { name: "Zigzag Wide", cols: 7, rows: 13, path: [{c: 0, r: 12}, {c: 0, r: 7}, {c: 6, r: 7}, {c: 6, r: 11}, {c: 1, r: 11}, {c: 1, r: 1}, {c: 6, r: 1}, {c: 6, r: 5}, {c: 0, r: 5}, {c: 0, r: 0}] },
  L23: { name: "Box Track", cols: 6, rows: 14, path: [{c: 1, r: 13}, {c: 1, r: 10}, {c: 4, r: 10}, {c: 4, r: 12}, {c: 2, r: 12}, {c: 2, r: 7}, {c: 4, r: 7}, {c: 4, r: 9}, {c: 1, r: 9}, {c: 1, r: 4}, {c: 3, r: 4}, {c: 3, r: 6}, {c: 0, r: 6}, {c: 0, r: 1}, {c: 5, r: 1}, {c: 5, r: 3}, {c: 1, r: 3}] },
  L24: { name: "Double Fold", cols: 7, rows: 13, path: [{c: 6, r: 12}, {c: 6, r: 0}, {c: 4, r: 0}, {c: 4, r: 2}, {c: 5, r: 2}, {c: 5, r: 4}, {c: 4, r: 4}, {c: 4, r: 6}, {c: 5, r: 6}, {c: 5, r: 8}, {c: 4, r: 8}, {c: 4, r: 10}, {c: 5, r: 10}, {c: 5, r: 12}, {c: 0, r: 12}, {c: 0, r: 6}, {c: 2, r: 6}, {c: 2, r: 5}, {c: 0, r: 5}, {c: 0, r: 0}] },
  L25: { name: "Weave Path", cols: 7, rows: 14, path: [{c: 0, r: 0}, {c: 0, r: 13}, {c: 3, r: 13}, {c: 3, r: 10}, {c: 1, r: 10}, {c: 1, r: 12}, {c: 6, r: 12}, {c: 6, r: 6}, {c: 1, r: 6}, {c: 1, r: 4}, {c: 6, r: 4}, {c: 6, r: 0}] },
  L26: { name: "Staircase", cols: 8, rows: 14, path: [{c: 0, r: 13}, {c: 7, r: 13}, {c: 7, r: 11}, {c: 0, r: 11}, {c: 0, r: 7}, {c: 7, r: 7}, {c: 7, r: 5}, {c: 0, r: 5}, {c: 0, r: 2}, {c: 7, r: 2}, {c: 7, r: 0}, {c: 0, r: 0}] },
  L27: { name: "Reverse Flow", cols: 7, rows: 15, path: [{c: 4, r: 11}, {c: 4, r: 8}, {c: 2, r: 8}, {c: 2, r: 10}, {c: 6, r: 10}, {c: 6, r: 0}, {c: 0, r: 0}, {c: 0, r: 3}, {c: 4, r: 3}, {c: 4, r: 1}, {c: 2, r: 1}, {c: 2, r: 5}, {c: 0, r: 5}, {c: 0, r: 14}, {c: 6, r: 14}] },
  L28: { name: "Spiral Tight", cols: 8, rows: 16, path: [{c: 0, r: 0}, {c: 0, r: 4}, {c: 3, r: 4}, {c: 3, r: 0}, {c: 1, r: 0}, {c: 1, r: 3}, {c: 7, r: 3}, {c: 7, r: 0}, {c: 4, r: 0}, {c: 4, r: 15}, {c: 7, r: 15}, {c: 7, r: 11}, {c: 0, r: 11}, {c: 0, r: 15}, {c: 3, r: 15}, {c: 3, r: 8}, {c: 0, r: 8}] },
  L29: { name: "Loop Maze", cols: 8, rows: 16, path: [{c: 0, r: 15}, {c: 7, r: 15}, {c: 7, r: 0}, {c: 0, r: 0}, {c: 0, r: 13}, {c: 5, r: 13}, {c: 5, r: 2}, {c: 2, r: 2}, {c: 2, r: 11}] },
  L30: { name: "Chaos Boss", cols: 8, rows: 16, path: [{c: 0, r: 15}, {c: 7, r: 15}, {c: 7, r: 6}, {c: 1, r: 6}, {c: 1, r: 11}, {c: 5, r: 11}, {c: 5, r: 9}, {c: 2, r: 9}, {c: 2, r: 7}, {c: 6, r: 7}, {c: 6, r: 12}, {c: 0, r: 12}, {c: 0, r: 4}, {c: 7, r: 4}, {c: 7, r: 0}, {c: 0, r: 0}, {c: 0, r: 3}, {c: 6, r: 3}, {c: 6, r: 1}, {c: 1, r: 1}] },
  L31: { name: "Branch Left", cols: 7, rows: 14, path: [{c: 1, r: 0}, {c: 1, r: 4}, {c: 4, r: 4}, {c: 4, r: 8}, {c: 1, r: 8}, {c: 1, r: 13}, {c: 5, r: 13}, {c: 5, r: 10}, {c: 3, r: 10}, {c: 3, r: 12}], blocked: [{c: 3, r: 2}, {c: 2, r: 6}, {c: 3, r: 9}] },
  L32: { name: "Branch Right", cols: 7, rows: 14, path: [{c: 3, r: 0}, {c: 3, r: 4}, {c: 6, r: 4}, {c: 6, r: 7}, {c: 4, r: 7}, {c: 4, r: 9}, {c: 0, r: 9}, {c: 0, r: 11}, {c: 2, r: 11}, {c: 2, r: 13}], blocked: [{c: 5, r: 2}, {c: 4, r: 3}, {c: 2, r: 7}, {c: 3, r: 6}, {c: 3, r: 10}] },
  L33: { name: "Grid Cross", cols: 6, rows: 14, path: [{c: 4, r: 0}, {c: 4, r: 4}, {c: 0, r: 4}, {c: 0, r: 7}, {c: 5, r: 7}, {c: 5, r: 9}, {c: 0, r: 9}, {c: 0, r: 13}, {c: 5, r: 13}, {c: 5, r: 11}], blocked: [{c: 1, r: 5}, {c: 2, r: 6}, {c: 3, r: 5}, {c: 3, r: 8}, {c: 1, r: 8}, {c: 2, r: 10}, {c: 3, r: 11}, {c: 1, r: 11}, {c: 2, r: 12}, {c: 4, r: 10}] },
  L34: { name: "Offset Grid", cols: 6, rows: 13, path: [{c: 4, r: 0}, {c: 4, r: 4}, {c: 1, r: 4}, {c: 1, r: 7}, {c: 5, r: 7}, {c: 5, r: 10}, {c: 2, r: 10}, {c: 2, r: 12}, {c: 0, r: 12}, {c: 0, r: 9}, {c: 2, r: 9}], blocked: [{c: 2, r: 6}, {c: 3, r: 5}, {c: 4, r: 6}, {c: 5, r: 5}, {c: 3, r: 3}, {c: 2, r: 2}, {c: 1, r: 1}, {c: 3, r: 9}, {c: 4, r: 8}, {c: 2, r: 8}, {c: 1, r: 10}, {c: 3, r: 11}, {c: 0, r: 6}, {c: 0, r: 5}] },
  L35: { name: "Spiral Out", cols: 7, rows: 14, path: [{c: 5, r: 0}, {c: 5, r: 4}, {c: 2, r: 4}, {c: 2, r: 9}, {c: 6, r: 9}, {c: 6, r: 12}, {c: 2, r: 12}, {c: 2, r: 10}, {c: 0, r: 10}, {c: 0, r: 13}, {c: 2, r: 13}], blocked: [{c: 3, r: 8}, {c: 3, r: 7}, {c: 3, r: 6}, {c: 3, r: 5}, {c: 5, r: 5}, {c: 5, r: 6}, {c: 5, r: 7}, {c: 5, r: 8}, {c: 3, r: 10}, {c: 3, r: 11}, {c: 5, r: 11}, {c: 5, r: 10}, {c: 1, r: 11}, {c: 1, r: 12}, {c: 3, r: 13}, {c: 5, r: 13}, {c: 1, r: 9}, {c: 1, r: 8}, {c: 1, r: 7}, {c: 1, r: 6}, {c: 1, r: 5}, {c: 1, r: 4}, {c: 1, r: 3}, {c: 1, r: 2}, {c: 1, r: 1}, {c: 1, r: 0}, {c: 3, r: 3}, {c: 3, r: 2}, {c: 3, r: 1}, {c: 3, r: 0}] },
  L36: { name: "Wide Loop", cols: 7, rows: 14, path: [{c: 1, r: 0}, {c: 1, r: 3}, {c: 4, r: 3}, {c: 4, r: 7}, {c: 0, r: 7}, {c: 0, r: 10}, {c: 4, r: 10}, {c: 4, r: 8}, {c: 6, r: 8}, {c: 6, r: 11}, {c: 4, r: 11}, {c: 4, r: 13}], blocked: [{c: 3, r: 1}, {c: 2, r: 5}, {c: 3, r: 8}, {c: 5, r: 9}, {c: 4, r: 2}, {c: 2, r: 0}, {c: 2, r: 2}, {c: 4, r: 0}, {c: 5, r: 1}, {c: 6, r: 0}, {c: 6, r: 1}, {c: 6, r: 2}, {c: 6, r: 3}, {c: 6, r: 4}, {c: 6, r: 5}, {c: 6, r: 6}, {c: 6, r: 7}, {c: 0, r: 13}, {c: 1, r: 13}, {c: 2, r: 13}, {c: 2, r: 12}, {c: 1, r: 12}, {c: 0, r: 12}, {c: 6, r: 13}, {c: 0, r: 6}, {c: 0, r: 5}, {c: 0, r: 4}, {c: 0, r: 3}, {c: 0, r: 2}, {c: 0, r: 1}, {c: 0, r: 0}, {c: 3, r: 4}, {c: 1, r: 4}, {c: 3, r: 6}, {c: 1, r: 6}, {c: 5, r: 3}, {c: 5, r: 5}, {c: 5, r: 7}, {c: 2, r: 9}, {c: 1, r: 8}, {c: 1, r: 11}, {c: 3, r: 11}, {c: 3, r: 13}, {c: 5, r: 12}] },
  L37: { name: "Double Spiral", cols: 7, rows: 14, path: [{c: 1, r: 0}, {c: 1, r: 5}, {c: 6, r: 5}, {c: 6, r: 8}, {c: 1, r: 8}, {c: 1, r: 10}, {c: 4, r: 10}, {c: 4, r: 13}, {c: 2, r: 13}, {c: 2, r: 11}, {c: 0, r: 11}, {c: 0, r: 13}], blocked: [{c: 3, r: 3}, {c: 3, r: 2}, {c: 3, r: 1}, {c: 3, r: 0}, {c: 4, r: 1}, {c: 4, r: 0}, {c: 4, r: 2}, {c: 4, r: 3}, {c: 5, r: 3}, {c: 6, r: 3}, {c: 6, r: 2}, {c: 5, r: 2}, {c: 5, r: 1}, {c: 6, r: 1}, {c: 6, r: 0}, {c: 5, r: 0}, {c: 0, r: 0}, {c: 0, r: 1}, {c: 2, r: 0}, {c: 0, r: 2}, {c: 0, r: 3}, {c: 0, r: 4}, {c: 0, r: 5}, {c: 0, r: 6}, {c: 0, r: 7}, {c: 0, r: 8}, {c: 0, r: 9}, {c: 0, r: 10}, {c: 5, r: 13}, {c: 6, r: 13}, {c: 6, r: 12}, {c: 6, r: 11}, {c: 6, r: 10}, {c: 5, r: 10}, {c: 5, r: 11}, {c: 5, r: 12}, {c: 6, r: 9}, {c: 5, r: 9}, {c: 4, r: 9}, {c: 1, r: 13}, {c: 6, r: 4}, {c: 5, r: 4}, {c: 2, r: 4}, {c: 5, r: 6}, {c: 5, r: 7}, {c: 1, r: 6}, {c: 1, r: 7}, {c: 2, r: 6}, {c: 2, r: 7}] },
  L38: { name: "Needle Eye", cols: 7, rows: 14, path: [{c: 1, r: 0}, {c: 1, r: 12}, {c: 5, r: 12}, {c: 5, r: 1}, {c: 2, r: 1}, {c: 2, r: 11}], blocked: [{c: 0, r: 12}, {c: 1, r: 13}, {c: 2, r: 13}, {c: 3, r: 13}, {c: 4, r: 13}, {c: 5, r: 13}, {c: 6, r: 12}, {c: 0, r: 10}, {c: 0, r: 0}, {c: 2, r: 0}, {c: 3, r: 0}, {c: 4, r: 0}, {c: 5, r: 0}, {c: 6, r: 1}, {c: 6, r: 10}, {c: 6, r: 7}, {c: 6, r: 4}, {c: 0, r: 7}, {c: 0, r: 3}, {c: 3, r: 11}, {c: 4, r: 10}, {c: 4, r: 2}, {c: 3, r: 3}, {c: 3, r: 8}, {c: 4, r: 8}, {c: 4, r: 7}, {c: 4, r: 6}, {c: 4, r: 5}, {c: 3, r: 5}, {c: 3, r: 6}, {c: 3, r: 7}, {c: 4, r: 4}, {c: 3, r: 9}] },
  L39: { name: "Complex Maze", cols: 7, rows: 14, path: [{c: 0, r: 13}, {c: 6, r: 13}, {c: 6, r: 0}, {c: 0, r: 0}, {c: 0, r: 12}, {c: 5, r: 12}, {c: 5, r: 7}, {c: 4, r: 7}, {c: 4, r: 5}, {c: 5, r: 5}, {c: 5, r: 1}, {c: 1, r: 1}, {c: 1, r: 5}, {c: 2, r: 5}, {c: 2, r: 7}, {c: 1, r: 7}, {c: 1, r: 11}, {c: 3, r: 11}, {c: 3, r: 2}], blocked: [{c: 2, r: 9}, {c: 4, r: 9}] },
  L40: { name: "Ultimate Boss", cols: 7, rows: 14, path: [{c: 0, r: 13}, {c: 3, r: 13}, {c: 3, r: 9}, {c: 0, r: 9}, {c: 0, r: 12}, {c: 6, r: 12}, {c: 6, r: 13}, {c: 4, r: 13}, {c: 4, r: 6}, {c: 6, r: 6}, {c: 6, r: 8}, {c: 0, r: 8}, {c: 0, r: 4}, {c: 3, r: 4}, {c: 3, r: 6}, {c: 1, r: 6}, {c: 1, r: 1}, {c: 6, r: 1}, {c: 6, r: 4}, {c: 4, r: 4}, {c: 4, r: 0}], blocked: [{c: 0, r: 0}, {c: 1, r: 0}, {c: 2, r: 0}, {c: 3, r: 0}, {c: 5, r: 0}, {c: 6, r: 0}, {c: 0, r: 1}, {c: 0, r: 2}, {c: 0, r: 3}, {c: 2, r: 3}, {c: 3, r: 2}, {c: 6, r: 5}, {c: 5, r: 5}, {c: 3, r: 7}, {c: 2, r: 10}, {c: 1, r: 11}, {c: 6, r: 9}, {c: 6, r: 10}, {c: 6, r: 11}] },
  L41: { name: "Expansion Alpha", cols: 8, rows: 15, path: [{c: 0, r: 13}, {c: 7, r: 13}, {c: 7, r: 11}, {c: 0, r: 11}, {c: 0, r: 8}, {c: 7, r: 8}, {c: 7, r: 4}, {c: 0, r: 4}, {c: 0, r: 0}, {c: 7, r: 0}], blocked: [{c: 0, r: 14}, {c: 7, r: 14}, {c: 4, r: 12}, {c: 0, r: 12}, {c: 1, r: 14}, {c: 6, r: 14}, {c: 7, r: 9}, {c: 7, r: 10}, {c: 7, r: 3}, {c: 7, r: 2}, {c: 7, r: 1}, {c: 0, r: 7}, {c: 0, r: 6}, {c: 0, r: 5}, {c: 1, r: 6}, {c: 2, r: 6}, {c: 3, r: 6}, {c: 4, r: 6}, {c: 5, r: 6}, {c: 2, r: 2}, {c: 3, r: 2}, {c: 4, r: 2}, {c: 5, r: 2}, {c: 6, r: 2}] },
  L42: { name: "Expansion Beta", cols: 8, rows: 16, path: [{c: 0, r: 15}, {c: 7, r: 15}, {c: 7, r: 11}, {c: 0, r: 11}, {c: 0, r: 14}, {c: 6, r: 14}, {c: 6, r: 9}, {c: 0, r: 9}, {c: 0, r: 7}, {c: 2, r: 7}, {c: 2, r: 10}, {c: 7, r: 10}, {c: 7, r: 4}, {c: 0, r: 4}, {c: 0, r: 6}, {c: 6, r: 6}, {c: 6, r: 0}, {c: 0, r: 0}, {c: 0, r: 3}, {c: 7, r: 3}, {c: 7, r: 1}, {c: 1, r: 1}], blocked: [{c: 7, r: 0}, {c: 0, r: 10}, {c: 1, r: 12}, {c: 1, r: 13}, {c: 5, r: 13}, {c: 5, r: 12}, {c: 6, r: 8}, {c: 6, r: 7}, {c: 1, r: 5}] },
  L43: { name: "Growth Gamma", cols: 9, rows: 16, path: [{c: 0, r: 15}, {c: 8, r: 15}, {c: 8, r: 8}, {c: 6, r: 8}, {c: 6, r: 5}, {c: 8, r: 5}, {c: 8, r: 0}, {c: 5, r: 0}, {c: 5, r: 1}, {c: 3, r: 1}, {c: 3, r: 0}, {c: 0, r: 0}, {c: 0, r: 5}, {c: 3, r: 5}, {c: 3, r: 8}, {c: 0, r: 8}, {c: 0, r: 10}, {c: 6, r: 10}, {c: 6, r: 13}, {c: 0, r: 13}], blocked: [{c: 8, r: 7}, {c: 8, r: 6}, {c: 7, r: 6}, {c: 7, r: 7}, {c: 4, r: 0}, {c: 2, r: 6}, {c: 2, r: 7}, {c: 1, r: 7}, {c: 0, r: 7}, {c: 0, r: 6}, {c: 1, r: 6}, {c: 7, r: 1}, {c: 1, r: 1}, {c: 7, r: 14}, {c: 0, r: 14}, {c: 0, r: 12}, {c: 0, r: 11}, {c: 5, r: 12}, {c: 1, r: 14}, {c: 1, r: 9}, {c: 2, r: 9}, {c: 1, r: 11}, {c: 1, r: 12}, {c: 5, r: 11}, {c: 1, r: 4}, {c: 7, r: 4}, {c: 6, r: 3}, {c: 6, r: 2}, {c: 2, r: 2}, {c: 2, r: 3}] },
  L44: { name: "Growth Delta", cols: 9, rows: 18, path: [{c: 0, r: 17}, {c: 4, r: 17}, {c: 4, r: 12}, {c: 5, r: 12}, {c: 5, r: 17}, {c: 8, r: 17}, {c: 8, r: 8}, {c: 4, r: 8}, {c: 4, r: 7}, {c: 8, r: 7}, {c: 8, r: 0}, {c: 5, r: 0}, {c: 5, r: 4}, {c: 4, r: 4}, {c: 4, r: 0}, {c: 0, r: 0}, {c: 0, r: 7}, {c: 3, r: 7}, {c: 3, r: 8}, {c: 0, r: 8}, {c: 0, r: 16}], blocked: [{c: 2, r: 16}, {c: 1, r: 16}, {c: 1, r: 15}, {c: 2, r: 14}, {c: 1, r: 14}, {c: 1, r: 13}, {c: 1, r: 12}, {c: 2, r: 12}, {c: 3, r: 15}, {c: 3, r: 13}, {c: 1, r: 9}, {c: 2, r: 10}, {c: 3, r: 10}, {c: 4, r: 10}, {c: 5, r: 10}, {c: 6, r: 10}, {c: 1, r: 11}, {c: 7, r: 10}, {c: 7, r: 11}, {c: 6, r: 12}, {c: 7, r: 13}, {c: 6, r: 14}, {c: 7, r: 15}, {c: 6, r: 16}, {c: 3, r: 11}, {c: 5, r: 11}, {c: 3, r: 9}, {c: 5, r: 9}, {c: 7, r: 9}, {c: 1, r: 6}, {c: 1, r: 5}, {c: 1, r: 4}, {c: 1, r: 3}, {c: 1, r: 2}, {c: 1, r: 1}, {c: 2, r: 6}, {c: 3, r: 5}, {c: 4, r: 6}, {c: 5, r: 5}, {c: 6, r: 6}, {c: 7, r: 5}, {c: 6, r: 4}, {c: 7, r: 3}, {c: 6, r: 2}, {c: 7, r: 1}, {c: 2, r: 4}, {c: 3, r: 3}, {c: 2, r: 2}, {c: 3, r: 1}] },
  L45: { name: "Growth Large", cols: 9, rows: 17, path: [{c: 0, r: 16}, {c: 8, r: 16}, {c: 8, r: 8}, {c: 1, r: 8}, {c: 1, r: 14}, {c: 6, r: 14}, {c: 6, r: 13}, {c: 2, r: 13}, {c: 2, r: 9}, {c: 3, r: 9}, {c: 3, r: 12}, {c: 7, r: 12}, {c: 7, r: 15}, {c: 0, r: 15}, {c: 0, r: 6}, {c: 8, r: 6}, {c: 8, r: 0}, {c: 0, r: 0}, {c: 0, r: 4}, {c: 7, r: 4}, {c: 7, r: 1}, {c: 1, r: 1}, {c: 1, r: 3}, {c: 6, r: 3}], blocked: [{c: 8, r: 7}, {c: 0, r: 5}, {c: 1, r: 7}, {c: 7, r: 5}, {c: 4, r: 11}, {c: 5, r: 10}, {c: 6, r: 9}, {c: 7, r: 11}, {c: 4, r: 2}, {c: 3, r: 5}, {c: 4, r: 5}, {c: 4, r: 7}, {c: 5, r: 7}] },
  L46: { name: "Extended Path", cols: 9, rows: 18, path: [{c: 8, r: 0}, {c: 7, r: 0}, {c: 7, r: 1}, {c: 6, r: 1}, {c: 6, r: 2}, {c: 2, r: 2}, {c: 2, r: 3}, {c: 1, r: 3}, {c: 1, r: 4}, {c: 0, r: 4}, {c: 0, r: 5}, {c: 1, r: 5}, {c: 1, r: 6}, {c: 2, r: 6}, {c: 2, r: 7}, {c: 6, r: 7}, {c: 6, r: 8}, {c: 7, r: 8}, {c: 7, r: 9}, {c: 8, r: 9}, {c: 8, r: 10}, {c: 7, r: 10}, {c: 7, r: 11}, {c: 6, r: 11}, {c: 6, r: 12}, {c: 2, r: 12}, {c: 2, r: 13}, {c: 1, r: 13}, {c: 1, r: 14}, {c: 0, r: 14}, {c: 0, r: 15}, {c: 1, r: 15}, {c: 1, r: 16}, {c: 2, r: 16}, {c: 2, r: 17}, {c: 4, r: 17}, {c: 4, r: 0}], blocked: [{c: 8, r: 17}, {c: 7, r: 17}, {c: 8, r: 16}, {c: 7, r: 16}, {c: 8, r: 15}, {c: 7, r: 15}, {c: 8, r: 14}, {c: 7, r: 14}, {c: 6, r: 17}, {c: 6, r: 16}, {c: 6, r: 15}, {c: 6, r: 14}, {c: 0, r: 11}, {c: 1, r: 11}, {c: 1, r: 10}, {c: 0, r: 10}, {c: 0, r: 9}, {c: 1, r: 9}, {c: 2, r: 9}, {c: 2, r: 10}, {c: 0, r: 8}, {c: 1, r: 8}, {c: 8, r: 6}, {c: 7, r: 6}, {c: 7, r: 5}, {c: 8, r: 5}, {c: 8, r: 4}, {c: 8, r: 3}, {c: 7, r: 3}, {c: 7, r: 4}, {c: 6, r: 4}, {c: 6, r: 5}, {c: 0, r: 1}, {c: 1, r: 0}, {c: 0, r: 0}, {c: 2, r: 0}, {c: 6, r: 0}, {c: 3, r: 0}, {c: 5, r: 0}, {c: 5, r: 6}, {c: 5, r: 3}, {c: 3, r: 6}, {c: 3, r: 3}, {c: 0, r: 2}, {c: 1, r: 1}, {c: 3, r: 8}, {c: 3, r: 11}, {c: 5, r: 10}, {c: 5, r: 9}, {c: 8, r: 13}, {c: 7, r: 13}, {c: 8, r: 12}, {c: 8, r: 7}, {c: 5, r: 13}, {c: 5, r: 17}, {c: 3, r: 13}, {c: 3, r: 16}, {c: 5, r: 15}, {c: 0, r: 12}, {c: 0, r: 16}, {c: 0, r: 17}, {c: 1, r: 17}, {c: 8, r: 2}, {c: 0, r: 7}] },
  L47: { name: "Extended Wide", cols: 10, rows: 20, path: [{c: 5, r: 19}, {c: 5, r: 8}, {c: 4, r: 8}, {c: 4, r: 9}, {c: 3, r: 9}, {c: 3, r: 7}, {c: 2, r: 7}, {c: 2, r: 10}, {c: 4, r: 10}, {c: 4, r: 11}, {c: 1, r: 11}, {c: 1, r: 6}, {c: 4, r: 6}, {c: 4, r: 7}, {c: 5, r: 7}, {c: 5, r: 6}, {c: 8, r: 6}, {c: 8, r: 11}, {c: 6, r: 11}, {c: 6, r: 10}, {c: 7, r: 10}, {c: 7, r: 9}, {c: 6, r: 9}, {c: 6, r: 8}, {c: 7, r: 8}, {c: 7, r: 7}, {c: 6, r: 7}, {c: 6, r: 0}], blocked: [{c: 9, r: 19}, {c: 8, r: 19}, {c: 6, r: 19}, {c: 7, r: 19}, {c: 8, r: 18}, {c: 9, r: 18}, {c: 9, r: 17}, {c: 4, r: 19}, {c: 3, r: 19}, {c: 2, r: 19}, {c: 0, r: 19}, {c: 1, r: 19}, {c: 0, r: 18}, {c: 1, r: 18}, {c: 0, r: 17}, {c: 1, r: 17}, {c: 2, r: 18}, {c: 0, r: 16}, {c: 0, r: 15}, {c: 1, r: 16}, {c: 2, r: 17}, {c: 3, r: 18}, {c: 7, r: 18}, {c: 8, r: 17}, {c: 9, r: 16}, {c: 9, r: 15}, {c: 0, r: 14}, {c: 0, r: 12}, {c: 0, r: 13}, {c: 9, r: 12}, {c: 9, r: 14}, {c: 9, r: 13}, {c: 9, r: 4}, {c: 9, r: 3}, {c: 9, r: 2}, {c: 9, r: 1}, {c: 9, r: 0}, {c: 7, r: 0}, {c: 8, r: 0}, {c: 8, r: 1}, {c: 5, r: 0}, {c: 4, r: 0}, {c: 3, r: 0}, {c: 2, r: 0}, {c: 1, r: 0}, {c: 0, r: 0}, {c: 0, r: 1}, {c: 0, r: 2}, {c: 0, r: 3}, {c: 0, r: 4}, {c: 0, r: 5}, {c: 1, r: 1}, {c: 1, r: 2}, {c: 2, r: 1}, {c: 4, r: 1}, {c: 3, r: 1}, {c: 2, r: 2}, {c: 3, r: 2}, {c: 1, r: 3}, {c: 2, r: 3}, {c: 1, r: 4}, {c: 9, r: 5}, {c: 4, r: 12}, {c: 6, r: 12}, {c: 7, r: 5}, {c: 5, r: 5}, {c: 1, r: 15}, {c: 1, r: 14}, {c: 1, r: 13}, {c: 1, r: 12}] },
  L48: { name: "Extended Deep", cols: 10, rows: 20, path: [{c: 1, r: 16}, {c: 1, r: 13}, {c: 4, r: 13}, {c: 4, r: 17}, {c: 0, r: 17}, {c: 0, r: 12}, {c: 5, r: 12}, {c: 5, r: 18}, {c: 0, r: 18}, {c: 0, r: 19}, {c: 9, r: 19}, {c: 9, r: 18}, {c: 6, r: 18}, {c: 6, r: 12}, {c: 9, r: 12}, {c: 9, r: 17}, {c: 8, r: 17}, {c: 8, r: 0}, {c: 1, r: 0}, {c: 1, r: 10}, {c: 6, r: 10}, {c: 6, r: 2}, {c: 3, r: 2}, {c: 3, r: 8}, {c: 5, r: 8}, {c: 5, r: 7}, {c: 4, r: 7}, {c: 4, r: 6}, {c: 5, r: 6}, {c: 5, r: 5}, {c: 4, r: 5}], blocked: [{c: 2, r: 16}, {c: 3, r: 16}, {c: 7, r: 17}, {c: 7, r: 16}, {c: 9, r: 11}, {c: 9, r: 9}, {c: 9, r: 10}, {c: 9, r: 8}, {c: 9, r: 7}, {c: 9, r: 6}, {c: 9, r: 5}, {c: 9, r: 4}, {c: 9, r: 3}, {c: 9, r: 2}, {c: 9, r: 0}, {c: 9, r: 1}, {c: 0, r: 0}, {c: 0, r: 1}, {c: 0, r: 2}, {c: 0, r: 3}, {c: 0, r: 4}, {c: 0, r: 6}, {c: 0, r: 5}, {c: 0, r: 7}, {c: 0, r: 8}, {c: 0, r: 9}, {c: 0, r: 10}, {c: 0, r: 11}, {c: 5, r: 9}, {c: 4, r: 9}, {c: 2, r: 9}, {c: 3, r: 9}, {c: 2, r: 1}, {c: 7, r: 1}, {c: 7, r: 11}, {c: 7, r: 10}, {c: 1, r: 11}, {c: 2, r: 11}, {c: 6, r: 11}, {c: 5, r: 11}, {c: 4, r: 11}, {c: 3, r: 11}, {c: 7, r: 9}, {c: 6, r: 1}, {c: 5, r: 1}, {c: 4, r: 1}, {c: 3, r: 1}, {c: 2, r: 2}, {c: 7, r: 2}, {c: 7, r: 3}, {c: 2, r: 3}, {c: 2, r: 4}, {c: 7, r: 4}, {c: 7, r: 5}, {c: 2, r: 5}] },
  L49: { name: "Extended Complex", cols: 10, rows: 20, path: [{c: 4, r: 4}, {c: 4, r: 5}, {c: 5, r: 5}, {c: 5, r: 3}, {c: 3, r: 3}, {c: 3, r: 6}, {c: 6, r: 6}, {c: 6, r: 2}, {c: 2, r: 2}, {c: 2, r: 7}, {c: 6, r: 7}, {c: 6, r: 17}, {c: 2, r: 17}, {c: 2, r: 12}, {c: 5, r: 12}, {c: 5, r: 16}, {c: 3, r: 16}, {c: 3, r: 13}, {c: 4, r: 13}, {c: 4, r: 15}], blocked: [{c: 9, r: 19}, {c: 9, r: 18}, {c: 9, r: 17}, {c: 9, r: 16}, {c: 9, r: 15}, {c: 9, r: 14}, {c: 9, r: 13}, {c: 9, r: 12}, {c: 9, r: 7}, {c: 9, r: 5}, {c: 9, r: 4}, {c: 9, r: 3}, {c: 9, r: 2}, {c: 9, r: 1}, {c: 9, r: 0}, {c: 5, r: 11}, {c: 5, r: 10}, {c: 5, r: 9}, {c: 5, r: 8}, {c: 7, r: 8}, {c: 7, r: 9}, {c: 7, r: 11}, {c: 7, r: 10}, {c: 4, r: 8}, {c: 3, r: 8}, {c: 2, r: 8}, {c: 1, r: 8}, {c: 0, r: 8}, {c: 0, r: 11}, {c: 1, r: 11}, {c: 2, r: 11}, {c: 3, r: 11}, {c: 4, r: 11}, {c: 0, r: 0}, {c: 0, r: 19}] },
  L50: { name: "Final Apex", cols: 20, rows: 17, path: [{c: 0, r: 16}, {c: 0, r: 11}, {c: 6, r: 11}, {c: 6, r: 16}, {c: 1, r: 16}, {c: 1, r: 12}, {c: 5, r: 12}, {c: 5, r: 15}, {c: 2, r: 15}, {c: 2, r: 10}, {c: 19, r: 10}, {c: 19, r: 16}, {c: 14, r: 16}, {c: 14, r: 11}, {c: 18, r: 11}, {c: 18, r: 15}, {c: 15, r: 15}, {c: 15, r: 12}, {c: 17, r: 12}, {c: 17, r: 2}, {c: 14, r: 2}, {c: 14, r: 5}, {c: 18, r: 5}, {c: 18, r: 1}, {c: 13, r: 1}, {c: 13, r: 6}, {c: 19, r: 6}, {c: 19, r: 0}, {c: 0, r: 0}, {c: 0, r: 6}, {c: 6, r: 6}, {c: 6, r: 1}, {c: 1, r: 1}, {c: 1, r: 5}, {c: 5, r: 5}, {c: 5, r: 2}, {c: 2, r: 2}, {c: 2, r: 8}, {c: 10, r: 8}], blocked: [{c: 0, r: 10}, {c: 1, r: 10}, {c: 1, r: 9}, {c: 1, r: 8}, {c: 1, r: 7}, {c: 0, r: 7}, {c: 0, r: 8}, {c: 0, r: 9}, {c: 7, r: 16}, {c: 8, r: 16}, {c: 9, r: 16}, {c: 10, r: 16}, {c: 11, r: 16}, {c: 12, r: 16}, {c: 13, r: 16}, {c: 13, r: 15}, {c: 13, r: 14}, {c: 13, r: 13}, {c: 13, r: 12}, {c: 13, r: 11}, {c: 12, r: 11}, {c: 11, r: 11}, {c: 10, r: 11}, {c: 9, r: 11}, {c: 8, r: 11}, {c: 7, r: 11}, {c: 7, r: 12}, {c: 7, r: 13}, {c: 7, r: 14}, {c: 7, r: 15}, {c: 8, r: 15}, {c: 9, r: 15}, {c: 10, r: 15}, {c: 11, r: 15}, {c: 12, r: 15}, {c: 12, r: 14}, {c: 11, r: 14}, {c: 10, r: 14}, {c: 9, r: 14}, {c: 8, r: 14}, {c: 8, r: 13}, {c: 9, r: 13}, {c: 10, r: 13}, {c: 11, r: 13}, {c: 12, r: 12}, {c: 12, r: 13}, {c: 11, r: 12}, {c: 10, r: 12}, {c: 9, r: 12}, {c: 8, r: 12}, {c: 7, r: 1}, {c: 8, r: 1}, {c: 9, r: 1}, {c: 10, r: 1}, {c: 11, r: 1}, {c: 12, r: 1}, {c: 12, r: 2}, {c: 12, r: 3}, {c: 12, r: 4}, {c: 12, r: 5}, {c: 12, r: 6}, {c: 11, r: 6}, {c: 10, r: 6}, {c: 9, r: 6}, {c: 8, r: 6}, {c: 7, r: 6}, {c: 7, r: 5}, {c: 7, r: 4}, {c: 7, r: 3}, {c: 7, r: 2}, {c: 8, r: 2}, {c: 9, r: 2}, {c: 10, r: 2}, {c: 11, r: 2}, {c: 11, r: 3}, {c: 10, r: 3}, {c: 9, r: 3}, {c: 8, r: 3}, {c: 8, r: 4}, {c: 9, r: 4}, {c: 10, r: 4}, {c: 11, r: 4}, {c: 11, r: 5}, {c: 10, r: 5}, {c: 9, r: 5}, {c: 8, r: 5}, {c: 18, r: 9}, {c: 19, r: 9}, {c: 19, r: 8}, {c: 19, r: 7}, {c: 18, r: 7}, {c: 18, r: 8}, {c: 16, r: 9}, {c: 16, r: 8}, {c: 16, r: 7}, {c: 15, r: 7}, {c: 14, r: 7}, {c: 14, r: 8}, {c: 15, r: 8}, {c: 15, r: 9}, {c: 14, r: 9}, {c: 13, r: 9}, {c: 13, r: 8}, {c: 13, r: 7}, {c: 12, r: 7}, {c: 12, r: 8}, {c: 12, r: 9}, {c: 2, r: 9}, {c: 3, r: 7}, {c: 4, r: 7}, {c: 5, r: 7}, {c: 6, r: 7}, {c: 7, r: 7}, {c: 3, r: 9}, {c: 4, r: 9}, {c: 5, r: 9}, {c: 6, r: 9}, {c: 7, r: 9}, {c: 8, r: 9}, {c: 8, r: 7}] },
};

// [XYZ206] Level Scaling & Spawn Factory: Continuous level speed and count scaling helpers, plus enemy spawn object factory.
function getLevelSpeedMult(lvl) {
  const t = Math.max(0, Math.min(1, (lvl - 11) / 39));
  return 1.0 + t * 0.35;
}
function getLevelCountBonus(lvl) {
  const t = Math.max(0, Math.min(1, (lvl - 11) / 39));
  return Math.floor(t * 6);
}

function createEnemySpawn(type, count, opts = {}) {
  const cfg = ENEMY_CONFIGS[type] || ENEMY_CONFIGS.grunt;
  const isBoss = !!opts.isBoss;
  const isMiniBoss = !!opts.isMiniBoss;
  const hpMult = opts.hpMult ?? (isBoss ? 3.5 : (isMiniBoss ? 2.0 : 1.0));
  const speedMult = opts.speedMult ?? (isBoss ? 0.72 : (isMiniBoss ? 0.85 : 1.0));
  const bountyMult = opts.bountyMult ?? (isBoss ? 4.5 : (isMiniBoss ? 2.5 : 1.0));
  const calculatedHp = opts.hp !== undefined ? opts.hp : Math.round(cfg.baseHp * hpMult);
  const calculatedSpeed = opts.speed !== undefined ? opts.speed : Math.round(cfg.baseSpeed * speedMult);
  return {
    type,
    isBoss,
    isMiniBoss,
    count,
    hp: calculatedHp,
    speed: calculatedSpeed,
    interval: opts.interval ?? (type === 'swarm' ? 0.15 : (type === 'scout' ? 0.48 : (type === 'tank' ? 1.3 : (type === 'goliath' ? 1.5 : 0.7)))),
    clumps: opts.clumps,
    bounty: Math.max(1, Math.round(cfg.baseBounty * bountyMult))
  };
}

// [XYZ206.01] Standard Level Generator: Constructs wave definitions, enemy compositions, and boss encounters for campaign levels.
function generateStandardLevel(lvl, mapId, wavesCount, sGold, baseHpScale, bossHpVal, bossType, tune = {}) {
  const mobHpMult = tune.mobHpMult ?? 1.0;
  const miniBossHpMult = tune.miniBossHpMult ?? 1.0;
  const wavesArr = [];
  const isBossLevel = (lvl % 10 === 0);

  for (let w = 1; w <= wavesCount; w++) {
    const isLastWave = (w === wavesCount);
    const spawns = [];
    const count = 6 + w * 2;
    const hpScale = (baseHpScale / ENEMY_CONFIGS.grunt.baseHp) * Math.pow(1.08, w - 1);
    const bountyScale = Math.max(0.45, 1 - (lvl - 1) * 0.035 - (w - 1) * 0.025);

    if (w % 2 === 0) {
      const heavyType = lvl > 40 ? 'emp_bomber' : (lvl > 30 ? 'goliath' : (lvl > 20 ? 'blinker' : (lvl > 10 ? 'swarm' : 'tank')));
      const heavyInterval = heavyType === 'tank' ? 1.3 : (heavyType === 'goliath' ? 1.5 : (heavyType === 'swarm' ? 0.15 : 0.95));
      spawns.push(createEnemySpawn(heavyType, Math.max(1, Math.floor(count * 0.3)), {
        clumps: heavyType === 'swarm' ? swarmClumpsFor(lvl, w) : undefined,
        hpMult: hpScale * 2.0 * mobHpMult,
        speedMult: 1.0,
        bountyMult: bountyScale,
        interval: heavyInterval
      }));
      spawns.push(createEnemySpawn('scout', Math.floor(count * 0.5), {
        hpMult: hpScale * 0.52 * mobHpMult,
        speedMult: 1.0,
        bountyMult: bountyScale,
        interval: 0.6
      }));
    } else {
      const standardType = lvl > 40 ? (w > 4 ? 'emp_bomber' : 'goliath') : (lvl > 20 ? (w > 3 ? 'blinker' : 'grunt') : (lvl > 10 ? (w > 3 ? 'swarm' : 'grunt') : 'grunt'));
      spawns.push(createEnemySpawn(standardType, count, {
        clumps: standardType === 'swarm' ? swarmClumpsFor(lvl, w) : undefined,
        hpMult: hpScale * mobHpMult,
        speedMult: 1.0,
        bountyMult: bountyScale,
        interval: 0.65
      }));
      if (w > 2) {
        spawns.push(createEnemySpawn('scout', Math.floor(count * 0.35), {
          hpMult: hpScale * 0.5 * mobHpMult,
          speedMult: 1.0,
          bountyMult: bountyScale,
          interval: 0.65
        }));
      }
    }

    if (isLastWave) {
      if (isBossLevel) {
        const bossBase = ENEMY_CONFIGS[bossType] || ENEMY_CONFIGS.grunt;
        spawns.push({
          type: bossType,
          isBoss: true,
          isMiniBoss: false,
          count: 1,
          hp: bossHpVal,
          speed: Math.round(bossBase.baseSpeed * 0.75),
          interval: 1.2,
          bounty: Math.max(35, Math.round(bossBase.baseBounty * 5.0))
        });
      } else {
        const miniBossType = (lvl % 3 === 0) ? 'tank' : ((lvl % 2 === 0) ? 'scout' : 'grunt');
        const miniBossBase = ENEMY_CONFIGS[miniBossType] || ENEMY_CONFIGS.grunt;
        spawns.push({
          type: miniBossType,
          isBoss: false,
          isMiniBoss: true,
          count: 1,
          hp: Math.round(miniBossBase.baseHp * 2.8 * (1 + lvl * 0.08) * miniBossHpMult),
          speed: Math.round(miniBossBase.baseSpeed * 0.85),
          interval: 1.2,
          bounty: Math.max(15, Math.round(miniBossBase.baseBounty * 2.5))
        });
      }
    }

    wavesArr.push({ wave: w, spawns });
  }

  const unlockedTowers = ['gun', 'laser', 'mortar', 'tesla', 'stasis', 'melter', 'railgun'];

  return {
    mapId: mapId,
    startHp: 10,
    startGold: sGold,
    totalWaves: wavesCount,
    unlockedTowers: unlockedTowers,
    canUpgrade: true,
    waves: wavesArr
  };
}
