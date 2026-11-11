# Add project specific ProGuard rules here.
-keepattributes *Annotation*,JavascriptInterface,Signature,InnerClasses,EnclosingMethod

# Save classes of our app (both prod and dev) and JS-bridge
-keep class io.github.synthwave.defense.** { *; }
-keepclassmembers class io.github.synthwave.defense.** {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Capacitor Defense
-keep class com.getcapacitor.** { *; }
-dontwarn com.getcapacitor.**

# Defense for  Yandex Mobile Ads SDK and its dependencies
-keep class com.yandex.mobile.ads.** { *; }
-keep class com.monetization.ads.** { *; }
-dontwarn com.yandex.mobile.ads.**
-dontwarn com.monetization.ads.**

# Defense for AppCompat / WebView dialogues for valid work of HTML <select>
-keep class androidx.appcompat.app.** { *; }
-keep class androidx.appcompat.widget.** { *; }