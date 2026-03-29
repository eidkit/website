---
slug: integrating-romanian-id-card-nfc-android
title: "What It Actually Takes to Integrate the Romanian ID Card Over NFC"
authors: [catalin]
date: 2026-03-29
tags: [cei, nfc, android, kotlin, pace, technical]
description: >
  The Romanian electronic identity card has four distinct applets, two authentication phases, and data formats specific to the Romanian implementation that appear in no complete public documentation. An honest assessment of what a correct integration involves.
image: /img/blog/en/nfc-technical-og-en.png
keywords:
  - Romanian ID card NFC integration Android
  - CEI NFC Kotlin Android SDK
  - PACE protocol Romanian eID
  - jMRTD Romanian CEI
  - read personal data CEI NFC
  - CEI EDATA applet Android
---

*This is the third article in our series on Romania's electronic identity card. The previous articles cover [the address problem that's quietly breaking KYC flows](/blog/romanian-id-card-address-problem) and [what your electronic ID card can and can't sign](/blog/romania-electronic-signature-law-2024-cei).*

If you have integrated an electronic passport or another chip-based identity document before, you will enter this project with a reasonable set of assumptions. Most of them are partially wrong for the Romanian CEI.

It is not that the ICAO standards do not apply — they do, as a starting point. The problem is that the CEI is a national identity card with country-specific extensions that appear nowhere in complete public documentation. What follows is a map of the terrain based on a completed spike on a Pixel 8 with a real Romanian CEI card — a spike that took considerably longer than expected, not because the problem is theoretically complex, but because every reasonable assumption had to be verified through direct testing.

---

## What You Already Know — and What Still Applies

Any ICAO-based electronic identity card uses **PACE** (Password Authenticated Connection Establishment) to establish a secure channel before any data can be read. The CEI does the same, using the CAN code — 6 digits printed on the front of the card — as the password.

The result of PACE is a Secure Messaging (SM) channel that wraps all subsequent APDU commands. Any command sent raw after the channel is established is rejected by the card — standard behaviour, not specific to the CEI.

The library that handles PACE on Android is **jMRTD** — the same one you would use for passports. Passive authentication works on familiar principles: the chip contains a Security Object Document that chains SHA-256 hashes of the data groups up to MAI's CSCA root certificate, bundled with the SDK:

```kotlin
val sod = SODFile(sodRaw.inputStream())
val dsc = sod.docSigningCertificate
val csca = assets.open("csca_romania.der").use {
    CertificateFactory.getInstance("X.509").generateCertificate(it) as X509Certificate
}
dsc.verify(csca.publicKey) // throws if invalid
```

Passive authentication must always run before trusting any data read from the card. An engineer with ICAO document experience will be comfortable up to this point. This is roughly where the familiar terrain ends.

---

## Where the Assumptions Start to Break

### The Chip Has Four Applets, Not One

Standard ICAO travel documents have a relatively predictable applet structure. The CEI does not follow the same pattern. The chip contains four applets with distinct roles:

| Applet | Role |
|--------|------|
| AID1 / National App | PACE entry point, hosts security parameters |
| GenPKI | Keys and certificates for active authentication and signing |
| ESIGN | Present on the card — not used in practice |
| EDATA | Personal data: name, CNP, address, photo |

The ESIGN applet exists on the chip and appears in some reference documents. It is not used. Signing goes through GenPKI, via a command different from what you would assume from reading the standards. This was one of the first things that surprised us and cost considerable time to clarify.

Each applet follows its own selection and authentication flow. You do not select an applet and read what you need.

### Two Phases, Different Requirements

Reading data from the CEI splits naturally into two phases:

**Phase 1 — CAN only:** accesses data available without a PIN — the holder's photo, the digitised handwritten signature, and the data needed for passive authentication. This phase uses the standard ICAO applet.

**Phase 2 — CAN + 4-digit PIN:** accesses the full personal data from the EDATA applet, including the home address — which is no longer printed on the physical card.

### The Order of Operations Before PACE Is Not Documented — and Matters

This is the problem that cost the most time. What you must do *before* PACE depends on what you want to do *after* PACE, and the rules are asymmetric depending on the usage scenario.

Phase 1 requires different preparation from Phase 2 and GenPKI. If the preparation is wrong for the given scenario, failures appear at unexpected points with error codes that do not indicate the real problem. There is no explanation for this asymmetry in any public documentation — it was discovered by elimination.

The general shape of a correct flow looks roughly like this:

```kotlin
// [scenario-specific preparation — different for Phase 1 vs Phase 2/GenPKI]

isoDep.timeout = 20000 // default timeout is insufficient

// PACE with CAN — establishes SM channel
val paceResult = ps.doPACE(canKey, paceOid, paceParams, null)
val wrapper = paceResult.wrapper

// all commands from here go through the wrapper
// wrapper.wrap(command) → cs.transmit() → wrapper.unwrap(response)

// [SELECT destination applet via wrapper]
// [VERIFY PIN via wrapper — if the scenario requires it]
// [SELECT FILE + READ BINARY in a loop via wrapper]
```

Loop, because in SM mode the card does not return all data in a single call — it returns chunks, and you are responsible for knowing when you have finished reading.

---

## Data Formats: Where the Romanian Implementation Diverges

### DG1 Is Not MRZ

This is where code that works perfectly for passports breaks completely. The identity data returned by the EDATA applet is not in the MRZ format that standard ICAO libraries parse — it is in a Romanian implementation-specific ASN.1 format, with correctly encoded diacritics and differently structured fields.

You need to write a custom parser. The format is not publicly documented — it was determined by direct inspection of bytes returned by the card.

### The Two Cryptographic Keys in GenPKI

GenPKI contains two distinct keys, on different elliptic curves, with different internal signing behaviours:

| Operation | PIN | Internal behaviour |
|-----------|-----|-------------------|
| Active authentication | 4 digits | Key on secp384r1, reference 0x81 |
| Document signing | 6 digits | Key on brainpoolP384r1, reference 0x8E |

The two keys have different behaviours at the protocol level. Confusing them produces an incorrect signature with no error message indicating the cause.

---

## Things That Break Before You Reach Business Logic

**The cryptographic provider** must be explicitly registered before any chip operation. Registration order matters and produces silent failures if wrong:

```kotlin
Security.removeProvider("BC")
Security.insertProviderAt(BouncyCastleProvider(), 1)
```

**Android 13+** changed the API for NFC tag interception. If you support older Android versions, you handle two variants with slightly different behaviour.

**PIN counter query does not work** in SM mode. There is no way to query remaining attempts before sending the actual PIN. You handle `SW=63CX` in the VERIFY response (X = attempts remaining) and `SW=6983` for a blocked card. This is a detail that directly affects application UX and appears mentioned nowhere.

**The PACE library parameters** matter exactly. The correct initialisation values were confirmed through testing; others produce PACE failures with no error message indicating the cause.

---

## What Required Direct Card Verification

Things that do not appear in public documentation and had to be discovered through testing:

- The asymmetric pre-PACE preparation behaviour depending on scenario
- Which applet is actually used for signing (not the one implied by its name)
- The Romanian implementation-specific data format for personal data
- The difference in internal behaviour between the two GenPKI keys
- The exact PACE library parameters that work with this card
- PIN counter query limitations in SM mode

The official MAI desktop middleware does not work with all issued cards — which means that even access to a standard card reader does not guarantee a working reference point from which to start.

Each of the points above represents real time lost if discovered independently. And there is no way to know in advance how many such details exist.

---

*We write about the Romanian CEI — its capabilities, its integration challenges, and the regulatory context around it. If a topic here is relevant to something you're building, feel free to [reach out](mailto:hello@eidkit.ro).*
