---
id: security-overview
title: Security Overview
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EidKit — Security Overview

**Version:** 1.0 · **Date:** April 2026 · **Contact:** hello@eidkit.ro

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
| **Document signing** | Qualified ECDSA-SHA384 signature using the card's non-repudiation key — requires signing PIN |

---

## What the SDK Does NOT Do

- **Does not transmit personal data** to any external server
- **Does not store personal data** on the device — no local database, cache, or identity files
- **Does not access the camera, microphone, location, or contacts** — NFC only
- **Does not include analytics, advertising, or tracking modules**
- **Does not initiate any network connection** on its own

Data flows exclusively on-device:

```
CEI chip ──NFC──▶ EidKit SDK ──▶ Integrating app
```

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

## Auditability & Transparency

| | |
|---|---|
| **Android source code** | Available on request — hello@eidkit.ro |
| **Android demo source code** | https://github.com/eidkit/eidkit-android-demo |
| **iOS source code** | Available on request — hello@eidkit.ro |
| **iOS demo source code** | https://github.com/eidkit/eidkit-iOS-demo |
| **Maven Central** | `ro.eidkit:sdk-android` |
| **App Store (iOS)** | [EidKit on the App Store](https://apps.apple.com/us/app/eidkit-app/id6761855403) — approved by Apple |
| **Google Play (Android)** | Available on Google Play — approved by Google |

Both apps passed the Apple App Store and Google Play review process, which includes automated malware scanning and manual behavioural review.

---

## Contact

For technical questions, source code access, or a guided walkthrough of the implementation:
**[hello@eidkit.ro](mailto:hello@eidkit.ro)**
