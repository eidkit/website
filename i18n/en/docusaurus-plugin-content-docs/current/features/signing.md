---
id: signing
title: Document Signing
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Document Signing

EidKit uses the nonRepudiation key on the Romanian CEI chip to produce a **qualified ECDSA-SHA384 signature** over a document hash. This enables PAdES/eIDAS-compatible PDF signing.

## How it works

1. Your app computes a SHA-384 hash of the document byte range to be signed
2. The user taps the card and enters their 6-digit **signing PIN**
3. The chip signs the hash using the nonRepudiation key (key ref `0x8E` in the GenPKI applet)
4. EidKit returns the raw 96-byte `r||s` ECDSA signature and the DER X.509 certificate

## Sign a document

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
// 1. Compute the SHA-384 hash of your document content
val hash = MessageDigest.getInstance("SHA-384").digest(documentBytes)
// hash.size == 48

// 2. Execute the signing session
val result = EidKit.signer(can = userEnteredCan)
    .sign(hash, signingPin = userEnteredSigningPin)
    .execute(isoDep)

// result.signature    — 96-byte raw ECDSA-SHA384 r||s
// result.certificate  — DER-encoded X.509 CE8E certificate
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
import CryptoKit

// 1. Compute the SHA-384 hash of your document content
let hash = Data(SHA384.hash(data: documentBytes))
// hash.count == 48

// 2. Execute the signing session
let result = try await EidKit.signer(can: userEnteredCan)
    .sign(hash: hash, signingPin: userEnteredSigningPin)
    .execute()

// result.signature    — 96-byte raw ECDSA-SHA384 r||s
// result.certificate  — DER-encoded X.509 CE8E certificate
```

</TabItem>
</Tabs>

## Embedding the signature in a PDF

`SignResult.signature` is a raw `r||s` value. To embed it in a PDF (PAdES/eIDAS), it must be wrapped in a CMS/PKCS#7 `SignedData` structure together with the certificate.

Options:
- **EidKit signing service** — set `EidKitConfig.signingServiceUrl` to delegate CMS wrapping, timestamping, and LTV to the EidKit backend (or your own on-premise instance)
- **DIY** — use Apache PDFBox (Android) or PDFKit/BouncyCastle to build the CMS structure yourself from `result.signature` and `result.certificate`

## Progress events

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
EidKit.signer(can = userEnteredCan)
    .sign(hash, signingPin = userEnteredSigningPin)
    .executeFlow(isoDep)
    .collect { event ->
        when (event) {
            is SignEvent.PaceEstablished -> showStep("Secure channel opened")
            is SignEvent.PinVerified     -> showStep("PIN accepted")
            is SignEvent.Done            -> showResult(event.result)
        }
    }
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.signer(can: userEnteredCan)
    .sign(hash: hash, signingPin: userEnteredSigningPin)
    .execute { event in
        switch event {
        case .paceEstablished: showStep("Secure channel opened")
        case .pinVerified:     showStep("PIN accepted")
        }
    }
```

</TabItem>
</Tabs>

:::warning Signing PIN
The signing PIN is **6 digits** — different from the 4-digit authentication PIN used for KYC. The Romanian CEI allows only **3 incorrect signing PIN attempts** before the signing key is permanently blocked.
:::
