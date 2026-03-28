---
slug: problema-adresei-carte-electronica-identitate
title: "Adresa ta e pe buletin. Banca nu știe cum să o citească."
authors: [catalin]
date: 2026-03-27
tags: [cei, kyc, identitate, romania, nfc, domiciliu]
description: >
  Noua carte electronică de identitate nu mai tipărește adresa de domiciliu. Adresa există pe cip — dar băncile, notariatele și instituțiile publice nu știu cum să o acceseze. Ce se întâmplă, de ce contează și ce presupune o integrare corectă.
image: /img/blog/address-problem-og.png
keywords:
  - carte electronica de identitate adresa domiciliu
  - CEI adresa lipsa banca
  - buletin electronic adresa domiciliu NFC
  - citire adresa CEI NFC
  - CEI KYC verificare adresa
  - adeverinta domiciliu carte electronica identitate
---

Odată cu introducerea noii Cărții Electronice de Identitate, adresa de domiciliu a dispărut de pe suprafața fizică a documentului. Nu mai există stradă, număr, oraș, județ tipărite pe verso. Toate aceste informații sunt stocate exclusiv pe cipul din interiorul cărții, accesibile doar prin NFC sau printr-un cititor de carduri.

În teorie, este un pas înainte. Adresa poate fi actualizată electronic atunci când te muți, fără să fie necesară emiterea unui nou document. În practică, tranziția a generat o criză care devine tot mai vizibilă.

---

## Problema, pe scurt

Milioane de români dețin acum un act de identitate care conține legal adresa lor de domiciliu — dar nu o pot prezenta unui funcționar bancar, notar sau angajat al statului într-un format pe care acesta să îl poată citi.

Până în această săptămână, Guvernul a înregistrat [peste 300 de sesizări](https://www.digi24.ro/stiri/actualitate/social/guvernul-anunta-solutii-la-sesizarile-romanilor-privind-cartea-de-identitate-electronica-principala-problema-lipsa-adresei-3697043) în categoria „Pașaport și Carte de Identitate" pe platforma fara-hartie.gov.ro. Cea mai frecventă problemă: lipsa adresei tipărite. Bănci, notariate, școli, birouri ANAF și autorități locale continuă să solicite o *adeverință de domiciliu* separată — un document care atestă adresa deja prezentă, tehnic vorbind, pe actul pe care îl țin în mână.

O persoană a povestit că a ajuns la notar pentru un act de vânzare-cumpărare și a fost trimisă acasă pentru că CEI „nu este suficientă pentru dovada domiciliului." Alta a pățit același lucru la bancă. [Un tânăr de 34 de ani](https://www.capital.ro/obligatoriu-pentru-romanii-cu-buletin-electronic-documentul-de-care-au-nevoie-cetatenii-care-au-carte-de-identitate-electronica.html): *„Am făcut buletinul electronic pentru că am înțeles că e mai modern și mai sigur. Nimeni nu mi-a spus că voi avea nevoie de o adeverință de fiecare dată când trebuie să dovedesc adresa."*

Asta se întâmplă când infrastructura avansează înainte ca instituțiile să fie pregătite să o folosească.

---

## Ce a făcut Guvernul

Guvernul a reacționat rapid. Pe 25 martie 2026 — acum două zile — [serviciile de evidență a persoanelor au primit instrucțiunea](https://ziare.com/carte-electronica-identitate/probleme-banci-notari-2002776) să verifice ele însele adresele în baza de date națională, fără să mai condiționeze preluarea dosarului de prezentarea unui document fizic.

Băncile au primit acces tehnic direct la baza de date a evidenței persoanelor și, conform anunțului guvernamental, nu mai trebuie să solicite adeverința.

Pentru notari, se testează un mecanism similar.

Pentru toți ceilalți — cetățeni care trebuie să dovedească adresa într-un loc care nu are încă acces la baza de date — Ministerul Afacerilor Interne a [lansat aplicația mobilă **RoCEIReader**](https://www.avocatnet.ro/articol_70442/Problema-adresei-de-pe-noile-buletine-rezolvat%C4%83-MAI-a-lansat-o-aplica%C8%9Bie-care-cite%C8%99te-informa%C8%9Biile-de-pe-c%C4%83r%C8%9Bile-electronice-de-identitate.html). Apropiați buletinul de telefon, introduceți codul CAN de 6 cifre și PIN-ul de 4 cifre, iar aplicația citește adresa de pe cip și permite salvarea ei ca PDF.

Disponibilă momentan doar pentru Android. Versiunea iOS „urmează în curând."

:::caution Forma acestei soluții
Răspunsul Guvernului la „instituțiile nu pot citi cipul" este o aplicație pentru cetățeni, prin care aceștia citesc cipul ei înșiși și produc un PDF. Acel PDF este apoi prezentat instituției care nu putea citi cipul.

Problema a fost parțial convertită dintr-o provocare de integrare tehnică în birocrație — birocrație digitală, dar tot birocrație. Funcționează și e mai bine decât nimic. Dar ilustrează bine distanța dintre ce *este* CEI — un card inteligent NFC cu securitate criptografică și date semnate de stat — și ce sunt pregătite majoritatea sistemelor să facă cu el.
:::

---

## Opțiunile pentru citirea adresei

Tranziția are consecințe reale pentru oricine construiește software care necesită o adresă de domiciliu verificată în România. Fluxul vechi — scanează actul, extrage adresa prin OCR de pe verso — nu mai funcționează. Adresa nu mai e pe verso.

Alternativele, aproximativ în ordinea robusteții:

**Acces direct la baza de date guvernamentală**
Băncile au primit acces direct la registrul DGEP. Curat, fără NFC, fără interacțiune suplimentară din partea utilizatorului dincolo de CNP. Accesul necesită un acord formal cu autoritatea guvernamentală și nu este disponibil oricărei companii private care îl solicită.

**Citirea cipului prin NFC**
Cardul este citit direct folosind codul CAN tipărit pe fața documentului. Adresa este furnizată exact așa cum o deține statul — semnată criptografic, verificabilă față de lanțul de certificate al Ministerului, fără dependență de o bază de date externă. Adresa se află în applet-ul EDATA al cardului, în spatele unui canal securizat PACE și al unui PIN de 4 cifre. Citirea corectă implică gestionarea unor formate de date specifice implementării românești, pe care bibliotecile ICAO standard nu le acoperă din cutie.

**Certificatul produs de utilizator**
Soluția de compromis facilitată acum prin RoCEIReader. Valabilă legal. Introduce un pas manual pentru utilizator, o fereastră de valabilitate de 6 luni și fricțiune tocmai acolo unde fluxurile de onboarding pierd cei mai mulți utilizatori.

---

## Imaginea de ansamblu

Problema adresei este simptomul cel mai vizibil, dar CEI este capabilă de mult mai mult decât a reușit să asimileze orice instituție până acum.

Cipul conține date biometrice, fotografia titularului și două chei criptografice susținute de certificate emise de MAI. Una este pentru semnătura electronică avansată — conform Legii 214/2024, un document semnat cu acest certificat are aceeași valoare juridică ca o semnătură olografă. Cealaltă este pentru autentificarea activă: o dovadă criptografică că cipul este autentic și nu clonat.

Și totuși, [platforma SPV a ANAF respinge semnătura de pe CEI](https://validsoftware.ro/probleme-cu-cartea-electronica-de-identitate-ce-nu-functioneaza-si-ce-solutii-ofera-guvernul-martie-2026/). Acceptă doar semnături de pe certificate calificate achiziționate separat, de la furnizori comerciali autorizați. Cardul îți oferă o semnătură legal valabilă. Portalul propriu al Guvernului nu o acceptă.

Cardul este înaintea ecosistemului. Ecosistemul recuperează decalajul, instituție cu instituție. Băncile au recuperat în privința adresei. Notarii sunt aproape. ANAF nu a recuperat în privința semnăturilor. Același tipar se va repeta pentru fiecare instituție care trebuie să interacționeze cu aceste carduri în următorii doi-trei ani.

---

## Ce presupune citirea cipului

Pentru cei curioși din punct de vedere tehnic: cipul CEI rulează protocolul PACE (Password Authenticated Connection Establishment) cu AES-256 pentru a stabili un canal securizat înainte ca orice să poată fi citit. După deschiderea canalului, citirea datelor personale necesită selectarea applet-ului corect, verificarea PIN-ului și parsarea răspunsului într-un format ASN.1 specific implementării românești — diferit de formatul MRZ ICAO pe care îl așteaptă majoritatea bibliotecilor.

Autentificarea pasivă — verificarea că datele de pe cip sunt semnate de MAI și nu au fost alterate — trebuie să ruleze întotdeauna înainte de a folosi orice date citite de pe card. Lanțul merge de la grupele de date prin certificatul semnatarului documentului până la certificatul rădăcină CSCA al Ministerului.

Nimic din toate astea nu este exotic. Dar este specific, iar specificul contează. Nu poți integra CEI citind documentația ICAO standard și adaptând un cititor de pașapoarte. Implementarea românească are propria structură de applet-uri, propriile formate de date și propriile cerințe de secvențiere care nu sunt documentate complet nicăieri în mod public.

---

Din iulie 2025, CEI este singurul model de carte de identitate emis la nivel național. Fiecare act de identitate eliberat în România de acum înainte conține un cip pe care titularul nu îl poate prezenta majorității instituțiilor într-un format pe care acestea să îl poată citi.

Decalajul se va închide treptat. Întrebarea pentru oricine construiește în acest spațiu este cât timp este dispus să aștepte și dacă soluția de compromis — certificate PDF ale datelor deja existente pe card — reprezintă fricțiunea acceptabilă pentru produsul său.

---

*Scriem despre CEI — capabilitățile sale, provocările de integrare și contextul reglementar din jurul său. Dacă un subiect de aici este relevant pentru ce construiești, [scrie-ne](mailto:hello@eidkit.ro).*
