---
slug: legea-214-2024-semnatura-electronica-cei
title: "Legea semnăturii electronice din 2024, explicată. Ce poate face buletinul tău electronic și ce nu poate face încă."
authors: [catalin]
date: 2026-03-28
tags: [semnatura-electronica, legea-214-2024, cei, eidas, romania]
description: >
  Legea 214/2024 a intrat în vigoare în octombrie 2024 și a schimbat fundamental cadrul juridic al semnăturii electronice în România. Buletinul electronic îți oferă o semnătură cu valoare juridică — dar nu în toate situațiile. Iată ce spune legea cu exactitate, unde funcționează și unde nu.
image: /img/blog/law-214-og.png
keywords:
  - legea 214 2024 semnatura electronica
  - semnatura electronica avansata CEI efecte juridice
  - carte electronica identitate semnatura valoare juridica
  - semnatura calificata versus avansata Romania
  - CEI SPV ANAF semnatura
  - semnatura electronica buletin electronic
---

*Acesta este al doilea articol din seria noastră despre carta electronică de identitate. Primul acoperă [problema adresei care strică fluxurile KYC](/blog/problema-adresei-carte-electronica-identitate).*

Pe 8 octombrie 2024 a intrat în vigoare [Legea nr. 214/2024](https://legislatie.just.ro/Public/DetaliiDocument/285178) privind utilizarea semnăturii electronice — cel mai important act normativ din acest domeniu din România din 2001 încoace. A abrogat vechea lege a semnăturii electronice, a clarificat cadrul juridic pentru toate cele trei tipuri de semnături și a dat, pentru prima dată, o bază legală clară semnăturii de pe noua carte electronică de identitate.

Multă lume a înțeles asta ca pe un anunț simplu: *buletinul tău poate semna acte cu valoare juridică.* Adevărul este mai nuanțat și merită explicat corect — mai ales că diferența dintre ce *poți* semna cu CEI și ce *nu poți* semna are consecințe practice imediate.

---

## Trei tipuri de semnătură, trei niveluri de securitate

Legea, urmând Regulamentul european eIDAS, recunoaște trei tipuri de semnătură electronică. Nu sunt interschimbabile.

**Semnătura electronică simplă (SES)**
Cel mai de bază nivel. Un exemplu: numele tău scris la finalul unui e-mail sau o imagine PNG cu semnătura ta lipită într-un document Word. Legea îi recunoaște valoarea juridică în circumstanțe limitate: acte cu valoare sub jumătate din salariul minim brut (~925 RON la momentul actual), dacă cealaltă parte recunoaște documentul prin comportament (de exemplu, execută obligațiile din el), sau dacă ambele părți, ambele persoane juridice, au agreat dinainte în scris că acceptă acest tip de semnătură.

**Semnătura electronică avansată (AdES)**
Un nivel mai sus. Trebuie să fie legată unic de semnatar, să permită identificarea acestuia, să fie creată cu date de semnare aflate sub controlul exclusiv al semnatarului și să fie capabilă să detecteze orice modificare ulterioară a documentului semnat. Semnătura de pe CEI intră în această categorie — este creată cu un certificat emis de Ministerul Afacerilor Interne, stocat pe cipul cardului, sub controlul titularului prin PIN.

**Semnătura electronică calificată (QES)**
Cel mai înalt nivel. O semnătură avansată care, în plus, este creată printr-un dispozitiv calificat de creare a semnăturii și se bazează pe un certificat calificat emis de un prestator de servicii de încredere calificat (QTSP) — o entitate acreditată și supravegheată de stat. Sunt câțiva astfel de furnizori în România: certSIGN, DigiSign, CertDigital, Trans Sped și alții. Certificatul se obține separat, contra cost, de obicei pe un token USB sau în cloud.

Semnătura de pe CEI **nu este calificată.** Este avansată, cu un certificat emis de o autoritate publică — ceea ce o plasează într-o subcategorie cu efecte juridice extinse față de o semnătură avansată obișnuită, dar tot sub nivelul calificată.

---

## Ce poate face semnătura de pe CEI, conform Art. 4 din Legea 214/2024

Articolul 4 alineatul (5) din lege prevede că o semnătură electronică avansată produce aceleași efecte juridice ca o semnătură olografă **dacă** este îndeplinită cel puțin una din următoarele condiții:

**a)** actul a fost semnat cu o semnătură electronică avansată creată cu un certificat emis de o autoritate sau instituție publică din România **sau** de un prestator de servicii de încredere calificat

**b)** documentul electronic este recunoscut de cel căruia îi este opus — inclusiv prin executarea obligațiilor din document

**c)** părțile au agreat expres, printr-un înscris separat semnat olograf sau cu semnătură calificată, că vor conferi semnăturii avansate efectele juridice ale semnăturii olografe

CEI satisface condiția **(a)** în mod direct: certificatul este emis de MAI, care este o autoritate publică din România. Asta înseamnă că, pentru orice act pe care legea îl cere în formă scrisă ca **condiție de probă** (*ad probationem*) sau pentru care nu impune nicio formă specială, semnătura de pe CEI este echivalentă cu o semnătură olografă — fără alte condiții suplimentare.

Exemple concrete unde funcționează: contracte de prestări servicii, contracte de consultanță, contracte de muncă (prin coroborare cu OUG 36/2021 care permite AdES pentru contracte individuale de muncă), corespondență oficială, cereri administrative simple, acorduri comerciale între profesioniști.

---

## Ce nu poate face semnătura de pe CEI

Există două categorii de situații unde semnătura avansată de pe CEI nu este suficientă, indiferent de ce spune legea în teorie.

### 1. Actele care cer forma scrisă *ad validitatem*

Unele acte juridice sunt valide doar dacă sunt în formă scrisă — nu ca o condiție de probă, ci ca o condiție de validitate. Exemple: contracte de ipotecă, contracte de donație, statute de asociere pentru persoane juridice. Legea spune că, pentru aceste acte, forma electronică este valabilă dacă documentul este semnat cu semnătură calificată **sau** cu semnătură avansată care produce efectele semnăturii olografe în condițiile legii.

CEI poate tehnic satisface această condiție (certificat MAI = autoritate publică = condiția (a) îndeplinită), dar în practică notarii și registrele publice cer semnătură calificată. Și au dreptul să o facă, deoarece legea nu le interzice să impună cerințe tehnice mai stricte în procedurile lor interne.

### 2. Platformele automatizate ale statului — și aceasta este problema reală

**ANAF / SPV:** La data publicării acestui articol, [Spațiul Privat Virtual al ANAF nu recunoaște semnătura de pe CEI](https://validsoftware.ro/probleme-cu-cartea-electronica-de-identitate-ce-nu-functioneaza-si-ce-solutii-ofera-guvernul-martie-2026/). Platformele cu validare automată verifică certificatele fără intervenție umană și acceptă exclusiv semnături calificate. Poți semna un document *corect și legal* cu CEI, dar platforma îl va respinge automat. Sunt necesare: D212, D112, D300 și orice altă declarație fiscală.

**ONRC:** Același lucru. Înregistrarea actelor societare, modificările statutare, orice operațiune cu efect juridic la Registrul Comerțului necesită semnătură calificată.

**SICAP/SEAP:** Participarea la licitații publice necesită semnătură calificată.

Motivul tehnic: aceste platforme au fost construite și configurate înainte ca CEI să existe la scară națională. [Validarea automată acceptă exclusiv semnături calificate](https://alfasign.ro/semnatura-electronica-de-pe-cei-in-relatie-cu-statul/) — singurele cu o structură bine-definită și verificabilă instantaneu. Certificatul avansat de pe CEI, deși legal valid, nu trece prin același canal tehnic.

:::caution Distincția importantă
Legea nu zice că semnătura de pe CEI este refuzată legal de ANAF. Problema nu este juridică — este tehnică. Documentul semnat cu CEI este valabil. Platforma nu știe să îl proceseze. Sunt două lucruri diferite, și confuzia dintre ele a creat multă frustrare.
:::

---

## O excepție care merită menționată: sistemele electronice închise

Art. 4 alin. (5) lit. d) din lege permite semnăturii avansate să producă efectele semnăturii olografe și în cadrul unui **sistem electronic închis** — o platformă utilizată de un set definit de participanți, care respectă un proces de auditare a securității. Asta înseamnă că o companie privată poate construi un flux de semnare care acceptă CEI și să îi confere deplină valoare juridică în raporturile interne sau cu clienții săi, dacă arhitectura sistemului respectă condițiile legii.

Acesta este spațiul unde sectorul privat poate și ar trebui să se miște mai rapid decât statul.

---

## Certificatul de pe CEI: câteva detalii tehnice relevante

Legea 214/2024 conține o prevedere specifică pentru certificatul de pe CEI: prin excepție de la regula generală de 2 ani pentru semnăturile avansate, certificatul emis de MAI și înscris pe carta electronică de identitate este valabil pentru **maximum 5 ani** (Art. 3 alin. 5). Valabilitatea concretă o stabilește MAI la emitere.

Certificatul acoperă semnătura electronică avansată. Nu este un certificat calificat. Dacă ai nevoie de semnătură calificată pentru SPV sau ONRC, trebuie să obții separat un certificat de la un furnizor acreditat — certSIGN, DigiSign, CertDigital sau altul din lista aprobată de Autoritatea pentru Digitalizarea României.

---

## Unde funcționează bine acum: sectorul privat

Dacă platformele automatizate ale statului sunt excepția problematică, tot sectorul privat este câmpul liber. Certificatul de pe CEI este emis de MAI — autoritate publică — ceea ce înseamnă că satisface direct condiția (a) din Art. 4(5). Orice companie care construiește un flux de semnare cu CEI nu are nevoie de condiții suplimentare: nici acord prealabil între părți, nici recunoaștere tacită. Semnătura este valabilă din prima.

Domeniile cu cel mai mare potențial practic:

**Resurse umane și contracte de muncă.** OUG 36/2021 permite explicit semnătura electronică avansată pentru contractele individuale de muncă și toate documentele aferente. Companiile care angajează remote sau care procesează volume mari de contracte HR au nevoie de exact asta — identitatea verificată și contractul semnat, în același flux.

**Fintech și onboarding financiar.** Contracte de servicii, acorduri de mandat, documente de consimțământ, contracte de credit (cu excepția ipotecilor care necesită notar). O platformă fintech care construiește onboardingul pe CEI obține verificarea identității, adresa de domiciliu și semnătura legal valabilă dintr-o singură interacțiune NFC.

**Imobiliare — chirii.** Contractele de închiriere sunt acte *ad probationem*, nu *ad validitatem*. Semnătura avansată de pe CEI este pe deplin suficientă. Platformele proptech care vor să elimine prezența fizică la semnarea contractului de chirie au baza legală.

**Asigurări.** Contracte de polițe, mandate de brokeraj, declarații de daună. ASF (Autoritatea de Supraveghere Financiară) a împins în mod activ spre fluxuri digitale. Companiile de asigurări au nevoie de verificare a identității la onboarding *și* de semnătură pe documente de poliță — CEI rezolvă ambele.

**Telecomunicații.** Contractele de abonament sunt acorduri comerciale standard, integral valabile cu semnătură avansată. Orange, Vodafone, Digi — fiecare are fricțiune masivă la onboarding în prezent.

**Servicii medicale private.** Formulare de consimțământ, acorduri de tratament, documente de internare în rețelele private de clinici.

**Platforme de freelancing și colaborare B2B.** Contracte de colaborare, contracte de prestări servicii între profesioniști. Conform Legii 214/2024, în relațiile B2B între profesioniști cu un acord prealabil, orice semnătură electronică avansată este valabilă.

**Servicii juridice.** Contracte de asistență juridică, împuterniciri, fluxuri interne de documente pentru cabinete de avocatură.

**Banking — contracte cu clienții.** Distinct de problema SPV/ANAF: contractele de servicii bancare cu persoane fizice, acordurile de mandat pentru investiții, documentele de onboarding pentru conturi noi — toate sunt relații private, nu interacțiuni cu platforme automatizate ale statului. CEI este valabilă.

Numitorul comun al tuturor acestor domenii: au nevoie de identitate verificată *și* de semnătură *și* beneficiază de eliminarea fricțiunii din procesul de onboarding sau semnare. CEI este singurul mecanism disponibil în România care oferă toate trei simultan, din telefon, fără hardware suplimentar, fără o vizită la un birou.

---

## Ce urmează

Situația nu este statică. Guvernul a anunțat că lucrează la compatibilizarea tehnică a platformelor statului cu semnătura de pe CEI, deși nu există un termen public asumat. Presiunea vine din mai multe direcții: numărul de CEI în circulație crește rapid, Regulamentul eIDAS 2.0 obligă instituțiile să accepte mijloacele de identificare electronică recunoscute, iar EUDI Wallet — portofelul european de identitate digitală — trebuie să fie disponibil în România până la finalul lui 2026.

Deocamdată, situația practică este simplă: semnătura de pe CEI funcționează bine în relațiile private și acolo unde există o persoană care verifică documentul. Nu funcționează (încă) pe platformele automatizate ale statului.

---

*Scriem despre CEI — capabilitățile sale, provocările de integrare și contextul reglementar din jurul său. Dacă un subiect de aici este relevant pentru ce construiești, [scrie-ne](mailto:hello@eidkit.ro).*
