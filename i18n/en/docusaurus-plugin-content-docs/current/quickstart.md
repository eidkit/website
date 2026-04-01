---
id: quickstart
title: Quickstart
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

Get EidKit running in a mobile app in minutes.

## Requirements

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

- Android API 26+ (Android 8.0)
- A device with NFC
- A Romanian CEI card for testing

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

- iOS 15+
- iPhone 7 or later (NFC required)
- A Romanian CEI card for testing

</TabItem>
</Tabs>

## 1. Install

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
// app/build.gradle.kts
dependencies {
    implementation("ro.eidkit:sdk-android:0.1.0")
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/eidkit/eidkit-ios-releases", from: "0.1.0"),
],
targets: [
    .target(name: "MyApp", dependencies: ["EidKit"]),
]
```

</TabItem>
</Tabs>

:::info Early access
EidKit is currently in **early access** — a license token is required for production use. Email us at [hello@eidkit.ro](mailto:hello@eidkit.ro) to get access.
:::

## 2. NFC setup

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

Add the NFC permission, intent filter, and tech filter to `AndroidManifest.xml`:

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.NFC" />

<application ...>
    <activity
        android:name=".MainActivity"
        android:launchMode="singleTop">  <!-- required for onNewIntent -->

        <intent-filter>
            <action android:name="android.nfc.action.TECH_DISCOVERED" />
        </intent-filter>
        <meta-data
            android:name="android.nfc.action.TECH_DISCOVERED"
            android:resource="@xml/nfc_tech_filter" />
    </activity>
</application>
```

Create `res/xml/nfc_tech_filter.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <tech-list>
        <tech>android.nfc.tech.IsoDep</tech>
    </tech-list>
</resources>
```

Attach `NfcManager` to your Activity to receive card tap events:

```kotlin
class MainActivity : ComponentActivity() {
    private val nfcManager = EidKit.nfcManager()

    override fun onResume() {
        super.onResume()
        nfcManager.enableForegroundDispatch(this)
    }

    override fun onPause() {
        super.onPause()
        nfcManager.disableForegroundDispatch(this)
    }
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

Add the **Near Field Communication Tag Reading** capability in Xcode (Target → Signing & Capabilities).

Also add the `NFCReaderUsageDescription` key to `Info.plist`:

```xml
<key>NFCReaderUsageDescription</key>
<string>EidKit reads your identity card via NFC.</string>
```

The SDK presents the system NFC sheet automatically at each session — no additional UI setup needed.

</TabItem>
</Tabs>

## 3. Configure the SDK

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

Create an `Application` class and register it in the manifest:

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        EidKit.configure(this, EidKitConfig {
            licenseToken = BuildConfig.EIDKIT_LICENSE_TOKEN
        })
    }
}
```

```xml
<!-- AndroidManifest.xml -->
<application android:name=".MyApp" ...>
```

Define `EIDKIT_LICENSE_TOKEN` in `app/build.gradle.kts` as a `BuildConfig` field:

```kotlin
// app/build.gradle.kts
android {
    buildFeatures { buildConfig = true }
    defaultConfig {
        buildConfigField("String", "EIDKIT_LICENSE_TOKEN", "\"${project.findProperty("EIDKIT_LICENSE_TOKEN") ?: ""}\"")
    }
}
```

Add your token to `local.properties` (never commit this file):

```
EIDKIT_LICENSE_TOKEN=your-token-here
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

Call `EidKit.configure()` once at app startup:

```swift
@main
struct MyApp: App {
    init() {
        EidKit.configure(EidKitConfig(
            licenseToken: "your-token"
        ))
    }
    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
```

</TabItem>
</Tabs>

:::note Demo mode
Without a valid `licenseToken`, the SDK runs in **demo mode** — data read from the card is automatically masked. Ideal for development and testing without exposing real personal data.
:::

## 4. Read a card

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

`onNewIntent` is called when an NFC card is detected. Requires `android:launchMode="singleTop"` on the Activity (configured in step 2).

```kotlin
override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    val isoDep = nfcManager.handleIntent(intent) ?: return

    lifecycleScope.launch {
        val result = EidKit.reader(can = userEnteredCan)
            .withPersonalData(pin = userEnteredPin)
            .withActiveAuth()
            .read(isoDep)

        // result.passiveAuth  — always present
        // result.identity     — name, CNP, DOB
        // result.personalData — address, document info
        // result.claim        — proof material for backend verification
    }
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
import EidKit

func readCard() async throws {
    let result = try await EidKit.reader(can: userEnteredCan)
        .withPersonalData(pin: userEnteredPin)
        .withActiveAuth()
        .read()

    // result.passiveAuth  — always present
    // result.identity     — name, CNP, DOB
    // result.personalData — address, document info
    // result.claim        — proof material for backend verification
}
```

</TabItem>
</Tabs>

:::info CAN
The CAN is the 6-digit number printed on the **front** of the card. The user must enter it in your app UI — never hardcode or store it.

![Location of the CAN code on the Electronic Identity Card](/img/cei-can-sample.png)
:::

:::warning PIN attempts
The Romanian CEI allows only **3 incorrect PIN attempts** before the PIN is blocked. A blocked PIN requires an in-person visit to an MAI service point to unblock. Always let the user enter their PIN themselves.
:::

## Next steps

- [KYC](/docs/features/kyc) — read identity data and photos
- [Document Signing](/docs/features/signing) — sign PDFs with the card
- [Active Authentication](/docs/features/active-auth) — verify chip authenticity
- [Android API Reference ↗](https://eidkit.ro/android-api/latest/index.html)
- [iOS API Reference ↗](https://eidkit.ro/ios-api/latest/index.html)
