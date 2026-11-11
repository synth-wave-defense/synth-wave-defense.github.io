package io.github.synthwave.defense;

import android.content.Context;
import android.os.Bundle;
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

public class MainActivity extends BridgeActivity {
    private static final String TAG = "SynthWaveMainActivity";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        installCrashGuard();
        super.onCreate(savedInstanceState);

        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
                this.bridge.getWebView().addJavascriptInterface(new NativeYandexAdsBridge(this), "NativeYandexAdsBridge");
                Log.d(TAG, "NativeYandexAdsBridge registered successfully");
            }
        } catch (Throwable e) {
            Log.e(TAG, "Error attaching NativeYandexAdsBridge", e);
        }
    }

    private void installCrashGuard() {
        final Thread.UncaughtExceptionHandler defaultHandler = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            try {
                String stack = Log.getStackTraceString(throwable);
                String tName = thread != null ? thread.getName() : "unknown";
                boolean isMainThread = (thread == Looper.getMainLooper().getThread());

                // Поглощаем сбои сторонних фоновых потоков SDK рекламы / корутин без падения игры
                boolean isBgSdkCrash = !isMainThread && (
                    tName.contains("YandexAds") ||
                    tName.contains("ExoPlayer") ||
                    tName.contains("OkHttp") ||
                    stack.contains("com.monetization.ads") ||
                    stack.contains("com.yandex.mobile.ads") ||
                    stack.contains("CompletionHandlerException")
                );

                if (isBgSdkCrash) {
                    Log.w(TAG, "Suppressed background SDK exception on thread: " + tName, throwable);
                    return;
                }
            } catch (Throwable ignored) {}

            if (defaultHandler != null) {
                defaultHandler.uncaughtException(thread, throwable);
            }
        });
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
            runOnUiThread(() -> {
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
            runOnUiThread(() -> {
                try {
                    MobileAds.initialize(context.getApplicationContext(), new InitializationListener() {
                        @Override
                        public void onInitializationCompleted() {
                            try {
                                isSdkInitialized = true;
                                setupLoader();
                                if (defaultAdUnitId != null && !defaultAdUnitId.isEmpty()) {
                                    loadRewardedAd(defaultAdUnitId);
                                }
                            } catch (Throwable t) {
                                Log.e(TAG, "Error in onInitializationCompleted", t);
                            }
                        }
                    });
                } catch (Throwable t) {
                    Log.e(TAG, "Error in MobileAds.initialize", t);
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
            runOnUiThread(() -> {
                try {
                    if (!isSdkInitialized) return;
                    if (isAdLoading || rewardedAd != null) return;
                    setupLoader();
                    if (rewardedAdLoader == null) {
                        runJs("window.onYandexAdFailedToLoad && window.onYandexAdFailedToLoad('Loader unavailable');");
                        return;
                    }
                    isAdLoading = true;
                    AdRequestConfiguration config = new AdRequestConfiguration.Builder(adUnitId).build();
                    rewardedAdLoader.loadAd(config);
                } catch (Throwable t) {
                    isAdLoading = false;
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
            runOnUiThread(() -> {
                try {
                    if (rewardedAd != null) {
                        rewardedAd.show(MainActivity.this);
                    } else {
                        runJs("window.onYandexAdFailedToShow && window.onYandexAdFailedToShow('Ad not ready');");
                    }
                } catch (Throwable t) {
                    rewardedAd = null;
                    String msg = t.getMessage() != null ? t.getMessage().replace("'", "\\'") : "Show exception";
                    runJs("window.onYandexAdFailedToShow && window.onYandexAdFailedToShow('" + msg + "');");
                }
            });
        }
    }
}