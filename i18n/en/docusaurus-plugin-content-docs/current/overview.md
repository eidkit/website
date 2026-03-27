---
id: overview
title: Overview
sidebar_position: 1
---

# EidKit Overview

EidKit is an Android and iOS SDK for interacting with the **Romanian Electronic Identity Card (CEI)** via NFC.

## What is the Romanian CEI?

The Romanian CEI (Carte de Identitate Electronică) is a biometric identity card issued since 2021 by the Ministry of Internal Affairs (MAI). It contains a contactless chip that stores:

| Data | Access |
|------|--------|
| Basic identity (name, CNP, DOB, nationality) | Requires 4-digit auth PIN |
| Address and document info | Requires 4-digit auth PIN |
| Face photo (JPEG, ~24 KB) | Open (no PIN, ~7s) |
| Handwritten signature image (JPEG, ~2.6 KB) | Open (no PIN, ~1.5s) |
| Non-repudiation signing key | Requires 6-digit signing PIN |

All chip communication uses the **PACE** (Password Authenticated Connection Establishment) protocol, keyed on the 6-digit **CAN** (Card Access Number) printed on the front of the card.

## What EidKit does

EidKit handles everything from NFC session management to cryptographic verification:

- **PACE key establishment** — derives session keys from the CAN, opens an encrypted channel to the chip
- **Passive authentication** — verifies the data group hashes against the Document Signer Certificate and CSCA root (bundled Romanian MAI cert), confirming the card was issued by MAI and data has not been tampered with
- **KYC reading** — reads identity, personal data, photo, and signature image from the card applets
- **Document signing** — authenticates with the nonRepudiation key and produces an ECDSA-SHA384 signature over a document hash
- **Active authentication** — challenge/response with the chip's authentication key, confirming the chip is genuine and not cloned; returns raw cryptographic proof in `CeiIdentityClaim` for backend verification

## SDK entry points

| Class | Purpose |
|-------|---------|
| `EidKit` | Configure the SDK, obtain `CeiReader` and `CeiSigner` builders |
| `CeiReader` | Builder for KYC read sessions |
| `CeiSigner` | Builder for document signing sessions |

## Minimum requirements

| Platform | Minimum version |
|----------|----------------|
| Android | API 26 (Android 8.0) |
| iOS | iOS 15 |

## Next steps

- [Quickstart](/docs/quickstart)
