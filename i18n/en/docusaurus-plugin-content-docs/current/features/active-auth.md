---
id: active-auth
title: Active Authentication
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Active Authentication

Active authentication verifies that the card chip is **genuine and has not been cloned**. It uses a challenge-response protocol with the chip's authentication key.

## How it works

1. EidKit generates a random challenge and sends it to the chip
2. The chip signs the challenge with its internal authentication private key
3. EidKit verifies the signature against the public key stored in the Document Security Object (SOD)
4. If valid, `result.activeAuth` is `Verified` and `result.claim` includes an `activeAuthProof`

`activeAuthProof` contains the challenge, the chip's signature, and the X.509 certificate — raw cryptographic proof your backend can use for independent verification.

:::note Transport format
Serialization of `CeiIdentityClaim` into a transport format (JWT, CBOR, etc.) for sending to a backend is planned for a future milestone. For now, the claim is an in-memory object available within the session.
:::

## Enable active authentication

Active authentication shares the PACE session with personal data reading — `withPersonalData(pin:)` must also be called.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = userEnteredCan)
    .withPersonalData(pin = userEnteredPin)
    .withActiveAuth()           // enable active authentication
    .read(isoDep)

when (result.activeAuth) {
    is ActiveAuthStatus.Verified -> {
        // Chip is genuine
        val claim = result.claim   // includes activeAuthProof
        // Send claim to your backend for verification
    }
    is ActiveAuthStatus.Failed  -> {
        // Chip failed active auth — possible clone attempt
    }
    is ActiveAuthStatus.Skipped -> {
        // withActiveAuth() was not called
    }
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.reader(can: userEnteredCan)
    .withPersonalData(pin: userEnteredPin)
    .withActiveAuth()           // enable active authentication
    .read()

switch result.activeAuth {
case .verified:
    // Chip is genuine
    let claim = result.claim   // includes activeAuthProof
    // Send claim to your backend for verification
case .failed:
    // Chip failed active auth — possible clone attempt
case .skipped:
    // withActiveAuth() was not called
}
```

</TabItem>
</Tabs>

## The identity claim

When both passive auth and active auth succeed and identity was read, `result.claim` is a `CeiIdentityClaim` containing:

| Field | Description |
|-------|-------------|
| `identity` | Core identity fields (name, CNP, DOB) |
| `passiveAuthStatus` | `valid` |
| `activeAuthProof` | Challenge + chip signature — proves card is genuine |
| `issuedAt` | Session timestamp |

Your backend can verify `activeAuthProof` by checking the chip's signature against the public key from the included certificate.

## Passive vs active authentication

| | Passive Auth | Active Auth |
|---|---|---|
| What it proves | Data was issued by Romanian MAI and not tampered | The chip is genuine (not a cloned data copy) |
| Always runs | Yes | Only when `withActiveAuth()` is called |
| Requires PIN | No | Yes (shares session with `withPersonalData`) |
| Adds latency | ~0.5s | ~1s |
