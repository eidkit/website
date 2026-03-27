---
id: android-quickstart
title: Android Quickstart
sidebar_position: 2
---

# Android Quickstart

Get EidKit running in an Android app in minutes.

## Requirements

- Android API 26+ (Android 8.0)
- A device with NFC
- A Romanian CEI card for testing

## 1. Add the dependency

EidKit is distributed via GitHub Packages.

**`settings.gradle.kts`** — add the GitHub Packages Maven repository:

```kotlin
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri("https://maven.pkg.github.com/eidkit/eidkit-android")
            credentials {
                username = providers.gradleProperty("gpr.user").orNull
                    ?: System.getenv("GITHUB_ACTOR")
                password = providers.gradleProperty("gpr.token").orNull
                    ?: System.getenv("GITHUB_TOKEN")
            }
        }
    }
}
```

**`app/build.gradle.kts`**:

```kotlin
dependencies {
    implementation("ro.eidkit:sdk-android:0.1.0")
}
```

## 2. Configure the SDK

Call `EidKit.configure()` once in `Application.onCreate()`:

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        EidKit.configure(this, EidKitConfig {
            licenseToken = BuildConfig.EIDKIT_LICENSE_TOKEN   // optional — see config docs
        })
    }
}
```

## 3. Handle NFC in your Activity

```kotlin
class MyActivity : ComponentActivity() {
    private val nfcManager = EidKit.nfcManager()

    override fun onResume() {
        super.onResume()
        nfcManager.enableForegroundDispatch(this)
    }

    override fun onPause() {
        super.onPause()
        nfcManager.disableForegroundDispatch(this)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val isoDep = nfcManager.handleIntent(intent) ?: return

        lifecycleScope.launch {
            val result = EidKit.reader(can = userEnteredCan)
                .withPersonalData(pin = userEnteredPin)
                .withActiveAuth()
                .read(isoDep)

            // result.passiveAuth — always present
            // result.identity   — name, CNP, DOB
            // result.personalData — address, document info
            // result.claim      — proof material for backend verification
        }
    }
}
```

:::info CAN
The CAN is the 6-digit number printed on the **front** of the card. The user must enter it in your app UI — never hardcode or store it.
:::

:::warning PIN attempts
The Romanian CEI allows only **3 incorrect PIN attempts** before the PIN is blocked. A blocked PIN requires an in-person visit to an MAI service point to unblock. Always let the user enter their PIN themselves.
:::

## Next steps

- [KYC feature](/docs/features/kyc) — read identity data and photos
- [Document Signing](/docs/features/signing) — sign PDFs with the card
- [Active Authentication](/docs/features/active-auth) — verify chip authenticity
- [Android API Reference](/docs/android-api)
