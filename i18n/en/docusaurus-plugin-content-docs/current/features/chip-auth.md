---
id: chip-auth
title: Chip Authentication
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Chip Authentication

Chip Authentication (CA, BSI TR-03110) cryptographically binds the MAI-signed identity to the card's physical chip. It is required for any server-side verification flow (SSO).

## Why it is necessary

Passive Authentication proves the data was signed by MAI. Active Authentication (AA) proves the chip can sign a challenge. But the two verifications are independent.

**The attack vector without CA:** an attacker who knows the victim's CAN can read the ICAO data (SOD + DG1) without a PIN — the CAN is visible on the front of the card, and these files are accessible without authentication. The attacker can then use their own chip and their own PIN for the AA signature. A backend verifying only passive + active sees both chains as valid and cannot distinguish the attacker from the victim.

**CA closes the attack:** the server generates a terminal keypair `(d_terminal, Q_terminal)` and sends `Q_terminal` to the app. The app relays it to the chip via GENERAL AUTHENTICATE. The server independently recomputes `Z = ECDH(d_terminal, Q_chip_from_DG14)` — only the chip holding `d_chip` can produce the same Z. `d_terminal` never leaves the server.

## Enabling CA

### SSO flow (v2 — server-side key)

In the SSO flow, CA runs mid-NFC session: the SDK suspends the session, sends DG14 to the server, receives `Q_terminal`, relays it to the chip — all while the card stays on the phone.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val reader = EidKit.reader(can = userEnteredCan)
    .withPersonalData(pin = userEnteredPin)
    .withActiveAuth()
    .withChipAuth { rawDg14 ->
        // Called mid-NFC, card still on phone
        // POST to /v2/session/ca-prepare, return Q_terminal or null to skip CA
        postCaPrepare(sessionToken, rawDg14)
    }

val result = reader.read(isoDep)
val proof = result.claim?.chipAuthProof
// proof.serverMode == true — d_terminal stayed on the server
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let reader = try EidKitSdk.reader(can: userEnteredCan)
    .withPersonalData(pin: userEnteredPin)
    .withActiveAuth()
    .withChipAuth(onDg14Ready: { rawDg14 in
        // Called mid-NFC, card still on phone
        // POST to /v2/session/ca-prepare, return Q_terminal or nil to skip CA
        return await postCaPrepare(sessionToken: sessionToken, rawDg14: rawDg14)
    })

let result = try await reader.read()
let proof = result.claim?.chipAuthProof
// proof.serverMode == true — d_terminal stayed on the server
```

</TabItem>
</Tabs>

### KYC flow (v1 — local key)

For local verification (without SSO), the SDK generates the keypair on-device:

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = userEnteredCan)
    .withPersonalData(pin = userEnteredPin)
    .withChipAuth()
    .read(isoDep)

val proof = result.claim?.chipAuthProof
// proof.serverMode == false — key was generated on-device
// Send proof to your own backend for verification
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKitSdk.reader(can: userEnteredCan)
    .withPersonalData(pin: userEnteredPin)
    .withChipAuth()
    .read()

let proof = result.claim?.chipAuthProof
// proof.serverMode == false — key was generated on-device
// Send proof to your own backend for verification
```

</TabItem>
</Tabs>

## Proof material

`chipAuthProof` contains everything your backend needs for independent verification:

| Field | Description |
|-------|-------------|
| `terminalPublicKey` | Terminal public key sent to the chip via GENERAL AUTHENTICATE — 65 bytes, uncompressed brainpoolP256r1 point |
| `sharedSecretX` | X-coordinate of the ECDH shared secret — 32 bytes (zeros in v2 server-key mode; server computes Z independently) |
| `rawDg14` | Raw DG14 bytes — contains `Q_chip`, covered by the MAI-signed SOD hash |
| `serverMode` | `true` in the v2 flow — `d_terminal` was server-generated and never left the server |

## Server-side verification (v2)

In the v2 flow, the server receives no private key from the app. The flow is:

1. **`POST /v2/session/ca-prepare`** — app sends `rawDg14` (card still on phone); server generates `(d_terminal, Q_terminal)`, stores `d_terminal` and DG14 in the session, returns `Q_terminal`
2. **App relays `Q_terminal` to the chip** via GENERAL AUTHENTICATE — chip computes Z internally
3. **`POST /v2/session/complete`** — server recomputes `Z = ECDH(d_terminal, Q_chip_from_stored_DG14)` and verifies the binding

DG14 is stored at step 1 — the server does not accept a different copy at step 3, preventing DG14 substitution between calls.

:::caution Residual limitation
CA closes the split-proof attack for attackers with a **different name**. A highly constrained residual exists: an attacker who has **physical access to the victim's card** (to read the CAN from the card face), shares the **same legal name** as the victim, and is willing to **accept detection risk** — every authentication permanently logs the CE81 serial number (hashed with a server secret), and MAI holds the SERIALNUMBER→CNP mapping, enabling forensic identification of the attacker. This is a detectable insider threat, not a scalable attack vector.
:::

:::info Full technical detail
All verification conditions and the SSO flow diagram: [Security Overview](/docs/security-overview#eidkit-sso-security--zero-trust-model).
:::
