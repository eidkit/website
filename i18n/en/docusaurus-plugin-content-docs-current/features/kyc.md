---
id: kyc
title: KYC — Read Card Data
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# KYC — Read Card Data

EidKit reads identity data, photos, and address information from the Romanian CEI chip in a single NFC session.

## What you can read

| Data | Source | Requires |
|------|--------|---------|
| Name, CNP, date of birth, sex, nationality | EDATA applet | 4-digit auth PIN |
| Birthplace, address, document number, expiry | EDATA applet | 4-digit auth PIN |
| Face photo (JPEG, ~24 KB) | DG2 | No PIN (slower — ~7s) |
| Handwritten signature image (JPEG, ~2.6 KB) | DG7 | No PIN (~1.5s) |

Passive authentication always runs — the SDK verifies data against the Romanian MAI root certificate automatically.

## Basic read (identity only)

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = userEnteredCan)
    .withPersonalData(pin = userEnteredPin)
    .read(isoDep)

val identity = result.identity
// identity.firstName, identity.lastName
// identity.cnp          — Romanian personal identification number
// identity.dateOfBirth
// identity.sex
// identity.nationality

val personal = result.personalData
// personal.address      — full Romanian address
// personal.documentNumber
// personal.expiryDate
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.reader(can: userEnteredCan)
    .withPersonalData(pin: userEnteredPin)
    .read()

let identity = result.identity
// identity?.firstName, identity?.lastName
// identity?.cnp          — Romanian personal identification number
// identity?.dateOfBirth
// identity?.sex
// identity?.nationality

let personal = result.personalData
// personal?.address      — full Romanian address
// personal?.documentNumber
// personal?.expiryDate
```

</TabItem>
</Tabs>

## Read with photo

Including the face photo adds ~7 seconds to the session. Only request it when needed.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = userEnteredCan)
    .withPersonalData(pin = userEnteredPin)
    .withPhoto()              // DG2 — ~7s
    .withSignatureImage()     // DG7 — ~1.5s (optional)
    .read(isoDep)

result.photo?.let { jpegBytes ->
    val bitmap = BitmapFactory.decodeByteArray(jpegBytes, 0, jpegBytes.size)
    imageView.setImageBitmap(bitmap)
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.reader(can: userEnteredCan)
    .withPersonalData(pin: userEnteredPin)
    .withPhoto()              // DG2 — ~7s
    .withSignatureImage()     // DG7 — ~1.5s (optional)
    .read()

if let jpegData = result.photo {
    let image = UIImage(data: jpegData)
    imageView.image = image
}
```

</TabItem>
</Tabs>

## Progress events

Use `readFlow` (Android) or the `onEvent` overload (iOS) to drive a wizard UI while the session runs.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
EidKit.reader(can = userEnteredCan)
    .withPersonalData(pin = userEnteredPin)
    .readFlow(isoDep)
    .collect { event ->
        when (event) {
            is ReadEvent.PaceEstablished  -> showStep("Secure channel opened")
            is ReadEvent.PassiveAuthDone  -> showStep("Data verified")
            is ReadEvent.EDataRead        -> showStep("Identity read")
            is ReadEvent.Done             -> showResult(event.result)
        }
    }
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.reader(can: userEnteredCan)
    .withPersonalData(pin: userEnteredPin)
    .read { event in
        switch event {
        case .paceEstablished:  showStep("Secure channel opened")
        case .passiveAuthDone:  showStep("Data verified")
        case .eDataRead:        showStep("Identity read")
        }
    }
```

</TabItem>
</Tabs>

## Passive authentication result

`result.passiveAuth` is always populated:

| Status | Meaning |
|--------|---------|
| `Valid` | Data is genuine — issued by Romanian MAI, not tampered |
| `Invalid` | Hash or certificate chain verification failed |
| `Skipped` | Not possible (should not occur in normal operation) |

If `passiveAuth` is `Valid` and identity was read, `result.claim` is a signed `CeiIdentityClaim` your backend can verify.
