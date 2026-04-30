---
id: chip-auth
title: Autentificare prin cip
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Autentificare prin cip

Chip Authentication (CA, BSI TR-03110) leagă criptografic identitatea MAI-semnată de cipul fizic al cardului. Este obligatorie pentru orice flux de verificare server-side.

## De ce este necesară

Autentificarea pasivă dovedește că datele au fost semnate de MAI. Autentificarea activă (AA) dovedește că cipul poate semna un challenge. Dar cele două verificări sunt independente.

**Vectorul de atac fără CA:** un atacator care cunoaște CAN-ul victimei poate citi datele ICAO (SOD + DG1) fără PIN — CAN-ul este vizibil pe fața cardului, iar aceste fișiere sunt accesibile fără autentificare. Atacatorul poate apoi folosi propriul chip și propriul PIN pentru semnătura AA. Un backend care verifică doar pasiv + activ vede ambele lanțuri valide și nu poate distinge atacatorul de victimă.

**CA închide atacul:** serverul efectuează un schimb ECDH cu cheia publică `Q_chip` din DG14 — semnat de MAI și acoperit de SOD. Numai cipul care deține cheia privată corespunzătoare `d_chip` poate produce secretul partajat corect. Identitatea și cipul fizic nu pot fi separate.

## Activare

CA partajează sesiunea PACE cu citirea datelor personale — `withPersonalData(pin:)` trebuie apelat și el.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = canIntrodusDeutilizator)
    .withPersonalData(pin = pinIntrodusDeutilizator)
    .withActiveAuth()
    .withChipAuth()
    .read(isoDep)

val proof = result.claim?.chipAuthProof
// Trimite proof la backend împreună cu restul claim-ului
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKitSdk.reader(can: canIntrodusDeutilizator)
    .withPersonalData(pin: pinIntrodusDeutilizator)
    .withActiveAuth()
    .withChipAuth()
    .read()

let proof = result.claim?.chipAuthProof
// Trimite proof la backend împreună cu restul claim-ului
```

</TabItem>
</Tabs>

## Materialul criptografic

`chipAuthProof` conține tot ce are nevoie backend-ul pentru verificare independentă:

| Câmp | Descriere |
|------|-----------|
| `terminalPublicKey` | Cheia publică efemeră a terminalului — 65 bytes, punct necomprimat |
| `ephemeralPrivateKey` | Cheia privată efemeră — 32 bytes; folosită o singură dată, sigur de trimis propriului server |
| `sharedSecretX` | Coordonata X a secretului partajat ECDH — 32 bytes |
| `rawDg14` | Bytes-urile brute DG14 — conține `Q_chip`, acoperit de hash-ul SOD semnat de MAI |

## Verificare server-side

Serverul recomputează `K_ca = ECDH(d_terminal, Q_chip_din_DG14)` și compară cu `sharedSecretX` primit de la aplicație. Dacă se potrivesc, cipul care a semnat challenge-ul AA deține exact cheia privată corespunzătoare identității MAI-semnate.

```javascript
// Exemplu Node.js (webhook EidKit SSO)
const ecdh = crypto.createECDH('brainpoolP256r1');
ecdh.setPrivateKey(Buffer.from(caEphemeralPrivateKey, 'base64'));
const recomputed = ecdh.computeSecret(qChipFromDg14);
if (!recomputed.slice(0, 32).equals(Buffer.from(caSharedSecretX, 'base64'))) {
    throw new Error('CA binding mismatch — split-proof attack detected');
}
```

:::info Detalii complete
Toate cele 8 condiții de verificare și diagrama fluxului SSO: [Security Overview](/docs/security-overview#eidkit-sso-security--zero-trust-model).
:::
