---
slug: electronic-id-authentication-zero-trust
title: "Authenticating with the Romanian ID Card. Why Two Correct Checks Can Still Be Insufficient."
authors: [catalin]
date: 2026-05-05
tags: [cei, security, authentication, sso, chip-authentication, zero-trust]
description: >
  Passive authentication proves the data was signed by MAI. Active authentication proves the chip can sign a challenge. But the two checks are independent — and that opens a real attack vector. Here is what genuinely secure CEI authentication looks like.
image: /img/blog/zero-trust-sso-og.png

keywords:
  - Romanian ID card authentication security
  - CEI active passive authentication
  - chip authentication CEI Android
  - SSO Romanian electronic ID
  - zero trust authentication CEI
  - split proof attack eID
---

When an engineer integrates CEI reading for the first time and sees that passive authentication verifies data against the MAI certificate while active authentication confirms the chip can sign a challenge, the natural conclusion is that everything is in order. Two independent checks, both passing, so the card is genuine and the data is correct.

The conclusion is reasonable. It is wrong.

---

## The Two Checks and What Each Actually Proves

**Passive authentication** verifies data integrity. The Security Object Document on the card contains SHA-256 hashes of the data groups, signed with MAI's Document Signer certificate, verified against the Ministry's CSCA root. If the check passes, you know the data has not been modified since issuance and that MAI signed it.

**Active authentication** verifies that the chip holds a private key. The server sends a 48-byte challenge, the chip signs it with its authentication private key, the server verifies the signature against the certificate on the card. If the check passes, you know someone with access to a functional chip responded correctly.

The problem is that the two checks are **independent**. Passive verifies the data. Active verifies the chip. But neither verifies that the data and the chip belong to the same physical card.

---

## The Attack Vector: Split-Proof

Here is the concrete scenario.

The CAN code is printed on the front of the identity card. Anyone who holds the card for a few seconds can read it — at a queue, at a counter, during a routine check. The CAN is not a secret in the traditional sense; it is an access identifier for the NFC channel.

With the victim's CAN, an attacker can establish a PACE channel with the card and read the ICAO files that do not require a PIN — the SOD and data from the standard applet. This includes the MAI-signed hashes and, depending on configuration, basic data. Passive authentication of this data will pass on any backend.

The attacker now uses **their own card** for active authentication. They forward the server's challenge to their own chip, receive a valid signature against their own certificate.

A backend that verifies passive and active **separately** sees two valid chains. It cannot distinguish the attacker from the legitimate holder — because it never verified that the MAI data and the chip that signed the challenge are the same physical object.

---

## Chip Authentication: The Cryptographic Binding Between Data and Chip

Chip Authentication (CA, standardised in BSI TR-03110) solves exactly this problem.

The card contains in DG14 a public key `Q_chip` — specific to this chip, covered by the SOD hash signed by MAI. Chip Authentication performs an ECDH exchange between an ephemeral terminal key and `Q_chip`. Only the chip that holds the corresponding private key `d_chip` can produce the correct shared secret.

The server recomputes the exchange and compares:

```javascript
// Server-side verification (Node.js)
const ecdh = crypto.createECDH('brainpoolP256r1');
ecdh.setPrivateKey(Buffer.from(caEphemeralPrivateKey, 'base64'));
const recomputed = ecdh.computeSecret(qChipFromDg14);

if (!recomputed.slice(0, 32).equals(Buffer.from(caSharedSecretX, 'base64'))) {
    throw new Error('CA binding mismatch — split-proof attack detected');
}
```

If the comparison fails, someone presented the victim's MAI-signed data with their own chip. The attack is detected.

If it passes, the data from the card and the chip that responded to the challenge are cryptographically bound — because `Q_chip` is signed by MAI in the SOD, and the ECDH confirms that the physical chip holds the corresponding private key.

---

## What Zero Trust Means in the Context of CEI

A correct CEI authentication flow enforces three conditions simultaneously:

**The data is signed by MAI** — passive authentication against the CSCA root.

**The chip is genuine** — active authentication proves the chip can sign a challenge with its own private key.

**The data and the chip are the same physical object** — Chip Authentication binds `Q_chip` from DG14 (signed by MAI) to the chip that performed the ECDH.

Without all three, you cannot issue an authentication token with complete cryptographic guarantee. Without CA in particular, a system that verifies passive and active separately has a real, exploitable attack vector — not a theoretical one.

:::caution Active authentication alone is not sufficient
A backend that verifies AA without CA knows that someone responded to a challenge with a functional chip. It does not know that the chip contains the identity that was presented. The two must be verified together.
:::

---

## EidKit SSO: Standard OIDC, Zero Trust on CEI

EidKit SSO is a standard OIDC identity provider — the same protocol as Google Sign-In or GitHub OAuth. Client ID, Client Secret, redirect URI. If you have ever integrated an OAuth provider, you already know everything you need technically.

```javascript
// JWT received after successful authentication
{
  "sub": "a3f7bc9d...",          // stable pseudonym per person, not the raw CNP
  "name": "CĂTĂLIN TOMA",
  "given_name": "CĂTĂLIN",
  "family_name": "TOMA",
  "birthdate": "1985-03-15",
  "address": {
    "formatted": "Str. Exemplu Nr. 1, Timișoara, Timiș"
  }
}
```

The data is not self-declared by the user — it comes directly from the CEI chip, verified by MAI. The home address is included, even though it no longer appears printed on the physical card.

The authentication flow implements all three layers: passive + active + Chip Authentication. The server does not issue any token without cryptographic proof that the user holds the physical card, knows the PIN, and that the data presented and the chip are the same object.

One UX detail that simplifies integration: there is no difference between registration and login. The `sub` in the JWT is a stable, unique pseudonym per person — the first card tap creates the account automatically, with no form, no email, no password.

Integration documentation and the full security overview are available at [eidkit.ro/docs](https://eidkit.ro/docs/sso/integration).

---

*We write about the Romanian CEI — its capabilities, its integration challenges, and the regulatory context around it. If a topic here is relevant to something you're building, feel free to [reach out](mailto:hello@eidkit.ro).*
