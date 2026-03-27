---
id: active-auth
title: Autentificare activă
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Autentificare activă

Autentificarea activă verifică că cipul cardului este **autentic și nu a fost clonat**. Folosește un protocol challenge-response cu cheia de autentificare a cipului.

## Cum funcționează

1. EidKit generează un challenge aleatoriu și îl trimite cipului
2. Cipul semnează challenge-ul cu cheia privată de autentificare internă
3. EidKit verifică semnătura față de cheia publică stocată în Document Security Object (SOD)
4. Dacă este validă, `result.activeAuth` este `Verified` și `result.claim` include un `activeAuthProof`

`activeAuthProof` conține challenge-ul, semnătura cipului și certificatul X.509 — material criptografic brut pe care backend-ul tău îl poate folosi pentru verificare independentă.

:::note Format de transport
Serializarea `CeiIdentityClaim` într-un format de transport (JWT, CBOR etc.) pentru transmiterea către backend este planificată într-un milestone viitor. Deocamdată, claim-ul este un obiect în memorie disponibil în cadrul sesiunii.
:::

## Activare autentificare activă

Autentificarea activă partajează sesiunea PACE cu citirea datelor personale — `withPersonalData(pin:)` trebuie apelat și el.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = canIntrodusDeutilizator)
    .withPersonalData(pin = pinIntrodusDeutilizator)
    .withActiveAuth()           // activează autentificarea activă
    .read(isoDep)

when (result.activeAuth) {
    is ActiveAuthStatus.Verified -> {
        // Cipul este autentic
        val claim = result.claim   // include activeAuthProof
        // Trimite claim-ul la backend pentru verificare
    }
    is ActiveAuthStatus.Failed  -> {
        // Cipul a eșuat autentificarea activă — posibil atac de clonare
    }
    is ActiveAuthStatus.Skipped -> {
        // withActiveAuth() nu a fost apelat
    }
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.reader(can: canIntrodusDeutilizator)
    .withPersonalData(pin: pinIntrodusDeutilizator)
    .withActiveAuth()           // activează autentificarea activă
    .read()

switch result.activeAuth {
case .verified:
    // Cipul este autentic
    let claim = result.claim   // include activeAuthProof
    // Trimite claim-ul la backend pentru verificare
case .failed:
    // Cipul a eșuat autentificarea activă — posibil atac de clonare
case .skipped:
    // withActiveAuth() nu a fost apelat
}
```

</TabItem>
</Tabs>

## Claim-ul de identitate

Când atât autentificarea pasivă cât și cea activă reușesc și identitatea a fost citită, `result.claim` este un `CeiIdentityClaim` care conține:

| Câmp | Descriere |
|------|-----------|
| `identity` | Câmpuri de identitate de bază (nume, CNP, dată de naștere) |
| `passiveAuthStatus` | `valid` |
| `activeAuthProof` | Challenge + semnătură cip — dovedește că cardul este autentic |
| `issuedAt` | Timestamp-ul sesiunii |

Backend-ul tău poate verifica `activeAuthProof` verificând semnătura cipului față de cheia publică din certificatul inclus.

## Autentificare pasivă vs. activă

| | Autentificare pasivă | Autentificare activă |
|---|---|---|
| Ce dovedește | Datele au fost emise de MAI și nu au fost modificate | Cipul este autentic (nu o copie clonată a datelor) |
| Rulează întotdeauna | Da | Doar când `withActiveAuth()` este apelat |
| Necesită PIN | Nu | Da (partajează sesiunea cu `withPersonalData`) |
| Latență adăugată | ~0.5s | ~1s |
