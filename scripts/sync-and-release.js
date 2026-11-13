// scripts/sync-and-release.js
// Единое версионирование Dev + Prod:
//   npm run release         -> релиз с текущей версией Dev (например, 1.38.32)
//   npm run release:major   -> крупный релиз (1.38.32 -> 1.39.0) + синхронизация Dev
//   Доп. флаг: -- --code 2  -> поднять versionCode в android/app/build.gradle для стора

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(name);
  return (idx !== -1 && args[idx + 1]) ? args[idx + 1] : null;
}
const hasFlag = (name) => args.includes(name);

const isMajor = hasFlag('--major');
const newVersionCode = getArg('--code');
const skipBuild = hasFlag('--skip-build');

const PROD_ROOT = path.resolve(__dirname, '..');
const DEFAULT_DEV_ROOT = 'D:\\Private\\Development\\37 cap\\dev-synth-wave-defense';

const DEV_ROOT = getArg('--dev') ? path.resolve(getArg('--dev')) : DEFAULT_DEV_ROOT;
const PROD_WWW = path.join(PROD_ROOT, 'www');
const DEV_WWW = path.join(DEV_ROOT, 'www');

if (!fs.existsSync(DEV_WWW)) {
  console.error(`❌ Не найдена папка Dev www/ по пути: ${DEV_WWW}`);
  process.exit(1);
}

// --- [1/6] Читаем текущую версию из Dev ---
function readVersionFromDir(rootDir) {
  const htmlPath = path.join(rootDir, 'www', 'index.html');
  if (fs.existsSync(htmlPath)) {
    const match = fs.readFileSync(htmlPath, 'utf8').match(/window\.APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
    if (match) return match[1];
  }
  const pkgPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version;
  }
  return null;
}

const devVersion = readVersionFromDir(DEV_ROOT);
if (!devVersion) {
  console.error('❌ Не удалось определить текущую версию в Dev-репозитории.');
  process.exit(1);
}

// Вычисляем итоговую версию релиза
let targetVersion = devVersion;
if (isMajor) {
  const parts = devVersion.split('.');
  const major = parseInt(parts[0], 10) || 1;
  const minor = parseInt(parts[1], 10) || 0;
  targetVersion = `${major}.${minor + 1}.0`;
}

console.log(`\n🚀 Релиз ${isMajor ? '[MAJOR]' : '[STANDARD]'}: Dev (${devVersion}) -> Prod (${targetVersion})\n`);

// --- [2/6] Бэкап Prod-манифестов ---
console.log('=== [1/5] Бэкап манифестов на Prod ===');
const preservedFiles = ['update_manifest.json', 'manifest.json'];
const manifestBackups = {};

for (const filename of preservedFiles) {
  const fp = path.join(PROD_WWW, filename);
  if (fs.existsSync(fp)) {
    manifestBackups[filename] = fs.readFileSync(fp, 'utf8');
    console.log(`   ✔ Сохранен: www/${filename}`);
  }
}

// --- [3/6] Копирование свежей www/ из Dev на Prod ---
console.log('=== [2/5] Копирование папки www/ с Dev на Prod ===');
if (fs.existsSync(PROD_WWW)) {
  fs.rmSync(PROD_WWW, { recursive: true, force: true });
}
fs.cpSync(DEV_WWW, PROD_WWW, { recursive: true });
console.log('   ✔ Файлы скопированы');

// --- [4/6] Восстановление Prod-манифестов ---
console.log('=== [3/5] Восстановление Prod-манифестов ===');
for (const filename of preservedFiles) {
  const fp = path.join(PROD_WWW, filename);
  if (manifestBackups[filename]) {
    let content = manifestBackups[filename];
    if (filename === 'update_manifest.json') {
      try {
        const parsed = JSON.parse(content);
        parsed.version = targetVersion;
        content = JSON.stringify(parsed, null, 2) + '\n';
      } catch (e) {
        content = content.replace(/"version"\s*:\s*"[^"]+"/, `"version": "${targetVersion}"`);
      }
    }
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`   ✔ Восстановлен www/${filename} (version: ${targetVersion})`);
  } else if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    content = content
      .replace(/synth-wave-defense\/dev-synth-wave-defense/g, 'synth-wave-defense/synth-wave-defense.github.io')
      .replace(/"version"\s*:\s*"[^"]+"/, `"version": "${targetVersion}"`);
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`   ✔ Адаптирован www/${filename} под Prod URL`);
  }
}

// --- [5/6] Запись версии в Prod (и синхронизация в Dev при --major) ---
console.log('=== [4/5] Обновление версии в файлах ===');

function applyVersionToRepo(rootDir, version, updateManifest = false) {
  const wwwDir = path.join(rootDir, 'www');
  ['index.html', 'telemetry.js'].forEach(file => {
    const fp = path.join(wwwDir, file);
    if (!fs.existsSync(fp)) return;
    let content = fs.readFileSync(fp, 'utf8');
    content = content.replace(/window\.APP_VERSION\s*=\s*['"][^'"]+['"]/g, `window.APP_VERSION = '${version}'`);
    content = content.replace(/window\.APP_VERSION\s*\|\|\s*['"][^'"]+['"]/g, `window.APP_VERSION || '${version}'`);
    fs.writeFileSync(fp, content, 'utf8');
  });

  const pkgPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  }

  if (updateManifest) {
    const mPath = path.join(wwwDir, 'update_manifest.json');
    if (fs.existsSync(mPath)) {
      try {
        const m = JSON.parse(fs.readFileSync(mPath, 'utf8'));
        m.version = version;
        fs.writeFileSync(mPath, JSON.stringify(m, null, 2) + '\n', 'utf8');
      } catch (e) {}
    }
  }
}

// Обновляем Prod
applyVersionToRepo(PROD_ROOT, targetVersion, false);
console.log(`   ✔ Prod обновлен до v${targetVersion}`);

// Если был major-релиз — синхронизируем новую базовую версию (например, 1.39.0) обратно в Dev
if (isMajor) {
  applyVersionToRepo(DEV_ROOT, targetVersion, true);
  console.log(`   ✔ Dev синхронизирован на новую базу v${targetVersion}`);
}

// Обновляем versionCode в android/app/build.gradle (если передан --code)
const gradlePath = path.join(PROD_ROOT, 'android', 'app', 'build.gradle');
if (fs.existsSync(gradlePath) && newVersionCode) {
  let gradle = fs.readFileSync(gradlePath, 'utf8');
  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${parseInt(newVersionCode, 10)}`);
  fs.writeFileSync(gradlePath, gradle, 'utf8');
  console.log(`   ✔ android/app/build.gradle -> versionCode ${newVersionCode}`);
}

// --- [6/6] Запуск прод-сборки ---
if (!skipBuild) {
  console.log('\n=== [5/5] Запуск прод-сборки (scripts/build-prod.js) ===');
  execSync('node scripts/build-prod.js', { cwd: PROD_ROOT, stdio: 'inherit' });
}

console.log(`\n✅ Готово! Релиз v${targetVersion} собран и готов к git push.`);