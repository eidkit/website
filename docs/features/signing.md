---
id: signing
title: Semnare documente
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Semnare documente

EidKit folosește cheia de non-repudiere de pe cipul CEI românesc pentru a produce o **semnătură calificată ECDSA-SHA384** peste un hash de document. Aceasta permite semnarea PDF conform PAdES/eIDAS.

## Cum funcționează

1. Aplicația ta calculează un hash SHA-384 al intervalului de octeți din document care urmează să fie semnat
2. Utilizatorul apropie cardul și introduce **PIN-ul de semnătură** de 6 cifre
3. Cipul semnează hash-ul folosind cheia de non-repudiere (referință cheie `0x8E` în applet-ul GenPKI)
4. EidKit returnează semnătura ECDSA brută de 96 de octeți `r||s` și certificatul X.509 DER

## Semnează un document

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
// 1. Calculează hash-ul SHA-384 al conținutului documentului
val hash = MessageDigest.getInstance("SHA-384").digest(bytesDocument)
// hash.size == 48

// 2. Execută sesiunea de semnare
val result = EidKit.signer(can = canIntrodusDeutilizator)
    .sign(hash, signingPin = pinSemnareIntrodusDeutilizator)
    .execute(isoDep)

// result.signature    — semnătură ECDSA-SHA384 brută r||s, 96 octeți
// result.certificate  — certificat X.509 DER (CE8E)
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
import CryptoKit

// 1. Calculează hash-ul SHA-384 al conținutului documentului
let hash = Data(SHA384.hash(data: bytesDocument))
// hash.count == 48

// 2. Execută sesiunea de semnare
let result = try await EidKit.signer(can: canIntrodusDeutilizator)
    .sign(hash: hash, signingPin: pinSemnareIntrodusDeutilizator)
    .execute()

// result.signature    — semnătură ECDSA-SHA384 brută r||s, 96 octeți
// result.certificate  — certificat X.509 DER (CE8E)
```

</TabItem>
</Tabs>

## Integrarea semnăturii în PDF

`SignResult.signature` este o valoare `r||s` brută. Pentru a o integra într-un PDF (PAdES/eIDAS), trebuie împachetată într-o structură CMS/PKCS#7 `SignedData` împreună cu certificatul.

Opțiuni:
- **Serviciu de semnare EidKit** — setează `EidKitConfig.signingServiceUrl` pentru a delega împachetarea CMS, marcarea temporală și LTV către backend-ul EidKit (sau propria instanță on-premise)
- **Implementare proprie** — folosește Apache PDFBox (Android) sau PDFKit/BouncyCastle pentru a construi structura CMS din `result.signature` și `result.certificate`

## Evenimente de progres

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
EidKit.signer(can = canIntrodusDeutilizator)
    .sign(hash, signingPin = pinSemnareIntrodusDeutilizator)
    .executeFlow(isoDep)
    .collect { event ->
        when (event) {
            is SignEvent.PaceEstablished -> afiseazaPas("Canal securizat deschis")
            is SignEvent.PinVerified     -> afiseazaPas("PIN acceptat")
            is SignEvent.Done            -> afiseazaRezultat(event.result)
        }
    }
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
let result = try await EidKit.signer(can: canIntrodusDeutilizator)
    .sign(hash: hash, signingPin: pinSemnareIntrodusDeutilizator)
    .execute { event in
        switch event {
        case .paceEstablished: afiseazaPas("Canal securizat deschis")
        case .pinVerified:     afiseazaPas("PIN acceptat")
        }
    }
```

</TabItem>
</Tabs>

:::warning PIN de semnătură
PIN-ul de semnătură are **6 cifre** — diferit de PIN-ul de autentificare de 4 cifre folosit pentru KYC. CEI românesc permite doar **3 încercări incorecte de PIN de semnătură** înainte de blocarea permanentă a cheii de semnare.
:::
