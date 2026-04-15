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
| **Semnare documente** | Semnătură calificată ECDSA-SHA384 cu cheia de non-repudiere — necesită PIN semnătură |

---

## Ce NU face SDK-ul

- **Nu transmite date cu caracter personal** către niciun server extern
- **Nu stochează date personale** pe dispozitiv — fără bază de date locală, cache sau fișiere
- **Nu accesează camera, microfonul, locația sau contactele** — exclusiv NFC
- **Nu conține module de analiză, publicitate sau tracking**
- **Nu inițiază nicio conexiune de rețea** din proprie inițiativă

Fluxul de date este exclusiv local:

```
Cip CEI ──NFC──▶ EidKit SDK ──▶ Aplicația integratoare
```

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

## Auditabilitate și transparență

| | |
|---|---|
| **Cod sursă Android** | [github.com/eidkit/eidkit-android](https://github.com/eidkit/eidkit-android) (public) |
| **Cod sursă iOS** | Disponibil la cerere — hello@eidkit.ro |
| **Maven Central** | `ro.eidkit:sdk-android` |
| **App Store (iOS)** | [EidKit pe App Store](https://apps.apple.com/us/app/eidkit-app/id6761855403) — aprobat de Apple |
| **Google Play (Android)** | Disponibil pe Google Play — aprobat de Google |

Ambele aplicații au trecut procesul de revizuire Apple App Store și Google Play, care include scanare automată de malware și revizuire manuală.

---

## Contact

Pentru întrebări tehnice, acces la codul sursă sau un walkthrough detaliat al implementării:
**[hello@eidkit.ro](mailto:hello@eidkit.ro)**
