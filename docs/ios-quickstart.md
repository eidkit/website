---
id: ios-quickstart
title: Ghid rapid iOS
sidebar_position: 3
---

# Ghid rapid iOS

Integrează EidKit într-o aplicație iOS în câteva minute.

## Cerințe

- iOS 15+
- iPhone 7 sau mai nou (NFC obligatoriu)
- O carte de identitate electronică românească (CEI) pentru testare

## 1. Adaugă pachetul Swift

În Xcode: **File → Add Package Dependencies** și introdu:

```
https://github.com/eidkit/eidkit-ios
```

Sau adaugă direct în `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/eidkit/eidkit-ios", from: "0.1.0"),
],
targets: [
    .target(name: "MyApp", dependencies: ["EidKit"]),
]
```

## 2. Adaugă dreptul NFC

În Xcode, adaugă capabilitatea **Near Field Communication Tag Reading** la target-ul tău. Aceasta adaugă dreptu `com.apple.developer.nfc.readersession.formats` în `Entitlements.plist`.

Adaugă și cheia `NFCReaderUsageDescription` în `Info.plist`:

```xml
<key>NFCReaderUsageDescription</key>
<string>EidKit citește cartea ta de identitate prin NFC.</string>
```

## 3. Configurează SDK-ul

Apelează `EidKit.configure()` o singură dată la pornirea aplicației:

```swift
@main
struct MyApp: App {
    init() {
        EidKit.configure(EidKitConfig(
            licenseToken: "your-token"   // opțional — vezi documentația de configurare
        ))
    }

    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
```

## 4. Citește un card

```swift
import EidKit

// Apelat dintr-o acțiune de buton sau similar
func citesteCard() async throws {
    let result = try await EidKit.reader(can: canIntrodusDeutilizator)
        .withPersonalData(pin: pinIntrodusDeutilizator)
        .withActiveAuth()
        .read()

    // result.passiveAuth — întotdeauna prezent
    // result.identity   — nume, CNP, dată de naștere
    // result.personalData — adresă, date document
    // result.claim      — JWT semnat pentru verificare backend
}
```

SDK-ul afișează automat panoul NFC de sistem — nu este necesară nicio configurare suplimentară a interfeței.

:::info CAN
CAN-ul este numărul de 6 cifre tipărit pe **fața** cardului. Utilizatorul trebuie să îl introducă în interfața aplicației — nu îl stoca niciodată sau nu îl codifica direct în aplicație.
:::

:::warning Încercări PIN
CEI românesc permite doar **3 încercări incorecte de PIN** înainte de blocarea acestuia. Un PIN blocat necesită o vizită la un serviciu MAI pentru deblocare. Permite întotdeauna utilizatorului să introducă singur PIN-ul.
:::

## Pași următori

- [Funcționalitate KYC](/docs/features/kyc) — citire date de identitate și fotografii
- [Semnare documente](/docs/features/signing) — semnare PDF-uri cu cardul
- [Autentificare activă](/docs/features/active-auth) — verificarea autenticității cipului
- [Referință API iOS](/docs/ios-api)
