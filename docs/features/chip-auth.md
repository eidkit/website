---
id: chip-auth
title: Autentificare prin cip
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Autentificare prin cip

Chip Authentication (CA, BSI TR-03110) leagă criptografic identitatea MAI-semnată de cipul fizic al cardului. Este obligatorie pentru orice flux de verificare server-side (SSO).

## De ce este necesară

Autentificarea pasivă dovedește că datele au fost semnate de MAI. Autentificarea activă (AA) dovedește că cipul poate semna un challenge. Dar cele două verificări sunt independente.

**Vectorul de atac fără CA:** un atacator care cunoaște CAN-ul victimei poate citi datele ICAO (SOD + DG1) fără PIN — CAN-ul este vizibil pe fața cardului, iar aceste fișiere sunt accesibile fără autentificare. Atacatorul poate apoi folosi propriul chip și propriul PIN pentru semnătura AA. Un backend care verifică doar pasiv + activ vede ambele lanțuri valide și nu poate distinge atacatorul de victimă.

**CA închide atacul:** serverul generează o pereche de chei terminale `(d_terminal, Q_terminal)` și trimite `Q_terminal` aplicației. Aplicația îl relayează cipului via GENERAL AUTHENTICATE. Serverul recomputează independent `Z = ECDH(d_terminal, Q_chip_din_DG14)` — numai cipul care deține `d_chip` poate produce același Z. `d_terminal` nu părăsește niciodată serverul.

## Activare

### Flux SSO (v2 — cheie server-side)

În fluxul SSO, CA rulează mid-sesiune NFC: SDK-ul suspendă sesiunea, trimite DG14 la server, primește `Q_terminal`, îl relayează cipului — totul cu cardul în contact cu telefonul.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val reader = EidKit.reader(can = canIntrodusDeutilizator)
    .withPersonalData(pin = pinIntrodusDeutilizator)
    .withActiveAuth()
    .withChipAuth { rawDg14 ->
        // Apelat mid-NFC, cardul stă pe telefon
        // POST la /v2/session/ca-prepare, returnează Q_terminal sau null pentru a sări CA
        postCaPrepare(sessionToken, rawDg14)
    }

val result = reader.read(isoDep)
val proof = result.claim?.chipAuthProof
// proof.serverMode == true — d_terminal a rămas pe server
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let reader = try EidKitSdk.reader(can: canIntrodusDeutilizator)
    .withPersonalData(pin: pinIntrodusDeutilizator)
    .withActiveAuth()
    .withChipAuth(onDg14Ready: { rawDg14 in
        // Apelat mid-NFC, cardul stă pe telefon
        // POST la /v2/session/ca-prepare, returnează Q_terminal sau nil pentru a sări CA
        return await postCaPrepare(sessionToken: sessionToken, rawDg14: rawDg14)
    })

let result = try await reader.read()
let proof = result.claim?.chipAuthProof
// proof.serverMode == true — d_terminal a rămas pe server
```

</TabItem>
</Tabs>

### Flux KYC (v1 — cheie locală)

Pentru verificare locală (fără SSO), SDK-ul generează perechea de chei pe dispozitiv:

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = canIntrodusDeutilizator)
    .withPersonalData(pin = pinIntrodusDeutilizator)
    .withChipAuth()
    .read(isoDep)

val proof = result.claim?.chipAuthProof
// proof.serverMode == false — cheia a fost generată local
// Trimite proof la propriul backend pentru verificare
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKitSdk.reader(can: canIntrodusDeutilizator)
    .withPersonalData(pin: pinIntrodusDeutilizator)
    .withChipAuth()
    .read()

let proof = result.claim?.chipAuthProof
// proof.serverMode == false — cheia a fost generată local
// Trimite proof la propriul backend pentru verificare
```

</TabItem>
</Tabs>

## Materialul criptografic

`chipAuthProof` conține tot ce are nevoie backend-ul pentru verificare independentă:

| Câmp | Descriere |
|------|-----------|
| `terminalPublicKey` | Cheia publică a terminalului trimisă cipului via GENERAL AUTHENTICATE — 65 bytes, punct necomprimat brainpoolP256r1 |
| `sharedSecretX` | Coordonata X a secretului partajat ECDH — 32 bytes (zeros în modul server-key v2; serverul calculează Z independent) |
| `rawDg14` | Bytes-urile brute DG14 — conține `Q_chip`, acoperit de hash-ul SOD semnat de MAI |
| `serverMode` | `true` în fluxul v2 — `d_terminal` a fost generat server-side și nu a părăsit niciodată serverul |

## Verificare server-side (v2)

În fluxul v2, serverul nu primește nicio cheie privată de la aplicație. Fluxul este:

1. **`POST /v2/session/ca-prepare`** — aplicația trimite `rawDg14` (cu cardul în contact); serverul generează `(d_terminal, Q_terminal)`, stochează `d_terminal` și DG14 în sesiune, returnează `Q_terminal`
2. **Aplicația relayează `Q_terminal` cipului** via GENERAL AUTHENTICATE — cipul calculează Z intern
3. **`POST /v2/session/complete`** — serverul recomputează `Z = ECDH(d_terminal, Q_chip_din_DG14_stocat)` și verifică legătura

DG14 este stocat la pasul 1 — serverul nu acceptă o copie diferită la pasul 3, prevenind substituirea DG14 între apeluri.

:::caution Limitare reziduală
CA închide atacul de tip split-proof pentru atacatorii cu **nume diferit**. Există un rezidual extrem de specializat: un atacator care are **acces fizic la cardul victimei** (pentru a citi CAN-ul de pe față), are **același nume legal** ca victima și acceptă **riscul de detecție** — fiecare autentificare înregistrează permanent numărul de serie CE81 (hash cu cheie secretă server), iar MAI deține maparea SERIALNUMBER→CNP, permițând identificarea forensică a atacatorului. Acesta este un risc intern detectabil, nu un vector de atac scalabil.
:::

:::info Detalii complete
Toate condițiile de verificare și diagrama fluxului SSO: [Security Overview](/docs/security-overview#securitatea-eidkit-sso--model-zero-trust).
:::
