---
id: quickstart
title: Ghid rapid
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const AndroidInstall = () => {
  const {siteConfig} = useDocusaurusContext();
  const v = siteConfig.customFields.androidVersion;
  return <CodeBlock language="kotlin">{`// app/build.gradle.kts\ndependencies {\n    implementation("ro.eidkit:sdk-android:${v}")\n}`}</CodeBlock>;
};

export const IosInstall = () => {
  const {siteConfig} = useDocusaurusContext();
  const v = siteConfig.customFields.iosVersion;
  return <CodeBlock language="swift">{`// Package.swift\ndependencies: [\n    .package(url: "https://github.com/eidkit/eidkit-ios-releases", from: "${v}"),\n],\ntargets: [\n    .target(name: "MyApp", dependencies: ["EidKit"]),\n]`}</CodeBlock>;
};

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

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

<AndroidInstall />

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

<IosInstall />

</TabItem>
</Tabs>

:::info Acces timpuriu
EidKit este disponibil în prezent prin **acces timpuriu** — un token de licență este necesar pentru utilizare în producție. Scrie-ne la [hello@eidkit.ro](mailto:hello@eidkit.ro) pentru acces.
:::

## 2. Configurare NFC

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

Adaugă în `AndroidManifest.xml` permisiunea NFC, filtrul de intent și filtrul de tehnologie:

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.NFC" />

<application ...>
    <activity
        android:name=".MainActivity"
        android:launchMode="singleTop">  <!-- obligatoriu pentru onNewIntent -->

        <intent-filter>
            <action android:name="android.nfc.action.TECH_DISCOVERED" />
        </intent-filter>
        <meta-data
            android:name="android.nfc.action.TECH_DISCOVERED"
            android:resource="@xml/nfc_tech_filter" />
    </activity>
</application>
```

Creează fișierul `res/xml/nfc_tech_filter.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <tech-list>
        <tech>android.nfc.tech.IsoDep</tech>
    </tech-list>
</resources>
```

Atașează `NfcManager` la Activity-ul tău pentru a primi evenimentele de tap:

```kotlin
class MainActivity : ComponentActivity() {
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

Creează o clasă `Application` și înregistreaz-o în manifest:

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

```xml
<!-- AndroidManifest.xml -->
<application android:name=".MyApp" ...>
```

Definește `EIDKIT_LICENSE_TOKEN` în `app/build.gradle.kts` ca câmp `BuildConfig`:

```kotlin
// app/build.gradle.kts
android {
    buildFeatures { buildConfig = true }
    defaultConfig {
        buildConfigField("String", "EIDKIT_LICENSE_TOKEN", "\"${project.findProperty("EIDKIT_LICENSE_TOKEN") ?: ""}\"")
    }
}
```

Adaugă tokenul în `local.properties` (nu îl comite niciodată în git):

```
EIDKIT_LICENSE_TOKEN=tokenul-tău-aici
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

`onNewIntent` este apelat când un card NFC este detectat. Necesită `android:launchMode="singleTop"` pe Activity (configurat la pasul 2).

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
