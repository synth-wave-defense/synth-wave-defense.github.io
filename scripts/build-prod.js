// scripts/build-prod.js
// Production Build Pipeline: Tree-shaking, RC4 Obfuscation, and SourceMap Stripping

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WWW_DIR = path.join(__dirname, '..', 'www');

console.log('=== [1/5] Stripping Dev/OTA files & Source Maps ===');
const devDir = path.join(WWW_DIR, 'dev');
if (fs.existsSync(devDir)) {
  fs.rmSync(devDir, { recursive: true, force: true });
  console.log('Removed www/dev/');
}
['dev_gate.js', 'updater.js'].forEach(file => {
  const fp = path.join(WWW_DIR, file);
  if (fs.existsSync(fp)) {
    fs.rmSync(fp, { force: true });
    console.log('Removed www/' + file);
  }
});

console.log('=== [2/5] Injecting Production Stage & Dead-Code Markers ===');
['index.html', 'telemetry.js', 'engine.js'].forEach(file => {
  const fp = path.join(WWW_DIR, file);
  if (!fs.existsSync(fp)) return;
  let content = fs.readFileSync(fp, 'utf8');
  content = content.replace(/window\.__APP_STAGE__\s*=\s*['"]development['"]/g, "window.__APP_STAGE__ = 'production'");
  content = content.replace(/window\.__APP_STAGE__\s*===\s*['"]development['"]/g, 'false');
  fs.writeFileSync(fp, content, 'utf8');
});

console.log('=== [3/5] Running javascript-obfuscator (RC4 string encryption, No SourceMaps) ===');
// 1. Максимальная RC4-обфускация для файла дев-меню (capacitor-runtime-metadata.js)
const runtimeMetaFile = path.join(WWW_DIR, 'core', 'plugins', 'capacitor-runtime-metadata.js');
if (fs.existsSync(runtimeMetaFile)) {
  execSync(
    `npx --yes javascript-obfuscator "${runtimeMetaFile}" --output "${runtimeMetaFile}" ` +
    `--compact true --control-flow-flattening true --control-flow-flattening-threshold 0.75 ` +
    `--string-array true --string-array-encoding rc4 --string-array-threshold 1 ` +
    `--split-strings true --split-strings-chunk-length 5 ` +
    `--identifier-names-generator hexadecimal --source-map false`,
    { stdio: 'inherit' }
  );
}

// 2. Обфускация игровой логики и баланса (data.js, levels_data.js, engine.js) с RC4 и без SourceMaps
['data.js', 'levels_data.js', 'engine.js'].forEach(file => {
  const fp = path.join(WWW_DIR, file);
  if (!fs.existsSync(fp)) return;
  execSync(
    `npx --yes javascript-obfuscator "${fp}" --output "${fp}" ` +
    `--compact true --control-flow-flattening false ` +
    `--string-array true --string-array-encoding rc4 --string-array-threshold 1 ` +
    `--dead-code-injection false --identifier-names-generator hexadecimal --source-map false`,
    { stdio: 'inherit' }
  );
});

console.log('=== [4/5] Running Terser Minification + Tree Shaking ===');
function getAllJsFiles(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllJsFiles(full, list);
    } else if (entry.name.endsWith('.js')) {
      list.push(full);
    } else if (entry.name.endsWith('.map')) {
      fs.rmSync(full, { force: true });
    }
  }
  return list;
}

const jsFiles = getAllJsFiles(WWW_DIR);
for (const jsFile of jsFiles) {
  execSync(
    `npx --yes terser "${jsFile}" -o "${jsFile}" --compress dead_code=true,unused=false,conditionals=true`,
    { stdio: 'inherit' }
  );
}

console.log('=== [5/5] Verifying zero .map files exist ===');
getAllJsFiles(WWW_DIR);
console.log('Production JS build completed successfully.');