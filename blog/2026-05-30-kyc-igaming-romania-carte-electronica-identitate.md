---
slug: kyc-igaming-romania-carte-electronica-identitate
title: "Verificarea identității în iGaming după CEI: ce se schimbă pentru operatorii ONJN în 2026"
authors: [catalin]
date: 2026-05-30
tags: [cei, kyc, igaming, onjn, identitate, romania, nfc, jocuri-de-noroc]
description: >
  Noua carte electronică de identitate schimbă fundamental fluxul KYC pentru operatorii licențiați ONJN. Adresa nu mai apare pe cardul fizic, video KYC-ul are limite clare, iar cipul oferă ceva ce nicio altă soluție nu poate: identitate verificată criptografic de MAI la fiecare autentificare.
image: /img/blog/igaming-kyc-og.png
keywords:
  - kyc igaming romania 2026
  - verificare identitate onjn cei
  - carte electronica identitate operatori jocuri de noroc
  - kyc nfc romania
  - adresa domiciliu cei jocuri de noroc
  - bonus abuse identitate verificata
---

Piața de jocuri de noroc online din România este una dintre cele mai reglementate din Europa. ONJN a emis peste 50 de licențe de Clasa I, peste 90% din pariuri se plasează prin operatori licențiați, iar amenzile și revocările de licențe din ultimul an arată că reglementatorul urmărește îndeaproape conformitatea.

Din iulie 2025, fiecare cetățean român care solicită un act de identitate primește o Carte Electronică de Identitate cu cip NFC. Această tranziție schimbă un lucru concret în fluxul KYC al oricărui operator licențiat ONJN — și nu toți operatorii sunt pregătiți.

---

## Ce s-a schimbat concret

Vechiul buletin tipărea adresa de domiciliu pe verso. Operatorii puteau fotografia actul, extrage adresa prin OCR și o puteau folosi pentru verificarea de adresă cerută în procesul CDD.

Noua CEI nu mai tipărește adresa pe față sau pe verso. Adresa există exclusiv pe cipul electronic, în applet-ul EDATA, protejată de un canal criptat și de PIN-ul titularului.

Consecința practică: **fluxul clasic de „fotografiezi actul, extragem adresa prin OCR" nu mai funcționează pentru niciun utilizator cu CEI.**

Și numărul acestor utilizatori crește în fiecare zi. Guvernul a emis [peste 1,8 milioane de CEI](https://carteadeidentitate.gov.ro/despre/) până acum, cu 1,1 milioane de cărți vechi care expiră doar în 2025. Până la sfârșitul anului 2026, majoritatea utilizatorilor activi ai platformelor de iGaming din România vor deține CEI ca unic act de identitate valid.

---

## Problema bonus abuse — un vector pe care CEI îl închide

Unul dintre cele mai costisitoare probleme pentru operatori este multi-accounting-ul: același utilizator creează conturi multiple pentru a profita de bonusuri de bun-venit, oferte de reload și promoții.

Soluțiile actuale — verificare prin email, număr de telefon, IP — sunt ușor de ocolit. Video KYC-ul adaugă fricțiune, dar cu deepfake-uri disponibile comercial, nu mai oferă garanțiile de acum 3 ani.

CEI schimbă ecuația la nivel fundamental: **un card fizic, emis de MAI, legat criptografic de o singură identitate.** Nu există două persoane cu același CEI. Nu există CEI virtual sau generat software. Cipul conține o cheie privată stocată hardware care nu poate fi exportată sau clonată.

Un operator care leagă contul de cipul CEI — nu de CNP, nu de email, ci de cipul fizic — elimină practic multi-accounting-ul pentru toți utilizatorii cu CEI.

---

## Video KYC: ce poate și ce nu poate face

Soluțiile de video KYC actuale (Sumsub, Veriff, Onfido, Didit, Qoobiss) funcționează prin fotografierea documentului și verificarea biometrică a feței. Sunt soluții solide pentru ce fac.

Dar au limite structurale care nu pot fi rezolvate prin îmbunătățiri de produs:

**Nivelul de asigurare eIDAS.** Video KYC cu OCR pe document foto atinge cel mult nivelul Substantial. Cipul CEI cu autentificare activă (PACE + PA + AA) reprezintă nivelul High — dovadă criptografică că documentul este autentic, că cipul nu este clonat și că utilizatorul deține cardul fizic.

**Adresa de domiciliu.** Video KYC nu poate extrage adresa din CEI deoarece nu citește cipul. Niciun furnizor de video KYC nu poate accesa applet-ul EDATA. Adresa trebuie obținută prin alte mijloace — adeverință separată, acces direct la DGEP (disponibil băncilor, nu oricui), sau cerut utilizatorului să o declare manual.

**Rezistența la deepfake.** Autentificarea cu cipul CEI nu implică nici biometrie, nici video. Utilizatorul introduce CAN-ul tipărit pe card și PIN-ul setat la MAI, apoi atinge cardul de telefon. Nu există suprafață de atac pentru deepfake sau sinteză de imagine.

---

## Ce cere ONJN și unde se situează CEI

Legea 129/2019 și reglementările ONJN impun operatorilor obligații clare de identificare și verificare a identității jucătorilor, inclusiv verificarea adresei de domiciliu.

Platforma de autoexcludere — pe care ONJN și ICI București o modernizează printr-un protocol semnat în februarie 2026 — va folosi verificare prin card de identitate, nu video KYC. Semnalul reglementatorului este clar: direcția este spre identificare prin document, nu spre selfie și OCR.

Un operator care integrează autentificarea cu CEI nu face doar un upgrade tehnic. Face un pas înaintea cerințelor ONJN viitoare.

---

## Cum arată integrarea în practică

EidKit expune un OIDC SSO standard — același protocol ca „Autentifică-te cu Google", implementat în câteva ore de orice echipă de development.

Fluxul pentru utilizator:
1. Pe site-ul operatorului apare un cod QR
2. Utilizatorul deschide aplicația EidKit pe telefon și scanează QR-ul
3. Introduce CAN-ul (6 cifre tipărite pe card) și PIN-ul (4 cifre, setat la MAI)
4. Atinge cardul de telefon — autentificare completă în sub 15 secunde

Serverul primește:
- Nume și prenume verificate criptografic de MAI
- CNP verificat criptografic de MAI
- Adresă de domiciliu extrasă din cip (nu auto-declarată)
- Dovadă că cipul este autentic și nu clonat (Active Authentication)
- Dovadă că utilizatorul deține cardul fizic și cunoaște PIN-ul

Fiecare autentificare ulterioară — nu doar onboarding-ul — produce aceleași garanții. Nu există session hijacking, nu există cont preluat prin resetare de parolă, nu există furt de credențiale.

---

## Costul per verificare

Soluțiile de video KYC costă între $0.33 (Didit) și $1.85 (Sumsub Compliance) per verificare reușită. Un operator cu 10.000 de înregistrări noi pe lună plătește între $3.300 și $18.500 lunar doar pentru KYC inițial.

EidKit SSO costă [€0.25 per autentificare reușită](https://eidkit.ro/pricing) — cu nivel de asigurare mai ridicat și cu adresa verificată inclusă. Pentru autentificările recurente — logins repetate ale aceluiași utilizator — costul este identic, ceea ce face modelul favorabil operatorilor cu utilizatori activi frecvent.

---

## Calendarul de adoptare CEI

Câteva repere concrete:

- **Iulie 2025**: CEI devine singurul tip de act de identitate eliberat în România
- **August 2025**: CEI poate fi solicitată la orice SPCLEP din țară, indiferent de domiciliu
- **Sfârșitul anului 2025**: 1,1 milioane de cărți vechi expiră
- **Decembrie 2026**: termen eIDAS 2.0 pentru portofelul european de identitate digitală
- **2027**: operatorii privați reglementați vor trebui să accepte portofelul EUDI

Fiecare lună care trece crește procentul de utilizatori ai platformelor de iGaming care dețin CEI ca singurul lor act de identitate valid.

---

Dacă ești operator ONJN sau construiești pentru piața de iGaming din România și vrei să discuți cum arată o integrare concretă, [scrie-ne](mailto:hello@eidkit.ro?subject=EidKit%20iGaming). Primele integrări beneficiază de [programul pilot](https://eidkit.ro/pricing).
