---
slug: integrarea-cei-nfc-android
title: "What It Actually Takes to Integrate the Romanian ID Card Over NFC"
authors: [catalin]
date: 2026-03-29
tags: [cei, nfc, android, ios, kotlin, swift, pace, technical]
description: >
  The Romanian electronic identity card has four distinct applets, two authentication phases, and data formats specific to the Romanian implementation that appear in no complete public documentation. A technical breakdown for Android and iOS.
image: /img/blog/en/nfc-technical-og-en.png
keywords:
  - Romanian ID card NFC integration Android iOS
  - CEI NFC Kotlin Swift SDK
  - PACE protocol Romanian eID Android iOS
  - read personal data CEI NFC
  - CEI EDATA applet
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*This is the third article in our series on Romania's electronic identity card. The previous articles cover [the address problem that's quietly breaking KYC flows](/blog/problema-adresei-carte-electronica-identitate) and [what your electronic ID card can and can't sign](/blog/legea-214-2024-semnatura-electronica-cei).*

If you have integrated an electronic passport or another chip-based identity document before, you will enter this project with a reasonable set of assumptions. Most of them are partially wrong for the Romanian CEI.

It is not that the ICAO standards do not apply — they do, as a starting point. The problem is that the CEI is a national identity card with country-specific extensions that appear nowhere in complete public documentation. What follows is a map of the terrain based on complete implementations for both Android and iOS, tested against real CEI cards.

---

## What You Already Know — and What Still Applies

Any ICAO-based electronic identity card uses **PACE** (Password Authenticated Connection Establishment) to establish a secure channel before any data can be read. The CEI does the same, using the CAN code — 6 digits printed on the front of the card — as the password.

The result of PACE is a Secure Messaging (SM) channel that wraps all subsequent APDU commands. Any command sent raw after the channel is established is rejected by the card — standard behaviour, not specific to the CEI.

Passive authentication works on familiar principles on both platforms: the chip contains a Security Object Document that chains SHA-256 hashes of the data groups up to MAI's CSCA root certificate. The verification looks different depending on the platform, but the principle is the same:

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

On Android, jMRTD handles SOD parsing. Chain verification is done manually against the CSCA certificate bundled with the SDK:

```kotlin
val sod = SODFile(sodRaw.inputStream())
val dsc = sod.docSigningCertificate
val csca = assets.open("csca_romania.der").use {
    CertificateFactory.getInstance("X.509").generateCertificate(it) as X509Certificate
}
dsc.verify(csca.publicKey) // throws if invalid
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

On iOS there is no jMRTD equivalent. The SOD is a CMS SignedData structure — it must be parsed directly from ASN.1, and chain verification is done through `SecTrust` with the CSCA set as the only anchor, bypassing the system root store:

```swift
let sod = try SodVerifier.parse(sodBytes)
guard let dsc = SecCertificateCreateWithData(nil, sod.dscDer as CFData) else { ... }

var trust: SecTrust?
SecTrustCreateWithCertificates(dsc, SecPolicyCreateBasicX509(), &trust)
SecTrustSetAnchorCertificates(trust!, [csca] as CFArray)
SecTrustSetAnchorCertificatesOnly(trust!, true) // do not use the system trust store
var error: CFError?
let trusted = SecTrustEvaluateWithError(trust!, &error)
```

</TabItem>
</Tabs>

Passive authentication must always run before trusting any data read from the card. An engineer with ICAO document experience will be comfortable up to this point. This is roughly where the familiar terrain ends.

---

## Where the Assumptions Start to Break

### The Chip Has Four Applets, Not One

Standard ICAO travel documents have a relatively predictable applet structure. The CEI does not follow the same pattern. The chip contains four applets with distinct roles:

| Applet | Role |
|--------|------|
| AID1 / National App | PACE entry point, hosts security parameters |
| ICAO LDS | Photo, digitised handwritten signature, SOD for passive authentication |
| EDATA | Personal data: name, CNP, home address |
| GenPKI | Keys and certificates for active authentication and signing |

The ESIGN applet exists on the chip and appears in some reference documents. It is not used. Signing goes through GenPKI, via a command different from what you would assume from reading the standards.

Each applet follows its own selection and authentication flow. You do not select an applet and read what you need.

### Two Phases, Different Requirements

Reading data from the CEI splits naturally into two phases:

**Phase 1 — CAN only:** accesses data available without a PIN — the holder's photo, the digitised handwritten signature, and the data needed for passive authentication. This phase uses the standard ICAO applet.

**Phase 2 — CAN + 4-digit PIN:** accesses the full personal data from the EDATA applet, including the home address — which is no longer printed on the physical card.

### The Order of Operations Before PACE Is Not Documented — and Matters

What you must do *before* PACE depends on what you want to do *after* PACE, and the rules are asymmetric depending on the usage scenario. Phase 1 requires different preparation from Phase 2 and GenPKI. If the preparation is wrong for the given scenario, failures appear at unexpected points with error codes that do not indicate the real problem.

The situation differs between the two platforms for architectural reasons:

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

The Android NFC stack starts in MF context — no AID is pre-selected. This is the correct state for Phase 1: PACE works directly in MF context, after which SM SELECT ICAO gives access to DG2/DG7/SOD.

```kotlin
// Phase 1: no pre-selection needed — Android stack starts in MF context
isoDep.timeout = 20_000 // default timeout is insufficient for CEI

val paceResult = ps.doPACE(canKey, paceOid, paceParams, null)
val wrapper = paceResult.wrapper
// all commands from here go through the wrapper

// Phase 2: SELECT AID1 before PACE — chip requires AID1 context for EDATA/GenPKI
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

iOS automatically pre-selects the first AID from the `select-identifiers` list in `Info.plist` on connection. If the ICAO AID is listed first, the session starts in ICAO context — but PACE does not work in ICAO context (MSE SET AT returns SW=6985).

The fix: an explicit SELECT MF before PACE moves the session from ICAO context into MF context, replicating the Android starting state.

```swift
// Phase 1: iOS connects into ICAO context (ICAO AID is first in Info.plist)
// PACE does not work in ICAO context — SELECT MF before PACE
let selectMF = NFCISO7816APDU(instructionClass: 0x00, instructionCode: 0xA4,
                               p1Parameter: 0x00, p2Parameter: 0x0C,
                               data: Data([0x3F, 0x00]), expectedResponseLength: -1)
_ = try await tag.sendCommand(apdu: selectMF)
// PACE now works — MF context, same as Android

// Phase 2: SELECT AID1 before PACE — same behaviour as Android
```

</TabItem>
</Tabs>

The asymmetric pre-PACE preparation behaviour is not documented anywhere — it was discovered by elimination on both platforms.

---

## Data Formats: Where the Romanian Implementation Diverges

### DG1 Is Not MRZ

This is where code that works perfectly for passports breaks completely, on both platforms. The identity data returned by the EDATA applet is not in the MRZ format that standard ICAO libraries parse — it is in a Romanian implementation-specific ASN.1 format, with correctly encoded diacritics and differently structured fields:

```
SEQUENCE (0x30)
  [0] (0x80)  lastName     UTF-8  e.g. "TOMA"
  [1] (0x81)  firstName    UTF-8  e.g. "CĂTĂLIN"  (diacritics preserved)
  [2] (0x82)  sex          UTF-8  "M" or "F"
  [3] (0x83)  dateOfBirth  UTF-8  DDMMYYYY
  [4] (0x84)  cnp          UTF-8  13 digits
  [5] (0x85)  nationality  UTF-8  "ROU"
```

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

jMRTD's `DG1File` cannot parse this format. A custom parser is required:

```kotlin
// jMRTD won't help here — Romanian-specific ASN.1 format
val tags = parseContextTags(dg1Bytes) // custom parser
val lastName  = tags[0x80]?.toString(Charsets.UTF_8)
val firstName = tags[0x81]?.toString(Charsets.UTF_8) // diacritics are correct
val cnp       = tags[0x84]?.toString(Charsets.UTF_8)
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

No iOS library parses this format either. The same custom ASN.1 parser is needed:

```swift
// no iOS library parses this format
let tags = parseContextTags(dg1Bytes) // custom parser
let lastName  = tags[0x80].flatMap { String(data: $0, encoding: .utf8) }
let firstName = tags[0x81].flatMap { String(data: $0, encoding: .utf8) } // diacritics are correct
let cnp       = tags[0x84].flatMap { String(data: $0, encoding: .utf8) }
```

</TabItem>
</Tabs>

The format is not publicly documented — it was determined by direct inspection of bytes returned by the card.

### The Two Cryptographic Keys in GenPKI

GenPKI contains two distinct keys, on different elliptic curves, with different internal signing behaviours:

| Operation | PIN | Internal behaviour |
|-----------|-----|-------------------|
| Active authentication | 4 digits | Key on secp384r1, reference 0x81 |
| Document signing | 6 digits | Key on brainpoolP384r1, reference 0x8E |

Confusing them produces an incorrect signature with no error message indicating the cause. The behaviour is identical on Android and iOS — this is a chip constraint, not a platform one.

---

## Things That Break Before You Reach Business Logic

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

**The cryptographic provider** must be explicitly registered in the correct order before any chip operation. Wrong order produces silent failures:

```kotlin
Security.removeProvider("BC")
Security.insertProviderAt(BouncyCastleProvider(), 1)
```

**Android 13+** changed the API for NFC tag interception. If you support older Android versions, you handle two variants with slightly different behaviour.

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

**Entitlements:** the NFC session requires both `TAG` and `PACE` formats in the `.entitlements` file. If `PACE` is missing, the session starts but PACE fails without a clear error message.

**`Info.plist`** must include `NFCReaderUsageDescription` and the `select-identifiers` list with at least the ICAO AID (`A0000002471001`) — otherwise iOS will not deliver the tag to the app.

</TabItem>
</Tabs>

**PIN counter query does not work** in SM mode, on either platform. There is no way to query remaining attempts before sending the actual PIN. You handle `SW=63CX` in the VERIFY response (X = attempts remaining) and `SW=6983` for a blocked card — a detail that directly affects application UX.

---

*We write about the Romanian CEI — its capabilities, its integration challenges, and the regulatory context around it. If a topic here is relevant to something you're building, feel free to [reach out](mailto:hello@eidkit.ro).*
