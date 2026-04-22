---
slug: eidas-2-termenul-2027-companii-romania
title: "2027 este mai aproape decât pare. Ce înseamnă eIDAS 2.0 pentru companiile din România."
authors: [catalin]
date: 2026-04-21
tags: [eidas, eudi-wallet, kyc, regulament, romania, banci, fintech]
description: >
  Până la finalul lui 2027, băncile, fintech-urile, companiile de asigurări și operatorii de telecomunicații din România vor fi obligați legal să accepte EUDI Wallet pentru autentificarea utilizatorilor. 2026 este anul de pregătire. Iată ce înseamnă asta concret.
image: /img/blog/eidas-2027-og.png
keywords:
  - eIDAS 2.0 Romania companii 2027
  - EUDI Wallet Romania obligatii banci fintech
  - portofel digital european Romania 2026
  - eIDAS 2 strong customer authentication Romania
  - regulament identitate digitala Romania
  - CEI EUDI Wallet integrare
---

Pe 4 decembrie 2024, Comisia Europeană a publicat primele acte de implementare ale Regulamentului (UE) 2024/1183 — eIDAS 2.0. Douăzeci de zile mai târziu, acestea au intrat în vigoare. De atunci, a început numărătoarea inversă.

Termenele sunt legale, nu aspiraționale. Până la finalul lui 2026, fiecare stat membru trebuie să pună la dispoziția cetățenilor cel puțin un portofel de identitate digitală — EUDI Wallet — certificat la nivel european. Până la finalul lui 2027, companiile private din sectoarele reglementate sunt obligate să îl accepte. Iar sectoarele care intră sub această obligație includ, explicit, băncile, furnizorii de servicii de plată, companiile de asigurări și operatorii de telecomunicații.

Dacă lucrezi în oricare dintre aceste domenii în România, 2026 este anul în care trebuie să înțelegi ce implică această tranziție — nu 2027.

---

## Ce este EUDI Wallet și ce legătură are cu buletinul electronic

EUDI Wallet este o aplicație mobilă standardizată la nivel european în care cetățenii pot stoca și prezenta credențiale de identitate verificate — actul de identitate, permisul de conducere, diplome, calificări profesionale și alte atribute. Utilizatorul controlează ce date partajează și cu cine, prin divulgare selectivă: poți dovedi că ai peste 18 ani fără să arăți data nașterii exactă, sau poți confirma că ești rezident al unui stat membru fără să dai adresa completă.

Legătura cu CEI este directă și intenționată. Cătălin Giulescu, directorul DGEP, a declarat public că [cartea electronică de identitate este „un intermediar" în procesul de digitalizare](https://validsoftware.ro/portofelul-digital-european-eudi-wallet-ce-este-cand-vine-si-ce-trebuie-sa-faca-firmele-si-institutiile-din-romania/) — platforma pe care se construiește EUDI Wallet în România. Cipul CEI, cu certificatele sale digitale emise de MAI, este mecanismul principal de înrolare în portofel. Fără CEI, nu există EUDI Wallet românesc.

România participă deja în proiectul-pilot european EUDIW-PACT coordonat de Ministerul de Interne din Franța, alături de alte 24 de state membre. Pe 17-18 martie 2026, la București au avut loc teste de interoperabilitate transfrontalieră în mediu live — schimb de credențiale funcțional între state membre diferite.

---

## Termenele, clar

| Termen | Obligație |
|--------|-----------|
| **24 dec. 2024** | Primele acte de implementare intră în vigoare — ceasul pornește |
| **31 dec. 2026** | Fiecare stat membru pune la dispoziție cel puțin un EUDI Wallet certificat |
| **31 dec. 2026** | Organismele publice și semi-publice sunt obligate să îl accepte |
| **31 dec. 2027** | **Companiile private din sectoarele reglementate sunt obligate să îl accepte** |

Articolul 5f(2) din Regulament este direct: companiile private care sunt deja obligate prin lege să folosească autentificare puternică a utilizatorilor — Strong Customer Authentication — trebuie să accepte EUDI Wallet la cererea utilizatorului, în cel mult 36 de luni de la intrarea în vigoare a actelor de implementare. Baza legală pentru SCA în serviciile financiare este PSD2. Dacă ești bancă sau fintech care procesează plăți, obligația este certă.

Penalitățile pentru neconformare ajung la **5 milioane EUR sau 1% din cifra de afaceri globală**, oricare este mai mare.

---

## De ce 2026 este anul în care trebuie să acționezi, nu 2027

Există o capcană comună în modul în care companiile citesc termenele reglementare: văd data de 2027 și planifică pentru 2027. Problema este că o integrare de nivel enterprise nu se finalizează în câteva săptămâni.

Experții în implementare estimează că o integrare completă, de la decizie la producție, necesită între 9 și 18 luni pentru o organizație de dimensiuni medii-mari. O bancă cu sisteme legacy, procese de procurement, cerințe de audit intern și cicluri de release bine-definite va fi la capătul superior al acestui interval, nu la cel inferior.

Companiile care încep în 2027 vor intra în producție în 2028 — după termenul obligatoriu. Companiile care încep în 2026 vor fi gata la timp și vor fi câștigat un avantaj competitiv: vor putea să ofere clienților autentificarea prin EUDI Wallet înainte ca aceasta să devină standard.

Chambers & Partners, în analiza lor pe piața fintech din România, confirmă explicit: [„în practică, 2026 este un an de pregătire"](https://chambers.com/content/item/7008) pentru a putea accepta wallet-ul și adapta onboardingul până în 2027.

---

## Ce trebuie să pregătești concret

**1. Maparea fluxurilor de identitate**

Primul pas nu este tehnic — este de business. Orice companie care intră sub incidența obligației trebuie să identifice toate punctele din produsele și serviciile sale unde are loc o autentificare puternică sau o verificare de identitate: onboarding KYC, autentificare la tranzacții semnificative, semnare de contracte, acces la date sensibile. Aceste puncte sunt cele care trebuie să accepte credențiale EUDI Wallet.

**2. Înregistrarea ca Relying Party**

Companiile care vor să accepte EUDI Wallet trebuie să se înregistreze ca *relying party* la autoritatea națională competentă. Fără înregistrare, nu poți solicita credențiale din portofelele utilizatorilor. Procesul de înregistrare nu este instant — include identificarea entității juridice, specificarea atributelor pe care intenționezi să le accesezi și motivele de business pentru care ai nevoie de ele.

**3. Integrarea tehnică**

Standardele tehnice pentru interacțiunea cu EUDI Wallet — OpenID4VP pentru prezentarea credențialelor, OpenID4VCI pentru emiterea lor, SD-JWT pentru divulgare selectivă — sunt stabilite prin actele de implementare. Integrarea presupune implementarea acestor protocoale în sistemele existente, nu o înlocuire a acestora.

**4. Redesignul fluxurilor KYC**

Regulamentul impune minimizarea datelor — poți solicita doar atributele necesare pentru tranzacția respectivă. Dacă ai acum un flux KYC care colectează toate datele disponibile, va trebui să îl redesignezi pentru a cere selectiv doar ce este necesar pentru fiecare context. Aceasta este o schimbare de arhitectură, nu doar de UI.

---

## Situația din România: fundație solidă, incertitudine operațională

România nu pleacă de la zero. CEI este deja în rollout național, cu peste 1,5 milioane de carduri emise și un target de 5 milioane până la mijlocul lui 2026. ROeID există ca aplicație de SSO guvernamental. Testele de interoperabilitate EUDI Wallet au avut loc deja pe sol românesc.

Ceea ce lipsește este claritatea operațională pentru sectorul privat. Un raport recent al [Accace](https://www.accace.com/eidas-2-in-romania/) constată că, deși alinierea juridică există prin Legea 214/2024, multe companii nu au claritate pe cerințele practice pe termen scurt. Conștientizarea problemei este limitată în afara sectoarelor puternic reglementate.

Există și o nuanță onestă de adăugat: la nivel european, unele state membre [s-ar putea să nu respecte termenul din 2026](https://www.biometricupdate.com/202512/will-the-eudi-wallet-be-ready-in-2026-experts-say-probably-not) pentru lansarea wallet-ului, din cauza complexității tehnice și a standardelor care se finalizează în paralel. Dar termenul de 2027 pentru sectorul privat este independent de viteza de lansare a wallet-ului — obligația de acceptare există indiferent de momentul exact al disponibilității. Și în România, CEI este deja disponibilă și funcțională ca fundație.

---

## Legătura cu infrastructura de identitate de astăzi

Există o continuitate directă între ce e disponibil acum și ce va fi obligatoriu în 2027. EUDI Wallet va fi populat, în România, cu date din CEI. Fluxurile de KYC bazate pe NFC care citesc cipul CEI astăzi sunt arhitectural compatibile cu ce va presupune acceptarea credențialelor EUDI Wallet mâine — același nivel de asigurare, aceeași bază de date de identitate, aceleași certificate MAI în lanțul de verificare.

Companiile care integrează astăzi citirea CEI prin NFC pentru onboarding și verificare de identitate nu construiesc o soluție temporară. Construiesc infrastructura de identitate pe care vor trebui să o aibă în 2027 — cu un an sau doi avans față de obligația legală.

---

*Scriem despre CEI — capabilitățile sale, provocările de integrare și contextul reglementar din jurul său. Dacă un subiect de aici este relevant pentru ce construiești, [scrie-ne](mailto:hello@eidkit.ro).*
