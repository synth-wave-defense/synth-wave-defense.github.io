package io.github.synthwave.defense;

import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
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
    private static final String KEY_CLEAN_EXIT = "session_clean_exit";

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final StringBuilder liveSessionLog = new StringBuilder();
    private long bootStartTimeMs = 0L;
    private boolean isDiagShowing = false;
    private NativeYandexAdsBridge adsBridge;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        bootStartTimeMs = System.currentTimeMillis();
        installGlobalCrashInterceptor();

        SharedPreferences dp = getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE);
        String prevCurrLog = dp.getString(KEY_CURR_LOG, "");
        String lastCrash = dp.getString(KEY_LAST_CRASH, "");
        String lastExit = dp.getString(KEY_LAST_EXIT, "NONE");
        boolean prevClean = dp.getBoolean(KEY_CLEAN_EXIT, true);

        if (prevCurrLog != null && !prevCurrLog.isEmpty()) {
            dp.edit().putString(KEY_PREV_LOG, prevCurrLog).commit();
        }

        boolean hadCrash = (lastCrash != null && !lastCrash.isEmpty());
        boolean hadEarlyCrashExit = !prevClean && (lastExit.contains("CRASH") || lastExit.contains("INTERCEPTED") || lastExit.contains("RENDER_GONE"));

        dp.edit()
            .putString(KEY_CURR_LOG, "")
            .putString(KEY_LAST_EXIT, "RUNNING")
            .putBoolean(KEY_CLEAN_EXIT, false)
            .commit();

        recordStep("onCreate start | prevExit=" + lastExit + " | hadCrash=" + hadCrash);

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

        // Невидимая зона в левом верхнем углу (удержание 2 сек открывает лог в любой момент)
        attachInvisibleSecretLogTrigger();

        // Если прошлый запуск упал или был перехвачен — сразу открываем отчет поверх игры
        if (hadCrash || hadEarlyCrashExit) {
            recordStep("Previous session had crash/intercept -> auto-opening diagnostic report");
            mainHandler.postDelayed(() -> showDiagnosticDialog(true), 300);
        }
    }

    private void installGlobalCrashInterceptor() {
        final Thread.UncaughtExceptionHandler defaultHandler = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            try {
                String stack = Log.getStackTraceString(throwable);
                String tName = thread != null ? thread.getName() : "unknown";
                boolean isMainThread = (thread == Looper.getMainLooper().getThread());

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
                    .putBoolean(KEY_CLEAN_EXIT, false)
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
            sb.append("--- LAST CRASH / INTERCEPT STACK ---\n");
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

    // Полностью прозрачная зона 65x65dp в левом верхнем углу:
    // Обычные клики пропускает сквозь себя, а при удержании пальца 2 секунды открывает окно логов!
    private void attachInvisibleSecretLogTrigger() {
        runOnUiThread(() -> {
            try {
                FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(dpToPx(65), dpToPx(65));
                lp.gravity = Gravity.TOP | Gravity.START;
                lp.topMargin = dpToPx(24);
                lp.leftMargin = dpToPx(0);

                View secretZone = new View(this);
                secretZone.setBackgroundColor(Color.TRANSPARENT);

                final Runnable openLogRunnable = () -> showDiagnosticDialog(false);

                secretZone.setOnTouchListener((v, event) -> {
                    int action = event.getActionMasked();
                    if (action == MotionEvent.ACTION_DOWN) {
                        mainHandler.postDelayed(openLogRunnable, 2000);
                    } else if (action == MotionEvent.ACTION_UP || action == MotionEvent.ACTION_CANCEL) {
                        mainHandler.removeCallbacks(openLogRunnable);
                    }
                    return true;
                });

                addContentView(secretZone, lp);
            } catch (Throwable e) {
                recordStep("Failed to attach secret trigger: " + e.getMessage());
            }
        });
    }

    private int dpToPx(int dp) {
        return Math.round(dp * getResources().getDisplayMetrics().density);
    }

    private void showDiagnosticDialog(final boolean isIntercepted) {
        runOnUiThread(() -> {
            if (isFinishing() || isDestroyed() || isDiagShowing) return;
            isDiagShowing = true;

            final SharedPreferences dp = getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE);
            final String reportText = buildFullDiagnosticText(dp);

            LinearLayout root = new LinearLayout(this);
            root.setOrientation(LinearLayout.VERTICAL);
            root.setBackgroundColor(Color.parseColor("#0b0f19"));
            int pad = dpToPx(14);
            root.setPadding(pad, pad, pad, pad);

            TextView titleView = new TextView(this);
            titleView.setText(isIntercepted ? "⚠️ Перехвачен сбой / закрытие" : "🐞 Фоновый лог диагностики");
            titleView.setTextColor(Color.parseColor("#00e5ff"));
            titleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
            titleView.setTypeface(Typeface.DEFAULT_BOLD);
            root.addView(titleView);

            TextView subView = new TextView(this);
            subView.setText("Файл: Android/data/" + getPackageName() + "/files/crash_log.txt");
            subView.setTextColor(Color.parseColor("#94a3b8"));
            subView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
            subView.setPadding(0, dpToPx(4), 0, dpToPx(8));
            root.addView(subView);

            ScrollView scroll = new ScrollView(this);
            LinearLayout.LayoutParams scrollLp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, dpToPx(340)
            );
            scroll.setLayoutParams(scrollLp);
            scroll.setBackgroundColor(Color.parseColor("#05070c"));

            final TextView logTv = new TextView(this);
            logTv.setText(reportText);
            logTv.setTextColor(Color.parseColor("#e2e8f0"));
            logTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 10.5f);
            logTv.setTypeface(Typeface.MONOSPACE);
            logTv.setTextIsSelectable(true);
            int innerPad = dpToPx(8);
            logTv.setPadding(innerPad, innerPad, innerPad, innerPad);
            scroll.addView(logTv);
            root.addView(scroll);

            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setView(root);
            builder.setCancelable(false);
            builder.setPositiveButton("📋 Скопировать", null);
            builder.setNeutralButton("🧹 Очистить", null);
            builder.setNegativeButton("▶️ Закрыть окно", null);

            final AlertDialog dialog = builder.create();
            dialog.show();

            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {
                try {
                    String latest = buildFullDiagnosticText(dp);
                    logTv.setText(latest);
                    ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                    if (cm != null) {
                        cm.setPrimaryClip(ClipData.newPlainText("SynthWaveProdLog", latest));
                    }
                    Toast.makeText(this, "Скопировано в буфер обмена!", Toast.LENGTH_SHORT).show();
                } catch (Throwable e) {
                    Toast.makeText(this, "Ошибка: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });

            dialog.getButton(AlertDialog.BUTTON_NEUTRAL).setOnClickListener(v -> {
                dp.edit().remove(KEY_LAST_CRASH).remove(KEY_PREV_LOG).putBoolean(KEY_CLEAN_EXIT, true).commit();
                logTv.setText(buildFullDiagnosticText(dp));
                Toast.makeText(this, "Архив ошибок очищен", Toast.LENGTH_SHORT).show();
            });

            dialog.getButton(AlertDialog.BUTTON_NEGATIVE).setOnClickListener(v -> {
                isDiagShowing = false;
                dp.edit().putString(KEY_LAST_CRASH, "").putBoolean(KEY_CLEAN_EXIT, true).commit();
                dialog.dismiss();
            });
        });
    }

    // Блокируем ЛЮБУЮ попытку программно закрыть или свернуть Activity (и на старте, и при клике на язык!)
    private boolean interceptCloseCall(String methodName) {
        long elapsed = System.currentTimeMillis() - bootStartTimeMs;
        String stack = Log.getStackTraceString(new Throwable("Stack trace of " + methodName));
        recordStep("INTERCEPTED " + methodName + " at +" + elapsed + "ms!\n" + stack);

        SharedPreferences dp = getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE);
        dp.edit()
            .putString(KEY_LAST_EXIT, "INTERCEPTED_" + methodName + " at +" + elapsed + "ms")
            .putString(KEY_LAST_CRASH, "Blocked call to " + methodName + ":\n" + stack)
            .commit();

        showDiagnosticDialog(true);
        return true;
    }

    @Override
    public void finish() {
        if (interceptCloseCall("finish()")) return;
        super.finish();
    }

    @Override
    public void finishAffinity() {
        if (interceptCloseCall("finishAffinity()")) return;
        super.finishAffinity();
    }

    @Override
    public void finishAndRemoveTask() {
        if (interceptCloseCall("finishAndRemoveTask()")) return;
        super.finishAndRemoveTask();
    }

    @Override
    public boolean moveTaskToBack(boolean nonRoot) {
        if (interceptCloseCall("moveTaskToBack(" + nonRoot + ")")) return false;
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
            getSharedPreferences(DIAG_PREFS, Context.MODE_PRIVATE).edit().putBoolean(KEY_CLEAN_EXIT, true).commit();
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