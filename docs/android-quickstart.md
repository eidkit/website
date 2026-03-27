---
id: android-quickstart
title: Ghid rapid Android
sidebar_position: 2
---

# Ghid rapid Android

Integrează EidKit într-o aplicație Android în câteva minute.

## Cerințe

- Android API 26+ (Android 8.0)
- Un dispozitiv cu NFC
- O carte de identitate electronică românească (CEI) pentru testare

## 1. Adaugă dependența

EidKit este distribuit prin GitHub Packages.

**`settings.gradle.kts`** — adaugă repository-ul Maven GitHub Packages:

```kotlin
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri("https://maven.pkg.github.com/eidkit/eidkit-android")
            credentials {
                username = providers.gradleProperty("gpr.user").orNull
                    ?: System.getenv("GITHUB_ACTOR")
                password = providers.gradleProperty("gpr.token").orNull
                    ?: System.getenv("GITHUB_TOKEN")
            }
        }
    }
}
```

**`app/build.gradle.kts`**:

```kotlin
dependencies {
    implementation("ro.eidkit:sdk-android:0.1.0")
}
```

## 2. Configurează SDK-ul

Apelează `EidKit.configure()` o singură dată în `Application.onCreate()`:

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        EidKit.configure(this, EidKitConfig {
            licenseToken = BuildConfig.EIDKIT_LICENSE_TOKEN   // opțional — vezi documentația de configurare
        })
    }
}
```

## 3. Gestionează NFC în Activity

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

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val isoDep = nfcManager.handleIntent(intent) ?: return

        lifecycleScope.launch {
            val result = EidKit.reader(can = canIntrodusDeutilizator)
                .withPersonalData(pin = pinIntrodusDeutilizator)
                .withActiveAuth()
                .read(isoDep)

            // result.passiveAuth — întotdeauna prezent
            // result.identity   — nume, CNP, dată de naștere
            // result.personalData — adresă, date document
            // result.claim      — JWT semnat pentru verificare backend
        }
    }
}
```

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
- [Referință API Android](/docs/android-api)
