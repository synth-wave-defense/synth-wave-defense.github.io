# Отключаем агрессивный проход оптимизации регистров
-dontoptimize

# Сохраняем метаданные аннотаций, JS-интерфейсы и сигнатуры
-keepattributes *Annotation*,JavascriptInterface,Signature,InnerClasses,EnclosingMethod

# Сохраняем классы приложения и нативные мосты
-keep class io.github.synthwave.defense.** { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Защита Capacitor и плагинов (включая FilesystemPlugin, вызвавший VerifyError)
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }
-keep class io.ionic.** { *; }
-dontwarn com.getcapacitor.**
-dontwarn com.capacitorjs.**
-dontwarn io.ionic.**

# Защита Kotlin Coroutines (предотвращает повреждение регистров корутин)
-keep class kotlin.** { *; }
-keep class kotlinx.coroutines.** { *; }
-dontwarn kotlin.**
-dontwarn kotlinx.coroutines.**

# Защита SDK РСЯ (Yandex Mobile Ads)
-keep class com.yandex.mobile.ads.** { *; }
-keep class com.monetization.ads.** { *; }
-dontwarn com.yandex.mobile.ads.**
-dontwarn com.monetization.ads.**