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

EidKit is distributed via GitHub Packages.

**`settings.gradle.kts`** — add the Maven repository:

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

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

In Xcode: **File → Add Package Dependencies** and enter:

```
https://github.com/eidkit/eidkit-ios
```

Or add directly to `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/eidkit/eidkit-ios", from: "0.1.0"),
],
targets: [
    .target(name: "MyApp", dependencies: ["EidKit"]),
]
```

</TabItem>
</Tabs>

## 2. NFC setup

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

Attach `NfcManager` to your Activity to receive card tap events:

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

Call `EidKit.configure()` once in `Application.onCreate()`:

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        EidKit.configure(this, EidKitConfig {
            licenseToken = BuildConfig.EIDKIT_LICENSE_TOKEN   // optional
        })
    }
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

Call `EidKit.configure()` once at app startup:

```swift
@main
struct MyApp: App {
    init() {
        EidKit.configure(EidKitConfig(
            licenseToken: "your-token"   // optional
        ))
    }
    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
```

</TabItem>
</Tabs>

## 4. Read a card

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

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
