# Instructions for Jules (AI Developer Agent)

This repository contains a mobile-first synthwave Tower Defense game built with pure Vanilla JavaScript (Canvas 2D + Web Audio API).
Depending on the name of repository it is either dev-synth-wave-defense repository - `dev' or 'synth-wave-defense.github.io' - production.

## 1. Strict Architecture Rules
1. **Zero-Build Vanilla Stack:**
   - In this development repository, do NOT use bundlers (Webpack, Vite), transpilers, or npm runtime dependencies.
   - Do NOT convert code to TypeScript or use external framework imports.
   - All source code must remain clean, human-readable, and execute directly via standard browser ES6 scripts.

2. **File Responsibility (6 Core Layers):**
   - `data.js`: Game balance, tower/enemy/boss configs, map layouts. No simulation loops or DOM manipulation.
   - `levels_data.js`: Level wave arrays.
   - `engine.js`: Pure simulation logic, match physics, damage math, projectile updates, wave state, and localStorage. Never touch DOM or canvas rendering here.
   - `ui.js`: Presentation layer, Canvas rendering (sprite caching, particle effects, HUD), screen overlays (pause, victory, defeat), and input handlers.
   - `styles.css`: Pure visual synthwave styles, neon glows, responsive layouts.
   - `index.html`: DOM hierarchy and script bootstrap sequence.
   - `audio.js`: Web Audio API engine.
   - `music.js`: links to music tracks in /music directory

3. **Performance & Optimization Requirements (60 FPS Constraint):**
   - High-frequency simulation runs in `update(dt)` in `engine.js` — avoid creating short-lived objects or garbage collection spikes in this loop.
   - Always reuse arrays and use cached sprites from `ENEMY_SPRITE_CACHE` in `ui.js`.
   - Never remove or alter the `// javascript-obfuscator: disable` / `// javascript-obfuscator: enable` comments guarding performance-critical loops in `engine.js`.

## 2. Code Annotation Standards
  Important functions, core state controllers, and critical systems are marked with concise header annotations containing unique identification tags in the format `[XYZ100]` (3 uppercase letters followed by numbers, e.g., `[ENG101]`, `[UIB204]`, `[DAT050]`).
  When modifying existing annotated functions or introducing new significant architectural methods/components, you **must preserve the existing annotations** and **add new concise annotations in the exact same format (`[XYZ100]`)** with a one-line description of purpose and side-effects.

## 3. Versioning
  On dev repository use versioning which means:
  - 'index.html' contain the main version of the game at the beginning. Each update should increase the version, like 1.36.01 - > 1.36.02; after 1.36.99 we should get 1.37.00, etc. Top digit ('1' in our case) should not be changed unless clearly stated in developer requirements.
  - other files can have the same version as well, meaning that if you change 'data.js', and new version is 1.36.03, you need to update the version in 'index.html' and you can add it into 'data.js'
## 4. Production Deployment Protocol (Dev -> Production Only)
Minification and obfuscation are **forbidden in everyday development commits**. They must ONLY be applied when preparing a release to move the full repository or its part from `dev` (dev-synth-wave-defense repository) to `production` (synth-wave-defense.github.io).

When tasked with a production release or build sync, you MUST execute the build pipeline exactly as described below to protect the intellectual property while maintaining strict 60 FPS performance:

1. **Minification (Apply to ALL JS files):**
   - Use **`Terser`** to minify ALL JavaScript files for maximum compression.
   - **Target files:** `ui.js`, `engine.js`, `data.js`, `levels_data.js`, `audio.js`, `music.js`, `sfx-manifest.js`, `telemetry.js`, and any other `.js` files.

2. **Selective Obfuscation (Apply to SPECIFIC files only):**
   - After minification, apply **`javascript-obfuscator`** ONLY to the following files containing sensitive game logic and balance data:
     - `data.js` (Obfuscate completely).
	 - `levels_data.js`
     - `engine.js` (Obfuscate partially. You must strictly respect the `// javascript-obfuscator: disable` and `// javascript-obfuscator: enable` flags manually placed around the high-performance `update(dt)` loop so the core simulation loop remains untouched).

3. **Strict Obfuscation Exclusions:**
   - Do **NOT** run `javascript-obfuscator` on the following files. They are highly sensitive to CPU overhead and must remain unobfuscated to prevent severe mobile frame drops, audio glitching, or reporting failures:
     - `ui.js` (Canvas rendering and batching)
     - `audio.js` (Web Audio API engine)
     - `music.js` (Music streaming)
     - `sfx-manifest.js` (DSP parameters)
     - `telemetry.js` (Crash reporting)

4. **Lightweight Obfuscator Settings:**
   - You MUST use the following lightweight configuration for `javascript-obfuscator`. Heavy obfuscation (like control flow flattening) will destroy mobile browser performance.
   ```json
   {
     "controlFlowFlattening": false,
     "stringArray": true,
     "stringArrayEncoding": ["base64"],
     "deadCodeInjection": false,
     "identifierNamesGenerator": "hexadecimal"
   }```
