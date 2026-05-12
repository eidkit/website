---
id: security-overview
title: Prezentare de securitate
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EidKit — Prezentare de securitate

**Versiune:** 1.0 · **Data:** aprilie 2026 · **Contact:** hello@eidkit.ro

---

## Rezumat executiv

EidKit este un SDK pentru Android și iOS care permite interacțiunea cu **Cartea de Identitate Electronică (CEI) românească** prin NFC, direct de pe telefonul mobil.

Toate operațiunile criptografice au loc exclusiv pe cipul cardului și pe dispozitivul utilizatorului. **Nicio dată cu caracter personal nu părăsește dispozitivul.** SDK-ul implementează exclusiv standarde internaționale publicate, fără protocoale proprietare. Codul sursă este disponibil pentru auditare pe GitHub.

---

## Ce face SDK-ul

| Funcționalitate | Descriere |
|---|---|
| **Sesiune securizată PACE** | Canal criptat cu cipul cardului folosind CAN-ul (ISO 11770-4) |
| **Autentificare pasivă** | Verifică că datele au fost emise de MAI și nu au fost modificate (ICAO 9303) |
| **Citire date de identitate** | Nume, CNP, dată de naștere, adresă, fotografie, semnătură olografă — necesită PIN |
| **Autentificare activă** | Challenge-response că cipul este autentic și nu a fost clonat |
| **Chip Authentication** | ECDH cu cheia statică din DG14 (BSI TR-03110) — leagă identitatea MAI-semnată de cipul fizic; opt-in, fără PIN; obligatoriu pentru SSO |
| **Semnare documente** | Semnătură calificată ECDSA-SHA384 cu cheia de non-repudiere — necesită PIN semnătură |

---

## Ce NU face SDK-ul

- **Nu transmite date cu caracter personal** către niciun server extern
- **Nu stochează date personale** pe dispozitiv — fără bază de date locală, cache sau fișiere
- **Nu accesează camera, microfonul, locația sau contactele** — exclusiv NFC
- **Nu conține module de analiză, publicitate sau tracking**
- **Nu inițiază nicio conexiune de rețea** din proprie inițiativă

Fluxul de date este exclusiv local pentru KYC și semnare:

```
Cip CEI ──NFC──▶ EidKit SDK ──▶ Aplicația integratoare
```

**Excepție — fluxul SSO:** Aplicațiile care folosesc EidKit SSO trimit dovada criptografică (hash-uri, semnătura cipului, certificatele) către serverul EidKit (`idp.eidkit.ro`) pentru verificare server-side. Datele personale în clar (nume, adresă) sunt transmise numai dacă scope-ul solicitat le include și numai după ce toate verificările criptografice au trecut. Nicio conexiune de rețea nu se face din SDK — aplicația integratoare este cea care gestionează POST-ul.

---

## Permisiuni

<Tabs groupId="platform">
<TabItem value="android" label="Android">

SDK-ul declară o singură permisiune:

| Permisiune | Motiv |
|---|---|
| `android.permission.NFC` | Comunicare cu cipul cardului prin NFC |

**SDK-ul nu declară permisiunea INTERNET.** Orice conectivitate de rețea este responsabilitatea exclusivă a aplicației integratoare.

</TabItem>
<TabItem value="ios" label="iOS">

SDK-ul folosește exclusiv capabilitatea **Core NFC** a sistemului, declarată în entitlement-urile aplicației integratoare. Nu sunt necesare permisiuni de rețea sau acces la date personale ale dispozitivului.

</TabItem>
</Tabs>

---

## Dependențe

<Tabs groupId="platform">
<TabItem value="android" label="Android">

| Bibliotecă | Versiune | Utilizare | Origine |
|---|---|---|---|
| **JMRTD** | 0.7.40 | Sesiune PACE, autentificare pasivă, citire ICAO 9303 | Proiect academic JMRTD — folosit în sisteme de control al frontierelor UE |
| **SCUBA** (scuba-sc-android) | 0.0.23 | Abstracție I/O smart card peste NFC IsoDep | Proiect SCUBA, partener JMRTD |
| **SpongyCastle** (prov) | 1.58.0.0 | Provider criptografic — brainpoolP384r1, AES-CMAC, derivare chei PACE | Port Android al Bouncy Castle |
| **Bouncy Castle** (bcpkix) | 1.76 | Parsare și validare certificate X.509, lanț CSCA | The Legion of the Bouncy Castle |
| **OpenTelemetry API** | 1.40.0 | API telemetrie structurată (opțional, fără date trimise dacă aplicația nu configurează un exporter) | CNCF / OpenTelemetry |
| **Kotlin Coroutines** | 1.8.1 | Gestionare asincronă sesiune NFC | JetBrains |

</TabItem>
<TabItem value="ios" label="iOS">

| Bibliotecă | Versiune | Utilizare | Origine |
|---|---|---|---|
| **OpenSSL** (krzyzanowskim/OpenSSL) | 3.6.x | brainpoolP384r1 ECDH + AES-256-CMAC pentru derivarea cheilor PACE | OpenSSL Foundation |
| **OpenTelemetry Swift Core** | 2.3.x | API telemetrie structurată (opțional) | CNCF / OpenTelemetry |

</TabItem>
</Tabs>

Toate operațiunile criptografice folosesc biblioteci open-source consacrate, auditate internațional. **Nu există implementări criptografice personalizate.**

---

## Protocoale și standarde

| Protocol / Standard | Utilizare |
|---|---|
| **PACE** (ISO 11770-4 / ICAO 9303 Partea 11) | Sesiune NFC securizată cu cipul CEI |
| **Autentificare pasivă** (ICAO 9303 Partea 11) | Integritatea datelor față de certificatul MAI (CSCA) |
| **Autentificare activă** (ICAO 9303 Partea 11) | Dovadă că cipul este autentic, nu clonat |
| **Chip Authentication** (BSI TR-03110 CA) | Legătură criptografică între identitatea MAI-semnată și cipul fizic prin ECDH (brainpoolP256r1) |
| **ECDSA-SHA384** | Semnătură digitală cu cheia de non-repudiere |
| **X.509 / CSCA** | Validare lanț de certificate până la rădăcina MAI |
| **PAdES / eIDAS** (Regulamentul UE 910/2014) | Format semnătură electronică calificată pentru PDF |
| **Legea 214/2024** | Cadrul legal românesc pentru semnătura electronică CEI |

Toate protocoalele sunt publicate, standardizate și utilizate în sistemele de autentificare electronică din Uniunea Europeană.

---

## Securitatea sesiunii NFC

- **Canalul PACE** este criptat end-to-end — comunicarea NFC nu poate fi interceptată fără CAN-ul cardului
- **PIN-urile nu sunt stocate** — folosite exclusiv în memorie pe durata sesiunii, eliminate imediat după
- **Cipul blochează accesul** hardware după numărul limitat de încercări greșite de PIN — independent de SDK
- **Autentificarea pasivă rulează întotdeauna** — SDK-ul nu returnează date dacă verificarea față de certificatul MAI eșuează

---

## Securitatea EidKit SSO — model „zero trust"

EidKit SSO este un identity provider OIDC care nu emite niciun token dacă nu poate dovedi criptografic că:

1. **Cardul a fost emis de statul român** — Certificatul DSC din EF.SOD este verificat față de CSCA MAI (rădăcina PKI a Ministerului Afacerilor Interne).
2. **Datele de identitate nu au fost modificate** — SHA-256 al bytes-urilor DG1 (care conține CNP-ul) trebuie să corespundă cu hash-ul înregistrat și semnat în SOD de MAI.
3. **Cardul fizic a fost prezent** — Cipul semnează un challenge de 48 de bytes generat server-side (ECDSA-SHA384 cu cheia CE81), folosind true NONEwithECDSA. Challenge-ul este unic per sesiune — semnătura nu poate fi refolosită (anti-replay).
4. **PIN-ul a fost utilizat** — Autentificarea activă pe cipul CEI necesită verificarea PIN-ului de autentificare (4 cifre) înainte ca CE81 să poată semna. O semnătură AA validă implică că posesorul cunoaște PIN-ul cardului fizic.
5. **Cheia cipului a fost emisă de MAI** — Certificatul CE81 este verificat față de MAI GenPKI Sub-CA. O cheie rogue nu poate fi substituită.
6. **CNP-ul este extras server-side** — Serverul nu acceptă CNP-ul din payload-ul aplicației. Îl extrage din bytes-urile DG1 după ce integritatea lor a fost verificată față de SOD.
7. **DG14 este semnat de MAI** — SHA-256 al bytes-urilor DG14 (care conține cheia publică a cipului, Q_chip) trebuie să corespundă cu hash-ul înregistrat în SOD de MAI. Aceasta leagă cheia de autentificare a cipului de aceeași semnătură care acoperă identitatea.
8. **Legătura cip↔identitate este verificată criptografic** — Serverul efectuează un schimb ECDH (BSI TR-03110 Chip Authentication) cu Q_chip din DG14 semnat de MAI. Numai cipul care deține cheia privată d_chip poate produce un secret partajat corect. Aceasta închide atacul de separare: un atacator care citește datele ICAO ale victimei (CAN vizibil) nu poate combina SOD-ul victimei cu propriul cip pentru CE81.

Spre deosebire de sisteme de autentificare bazate pe parolă sau pe documente scanate, EidKit SSO nu poate fi compromis prin:
- **Phishing** — challenge-ul server-side este unic per sesiune; o sesiune captată nu poate fi refolosită
- **Falsificare date** — orice modificare a datelor de identitate invalidează hash-ul din SOD
- **Card clonat** — cipul deține o cheie privată hardware care nu poate fi extrasă; clonarea este imposibilă fizic
- **Prezentare de screenshot / PDF** — semnătura cipului necesită hardware real, nu o imagine
- **Separarea dovezilor (SOD de la un cip, AA de la altul)** — legătura CA verifică că cipul care a semnat challenge-ul CE81 deține exact cheia Q_chip din identitatea MAI-semnată

```
Browser                    Telefon (EidKit)              Server (idp.eidkit.ro)
  │                              │                              │
  │── /authorize ───────────────────────────────────────────▶ │
  │◀── QR (session + nonce) ────────────────────────────────── │
  │                              │◀── QR scanat                │
  │                              │── citire card (NFC)         │
  │                              │   PACE + CA + verifyPin + AA│
  │                              │── POST /session/complete ──▶│
  │                              │   (dovadă criptografică)    │── verifică 8 condiții
  │                              │                             │── emite auth code
  │◀── polling: code ───────────────────────────────────────── │
  │── POST /token (code) ──────────────────────────────────▶  │
  │◀── ID token (JWT RS256) ──────────────────────────────── │
```

---

## Auditabilitate și transparență

| | |
|---|---|
| **Cod sursă Android** | Disponibil la cerere — hello@eidkit.ro |
| **Cod sursă Android Demo** | https://github.com/eidkit/eidkit-android-demo |
| **Cod sursă iOS** | Disponibil la cerere — hello@eidkit.ro |
| **Cod sursă iOS Demo** | https://github.com/eidkit/eidkit-iOS-demo |
| **Maven Central** | `ro.eidkit:sdk-android` |
| **App Store (iOS)** | [EidKit pe App Store](https://apps.apple.com/us/app/eidkit-app/id6761855403) — aprobat de Apple |
| **Google Play (Android)** | [EidKit pe Google Play](https://play.google.com/store/apps/details?id=ro.eidkit.app) — aprobat de Google |

Ambele aplicații au trecut procesul de revizuire Apple App Store și Google Play, care include scanare automată de malware și revizuire manuală.

---

## Contact

Pentru întrebări tehnice, acces la codul sursă sau un walkthrough detaliat al implementării:
**[hello@eidkit.ro](mailto:hello@eidkit.ro)**
