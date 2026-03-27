---
id: ios-quickstart
title: iOS Quickstart
sidebar_position: 3
---

# iOS Quickstart

Get EidKit running in an iOS app in minutes.

## Requirements

- iOS 15+
- An iPhone 7 or later (NFC required)
- A Romanian CEI card for testing

## 1. Add the Swift package

In Xcode: **File → Add Package Dependencies** and enter:

```
https://github.com/eidkit/eidkit-ios
```

Or add it directly to `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/eidkit/eidkit-ios", from: "0.1.0"),
],
targets: [
    .target(name: "MyApp", dependencies: ["EidKit"]),
]
```

## 2. Add the NFC entitlement

In Xcode, add the **Near Field Communication Tag Reading** capability to your target. This adds the `com.apple.developer.nfc.readersession.formats` entitlement to your `Entitlements.plist`.

Also add the `NFCReaderUsageDescription` key to `Info.plist`:

```xml
<key>NFCReaderUsageDescription</key>
<string>EidKit reads your identity card via NFC.</string>
```

## 3. Configure the SDK

Call `EidKit.configure()` once at app startup:

```swift
@main
struct MyApp: App {
    init() {
        EidKit.configure(EidKitConfig(
            licenseToken: "your-token"   // optional — see config docs
        ))
    }

    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
```

## 4. Read a card

```swift
import EidKit

// Called from a button action or similar
func readCard() async throws {
    let result = try await EidKit.reader(can: userEnteredCan)
        .withPersonalData(pin: userEnteredPin)
        .withActiveAuth()
        .read()

    // result.passiveAuth — always present
    // result.identity   — name, CNP, DOB
    // result.personalData — address, document info
    // result.claim      — signed JWT for backend verification
}
```

The SDK presents the system NFC sheet automatically — no additional UI setup needed.

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
- [iOS API Reference](/docs/ios-api)
