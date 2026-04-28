---
title: EidKit SSO Integration
sidebar_position: 1
---

# EidKit SSO Integration

EidKit SSO is a standard OIDC identity provider. You integrate it exactly like Google Sign-In or Apple Sign-In — a Client ID, a Client Secret, a redirect URI.

## What you get

- **Client ID** and **Client Secret** — issued by EidKit
- **Issuer URL**: `https://auth.eidkit.ro/realms/eidkit`
- OIDC autodiscovery at `/.well-known/openid-configuration`
- MAI-verified data — not self-reported by the user

Contact [hello@eidkit.ro](mailto:hello@eidkit.ro) to configure your client.

---

## Available scopes

| Scope | Data returned |
|-------|--------------|
| `openid` | `sub` — stable pseudonym (SHA-256 of CNP, not the raw CNP) |
| `profile` | `name`, `given_name`, `family_name`, `birthdate` |
| `address` | `address.formatted` — MAI-verified address, not self-declared |
| `cei:document` | Number, series, expiry date, issuing authority |
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

After initial setup, token signatures can be verified locally using Keycloak's public JWKS — no call to EidKit per request:

```
GET https://auth.eidkit.ro/realms/eidkit/protocol/openid-connect/certs
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
  "iss": "https://auth.eidkit.ro/realms/eidkit",
  "aud": "your-client-id"
}
```

---

## Session management

EidKit issues an ID token once — there are no refresh tokens in the standard configuration. You manage the user session with your own cookie or server-side session. If you need re-verification (high-security flows), the user taps their card again.

:::info Tokens
Use the **ID token** — it contains everything you need. The access token has no EidKit API to use it against.
:::
