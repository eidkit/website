---
id: kyc
title: KYC — Citire date card
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# KYC — Citire date card

EidKit citește datele de identitate, fotografiile și informațiile despre adresă din cipul CEI românesc într-o singură sesiune NFC.

## Ce poți citi

| Date | Sursă | Necesită |
|------|-------|---------|
| Nume, CNP, dată de naștere, sex, naționalitate | Applet EDATA | PIN autentificare 4 cifre |
| Localitate naștere, adresă, număr document, dată expirare | Applet EDATA | PIN autentificare 4 cifre |
| Fotografie față (JPEG, ~24 KB) | DG2 | Fără PIN (~7s) |
| Imagine semnătură olografă (JPEG, ~2.6 KB) | DG7 | Fără PIN (~1.5s) |

Autentificarea pasivă rulează întotdeauna — SDK-ul verifică automat datele față de certificatul rădăcină MAI.

## Citire de bază (doar identitate)

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = canIntrodusDeutilizator)
    .withPersonalData(pin = pinIntrodusDeutilizator)
    .read(isoDep)

val identity = result.identity
// identity.firstName, identity.lastName
// identity.cnp          — cod numeric personal
// identity.dateOfBirth
// identity.sex
// identity.nationality

val personal = result.personalData
// personal.address      — adresă completă
// personal.documentNumber
// personal.expiryDate
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.reader(can: canIntrodusDeutilizator)
    .withPersonalData(pin: pinIntrodusDeutilizator)
    .read()

let identity = result.identity
// identity?.firstName, identity?.lastName
// identity?.cnp          — cod numeric personal
// identity?.dateOfBirth
// identity?.sex
// identity?.nationality

let personal = result.personalData
// personal?.address      — adresă completă
// personal?.documentNumber
// personal?.expiryDate
```

</TabItem>
</Tabs>

## Citire cu fotografie

Includerea fotografiei față adaugă ~7 secunde la sesiune. Solicită-o doar când este necesar.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
val result = EidKit.reader(can = canIntrodusDeutilizator)
    .withPersonalData(pin = pinIntrodusDeutilizator)
    .withPhoto()              // DG2 — ~7s
    .withSignatureImage()     // DG7 — ~1.5s (opțional)
    .read(isoDep)

result.photo?.let { jpegBytes ->
    val bitmap = BitmapFactory.decodeByteArray(jpegBytes, 0, jpegBytes.size)
    imageView.setImageBitmap(bitmap)
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.reader(can: canIntrodusDeutilizator)
    .withPersonalData(pin: pinIntrodusDeutilizator)
    .withPhoto()              // DG2 — ~7s
    .withSignatureImage()     // DG7 — ~1.5s (opțional)
    .read()

if let jpegData = result.photo {
    let image = UIImage(data: jpegData)
    imageView.image = image
}
```

</TabItem>
</Tabs>

## Evenimente de progres

Folosește `readFlow` (Android) sau supraîncărcarea cu `onEvent` (iOS) pentru a actualiza o interfață wizard în timpul sesiunii.

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
EidKit.reader(can = canIntrodusDeutilizator)
    .withPersonalData(pin = pinIntrodusDeutilizator)
    .readFlow(isoDep)
    .collect { event ->
        when (event) {
            is ReadEvent.PaceEstablished  -> afiseazaPas("Canal securizat deschis")
            is ReadEvent.PassiveAuthDone  -> afiseazaPas("Date verificate")
            is ReadEvent.EDataRead        -> afiseazaPas("Identitate citită")
            is ReadEvent.Done             -> afiseazaRezultat(event.result)
        }
    }
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.reader(can: canIntrodusDeutilizator)
    .withPersonalData(pin: pinIntrodusDeutilizator)
    .read { event in
        switch event {
        case .paceEstablished:  afiseazaPas("Canal securizat deschis")
        case .passiveAuthDone:  afiseazaPas("Date verificate")
        case .eDataRead:        afiseazaPas("Identitate citită")
        }
    }
```

</TabItem>
</Tabs>

## Rezultatul autentificării pasive

`result.passiveAuth` este întotdeauna populat:

| Status | Semnificație |
|--------|-------------|
| `Valid` | Datele sunt autentice — emise de MAI, nemodificate |
| `Invalid` | Verificarea hash-ului sau a lanțului de certificate a eșuat |
| `Skipped` | Nu a fost posibilă (nu apare în operare normală) |

Dacă `passiveAuth` este `Valid` și identitatea a fost citită, `result.claim` este un `CeiIdentityClaim` semnat pe care backend-ul tău îl poate verifica.
