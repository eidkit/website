---
slug: kyc-igaming-romania-carte-electronica-identitate
title: "Identity Verification in Romanian iGaming After CEI: What ONJN Operators Need to Know in 2026"
authors: [catalin]
date: 2026-05-30
tags: [cei, kyc, igaming, onjn, identity, romania, nfc, gambling]
description: >
  Romania's new electronic identity card fundamentally changes the KYC flow for ONJN-licensed operators. The address no longer appears on the physical card, video KYC has structural limits, and the chip offers something no other solution can: cryptographically MAI-verified identity at every authentication.
image: /img/blog/igaming-kyc-og.png
keywords:
  - kyc igaming romania 2026
  - identity verification onjn cei
  - electronic identity card gambling operators
  - kyc nfc romania
  - address verification cei gambling
  - bonus abuse verified identity
---

Romania's online gambling market is one of the most regulated in Europe. ONJN has issued over 50 Class I licenses, the channelization rate exceeds 90%, and the fines and license revocations of the past year show the regulator is watching closely.

Since July 2025, every Romanian citizen requesting an identity document receives an Electronic Identity Card (CEI) with an NFC chip. This transition changes one concrete thing in the KYC flow of any ONJN-licensed operator — and not all operators are prepared.

---

## What Has Actually Changed

The old identity card printed the home address on the back. Operators could photograph the document, extract the address via OCR, and use it for the address verification required in the CDD process.

The new CEI no longer prints the address on the front or back. The address exists exclusively on the electronic chip, in the EDATA applet, protected by an encrypted channel and the holder's PIN.

The practical consequence: **the classic "photograph the document, extract address via OCR" flow no longer works for any user with a CEI.**

And the number of these users grows every day. The government has issued [over 1.8 million CEIs](https://carteadeidentitate.gov.ro/despre/) so far, with 1.1 million old cards expiring in 2025 alone. By end of 2026, the majority of active users on Romanian iGaming platforms will hold a CEI as their only valid identity document.

---

## The Bonus Abuse Problem — a Vector the CEI Closes

One of the most costly problems for operators is multi-accounting: the same user creating multiple accounts to exploit welcome bonuses, reload offers, and promotions.

Current solutions — email verification, phone number, IP — are easy to circumvent. Video KYC adds friction, but with deepfakes commercially available, it no longer offers the guarantees it did three years ago.

The CEI changes the equation at a fundamental level: **one physical card, issued by MAI, cryptographically tied to a single identity.** There are no two people with the same CEI. There is no virtual or software-generated CEI. The chip contains a hardware-stored private key that cannot be exported or cloned.

An operator that ties the account to the CEI chip — not to a CNP, not to an email, but to the physical chip — essentially eliminates multi-accounting for all users with CEI.

---

## Video KYC: What It Can and Cannot Do

Current video KYC solutions (Sumsub, Veriff, Onfido, Didit, Qoobiss) work by photographing the document and performing biometric face verification. They are solid solutions for what they do.

But they have structural limits that cannot be resolved through product improvements:

**eIDAS assurance level.** Video KYC with OCR on a document photo reaches at most Substantial level. The CEI chip with active authentication (PACE + PA + AA) represents the High level — cryptographic proof that the document is authentic, that the chip is not cloned, and that the user physically holds the card.

**Home address.** Video KYC cannot extract the address from a CEI because it does not read the chip. No video KYC provider can access the EDATA applet. The address must be obtained through other means — a separate attestation, direct DGEP access (available to banks, not everyone), or asking the user to declare it manually.

**Deepfake resistance.** Authentication with the CEI chip involves no biometrics or video. The user enters the CAN printed on the card and the PIN set at MAI, then touches the card to the phone. There is no attack surface for deepfakes or image synthesis.

---

## What ONJN Requires and Where CEI Sits

Law 129/2019 and ONJN regulations impose clear identification and identity verification obligations on operators for players, including home address verification.

The self-exclusion platform — which ONJN and ICI Bucharest are modernizing through a protocol signed in February 2026 — will use identity card verification, not video KYC. The regulator's signal is clear: the direction is toward document-based identification, not selfie and OCR.

An operator integrating CEI authentication is not just making a technical upgrade. It's getting ahead of future ONJN requirements.

---

## What Integration Looks Like in Practice

EidKit exposes a standard OIDC SSO — the same protocol as "Sign in with Google," implementable in a few hours by any development team.

The user flow:
1. A QR code appears on the operator's site
2. The user opens the EidKit app on their phone and scans the QR code
3. Enters the CAN (6 digits printed on the card) and PIN (4 digits, set at MAI)
4. Touches the card to the phone — complete authentication in under 15 seconds

The server receives:
- Name and surname cryptographically verified by MAI
- CNP cryptographically verified by MAI
- Home address extracted from the chip (not self-declared)
- Proof that the chip is authentic and not cloned (Active Authentication)
- Proof that the user physically holds the card and knows the PIN

Every subsequent authentication — not just onboarding — produces the same guarantees. No session hijacking, no account takeover via password reset, no credential theft.

---

## Cost Per Verification

Video KYC solutions cost between $0.33 (Didit) and $1.85 (Sumsub Compliance) per successful verification. An operator with 10,000 new registrations per month pays between $3,300 and $18,500 monthly just for initial KYC.

EidKit SSO costs [€0.25 per successful authentication](https://eidkit.ro/en/pricing) — with a higher assurance level and verified address included. For recurring authentications — repeated logins of the same user — the cost is identical, making the model favorable for operators with frequently active users.

---

## The CEI Adoption Timeline

Some concrete milestones:

- **July 2025**: CEI becomes the only type of identity document issued in Romania
- **August 2025**: CEI can be requested at any SPCLEP in the country, regardless of domicile
- **End of 2025**: 1.1 million old cards expire
- **December 2026**: eIDAS 2.0 deadline for the European digital identity wallet
- **2027**: regulated private operators will be required to accept the EUDI wallet

Every month that passes increases the percentage of iGaming platform users who hold a CEI as their only valid identity document.

---

If you're an ONJN operator or building for the Romanian iGaming market and want to discuss what a concrete integration looks like, [write to us](mailto:hello@eidkit.ro?subject=EidKit%20iGaming). First integrations benefit from our [pilot program](https://eidkit.ro/en/pricing).
