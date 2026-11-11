package io.github.synthwave.defense;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.getcapacitor.BridgeActivity;
import com.yandex.mobile.ads.common.AdError;
import com.yandex.mobile.ads.common.AdRequestConfiguration;
import com.yandex.mobile.ads.common.AdRequestError;
import com.yandex.mobile.ads.common.ImpressionData;
import com.yandex.mobile.ads.common.InitializationListener;
import com.yandex.mobile.ads.common.MobileAds;
import com.yandex.mobile.ads.rewarded.Reward;
import com.yandex.mobile.ads.rewarded.RewardedAd;
import com.yandex.mobile.ads.rewarded.RewardedAdEventListener;
import com.yandex.mobile.ads.rewarded.RewardedAdLoadListener;
import com.yandex.mobile.ads.rewarded.RewardedAdLoader;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import org.json.JSONObject;

@Keep
public class MainActivity extends BridgeActivity {
    private static final String TAG = "SynthWaveDiag";
    private static final String DIAG_PREFS = "SynthWaveProdDiagPrefs";
    private static final String KEY_PREV_LOG = "prev_session_log";
    private static final String KEY_CURR_LOG = "curr_session_log";
    private static final String KEY_LAST_CRASH = "last_crash_stack";
    private static final String KEY_LAST_EXIT = "last_exit_reason";

    private final StringBuilder liveSessionLog = new StringBuilder();
    private long bootStartTimeMs = 0L;
    private NativeYandexAdsBridge adsBridge;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        bootStartTimeMs = System.currentTimeMillis();
        installSilentCrashInterceptor();

        SharedPreferences dp = getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE);
        String prevCurrLog = dp.getString(KEY_CURR_LOG, "");
        String lastExit = dp.getString(KEY_LAST_EXIT, "NONE");

        if (prevCurrLog != null && !prevCurrLog.isEmpty()) {
            dp.edit().putString(KEY_PREV_LOG, prevCurrLog).commit();
        }

        dp.edit()
            .putString(KEY_CURR_LOG, "")
            .putString(KEY_LAST_EXIT, "RUNNING")
            .commit();

        recordStep("onCreate start | prevExit=" + lastExit);

        super.onCreate(savedInstanceState);
        recordStep("super.onCreate completed");

        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
                WebView webView = this.bridge.getWebView();
                adsBridge = new NativeYandexAdsBridge(this);
                webView.addJavascriptInterface(new AssetCacheManager(), "AssetCacheManager");
                webView.addJavascriptInterface(adsBridge, "NativeYandexAdsBridge");
                webView.addJavascriptInterface(adsBridge, "NativeAdsBridge");
                recordStep("JS Bridges attached (NativeYandexAdsBridge + AssetCacheManager)");
            } else {
                recordStep("WARN: bridge or WebView is null!");
            }
        } catch (Throwable e) {
            recordStep("ERROR attaching bridges: " + Log.getStackTraceString(e));
        }
    }

    private void installSilentCrashInterceptor() {
        final Thread.UncaughtExceptionHandler defaultHandler = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            try {
                String stack = Log.getStackTraceString(throwable);
                String tName = thread != null ? thread.getName() : "unknown";
                boolean isMainThread = (thread == Looper.getMainLooper().getThread());

                // Поглощаем сбои сторонних фоновых потоков
                if (!isMainThread) {
                    recordStep("ABSORBED BG THREAD EXCEPTION [" + tName + "]: "
                        + throwable.getClass().getSimpleName() + " - " + throwable.getMessage());
                    return;
                }

                String header = "FATAL MAIN THREAD CRASH [" + tName + "]:\n"
                    + throwable.getClass().getName() + ": " + throwable.getMessage() + "\n" + stack;
                recordStep(header);

                SharedPreferences dp = getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE);
                dp.edit()
                    .putString(KEY_LAST_CRASH, header)
                    .putString(KEY_LAST_EXIT, "JAVA_CRASH: " + throwable.getClass().getSimpleName())
                    .commit();

                writeLogFileToDisk();
            } catch (Throwable ignored) {}

            if (defaultHandler != null) {
                defaultHandler.uncaughtException(thread, throwable);
            } else {
                System.exit(1);
            }
        });
    }

    private synchronized void recordStep(String msg) {
        long elapsed = System.currentTimeMillis() - bootStartTimeMs;
        String timeStr = new SimpleDateFormat("HH:mm:ss.SSS", Locale.US).format(new Date());
        String line = "[" + timeStr + " | +" + elapsed + "ms] " + msg + "\n";
        liveSessionLog.append(line);
        Log.d(TAG, msg);

        try {
            SharedPreferences dp = getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE);
            dp.edit().putString(KEY_CURR_LOG, liveSessionLog.toString()).commit();
            writeLogFileToDisk();
        } catch (Throwable ignored) {}
    }

    private void writeLogFileToDisk() {
        try {
            SharedPreferences dp = getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE);
            String fullReport = buildFullDiagnosticText(dp);
            File extDir = getExternalFilesDir(null);
            if (extDir != null) {
                File out = new File(extDir, "crash_log.txt");
                try (FileOutputStream fos = new FileOutputStream(out, false)) {
                    fos.write(fullReport.getBytes(StandardCharsets.UTF_8));
                }
            }
        } catch (Throwable ignored) {}
    }

    private String buildFullDiagnosticText(SharedPreferences dp) {
        StringBuilder sb = new StringBuilder();
        sb.append("=== SYNTH WAVE PROD DIAGNOSTIC LOG ===\n");
        sb.append("Package          : ").append(getPackageName()).append("\n");
        sb.append("Last Exit Reason : ").append(dp.getString(KEY_LAST_EXIT, "NONE")).append("\n\n");

        String crashStack = dp.getString(KEY_LAST_CRASH, "");
        if (crashStack != null && !crashStack.isEmpty()) {
            sb.append("--- LAST CRASH STACK ---\n");
            sb.append(crashStack).append("\n\n");
        }

        String prevLog = dp.getString(KEY_PREV_LOG, "");
        if (prevLog != null && !prevLog.isEmpty()) {
            sb.append("--- PREVIOUS SESSION TIMELINE ---\n");
            sb.append(prevLog).append("\n");
        }

        sb.append("--- CURRENT SESSION TIMELINE ---\n");
        sb.append(liveSessionLog.toString()).append("\n");
        return sb.toString();
    }

    private void logCloseCall(String methodName) {
        long elapsed = System.currentTimeMillis() - bootStartTimeMs;
        String stack = Log.getStackTraceString(new Throwable("Caller of " + methodName));
        recordStep("CALLED " + methodName + " at +" + elapsed + "ms:\n" + stack);

        SharedPreferences dp = getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE);
        dp.edit().putString(KEY_LAST_EXIT, methodName + " at +" + elapsed + "ms").commit();
        writeLogFileToDisk();
    }

    @Override
    public void finish() {
        logCloseCall("finish()");
        super.finish();
    }

    @Override
    public void finishAffinity() {
        logCloseCall("finishAffinity()");
        super.finishAffinity();
    }

    @Override
    public void finishAndRemoveTask() {
        logCloseCall("finishAndRemoveTask()");
        super.finishAndRemoveTask();
    }

    @Override
    public boolean moveTaskToBack(boolean nonRoot) {
        logCloseCall("moveTaskToBack(" + nonRoot + ")");
        return super.moveTaskToBack(nonRoot);
    }

    @Override
    public void onPause() {
        recordStep("Lifecycle: onPause()");
        super.onPause();
    }

    @Override
    public void onStop() {
        recordStep("Lifecycle: onStop()");
        super.onStop();
    }

    @Override
    public void onDestroy() {
        recordStep("Lifecycle: onDestroy() | isFinishing=" + isFinishing());
        super.onDestroy();
    }

    @Keep
    public class AssetCacheManager {
        @Keep
        @JavascriptInterface
        public void logJsDiagnostic(String msg) {
            recordStep("[JS] " + msg);
        }

        @Keep
        @JavascriptInterface
        public void confirmCacheValid() {
            recordStep("[JS] confirmCacheValid()");
        }

        @Keep
        @JavascriptInterface
        public String restoreBackupPack() {
            return "OK_BUILTIN";
        }

        @Keep
        @JavascriptInterface
        public String getStatusJson() {
            try {
                JSONObject obj = new JSONObject();
                obj.put("activeVersion", "builtin");
                obj.put("bootStatus", "SUCCESS");
                obj.put("bootLog", "Prod builtin");
                return obj.toString();
            } catch (Exception e) {
                return "{\"bootStatus\":\"SUCCESS\"}";
            }
        }

        @Keep
        @JavascriptInterface
        public String syncResourcePack(String f, String v, boolean imm) {
            return "OK_DISABLED";
        }

        @Keep
        @JavascriptInterface
        public String activateStagedPack() {
            return "OK_DISABLED";
        }
    }

    @Keep
    public class NativeYandexAdsBridge {
        private final Context context;
        private RewardedAdLoader rewardedAdLoader;
        private RewardedAd rewardedAd;
        private boolean isAdLoading = false;
        private boolean isSdkInitialized = false;
        private boolean isInitializing = false;
        private String pendingAdUnitId = "demo-rewarded-yandex";

        public NativeYandexAdsBridge(Context context) {
            this.context = context;
        }

        private void runJs(final String jsCode) {
            runOnUiThread(() -> {
                try {
                    if (MainActivity.this.bridge != null && MainActivity.this.bridge.getWebView() != null) {
                        MainActivity.this.bridge.getWebView().evaluateJavascript(jsCode, null);
                    }
                } catch (Throwable e) {
                    recordStep("YandexAds runJs error: " + e.getMessage());
                }
            });
        }

        @Keep
        @JavascriptInterface
        public void initialize(final String defaultAdUnitId) {
            recordStep("JS called NativeYandexAdsBridge.initialize(" + defaultAdUnitId + ")");
            if (defaultAdUnitId != null && !defaultAdUnitId.isEmpty()) {
                pendingAdUnitId = defaultAdUnitId;
            }
            runOnUiThread(() -> {
                try {
                    if (isSdkInitialized) {
                        recordStep("YandexAds already initialized -> loading " + pendingAdUnitId);
                        loadRewardedAd(pendingAdUnitId);
                        return;
                    }
                    if (isInitializing) {
                        recordStep("YandexAds initialization already in progress...");
                        return;
                    }
                    isInitializing = true;
                    recordStep("Calling MobileAds.initialize...");
                    MobileAds.initialize(context.getApplicationContext(), new InitializationListener() {
                        @Override
                        public void onInitializationCompleted() {
                            runOnUiThread(() -> {
                                try {
                                    isSdkInitialized = true;
                                    isInitializing = false;
                                    recordStep("MobileAds.onInitializationCompleted() SUCCESS");
                                    setupLoader();
                                    loadRewardedAd(pendingAdUnitId);
                                } catch (Throwable t) {
                                    recordStep("ERROR in onInitializationCompleted: " + Log.getStackTraceString(t));
                                }
                            });
                        }
                    });
                } catch (Throwable t) {
                    isInitializing = false;
                    recordStep("ERROR in MobileAds.initialize: " + Log.getStackTraceString(t));
                    String msg = t.getMessage() != null ? t.getMessage().replace("'", "\\'") : "Init error";
                    runJs("window.onYandexAdFailedToLoad && window.onYandexAdFailedToLoad('Native init error: " + msg + "');");
                }
            });
        }

        private void setupLoader() {
            if (rewardedAdLoader != null) return;
            try {
                rewardedAdLoader = new RewardedAdLoader(context.getApplicationContext());
                rewardedAdLoader.setAdLoadListener(new RewardedAdLoadListener() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedAd ad) {
                        recordStep("YandexAds: onAdLoaded SUCCESS");
                        rewardedAd = ad;
                        isAdLoading = false;
                        attachEventListener(ad);
                        runJs("window.onYandexAdLoaded && window.onYandexAdLoaded();");
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull AdRequestError adRequestError) {
                        rewardedAd = null;
                        isAdLoading = false;
                        String desc = adRequestError.getDescription() != null ? adRequestError.getDescription() : "Load error";
                        recordStep("YandexAds: onAdFailedToLoad (" + adRequestError.getCode() + ": " + desc + ")");
                        String safeDescription = desc.replace("'", "\\'");
                        runJs("window.onYandexAdFailedToLoad && window.onYandexAdFailedToLoad('" + safeDescription + "');");
                    }
                });
            } catch (Throwable t) {
                recordStep("ERROR in setupLoader: " + Log.getStackTraceString(t));
                rewardedAdLoader = null;
            }
        }

        private void attachEventListener(RewardedAd ad) {
            try {
                ad.setAdEventListener(new RewardedAdEventListener() {
                    @Override
                    public void onAdShown() {
                        recordStep("YandexAds: onAdShown");
                    }

                    @Override
                    public void onAdFailedToShow(@NonNull AdError adError) {
                        rewardedAd = null;
                        String desc = adError.getDescription() != null ? adError.getDescription() : "Show error";
                        recordStep("YandexAds: onAdFailedToShow (" + desc + ")");
                        String safeDescription = desc.replace("'", "\\'");
                        runJs("window.onYandexAdFailedToShow && window.onYandexAdFailedToShow('" + safeDescription + "');");
                    }

                    @Override
                    public void onAdDismissed() {
                        recordStep("YandexAds: onAdDismissed");
                        rewardedAd = null;
                        runJs("window.onYandexAdDismissed && window.onYandexAdDismissed();");
                    }

                    @Override
                    public void onAdClicked() {
                        recordStep("YandexAds: onAdClicked");
                    }

                    @Override
                    public void onRewarded(@NonNull Reward reward) {
                        recordStep("YandexAds: onRewarded!");
                        runJs("window.onYandexAdRewarded && window.onYandexAdRewarded();");
                    }

                    @Override
                    public void onAdImpression(@Nullable ImpressionData impressionData) {}
                });
            } catch (Throwable t) {
                recordStep("ERROR in attachEventListener: " + Log.getStackTraceString(t));
            }
        }

        @Keep
        @JavascriptInterface
        public void loadRewardedAd(final String adUnitId) {
            final String unitToLoad = (adUnitId != null && !adUnitId.isEmpty()) ? adUnitId : pendingAdUnitId;
            pendingAdUnitId = unitToLoad;
            recordStep("YandexAds.loadRewardedAd called for: " + unitToLoad + " | isSdkInit=" + isSdkInitialized);

            runOnUiThread(() -> {
                try {
                    if (!isSdkInitialized) {
                        recordStep("loadRewardedAd: SDK not initialized yet, calling initialize()");
                        initialize(unitToLoad);
                        return;
                    }
                    if (isAdLoading) {
                        recordStep("loadRewardedAd: already loading, skipping duplicate call");
                        return;
                    }
                    if (rewardedAd != null) {
                        recordStep("loadRewardedAd: ad already loaded, notifying JS");
                        runJs("window.onYandexAdLoaded && window.onYandexAdLoaded();");
                        return;
                    }
                    setupLoader();
                    if (rewardedAdLoader == null) {
                        runJs("window.onYandexAdFailedToLoad && window.onYandexAdFailedToLoad('Loader unavailable');");
                        return;
                    }
                    isAdLoading = true;
                    recordStep("YandexAds: requesting ad from server (" + unitToLoad + ")...");
                    AdRequestConfiguration config = new AdRequestConfiguration.Builder(unitToLoad).build();
                    rewardedAdLoader.loadAd(config);
                } catch (Throwable t) {
                    isAdLoading = false;
                    recordStep("ERROR in loadRewardedAd: " + Log.getStackTraceString(t));
                    String msg = t.getMessage() != null ? t.getMessage().replace("'", "\\'") : "Load exception";
                    runJs("window.onYandexAdFailedToLoad && window.onYandexAdFailedToLoad('" + msg + "');");
                }
            });
        }

        @Keep
        @JavascriptInterface
        public boolean isRewardedAdReady() {
            return rewardedAd != null;
        }

        @Keep
        @JavascriptInterface
        public void showRewardedAd() {
            recordStep("JS called showRewardedAd() | adReady=" + (rewardedAd != null));
            runOnUiThread(() -> {
                try {
                    if (rewardedAd != null) {
                        rewardedAd.show(MainActivity.this);
                    } else {
                        recordStep("showRewardedAd: ad is null, triggering reload");
                        runJs("window.onYandexAdFailedToShow && window.onYandexAdFailedToShow('Ad not ready');");
                        loadRewardedAd(pendingAdUnitId);
                    }
                } catch (Throwable t) {
                    rewardedAd = null;
                    recordStep("ERROR in showRewardedAd: " + Log.getStackTraceString(t));
                    String msg = t.getMessage() != null ? t.getMessage().replace("'", "\\'") : "Show exception";
                    runJs("window.onYandexAdFailedToShow && window.onYandexAdFailedToShow('" + msg + "');");
                }
            });
        }
    }
}