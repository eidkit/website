---
id: security-overview
title: Security Overview
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EidKit — Security Overview

**Version:** 1.2 · **Date:** June 2026 · **Contact:** hello@eidkit.ro

---

## Executive Summary

EidKit is an SDK for Android and iOS that enables interaction with the **Romanian Electronic Identity Card (CEI)** via NFC, directly from a mobile phone.

All cryptographic operations happen exclusively on the card chip and on the user's device. **No personally identifiable information leaves the device.** The SDK implements only published international standards — no proprietary protocols. Source code is available for review on GitHub.

---

## What the SDK Does

| Feature | Description |
|---|---|
| **PACE secure session** | Encrypted channel with the card chip using the CAN number (ISO 11770-4) |
| **Passive Authentication** | Verifies data was issued by the Romanian Ministry of Internal Affairs (MAI) and has not been tampered with (ICAO 9303) |
| **Identity data reading** | Name, CNP, date of birth, address, photo, handwritten signature — requires authentication PIN |
| **Active Authentication** | Challenge-response proof that the chip is genuine and not cloned |
| **Chip Authentication** | ECDH against the static DG14 key (BSI TR-03110) — cryptographically binds the MAI-signed identity to the physical chip; opt-in, no PIN required; mandatory for SSO |
| **Document signing** | Qualified ECDSA-SHA384 signature using the card's non-repudiation key — requires signing PIN |

---

## What the SDK Does NOT Do

- **Does not transmit personal data** to any external server
- **Does not store personal data** on the device — no local database, cache, or identity files
- **Does not access the camera, microphone, location, or contacts** — NFC only
- **Does not include analytics, advertising, or tracking modules**
- **Does not initiate any network connection** on its own

Data flows exclusively on-device for KYC and signing:

```
CEI chip ──NFC──▶ EidKit SDK ──▶ Integrating app
```

**Exception — SSO flow:** Applications using EidKit SSO send cryptographic proof (hashes, chip signature, certificates) to the EidKit server (`idp.eidkit.ro`) for server-side verification. Personal data in plain text (name, address) is transmitted only if the requested scopes include it and only after all cryptographic checks pass. No network connection is made from the SDK itself — the integrating app handles the POST.

---

## Permissions

<Tabs groupId="platform">
<TabItem value="android" label="Android">

The SDK declares a single permission:

| Permission | Reason |
|---|---|
| `android.permission.NFC` | Communication with the card chip via NFC |

**The SDK does not declare the INTERNET permission.** Any network connectivity is the sole responsibility of the integrating application.

</TabItem>
<TabItem value="ios" label="iOS">

The SDK uses only the **Core NFC** capability of the iOS system, declared in the integrating app's entitlements. No network permissions or access to device personal data are required.

</TabItem>
</Tabs>

---

## Dependencies

<Tabs groupId="platform">
<TabItem value="android" label="Android">

| Library | Version | Purpose | Origin |
|---|---|---|---|
| **JMRTD** | 0.7.40 | PACE session management, passive authentication, ICAO 9303 document reading | JMRTD academic project — used in EU border control systems |
| **SCUBA** (scuba-sc-android) | 0.0.23 | Smart card I/O abstraction over Android NFC IsoDep | SCUBA project, JMRTD companion |
| **SpongyCastle** (prov) | 1.58.0.0 | Cryptographic provider — brainpoolP384r1, AES-CMAC, PACE key derivation | Android port of Bouncy Castle |
| **Bouncy Castle** (bcpkix) | 1.76 | X.509 certificate parsing and chain validation (CSCA) | The Legion of the Bouncy Castle |
| **OpenTelemetry API** | 1.40.0 | Structured telemetry API (opt-in, no data sent unless app configures an exporter) | CNCF / OpenTelemetry |
| **Kotlin Coroutines** | 1.8.1 | Async NFC session management | JetBrains |

</TabItem>
<TabItem value="ios" label="iOS">

| Library | Version | Purpose | Origin |
|---|---|---|---|
| **OpenSSL** (krzyzanowskim/OpenSSL) | 3.6.x | brainpoolP384r1 ECDH + AES-256-CMAC for PACE key derivation | OpenSSL Foundation |
| **OpenTelemetry Swift Core** | 2.3.x | Structured telemetry API (opt-in) | CNCF / OpenTelemetry |

</TabItem>
</Tabs>

All cryptographic operations use well-established, internationally audited open-source libraries. **There are no custom cryptographic implementations.**

---

## Protocols & Standards

| Protocol / Standard | Usage |
|---|---|
| **PACE** (ISO 11770-4 / ICAO 9303 Part 11) | Secure NFC session with the CEI chip |
| **Passive Authentication** (ICAO 9303 Part 11) | Data integrity verification against the MAI certificate (CSCA) |
| **Active Authentication** (ICAO 9303 Part 11) | Proof that the chip is genuine, not cloned |
| **Chip Authentication** (BSI TR-03110 CA) | Cryptographic binding between MAI-signed identity and the physical chip via ECDH (brainpoolP256r1) |
| **ECDSA-SHA384** | Digital signature using the card's non-repudiation key |
| **X.509 / CSCA** | Certificate chain validation up to the MAI root certificate |
| **PAdES / eIDAS** (EU Regulation 910/2014) | Qualified electronic signature format for PDF documents |
| **Romanian Law 214/2024** | Romanian legal framework for electronic signatures using CEI |

All protocols are published, standardized, and used in electronic authentication systems across the European Union.

---

## NFC Session Security

- **The PACE channel** is end-to-end encrypted — NFC communication cannot be intercepted without the card's CAN number
- **PINs are never stored** — used exclusively in memory during the session and discarded immediately after
- **The chip enforces hardware lockout** after a limited number of wrong PIN attempts — independent of the SDK
- **Passive Authentication always runs** — the SDK does not return any data if verification against the MAI certificate fails

---

## EidKit SSO Security — Zero Trust Model

EidKit SSO is an OIDC identity provider that issues no token unless it can cryptographically prove that:

1. **The card was issued by the Romanian state** — The DSC certificate from EF.SOD is verified against the MAI CSCA (the PKI root of the Ministry of Internal Affairs).
2. **The identity data has not been modified** — SHA-256 of the DG1 bytes (which contains the CNP) must match the hash recorded and signed in the SOD by MAI.
3. **The physical card was present** — The chip signs a 48-byte server-generated challenge (ECDSA-SHA384 with the CE81 key), using true NONEwithECDSA. The challenge is unique per session — the signature cannot be replayed.
4. **The PIN was used** — Active Authentication on the CEI chip requires the 4-digit auth PIN to be verified on-chip before CE81 can sign. A valid AA signature implies the holder knows the PIN of the physical card.
5. **The chip key was issued by MAI** — The CE81 certificate is verified against the MAI GenPKI Sub-CA. A rogue key cannot be substituted.
6. **The CNP is extracted server-side** — The server does not accept the CNP from the app payload. It extracts it from the DG1 bytes after their integrity has been verified against the SOD.
7. **DG14 is signed by MAI** — SHA-256 of the DG14 bytes (which contains the chip's public key, Q_chip) must match the hash recorded in the SOD by MAI. This binds the chip authentication key to the same signature that covers the identity data.
8. **Chip-to-identity binding is cryptographically verified** — The server generates a terminal keypair `(d_terminal, Q_terminal)` and sends GENERAL AUTHENTICATE to the chip directly via the WebSocket relay, while the card is still on the phone. The server independently recomputes `Z = ECDH(d_terminal, Q_chip_from_DG14)` and validates the chip's response. `d_terminal` never leaves the server — an attacker controlling the app cannot produce a valid Z without a real chip. This closes the forged-app attack and the split-proof attack for attackers with a **different name** (combined with the CE81 subject vs DG1 name cross-check).
9. **Card issuance date is consistent** — The CE81 certificate's `notBefore` (MAI GenPKI PKI) must correspond to the issuance date derived from the SOD-verified DG1 (expiry − 10 years). Any discrepancy — indicative of a swapped chip or tampered data — blocks authentication.

Unlike password-based or document-scan authentication systems, EidKit SSO cannot be compromised by:
- **Phishing** — the server-side challenge is unique per session; a captured session cannot be reused
- **Data forgery** — any modification to identity data invalidates the SOD hash
- **Cloned card** — the chip holds a hardware private key that cannot be extracted; physical cloning is impossible
- **Screenshot / PDF replay** — the chip signature requires real hardware, not an image
- **Split-proof attack (different name)** — CA binding + CE81 vs DG1 name cross-check make it impossible to combine a victim's ICAO data with your own chip. **Same-name residual:** requires physical access to the victim's card + same legal name + accepting detection risk (CE81 serial number is permanently logged hashed with a server secret; MAI holds the SERIALNUMBER→CNP mapping). This is a detectable insider threat, not a scalable attack vector.

```
Browser                  Phone (EidKit app)            Server (idp.eidkit.ro)
  │                              │                              │
  │── /authorize ───────────────────────────────────────────▶ │
  │◀── QR (session + nonce) ────────────────────────────────── │
  │                              │◀── QR scanned               │
  │                              │── WebSocket /v3/nfc-relay ──▶│
  │                              │── PACE with chip (NFC)      │
  │                              │   sends Ksenc/Ksmac/SSC ───▶│
  │                              │◀──────── APDU relay ────────▶│── reads DG1, DG14
  │                              │                              │── DSC chain, DG1 hash
  │                              │◀──────── APDU relay ────────▶│── CA: GENERAL AUTHENTICATE
  │                              │                              │── verifies Z = ECDH(d_terminal, Q_chip)
  │                              │── PACE session 2 + PIN ─────▶│
  │                              │◀──────── APDU relay ────────▶│── Active Authentication (CE81)
  │                              │                              │── verifies 9 conditions
  │                              │                             │── issues auth code
  │◀── polling: code ───────────────────────────────────────── │
  │── POST /token (code) ──────────────────────────────────▶  │
  │◀── ID token (JWT RS256) ──────────────────────────────── │
```

---

## Auditability & Transparency

| | |
|---|---|
| **Android source code** | Available on request — hello@eidkit.ro |
| **Android demo source code** | https://github.com/eidkit/eidkit-android-demo |
| **iOS source code** | Available on request — hello@eidkit.ro |
| **iOS demo source code** | https://github.com/eidkit/eidkit-iOS-demo |
| **Maven Central** | `ro.eidkit:sdk-android` |
| **App Store (iOS)** | [EidKit on the App Store](https://apps.apple.com/us/app/eidkit-app/id6761855403) — approved by Apple |
| **Google Play (Android)** | [EidKit on Google Play](https://play.google.com/store/apps/details?id=ro.eidkit.app) — approved by Google |

Both apps passed the Apple App Store and Google Play review process, which includes automated malware scanning and manual behavioural review.

---

## Contact

For technical questions, source code access, or a guided walkthrough of the implementation:
**[hello@eidkit.ro](mailto:hello@eidkit.ro)**
