---
title: Integrare EidKit SSO
sidebar_position: 1
---

# Integrare EidKit SSO

EidKit SSO este un identity provider OIDC standard. Îl integrezi exact ca Google Sign-In sau Apple Sign-In — un Client ID, un Client Secret, un redirect URI.

## Ce primești

- **Client ID** și **Client Secret** — emise de EidKit
- **Issuer URL**: `https://auth.eidkit.ro/realms/eidkit`
- Autodiscovery OIDC la `/.well-known/openid-configuration`
- Date verificate de MAI — nu auto-declarate de utilizator

Contactează [hello@eidkit.ro](mailto:hello@eidkit.ro) pentru a-ți configura clientul.

---

## Scopuri disponibile

| Scope | Date returnate |
|-------|---------------|
| `openid` | `sub` — pseudonim stabil (SHA-256 al CNP, nu CNP-ul brut) |
| `profile` | `name`, `given_name`, `family_name`, `birthdate` |
| `address` | `address.formatted` — adresă verificată MAI, nu auto-declarată |
| `cei:document` | Număr, serie, dată expirare, autoritate emitentă |
| `cei:picture` | Fotografie față (JPEG base64, ~33KB) |
| `cei:signature` | Imagine semnătură olografă (JPEG base64, ~3.5KB) |

Majoritatea clienților au nevoie doar de `openid profile`. Imaginile sunt opt-in pentru cazuri specifice (ex. asigurări, HR).

---

## Înregistrare și autentificare — același flux

Nu există diferență între login și înregistrare. `sub`-ul din JWT este un pseudonim stabil și unic per persoană. Prima atingere a cardului creează contul automat.

```javascript
const { sub, name, given_name, family_name, address } = jwtPayload;

let user = await db.users.findOne({ eidkitSub: sub });

if (!user) {
  // Prima autentificare = înregistrare automată
  user = await db.users.create({
    eidkitSub:   sub,
    name:        name,
    givenName:   given_name,
    familyName:  family_name,
    address:     address?.formatted,
    createdAt:   new Date(),
  });
}

// Autentificările ulterioare = login cu același sub
await session.create({ userId: user.id });
```

---

## Verificare JWT fără apeluri de rețea

După setup inițial, semnăturile token-urilor pot fi verificate local folosind JWKS-ul public Keycloak — fără niciun apel către EidKit per request:

```
GET https://auth.eidkit.ro/realms/eidkit/protocol/openid-connect/certs
```

Cachează cheile publice și verifică semnătura JWT local la fiecare request.

---

## Exemplu JWT — scopes tipice (`openid profile address`)

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
  "aud": "client-id-ul-tau"
}
```

---

## Gestionarea sesiunii

EidKit emite un ID token o singură dată — nu există refresh tokens în configurația standard. Tu gestionezi sesiunea utilizatorului cu propriul cookie sau sesiune server-side. Dacă ai nevoie de re-verificare (fluxuri de securitate ridicată), utilizatorul atinge cardul din nou.

:::info Token-uri
Folosește **ID token-ul** — conține tot ce ai nevoie. Access token-ul nu are un API EidKit împotriva căruia să-l folosești.
:::
