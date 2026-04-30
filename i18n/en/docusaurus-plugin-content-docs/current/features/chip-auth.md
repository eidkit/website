---
id: chip-auth
title: Chip Authentication
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Chip Authentication

Chip Authentication (CA, BSI TR-03110) cryptographically binds the MAI-signed identity to the card's physical chip. It is required for any server-side verification flow.

## Why it is necessary

Passive Authentication proves the data was signed by MAI. Active Authentication (AA) proves the chip can sign a challenge. But the two verifications are independent.

**The attack vector without CA:** an attacker who knows the victim's CAN can read the ICAO data (SOD + DG1) without a PIN — the CAN is visible on the front of the card, and these files are accessible without authentication. The attacker can then use their own chip and their own PIN for the AA signature. A backend verifying only passive + active sees both chains as valid and cannot distinguish the attacker from the victim.

**CA closes the attack:** the server performs an ECDH key agreement with `Q_chip` — the chip's public key from DG14, signed by MAI and covered by the SOD. Only the chip holding the corresponding private key `d_chip` can produce the correct shared secret. The identity and the physical chip cannot be separated.

## Enabling CA

CA shares the PACE session with personal data reading — `withPersonalData(pin:)` must also be called.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = userEnteredCan)
    .withPersonalData(pin = userEnteredPin)
    .withActiveAuth()
    .withChipAuth()
    .read(isoDep)

val proof = result.claim?.chipAuthProof
// Send proof to your backend together with the rest of the claim
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKitSdk.reader(can: userEnteredCan)
    .withPersonalData(pin: userEnteredPin)
    .withActiveAuth()
    .withChipAuth()
    .read()

let proof = result.claim?.chipAuthProof
// Send proof to your backend together with the rest of the claim
```

</TabItem>
</Tabs>

## Proof material

`chipAuthProof` contains everything your backend needs for independent verification:

| Field | Description |
|-------|-------------|
| `terminalPublicKey` | Ephemeral terminal public key — 65 bytes, uncompressed point |
| `ephemeralPrivateKey` | Ephemeral private key scalar — 32 bytes; single-use, safe to send to your own server |
| `sharedSecretX` | X-coordinate of the ECDH shared secret — 32 bytes |
| `rawDg14` | Raw DG14 bytes — contains `Q_chip`, covered by the MAI-signed SOD hash |

## Server-side verification

The server recomputes `K_ca = ECDH(d_terminal, Q_chip_from_DG14)` and compares it to the `sharedSecretX` received from the app. If they match, the chip that signed the AA challenge holds exactly the private key corresponding to the MAI-signed identity.

```javascript
// Node.js example (EidKit SSO webhook)
const ecdh = crypto.createECDH('brainpoolP256r1');
ecdh.setPrivateKey(Buffer.from(caEphemeralPrivateKey, 'base64'));
const recomputed = ecdh.computeSecret(qChipFromDg14);
if (!recomputed.slice(0, 32).equals(Buffer.from(caSharedSecretX, 'base64'))) {
    throw new Error('CA binding mismatch — split-proof attack detected');
}
```

:::info Full technical detail
All 8 verification conditions and the SSO flow diagram: [Security Overview](/docs/security-overview#eidkit-sso-security--zero-trust-model).
:::
