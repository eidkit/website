---
title: EidKit SSO Integration
sidebar_position: 1
---

# EidKit SSO Integration

EidKit SSO is a standard OIDC identity provider. You integrate it exactly like Google Sign-In or Apple Sign-In — a Client ID, a Client Secret, a redirect URI.

## What you get

- **Client ID** and **Client Secret** — issued by EidKit
- **Issuer URL**: `https://idp.eidkit.ro`
- OIDC autodiscovery at `https://idp.eidkit.ro/.well-known/openid-configuration`
- Cryptographically verified data from MAI — not self-reported by the user

Contact [hello@eidkit.ro](mailto:hello@eidkit.ro) to configure your client.

---

## Available scopes

| Scope | Data returned |
|-------|--------------|
| `openid` | `sub` — stable pseudonym (SHA-256 of CNP, not the raw CNP) |
| `profile` | `name`, `given_name`, `family_name`, `birthdate` |
| `address` | `address.formatted` — MAI-verified address, not self-declared |
| `cei:document` | Number, series, expiry date, issuing authority |
| `cei:cnp` | CNP extracted server-side from verified DG1 — not from the app payload |
| `cei:picture` | Face photo (JPEG base64, ~33KB) |
| `cei:signature` | Handwritten signature image (JPEG base64, ~3.5KB) |

Most clients only need `openid profile`. Images are opt-in for specific use cases (e.g. insurance, HR).

---

## Registration and login — the same flow

There is no difference between login and registration. The `sub` in the JWT is a stable, unique pseudonym per person. The first card tap creates the account automatically.

```javascript
const { sub, name, given_name, family_name, address } = jwtPayload;

let user = await db.users.findOne({ eidkitSub: sub });

if (!user) {
  // First authentication = automatic registration
  user = await db.users.create({
    eidkitSub:   sub,
    name:        name,
    givenName:   given_name,
    familyName:  family_name,
    address:     address?.formatted,
    createdAt:   new Date(),
  });
}

// Subsequent authentications = login with the same sub
await session.create({ userId: user.id });
```

---

## JWT verification without network calls

After initial setup, token signatures can be verified locally using the public JWKS — no call to EidKit per request:

```
GET https://idp.eidkit.ro/.well-known/jwks.json
```

Cache the public keys and verify the JWT signature locally on every request.

---

## Example JWT — typical scopes (`openid profile address`)

```json
{
  "sub": "a3f7bc9d...",
  "name": "CĂTĂLIN TOMA",
  "given_name": "CĂTĂLIN",
  "family_name": "TOMA",
  "birthdate": "1985-03-15",
  "address": {
    "formatted": "Str. Exemplu Nr. 1, Timișoara, Timiș"
  },
  "iss": "https://idp.eidkit.ro",
  "aud": "your-client-id"
}
```

---

## Session management

EidKit issues an ID token once — there are no refresh tokens in the standard configuration. You manage the user session with your own cookie or server-side session. If you need re-verification (high-security flows), the user taps their card again.

:::info Tokens
Use the **ID token** — it contains everything you need. The access token has no EidKit API to use it against.
:::

---

## Security guarantees

Unlike a traditional OIDC provider that issues tokens on the basis of a password, EidKit SSO will not issue any token unless all of the following verifications pass:

| Check | What it proves |
|---|---|
| DSC chain → MAI CSCA | The identity card was issued by the Romanian state |
| DG1 hash from SOD | The identity data (including CNP) has not been modified since MAI signed it |
| DG14 hash from SOD | The chip's public key (Q_chip) was signed by MAI — cannot be substituted |
| Chip ECDSA signature | The physical card was present — cannot be forged without the chip |
| Server-side challenge | The signature is fresh — cannot be replayed |
| CE81 chain → MAI GenPKI Sub-CA | The chip's authentication key was issued by MAI |
| CA binding (ECDH, BSI TR-03110) | The chip that signed CE81 holds exactly the Q_chip key from the identity — split-proof attack is impossible |

**PIN proof:** Active Authentication on the CEI chip requires verification of the 4-digit auth PIN before CE81 can sign the challenge. A valid AA signature implies the user knows the PIN of the physical card.

The server extracts the CNP directly from verified DG1 bytes — it does not accept the CNP from the app payload.
