---
slug: integrarea-cei-nfc-android
title: "Ce înseamnă să integrezi CEI prin NFC. Un ghid pentru ingineri."
authors: [catalin]
date: 2026-03-29
tags: [cei, nfc, android, kotlin, pace, tehnic]
description: >
  Cardul electronic de identitate român nu este un simplu card NFC. Are patru applet-uri distincte, două faze de autentificare și formate de date specifice implementării românești care nu apar în nicio documentație publică completă. O evaluare onestă a complexității.
image: /img/blog/nfc-technical-og.png
keywords:
  - CEI NFC integrare Android
  - carte electronica identitate NFC Kotlin
  - PACE protocol CEI Android
  - jMRTD CEI Romania
  - citire date personale CEI NFC
  - CEI EDATA applet
---

*Acesta este al treilea articol din seria noastră despre carta electronică de identitate. Articolele anterioare acoperă [problema adresei care strică fluxurile KYC](/blog/problema-adresei-carte-electronica-identitate) și [ce poate semna buletinul tău electronic](/blog/legea-214-2024-semnatura-electronica-cei).*

Dacă ai mai integrat un pașaport electronic sau un alt document de identitate cu cip, vei intra în acest proiect cu un set de presupuneri rezonabile. Cele mai multe dintre ele sunt parțial greșite pentru CEI.

Nu este că standardele ICAO nu se aplică — se aplică, ca punct de plecare. Problema este că CEI este un card de identitate național cu extensii specifice care nu apar nicăieri documentate complet în public. Ce urmează este o hartă a terenului bazată pe un spike complet realizat pe un Pixel 8 cu un card CEI real — un spike care a durat considerabil mai mult decât ne-am așteptat, nu pentru că problema ar fi teoretic complexă, ci pentru că fiecare presupunere rezonabilă trebuia verificată prin testare directă.

---

## Ce știi deja — și ce se aplică

Orice card de identitate electronic bazat pe standardele ICAO folosește **PACE** (Password Authenticated Connection Establishment) pentru a stabili un canal securizat înainte de a permite citirea oricărui datum. CEI face același lucru, cu codul CAN — 6 cifre tipărite pe fața cardului — ca parolă.

Rezultatul PACE este un canal Secure Messaging (SM) care împachetează toate comenzile APDU ulterioare. Orice comandă trimisă raw după stabilirea canalului este respinsă de card — comportament standard, nu specific CEI.

Biblioteca care gestionează PACE pe Android este **jMRTD** — aceeași pe care ai folosi-o la pașapoarte. Autentificarea pasivă funcționează după principii cunoscute: cipul conține un Security Object Document care înlănțuie hash-urile SHA-256 ale datelor până la certificatul rădăcină CSCA al MAI, distribuit în bundle cu SDK-ul:

```kotlin
val sod = SODFile(sodRaw.inputStream())
val dsc = sod.docSigningCertificate
val csca = assets.open("csca_romania.der").use {
    CertificateFactory.getInstance("X.509").generateCertificate(it) as X509Certificate
}
dsc.verify(csca.publicKey) // aruncă excepție dacă invalid
```

Autentificarea pasivă trebuie să ruleze întotdeauna înainte de a folosi datele citite. Până aici, un inginer cu experiență în documente ICAO va fi confortabil. Aceasta este și cam limita terenului familiar.

---

## Unde presupunerile încep să se destrame

### Cipul are patru applet-uri, nu unul

Documentele de călătorie ICAO standard au o structură de applet relativ predictibilă. CEI nu urmează același tipar. Cipul conține patru applet-uri cu roluri distincte:

| Applet | Rol |
|--------|-----|
| AID1 / National App | Punct de intrare PACE, găzduiește parametrii de securitate |
| GenPKI | Chei și certificate pentru autentificare activă și semnare |
| ESIGN | Prezent pe card — dar nu este folosit în practică |
| EDATA | Date personale: nume, CNP, adresă, foto |

Applet-ul ESIGN există pe cip și apare în unele documente de referință. Nu este folosit. Semnarea se face prin GenPKI, printr-o comandă diferită de ce ai presupune din lectura standardelor. Acesta a fost unul dintre primele lucruri care ne-a surprins și a costat timp considerabil până la clarificare.

Fiecare applet urmează propriul flux de selecție și autentificare. Nu selectezi un applet și citești ce ai nevoie.

### Două faze, cerințe diferite

Citirea datelor de pe CEI se împarte natural în două faze:

**Faza 1 — doar CAN:** accesează datele disponibile fără PIN — fotografia titularului, semnătura olografă digitizată și datele necesare pentru autentificarea pasivă. Această fază folosește applet-ul ICAO standard.

**Faza 2 — CAN + PIN de 4 cifre:** accesează datele personale complete din applet-ul EDATA, inclusiv adresa de domiciliu — care nu mai apare tipărită pe cardul fizic.

### Ordinea operațiilor înainte de PACE nu este documentată — și contează

Aceasta este problema care a costat cel mai mult timp. Ce trebuie să faci *înainte* de PACE depinde de ce vrei să faci *după* PACE, iar regulile sunt asimetrice în funcție de scenariul de utilizare.

Faza 1 cere o pregătire diferită față de Faza 2 și GenPKI. Dacă pregătirea nu este cea corectă pentru scenariul respectiv, eșuările apar în puncte neașteptate, cu coduri de eroare care nu indică problema reală. Nu există nicio explicație pentru această asimetrie în documentația publică — a fost descoperită prin eliminare.

Structura generală a unui flux corect arată aproximativ așa:

```kotlin
// [pregătire specifică scenariului — diferită pentru Faza 1 vs Faza 2/GenPKI]

isoDep.timeout = 20000 // timeout-ul implicit este insuficient

// PACE cu CAN — stabilește canalul SM
val paceResult = ps.doPACE(canKey, paceOid, paceParams, null)
val wrapper = paceResult.wrapper

// toate comenzile de acum înainte trec prin wrapper
// wrapper.wrap(command) → cs.transmit() → wrapper.unwrap(response)

// [SELECT applet destinație prin wrapper]
// [VERIFY PIN prin wrapper — dacă scenariul o cere]
// [SELECT FILE + READ BINARY în buclă prin wrapper]
```

Buclă pentru că în modul SM, cardul nu returnează toate datele dintr-un singur apel — returnează chunk-uri, iar tu ești responsabil să știi când ai terminat de citit.

---

## Formatele de date: unde implementarea românească diverge

### DG1 nu este MRZ

Acesta este momentul în care codul care funcționează perfect la pașapoarte se rupe complet. Datele de identitate returnate de applet-ul EDATA nu sunt în formatul MRZ pe care îl parsează bibliotecile ICAO standard — sunt într-un format ASN.1 specific implementării românești, cu diacritice corecte și câmpuri structurate diferit.

Trebuie să scrii un parser propriu. Formatul nu este documentat public — a fost determinat prin inspecție directă a bytes returnați de card.

### Cele două chei criptografice din GenPKI

GenPKI conține două chei distincte, pe curbe eliptice diferite, cu comportamente interne diferite la semnare:

| Operațiune | PIN | Comportament intern |
|------------|-----|---------------------|
| Autentificare activă | 4 cifre | Cheie pe secp384r1, referință 0x81 |
| Semnare document | 6 cifre | Cheie pe brainpoolP384r1, referință 0x8E |

Cele două chei au comportamente diferite la nivel de protocol. A le confunda produce semnături incorecte fără niciun mesaj de eroare care să indice cauza.

---

## Lucruri care se rup înainte să ajungi la logica de business

**Furnizorul criptografic** trebuie înregistrat explicit înainte de orice operație pe cip. Ordinea de înregistrare contează și produce eșuări silențioase dacă este greșită:

```kotlin
Security.removeProvider("BC")
Security.insertProviderAt(BouncyCastleProvider(), 1)
```

**Android 13+** a schimbat API-ul pentru interceptarea tag-urilor NFC. Dacă suporți versiuni mai vechi, gestionezi două variante cu comportamente ușor diferite.

**PIN counter query nu funcționează** în modul SM. Nu există cale să interoghezi numărul de încercări rămase înainte de a trimite PIN-ul efectiv. Tratezi `SW=63CX` în răspunsul la VERIFY (X = încercări rămase) și `SW=6983` pentru card blocat. Acesta este un detaliu care afectează direct UX-ul aplicației și care nu apare menționat nicăieri.

**Parametrii bibliotecii PACE** contează exact. Valorile corecte de inițializare au fost confirmate prin testare; altele produc eșuări la PACE fără un mesaj de eroare care să indice cauza.

---

## Ce a necesitat verificare directă pe card

Lucrurile care nu apar în documentația publică și au trebuit descoperite prin testare:

- Comportamentul asimetric al pregătirii înainte de PACE în funcție de scenariu
- Care applet este folosit efectiv pentru semnare (nu cel din denumire)
- Formatul de date specific implementării românești pentru datele personale
- Diferența de comportament intern între cele două chei din GenPKI
- Parametrii exacți ai bibliotecii PACE care funcționează cu acest card
- Limitările PIN counter query în modul SM

Aplicația oficială de middleware MAI pentru desktop nu funcționează cu toate cardurile emise — ceea ce înseamnă că nici accesul la un card reader standard nu garantează un punct de referință funcțional din care să pornești.

Fiecare dintre punctele de mai sus reprezintă timp real pierdut dacă îl descoperi singur. Și nu există nicio modalitate să știi dinainte câte astfel de detalii există.

---

*Scriem despre CEI — capabilitățile sale, provocările de integrare și contextul reglementar din jurul său. Dacă un subiect de aici este relevant pentru ce construiești, [scrie-ne](mailto:hello@eidkit.ro).*
