# Instructions for Jules (AI Developer Agent)

This repository contains a mobile-first synthwave Tower Defense game built with pure Vanilla JavaScript (Canvas 2D + Web Audio API).
Depending on the name of repository it is either dev-synth-wave-defense repository - `dev` or `synth-wave-defense.github.io` - production.

## 1. Strict Architecture Rules
1. **Zero-Build Vanilla Stack:**
   - In this development repository, do NOT use bundlers (Webpack, Vite), transpilers, or npm runtime dependencies.
   - Do NOT convert code to TypeScript or use external framework imports.
   - All source code must remain clean, human-readable, and execute directly via standard browser ES6 scripts.

2. **No Service Workers:**
   - Strictly DO NOT use or introduce `sw.js` (Service Worker). Browser caching intercepts `NativeOtaBridge` requests and breaks the custom OTA update loop.

3. **File Responsibility:**
   - `data.js`: Game balance, tower/enemy/boss configs, map layouts. No simulation loops or DOM manipulation.
   - `levels_data.js`: Level wave arrays.
   - `engine.js`: Pure simulation logic, match physics, damage math, projectile updates, wave state, and localStorage. Never touch DOM or canvas rendering here.
   - `ui.js`: Presentation layer, Canvas rendering (sprite caching, particle effects, HUD), screen overlays (pause, victory, defeat), and input handlers.
   - `styles.css`: Pure visual synthwave styles, neon glows, responsive layouts.
   - `index.html`: DOM hierarchy and script bootstrap sequence.
   - `audio.js`: Web Audio API engine.
   - `music.js`: Works with `MusicDownloader`. Heavy audio tracks are hosted in GitHub Releases and defined in `update_manifest.json` (`bundled: false`), NOT stored in the local repository.
   - `updater.js`: OTA Live Updates Manager interacting with `NativeOtaBridge` and `update_manifest.json`.

4. **Performance & Optimization Requirements (60 FPS Constraint):**
   - High-frequency simulation runs in `update(dt)` in `engine.js` — avoid creating short-lived objects or garbage collection spikes in this loop.
   - Always reuse arrays and use cached sprites from `ENEMY_SPRITE_CACHE` in `ui.js`.
   - Never remove or alter the `// javascript-obfuscator: disable` / `// javascript-obfuscator: enable` comments guarding performance-critical loops in `engine.js`.

## 2. Code Annotation Standards
  Important functions, core state controllers, and critical systems are marked with concise header annotations containing unique identification tags in the format `[XYZ100]` (3 uppercase letters followed by numbers, e.g., `[ENG101]`, `[UIB204]`, `[DAT050]`).
  When modifying existing annotated functions or introducing new significant architectural methods/components, you **must preserve the existing annotations** and **add new concise annotations in the exact same format (`[XYZ100]`)** with a one-line description of purpose and side-effects.

## 3. Versioning
  On dev repository use versioning which means:
  - `index.html` contains the main version of the game at the beginning. Each update should increase the version, like 1.36.01 -> 1.36.02; after 1.36.99 we should get 1.37.00, etc. Top digit ('1' in our case) should not be changed unless clearly stated in developer requirements.
  - Other files can have the same version as well, meaning that if you change `data.js`, and new version is 1.36.03, you need to update the version in `index.html` and you can add it into `data.js`.

## 4. Production Deployment Protocol (Dev -> Production Only)
Minification and obfuscation are **forbidden in everyday development commits**. They must ONLY be applied when preparing a release to move files from `dev` (`dev-synth-wave-defense`) to `production` (`synth-wave-defense.github.io`). Because production files are publicly served via GitHub Pages, they must be protected before pushing to the repository.

When tasked with a production release or build sync, you MUST prepare the code in `www/` following this pipeline:

1. **Selective Obfuscation (Apply to SPECIFIC files only):**
   - Apply `javascript-obfuscator` ONLY to the following files containing sensitive game logic and balance data:
     - `data.js` (Obfuscate completely).
     - `levels_data.js` (Obfuscate completely).
     - `engine.js` (Obfuscate partially. You must strictly respect the `// javascript-obfuscator: disable` and `// javascript-obfuscator: enable` flags around the high-performance `update(dt)` simulation loop).

2. **Strict Obfuscation Exclusions:**
   - Do **NOT** run `javascript-obfuscator` on the following files. They are highly sensitive to CPU overhead or critical for updates and MUST remain unobfuscated (minification only):
     - `ui.js` (Canvas rendering and batching)
     - `audio.js` (Web Audio API engine)
     - `music.js` (Music streaming - works with GitHub Releases)
     - `sfx-manifest.js` (DSP parameters)
     - `telemetry.js` (Crash reporting)
     - `updater.js` (OTA logic and `NativeOtaBridge` calls must not be mangled)

3. **Minification (Apply to ALL JS files):**
   - After selective obfuscation, run `Terser` across ALL `.js` files in `www/` for maximum compression.

4. **Lightweight Obfuscator Settings:**
   - You MUST use the following lightweight configuration for `javascript-obfuscator` to prevent mobile frame drops:
   ```json
   {
     "controlFlowFlattening": false,
     "stringArray": true,
     "stringArrayEncoding": ["base64"],
     "deadCodeInjection": false,
     "identifierNamesGenerator": "hexadecimal"
   }
   ```
   *(Note: The remote workflow `.github/workflows/ota-bundle.yml` will automatically package the resulting `www/` directory into `bundle.zip`, publish it to `ota-bundles`, and stamp the commit SHA into `update_manifest.json` on push).*

## 5. Environment Isolation & File Transfer Protocol
When transferring updates from the `dev` repository to the `prod` repository, you must ONLY transfer the core game assets. Do NOT overwrite the production environment's native container or system configurations.

**INCLUDED (Files you MUST transfer and process):**
- All contents of the `www/` directory (including `index.html`, `engine.js`, `ui.js`, `data.js`, `updater.js`, `.css` files, and media assets like audio/images).
- `AGENTS.md` (if updated).

**EXCLUDED (Strictly DO NOT transfer, modify, or overwrite in the prod repo):**
- `capacitor.config.json` (Contains environment-specific server hostnames and Package IDs).
- `android/` directory (Contains environment-specific native Android builds and Gradle files).
- `package.json` and `package-lock.json` (Node.js dependencies).
- `node_modules/`
- `.github/workflows/` (Unless explicitly asked to update the CI/CD pipeline).
- `bundle.zip` (Generated automatically by CI/CD).
- `.git/` hidden folders.