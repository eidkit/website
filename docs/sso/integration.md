---
title: Integrare EidKit SSO
sidebar_position: 1
---

# Integrare EidKit SSO

EidKit SSO este un identity provider OIDC standard. Îl integrezi exact ca Google Sign-In sau Apple Sign-In — un Client ID, un Client Secret, un redirect URI.

## Obținerea credențialelor

Credențialele se obțin instant prin [Portalul Dezvoltatori](https://dashboard.eidkit.ro) — fără formulare, fără email.

**Ce ai nevoie:**
- Buletin electronic CEI (cartea de identitate cu cip NFC)
- Aplicația [EidKit](https://eidkit.ro) instalată pe telefon

**Pași:**
1. Accesează [dashboard.eidkit.ro](https://dashboard.eidkit.ro)
2. Apasă **„Înregistrează aplicația cu buletinul electronic"**
3. Scanează codul QR cu aplicația EidKit și atinge buletinul
4. Copiază `client_id` și `client_secret` — secretul este afișat o singură dată

:::info Ai nevoie de buletin electronic
Autentificarea cu CEI este necesară atât pentru înregistrarea în portal, cât și pentru testarea integrației tale. Dacă nu ai încă un buletin electronic, contactează [hello@eidkit.ro](mailto:hello@eidkit.ro).
:::

## Ce primești

- **Client ID** și **Client Secret** — generate instant
- **Issuer URL**: `https://idp.eidkit.ro`
- Autodiscovery OIDC la `https://idp.eidkit.ro/.well-known/openid-configuration`
- Date verificate criptografic de MAI — nu auto-declarate de utilizator

---

## Scopuri disponibile

| Scope | Date returnate |
|-------|---------------|
| `openid` | `sub` — pseudonim stabil (SHA-256 al CNP, nu CNP-ul brut) |
| `profile` | `name`, `given_name`, `family_name`, `birthdate` |
| `address` | `address.formatted` — adresă verificată MAI, nu auto-declarată |
| `cei:document` | Număr, serie, dată expirare, autoritate emitentă |
| `cei:cnp` | CNP extras server-side din DG1 verificat — nu din payload-ul aplicației |
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

După setup inițial, semnăturile token-urilor pot fi verificate local folosind JWKS-ul public — fără niciun apel către EidKit per request:

```
GET https://idp.eidkit.ro/.well-known/jwks.json
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
  "iss": "https://idp.eidkit.ro",
  "aud": "client-id-ul-tau"
}
```

---

## Gestionarea sesiunii

EidKit emite un ID token o singură dată — nu există refresh tokens în configurația standard. Tu gestionezi sesiunea utilizatorului cu propriul cookie sau sesiune server-side. Dacă ai nevoie de re-verificare (fluxuri de securitate ridicată), utilizatorul atinge cardul din nou.

:::info Token-uri
Folosește **ID token-ul** — conține tot ce ai nevoie. Access token-ul nu are un API EidKit împotriva căruia să-l folosești.
:::

---

## Garanții de securitate

Spre deosebire de un provider OIDC clasic care emite token-uri pe baza unei parole, EidKit SSO nu emite niciun token dacă oricare din verificările de mai jos eșuează:

| Verificare | Ce garantează |
|---|---|
| Lanț DSC → CSCA MAI | Cartea de identitate a fost emisă de statul român |
| Hash DG1 din SOD | Identitatea (inclusiv CNP-ul) nu a fost modificată după semnarea de MAI |
| Hash DG14 din SOD | Cheia publică a cipului (Q_chip) a fost semnată de MAI — nu poate fi substituită |
| Semnătură ECDSA a cipului | Cardul fizic a fost prezent — nu se poate falsifica fără cip |
| Challenge server-side | Semnătura este proaspătă — nu poate fi refolosită (anti-replay) |
| Lanț CE81 → MAI GenPKI Sub-CA | Cheia de autentificare a cipului a fost emisă de MAI |
| Legătură CA (ECDH, BSI TR-03110) | Cipul care a semnat CE81 deține exact cheia Q_chip din identitate — atacul de separare a dovezilor este imposibil |

**Proba de PIN:** Autentificarea activă pe cipul CEI necesită verificarea PIN-ului de autentificare (4 cifre) înainte ca cheia CE81 să poată semna challenge-ul. Semnătura AA în token implică că utilizatorul cunoaște PIN-ul cardului fizic.

Serverul extrage CNP-ul direct din bytes-urile DG1 verificate — nu îl acceptă din payload-ul aplicației.
