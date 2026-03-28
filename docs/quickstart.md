---
id: quickstart
title: Ghid rapid
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ghid rapid

Integrează EidKit într-o aplicație mobilă în câteva minute.

## Cerințe

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

- Android API 26+ (Android 8.0)
- Un dispozitiv cu NFC
- O carte de identitate electronică românească (CEI) pentru testare

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

- iOS 15+
- iPhone 7 sau mai nou (NFC obligatoriu)
- O carte de identitate electronică românească (CEI) pentru testare

</TabItem>
</Tabs>

## 1. Instalare

:::info Acces timpuriu
EidKit este disponibil în prezent prin **acces timpuriu**. Scrie-ne la [hello@eidkit.ro](mailto:hello@eidkit.ro) pentru a primi acces la SDK.

Odată ce ai acces, dependența arată astfel:

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
// app/build.gradle.kts
dependencies {
    implementation("ro.eidkit:sdk-android:0.1.0")
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/eidkit/eidkit-ios", from: "0.1.0"),
],
targets: [
    .target(name: "MyApp", dependencies: ["EidKit"]),
]
```

</TabItem>
</Tabs>
:::

## 2. Configurare NFC

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

Atașează `NfcManager` la Activity-ul tău pentru a primi evenimentele de tap:

```kotlin
class MyActivity : ComponentActivity() {
    private val nfcManager = EidKit.nfcManager()

    override fun onResume() {
        super.onResume()
        nfcManager.enableForegroundDispatch(this)
    }

    override fun onPause() {
        super.onPause()
        nfcManager.disableForegroundDispatch(this)
    }
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

Adaugă capabilitatea **Near Field Communication Tag Reading** în Xcode (Target → Signing & Capabilities).

Adaugă și cheia `NFCReaderUsageDescription` în `Info.plist`:

```xml
<key>NFCReaderUsageDescription</key>
<string>EidKit citește cartea ta de identitate prin NFC.</string>
```

SDK-ul afișează automat panoul NFC de sistem la fiecare sesiune — nu este necesară altă configurare UI.

</TabItem>
</Tabs>

## 3. Configurare SDK

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

Apelează `EidKit.configure()` o singură dată în `Application.onCreate()`:

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        EidKit.configure(this, EidKitConfig {
            licenseToken = BuildConfig.EIDKIT_LICENSE_TOKEN
        })
    }
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

Apelează `EidKit.configure()` o singură dată la pornirea aplicației:

```swift
@main
struct MyApp: App {
    init() {
        EidKit.configure(EidKitConfig(
            licenseToken: "your-token"
        ))
    }
    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
```

</TabItem>
</Tabs>

:::note Mod demo
Fără un `licenseToken` valid, SDK-ul rulează în **mod demo** — datele citite de pe card sunt anonimizate automat. Ideal pentru dezvoltare și testare fără a expune date reale.
:::

## 4. Citește un card

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

```kotlin
override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    val isoDep = nfcManager.handleIntent(intent) ?: return

    lifecycleScope.launch {
        val result = EidKit.reader(can = canIntrodusDeutilizator)
            .withPersonalData(pin = pinIntrodusDeutilizator)
            .withActiveAuth()
            .read(isoDep)

        // result.passiveAuth  — întotdeauna prezent
        // result.identity     — nume, CNP, dată de naștere
        // result.personalData — adresă, date document
        // result.claim        — material criptografic pentru verificare backend
    }
}
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

```swift
import EidKit

func citesteCard() async throws {
    let result = try await EidKit.reader(can: canIntrodusDeutilizator)
        .withPersonalData(pin: pinIntrodusDeutilizator)
        .withActiveAuth()
        .read()

    // result.passiveAuth  — întotdeauna prezent
    // result.identity     — nume, CNP, dată de naștere
    // result.personalData — adresă, date document
    // result.claim        — material criptografic pentru verificare backend
}
```

</TabItem>
</Tabs>

:::info CAN
CAN-ul este numărul de 6 cifre tipărit pe **fața** cardului. Utilizatorul trebuie să îl introducă în interfața aplicației — nu îl stoca niciodată sau nu îl hardcoda în aplicație.

![Localizarea codului CAN pe Cartea Electronică de Identitate](/img/cei-can-sample.png)
:::

:::warning Încercări PIN
CEI românesc permite doar **3 încercări incorecte de PIN** înainte de blocare. Un PIN blocat necesită o vizită la un serviciu MAI pentru deblocare. Permite întotdeauna utilizatorului să introducă singur PIN-ul.
:::

## Pași următori

- [KYC](/docs/features/kyc) — citire date de identitate și fotografii
- [Semnare documente](/docs/features/signing) — semnare PDF-uri cu cardul
- [Autentificare activă](/docs/features/active-auth) — verificarea autenticității cipului
- [Referință API Android ↗](https://eidkit.ro/android-api/latest/index.html)
- [Referință API iOS ↗](https://eidkit.ro/ios-api/latest/index.html)
