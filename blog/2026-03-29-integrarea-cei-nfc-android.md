---
slug: integrarea-cei-nfc-android
title: "Ce înseamnă să integrezi CEI prin NFC. Un ghid pentru ingineri."
authors: [catalin]
date: 2026-03-29
tags: [cei, nfc, android, ios, kotlin, swift, pace, tehnic]
description: >
  Cardul electronic de identitate român nu este un simplu card NFC. Are patru applet-uri distincte, două faze de autentificare și formate de date specifice implementării românești care nu apar în nicio documentație publică completă. O evaluare tehnică pentru Android și iOS.
image: /img/blog/nfc-technical-og.png
keywords:
  - CEI NFC integrare Android iOS
  - carte electronica identitate NFC Kotlin Swift
  - PACE protocol CEI Android iOS
  - citire date personale CEI NFC
  - CEI EDATA applet
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*Acesta este al treilea articol din seria noastră despre carta electronică de identitate. Articolele anterioare acoperă [problema adresei care strică fluxurile KYC](/blog/problema-adresei-carte-electronica-identitate) și [ce poate semna buletinul tău electronic](/blog/legea-214-2024-semnatura-electronica-cei).*

Dacă ai mai integrat un pașaport electronic sau un alt document de identitate cu cip, vei intra în acest proiect cu un set de presupuneri rezonabile. Cele mai multe dintre ele sunt parțial greșite pentru CEI.

Nu este că standardele ICAO nu se aplică — se aplică, ca punct de plecare. Problema este că CEI este un card de identitate național cu extensii specifice care nu apar nicăieri documentate complet în public. Ce urmează este o hartă a terenului bazată pe implementări complete pentru Android și iOS, testate pe carduri CEI reale.

---

## Ce știi deja — și ce se aplică

Orice card de identitate electronic bazat pe standardele ICAO folosește **PACE** (Password Authenticated Connection Establishment) pentru a stabili un canal securizat înainte de a permite citirea oricărui datum. CEI face același lucru, cu codul CAN — 6 cifre tipărite pe fața cardului — ca parolă.

Rezultatul PACE este un canal Secure Messaging (SM) care împachetează toate comenzile APDU ulterioare. Orice comandă trimisă raw după stabilirea canalului este respinsă de card — comportament standard, nu specific CEI.

Autentificarea pasivă funcționează după principii cunoscute pe ambele platforme: cipul conține un Security Object Document care înlănțuie hash-urile SHA-256 ale grupelor de date până la certificatul rădăcină CSCA al MAI. Verificarea arată diferit în funcție de platformă, dar principiul este același:

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

Pe Android, jMRTD gestionează parsarea SOD-ului. Verificarea lanțului se face manual față de certificatul CSCA distribuit în bundle cu SDK-ul:

```kotlin
val sod = SODFile(sodRaw.inputStream())
val dsc = sod.docSigningCertificate
val csca = assets.open("csca_romania.der").use {
    CertificateFactory.getInstance("X.509").generateCertificate(it) as X509Certificate
}
dsc.verify(csca.publicKey) // aruncă excepție dacă invalid
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

Pe iOS nu există echivalent jMRTD. SOD-ul este un CMS SignedData — trebuie parsat direct din ASN.1, iar verificarea lanțului se face prin `SecTrust` cu ancora setată la certificatul CSCA, fără a folosi store-ul de sistem:

```swift
let sod = try SodVerifier.parse(sodBytes)
guard let dsc = SecCertificateCreateWithData(nil, sod.dscDer as CFData) else { ... }

var trust: SecTrust?
SecTrustCreateWithCertificates(dsc, SecPolicyCreateBasicX509(), &trust)
SecTrustSetAnchorCertificates(trust!, [csca] as CFArray)
SecTrustSetAnchorCertificatesOnly(trust!, true) // nu folosi store-ul de sistem
var error: CFError?
let trusted = SecTrustEvaluateWithError(trust!, &error)
```

</TabItem>
</Tabs>

Autentificarea pasivă trebuie să ruleze întotdeauna înainte de a folosi datele citite. Până aici, un inginer cu experiență în documente ICAO va fi confortabil. Aceasta este și cam limita terenului familiar.

---

## Unde presupunerile încep să se destrame

### Cipul are patru applet-uri, nu unul

Documentele de călătorie ICAO standard au o structură de applet relativ predictibilă. CEI nu urmează același tipar. Cipul conține patru applet-uri cu roluri distincte:

| Applet | Rol |
|--------|-----|
| AID1 / National App | Punct de intrare PACE, găzduiește parametrii de securitate |
| ICAO LDS | Fotografie, semnătură olografă digitizată, SOD pentru autentificare pasivă |
| EDATA | Date personale: nume, CNP, adresă de domiciliu |
| GenPKI | Chei și certificate pentru autentificare activă și semnare |

Applet-ul ESIGN există pe cip și apare în unele documente de referință. Nu este folosit. Semnarea se face prin GenPKI, printr-o comandă diferită de ce ai presupune din lectura standardelor.

Fiecare applet urmează propriul flux de selecție și autentificare. Nu selectezi un applet și citești ce ai nevoie.

### Două faze, cerințe diferite

Citirea datelor de pe CEI se împarte natural în două faze:

**Faza 1 — doar CAN:** accesează datele disponibile fără PIN — fotografia titularului, semnătura olografă digitizată și datele necesare pentru autentificarea pasivă. Această fază folosește applet-ul ICAO standard.

**Faza 2 — CAN + PIN de 4 cifre:** accesează datele personale complete din applet-ul EDATA, inclusiv adresa de domiciliu — care nu mai apare tipărită pe cardul fizic.

### Ordinea operațiilor înainte de PACE nu este documentată — și contează

Ce trebuie să faci *înainte* de PACE depinde de ce vrei să faci *după* PACE, iar regulile sunt asimetrice în funcție de scenariu. Faza 1 cere o pregătire diferită față de Faza 2 și GenPKI. Dacă pregătirea nu este cea corectă, eșuările apar în puncte neașteptate cu coduri de eroare care nu indică problema reală.

Situația este diferită pe cele două platforme din motive arhitecturale:

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

Stack-ul NFC Android pornește în contextul MF — niciun AID nu este pre-selectat. Aceasta este starea corectă pentru Faza 1: PACE funcționează direct în context MF, după care SM SELECT ICAO oferă acces la DG2/DG7/SOD.

```kotlin
// Faza 1: nicio pre-selecție necesară — stack-ul Android pornește în MF
isoDep.timeout = 20_000 // timeout-ul implicit este insuficient pentru CEI

val paceResult = ps.doPACE(canKey, paceOid, paceParams, null)
val wrapper = paceResult.wrapper
// toate comenzile de acum înainte trec prin wrapper

// Faza 2: SELECT AID1 înainte de PACE — chip-ul cere context AID1 pentru EDATA/GenPKI
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

iOS pre-selectează automat primul AID din lista `select-identifiers` din `Info.plist` la conectare. Dacă ICAO AID este primul, sesiunea pornește în context ICAO — dar PACE nu funcționează în context ICAO (MSE SET AT returnează SW=6985).

Soluția: un SELECT MF explicit înainte de PACE mută sesiunea din contextul ICAO în contextul MF, replicând starea de start Android.

```swift
// Faza 1: iOS conectează în contextul ICAO (ICAO AID este primul în Info.plist)
// PACE nu funcționează în context ICAO — SELECT MF înainte de PACE
let selectMF = NFCISO7816APDU(instructionClass: 0x00, instructionCode: 0xA4,
                               p1Parameter: 0x00, p2Parameter: 0x0C,
                               data: Data([0x3F, 0x00]), expectedResponseLength: -1)
_ = try await tag.sendCommand(apdu: selectMF)
// acum PACE funcționează — context MF, la fel ca Android

// Faza 2: SELECT AID1 înainte de PACE — același comportament ca Android
```

</TabItem>
</Tabs>

Comportamentul asimetric al pregătirii pre-PACE nu este documentat nicăieri — a fost descoperit prin eliminare pe ambele platforme.

---

## Formatele de date: unde implementarea românească diverge

### DG1 nu este MRZ

Acesta este momentul în care codul care funcționează perfect la pașapoarte se rupe complet, pe ambele platforme. Datele de identitate returnate de applet-ul EDATA nu sunt în formatul MRZ pe care îl parsează bibliotecile ICAO standard — sunt într-un format ASN.1 specific implementării românești, cu diacritice corecte și câmpuri structurate diferit:

```
SEQUENCE (0x30)
  [0] (0x80)  lastName     UTF-8  ex. "TOMA"
  [1] (0x81)  firstName    UTF-8  ex. "CĂTĂLIN"  (cu diacritice)
  [2] (0x82)  sex          UTF-8  "M" sau "F"
  [3] (0x83)  dateOfBirth  UTF-8  DDMMYYYY
  [4] (0x84)  cnp          UTF-8  13 cifre
  [5] (0x85)  nationality  UTF-8  "ROU"
```

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

`jMRTD`'s `DG1File` nu poate parsa acest format. Este nevoie de un parser propriu:

```kotlin
// jMRTD nu ajută aici — format ASN.1 specific românesc
val tags = parseContextTags(dg1Bytes) // parser propriu
val lastName  = tags[0x80]?.toString(Charsets.UTF_8)
val firstName = tags[0x81]?.toString(Charsets.UTF_8) // diacriticele sunt corecte
val cnp       = tags[0x84]?.toString(Charsets.UTF_8)
```

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

Nu există nicio bibliotecă iOS care să parseze acest format. Același parser ASN.1 propriu:

```swift
// nicio bibliotecă iOS nu parsează acest format
let tags = parseContextTags(dg1Bytes) // parser propriu
let lastName  = tags[0x80].flatMap { String(data: $0, encoding: .utf8) }
let firstName = tags[0x81].flatMap { String(data: $0, encoding: .utf8) } // diacriticele sunt corecte
let cnp       = tags[0x84].flatMap { String(data: $0, encoding: .utf8) }
```

</TabItem>
</Tabs>

Formatul nu este documentat public — a fost determinat prin inspecție directă a bytes returnați de card.

### Cele două chei criptografice din GenPKI

GenPKI conține două chei distincte, pe curbe eliptice diferite, cu comportamente interne diferite la semnare:

| Operațiune | PIN | Comportament intern |
|------------|-----|---------------------|
| Autentificare activă | 4 cifre | Cheie pe secp384r1, referință 0x81 |
| Semnare document | 6 cifre | Cheie pe brainpoolP384r1, referință 0x8E |

A le confunda produce semnături incorecte fără niciun mesaj de eroare care să indice cauza. Comportamentul este identic pe Android și iOS — aceasta este o constrângere a cipului, nu a platformei.

---

## Lucruri care se rup înainte să ajungi la logica de business

<Tabs groupId="platform">
<TabItem value="android" label="Android (Kotlin)">

**Furnizorul criptografic** trebuie înregistrat explicit, în ordinea corectă, înainte de orice operație pe cip. Ordinea greșită produce eșuări silențioase:

```kotlin
Security.removeProvider("BC")
Security.insertProviderAt(BouncyCastleProvider(), 1)
```

**Android 13+** a schimbat API-ul pentru interceptarea tag-urilor NFC. Dacă suporți versiuni mai vechi, gestionezi două variante cu comportamente ușor diferite.

</TabItem>
<TabItem value="ios" label="iOS (Swift)">

**Entitlements:** sesiunea NFC necesită atât formatul `TAG` cât și `PACE` în fișierul `.entitlements`. Dacă lipsește `PACE`, sesiunea pornește dar PACE eșuează fără un mesaj de eroare clar.

**`Info.plist`** trebuie să conțină `NFCReaderUsageDescription` și lista de `select-identifiers` cu cel puțin AID-ul ICAO (`A0000002471001`) — altfel iOS nu va livra tag-ul aplicației.

</TabItem>
</Tabs>

**PIN counter query nu funcționează** în modul SM, pe nicio platformă. Nu există cale să interoghezi numărul de încercări rămase înainte de a trimite PIN-ul efectiv. Tratezi `SW=63CX` în răspunsul la VERIFY (X = încercări rămase) și `SW=6983` pentru card blocat — detaliu care afectează direct UX-ul aplicației.

---

*Scriem despre CEI — capabilitățile sale, provocările de integrare și contextul reglementar din jurul său. Dacă un subiect de aici este relevant pentru ce construiești, [scrie-ne](mailto:hello@eidkit.ro).*
