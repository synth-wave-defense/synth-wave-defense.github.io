package io.github.synthwave.defense;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
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
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "SynthWaveMainActivity";
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    @Override
    public void onCreate(Bundle savedInstanceState) {
        installCrashGuard();
        super.onCreate(savedInstanceState);

        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
                this.bridge.getWebView().addJavascriptInterface(new AssetCacheManager(), "AssetCacheManager");
                this.bridge.getWebView().addJavascriptInterface(new NativeYandexAdsBridge(this), "NativeYandexAdsBridge");
                Log.d(TAG, "JS Bridges attached successfully");
            }
        } catch (Throwable e) {
            Log.e(TAG, "Error attaching JS Bridges", e);
        }
    }

    private void installCrashGuard() {
        final Thread.UncaughtExceptionHandler defaultHandler = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            try {
                String tName = thread != null ? thread.getName() : "unknown";
                boolean isMainThread = (thread == Looper.getMainLooper().getThread());

                // Как и на Dev: любые ошибки в фоновых потоках (SDK рекламы, сеть, аналитика)
                // поглощаем без закрытия игры!
                if (!isMainThread) {
                    Log.w(TAG, "Suppressed background thread exception on [" + tName + "]: " + throwable.getMessage());
                    return;
                }
            } catch (Throwable ignored) {}

            if (defaultHandler != null) {
                defaultHandler.uncaughtException(thread, throwable);
            }
        });
    }

    @Keep
    public class AssetCacheManager {
        @Keep
        @JavascriptInterface
        public void logJsDiagnostic(String msg) {}

        @Keep
        @JavascriptInterface
        public void confirmCacheValid() {}

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
                obj.put("activePath", "builtin");
                obj.put("prevVersion", "builtin");
                obj.put("pendingVersion", "none");
                obj.put("badVersion", "");
                obj.put("bootLog", "Running builtin assets");
                obj.put("bootStatus", "SUCCESS");
                obj.put("currentServerPath", "public");
                return obj.toString();
            } catch (Exception e) {
                return "{\"bootStatus\":\"SUCCESS\"}";
            }
        }

        @Keep
        @JavascriptInterface
        public String syncResourcePack(String cacheFileName, String version, boolean applyImmediately) {
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

        public NativeYandexAdsBridge(Context context) {
            this.context = context;
        }

        private void runJs(final String jsCode) {
            mainHandler.post(() -> {
                try {
                    if (MainActivity.this.bridge != null && MainActivity.this.bridge.getWebView() != null) {
                        MainActivity.this.bridge.getWebView().evaluateJavascript(jsCode, null);
                    }
                } catch (Throwable e) {
                    Log.e(TAG, "runJs error: " + e.getMessage());
                }
            });
        }

        @Keep
        @JavascriptInterface
        public void initialize(final String defaultAdUnitId) {
            // Запускаем инициализацию РСЯ с небольшой задержкой (1.5 сек), чтобы WebView
            // спокойно завершил холодный старт и загрузку экрана без пиковой нагрузки
            mainHandler.postDelayed(() -> {
                try {
                    if (isFinishing() || isDestroyed()) return;
                    MobileAds.initialize(context.getApplicationContext(), new InitializationListener() {
                        @Override
                        public void onInitializationCompleted() {
                            mainHandler.post(() -> {
                                try {
                                    isSdkInitialized = true;
                                    setupLoader();
                                    if (defaultAdUnitId != null && !defaultAdUnitId.isEmpty()) {
                                        loadRewardedAd(defaultAdUnitId);
                                    }
                                } catch (Throwable t) {
                                    Log.e(TAG, "Error in onInitializationCompleted", t);
                                }
                            });
                        }
                    });
                } catch (Throwable t) {
                    Log.e(TAG, "Error in MobileAds.initialize", t);
                }
            }, 1500);
        }

        private void setupLoader() {
            if (rewardedAdLoader != null) return;
            try {
                rewardedAdLoader = new RewardedAdLoader(context.getApplicationContext());
                rewardedAdLoader.setAdLoadListener(new RewardedAdLoadListener() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedAd ad) {
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
                        String safeDescription = desc.replace("'", "\\'");
                        runJs("window.onYandexAdFailedToLoad && window.onYandexAdFailedToLoad('" + safeDescription + "');");
                    }
                });
            } catch (Throwable t) {
                Log.e(TAG, "Error in setupLoader", t);
                rewardedAdLoader = null;
            }
        }

        private void attachEventListener(RewardedAd ad) {
            try {
                ad.setAdEventListener(new RewardedAdEventListener() {
                    @Override
                    public void onAdShown() {}

                    @Override
                    public void onAdFailedToShow(@NonNull AdError adError) {
                        rewardedAd = null;
                        String desc = adError.getDescription() != null ? adError.getDescription() : "Show error";
                        String safeDescription = desc.replace("'", "\\'");
                        runJs("window.onYandexAdFailedToShow && window.onYandexAdFailedToShow('" + safeDescription + "');");
                    }

                    @Override
                    public void onAdDismissed() {
                        rewardedAd = null;
                        runJs("window.onYandexAdDismissed && window.onYandexAdDismissed();");
                    }

                    @Override
                    public void onAdClicked() {}

                    @Override
                    public void onRewarded(@NonNull Reward reward) {
                        runJs("window.onYandexAdRewarded && window.onYandexAdRewarded();");
                    }

                    @Override
                    public void onAdImpression(@Nullable ImpressionData impressionData) {}
                });
            } catch (Throwable t) {
                Log.e(TAG, "Error in attachEventListener", t);
            }
        }

        @Keep
        @JavascriptInterface
        public void loadRewardedAd(final String adUnitId) {
            mainHandler.post(() -> {
                try {
                    if (!isSdkInitialized || isAdLoading || rewardedAd != null) return;
                    setupLoader();
                    if (rewardedAdLoader == null) return;
                    isAdLoading = true;
                    AdRequestConfiguration config = new AdRequestConfiguration.Builder(adUnitId).build();
                    rewardedAdLoader.loadAd(config);
                } catch (Throwable t) {
                    isAdLoading = false;
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
            mainHandler.post(() -> {
                try {
                    if (rewardedAd != null) {
                        rewardedAd.show(MainActivity.this);
                    } else {
                        runJs("window.onYandexAdFailedToShow && window.onYandexAdFailedToShow('Ad not ready');");
                    }
                } catch (Throwable t) {
                    rewardedAd = null;
                    runJs("window.onYandexAdFailedToShow && window.onYandexAdFailedToShow('Show exception');");
                }
            });
        }
    }
}