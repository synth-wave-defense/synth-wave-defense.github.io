// Synth Wave Defense -- music_downloader.js
// Background Music Downloader & Local Storage Resolver via Capacitor Filesystem

(function () {
  'use strict';

  let isDownloading = false;
  let activeManifest = null;

  async function getFilesystemPlugin() {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Filesystem) {
      return window.Capacitor.Plugins.Filesystem;
    }
    return null;
  }

  async function checkFileExists(fs, path) {
    try {
      await fs.stat({
        path: path,
        directory: 'DATA'
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  const MusicDownloader = {
    // Set active update manifest
    setManifest: function (manifest) {
      activeManifest = manifest;
    },

    getManifest: function () {
      return activeManifest;
    },

    // Sequentially download external music tracks in the background
    startBackgroundDownload: async function (manifest) {
      if (manifest) activeManifest = manifest;
      if (isDownloading || !activeManifest || !Array.isArray(activeManifest.music)) {
        return;
      }

      const fs = await getFilesystemPlugin();
      if (!fs) {
        console.warn('[MusicDownloader] Capacitor Filesystem plugin is unavailable (running in browser?)');
        return;
      }

      isDownloading = true;

      // Ensure target directory exists in app storage
      try {
        await fs.mkdir({
          path: 'downloaded_music',
          directory: 'DATA',
          recursive: true
        });
      } catch (e) {
        // Directory already exists, ignore error
      }

      const remoteTracks = activeManifest.music.filter(t => !t.bundled && t.url);

      for (const track of remoteTracks) {
        const filename = track.filename || `${track.id}.ogg`;
        const filePath = `downloaded_music/${filename}`;

        const exists = await checkFileExists(fs, filePath);
        if (exists) {
          continue;
        }

        console.log(`[MusicDownloader] Downloading: ${filename}...`);

        try {
          await fs.downloadFile({
            url: track.url,
            path: filePath,
            directory: 'DATA'
          });
          console.log(`[MusicDownloader] Finished downloading: ${filename}`);

          // Gentle throttle delay (2s) between downloads to minimize CPU/network contention
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (err) {
          console.warn(`[MusicDownloader] Failed to download ${filename}:`, err);
          // Network interrupted; stop batch and resume on next app launch
          break;
        }
      }

      isDownloading = false;
    },

    // Resolve playback URL (built-in path, local file:// URI, or fallback)
    resolveTrackUrl: async function (relativePath) {
      // If no manifest is provided or running in plain browser, use standard web path
      if (!activeManifest || !window.Capacitor || !window.Capacitor.convertFileSrc) {
        return relativePath;
      }

      const filename = relativePath.split('/').pop();
      const trackEntry = activeManifest.music.find(t => (t.filename === filename || `${t.id}.ogg` === filename));

      // Bundled tracks play directly from assets
      if (!trackEntry || trackEntry.bundled) {
        return relativePath;
      }

      const fs = await getFilesystemPlugin();
      if (!fs) return relativePath;

      const localPath = `downloaded_music/${filename}`;
      const exists = await checkFileExists(fs, localPath);

      if (exists) {
        try {
          const uriResult = await fs.getUri({
            path: localPath,
            directory: 'DATA'
          });
          return window.Capacitor.convertFileSrc(uriResult.uri);
        } catch (e) {
          console.warn('[MusicDownloader] Error resolving local file URI:', e);
        }
      }

      // Track is not ready yet: fallback to the default starter track
      console.warn(`[MusicDownloader] Track ${filename} not available locally yet. Using fallback.`);
      return 'music/battle_01.ogg';
    }
  };

  window.MusicDownloader = MusicDownloader;
})();