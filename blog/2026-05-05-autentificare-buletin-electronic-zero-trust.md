---
slug: autentificare-buletin-electronic-zero-trust
title: "Autentificarea cu buletinul electronic. De ce două verificări corecte pot fi totuși insuficiente."
authors: [catalin]
date: 2026-05-05
tags: [cei, securitate, autentificare, sso, chip-authentication, zero-trust]
description: >
  Autentificarea pasivă dovedește că datele sunt semnate de MAI. Autentificarea activă dovedește că cipul poate semna un challenge. Dar cele două verificări sunt independente — și asta deschide un vector de atac real. Iată ce înseamnă autentificarea cu adevărat sigură pe CEI.
image: /img/blog/zero-trust-sso-og.png
keywords:
  - autentificare buletin electronic securitate
  - CEI autentificare activa pasiva
  - chip authentication CEI Android
  - SSO buletin electronic Romania
  - zero trust autentificare CEI
  - split proof attack eID
---

Când un inginer integrează citirea CEI pentru prima dată și vede că autentificarea pasivă verifică datele față de certificatul MAI, iar autentificarea activă confirmă că cipul poate semna un challenge, concluzia naturală este că totul e în ordine. Două verificări independente, amândouă trecute, deci cardul este autentic și datele sunt corecte.

Concluzia este rezonabilă. Și este greșită.

---

## Cele două verificări și ce dovedesc fiecare

**Autentificarea pasivă** verifică integritatea datelor. Security Object Document-ul de pe card conține hash-urile SHA-256 ale grupelor de date, semnat cu certificatul Document Signer al MAI, verificat față de CSCA-ul Ministerului. Dacă verificarea trece, știi că datele nu au fost modificate după emitere și că MAI le-a semnat.

**Autentificarea activă** verifică că cipul deține o cheie privată. Serverul trimite un challenge de 48 de bytes, cipul îl semnează cu cheia sa privată de autentificare, serverul verifică semnătura față de certificatul din card. Dacă verificarea trece, știi că cineva cu acces la un cip funcțional a răspuns corect.

Problema este că cele două verificări sunt **independente**. Pasivă verifică datele. Activă verifică cipul. Dar nu verifică că datele și cipul aparțin aceluiași card fizic.

---

## Vectorul de atac: split-proof

Iată scenariul concret.

CAN-ul este tipărit pe fața cărții de identitate. Oricine ține cardul în mână câteva secunde îl poate citi — la o coadă, la un ghișeu, la un control de rutină. CAN-ul nu este un secret în sensul tradițional al cuvântului; este un identificator de acces la canalul NFC.

Cu CAN-ul victimei, un atacator poate stabili un canal PACE cu cardul și poate citi fișierele ICAO care nu necesită PIN — SOD-ul și datele din applet-ul standard. Aceasta include hash-urile semnate de MAI și, în funcție de configurație, date de bază. Autentificarea pasivă a acestor date va trece pe orice backend.

Atacatorul folosește acum **propriul card** pentru autentificarea activă. Trimite challenge-ul de la server la propriul cip, primește o semnătură validă față de propriul certificat.

Un backend care verifică pasivă și activă **separat** vede două lanțuri valide. Nu poate distinge atacatorul de titularul legitim — pentru că nu a verificat niciodată că datele MAI și cipul care a semnat challenge-ul sunt același obiect fizic.

---

## Chip Authentication: legătura criptografică dintre date și cip

Chip Authentication (CA, standardizată în BSI TR-03110) rezolvă exact această problemă.

Cardul conține în DG14 o cheie publică `Q_chip` — specifică acestui cip, acoperită de hash-ul SOD semnat de MAI. Chip Authentication efectuează un schimb ECDH între o cheie efemeră a terminalului și `Q_chip`. Numai cipul care deține cheia privată corespunzătoare `d_chip` poate produce secretul partajat corect.

Serverul generează perechea de chei terminale server-side (`d_terminal` nu părăsește niciodată serverul), trimite `Q_terminal` aplicației, care îl relayează cipului via GENERAL AUTHENTICATE. Serverul recomputează apoi independent:

```
Z = ECDH(d_terminal, Q_chip_din_DG14_stocat)
```

Dacă comparația eșuează, cineva a prezentat date MAI-semnate ale victimei cu propriul cip. Atacul este detectat. Un atacator care controlează aplicația nu poate produce un Z valid fără un cip real — `d_terminal` nu a fost niciodată trimis aplicației.

Dacă trece, datele din card și cipul care a răspuns la challenge sunt criptografic legate — pentru că `Q_chip` este semnat de MAI în SOD, iar ECDH-ul confirmă că cipul fizic deține cheia privată corespunzătoare.

Această legătură închide atacul pentru atacatorii cu **nume diferit**. Există un rezidual extrem de specializat pentru atacatorii cu același nume legal ca victima — care necesită acces fizic la card și acceptarea riscului de detecție forensică (fiecare autentificare înregistrează permanent numărul de serie CE81, iar MAI deține maparea spre CNP).

---

## Ce înseamnă zero trust în contextul CEI

Un flux de autentificare corect pe CEI impune trei condiții simultan:

**Datele sunt semnate de MAI** — autentificare pasivă față de CSCA.

**Cipul este autentic** — autentificarea activă dovedește că cipul poate semna un challenge cu propria cheie privată.

**Datele și cipul sunt același obiect fizic** — Chip Authentication leagă `Q_chip` din DG14 (semnat de MAI) de cipul care a efectuat ECDH-ul.

Fără toate trei, nu poți emite un token de autentificare cu garanție criptografică completă. Fără CA în particular, un sistem care verifică pasivă și activă separat are un vector de atac real și exploatabil — nu teoretic.

:::caution Autentificarea activă singură nu este suficientă
Un backend care verifică AA fără CA știe că cineva a răspuns la un challenge cu un cip funcțional. Nu știe că acel cip conține identitatea pe care a prezentat-o. Cele două trebuie verificate împreună.
:::

---

## EidKit SSO: OIDC standard, zero trust pe CEI

EidKit SSO este un identity provider OIDC standard — același protocol ca Google Sign-In sau GitHub OAuth. Client ID, Client Secret, redirect URI. Dacă ai integrat vreodată un provider OAuth, știi deja tot ce ai nevoie tehnic.

```javascript
// JWT primit după autentificare reușită
{
  "sub": "a3f7bc9d...",          // pseudonim stabil per persoană, nu CNP-ul brut
  "name": "CĂTĂLIN TOMA",
  "given_name": "CĂTĂLIN",
  "family_name": "TOMA",
  "birthdate": "1985-03-15",
  "address": {
    "formatted": "Str. Exemplu Nr. 1, Timișoara, Timiș"
  }
}
```

Datele nu sunt auto-declarate de utilizator — vin direct din cipul CEI, verificate de MAI. Adresa de domiciliu este inclusă, deși nu mai apare tipărită pe cardul fizic.

Fluxul de autentificare implementează toate trei straturile: pasivă + activă + Chip Authentication. Serverul nu emite niciun token fără dovadă criptografică că utilizatorul deține cardul fizic, cunoaște PIN-ul și că datele prezentate și cipul sunt același obiect.

Un detaliu de UX care simplifică integrarea: nu există diferență între înregistrare și login. `sub`-ul din JWT este un pseudonim stabil și unic per persoană — prima atingere a cardului creează contul automat, fără formular, fără email, fără parolă.

Documentația de integrare și prezentarea completă de securitate sunt disponibile pe [eidkit.ro/docs](https://eidkit.ro/docs/sso/integration).

---

*Scriem despre CEI — capabilitățile sale, provocările de integrare și contextul reglementar din jurul său. Dacă un subiect de aici este relevant pentru ce construiești, [scrie-ne](mailto:hello@eidkit.ro).*
