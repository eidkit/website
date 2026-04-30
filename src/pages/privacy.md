---
title: Politică de confidențialitate
description: Politica de confidențialitate pentru aplicația EidKit Demo și serviciul EidKit SSO
---

# Politică de confidențialitate

*Ultima actualizare: 30 aprilie 2026*

---

## Cine suntem

**EidKit** este un SDK și un serviciu de autentificare pentru Cartea de Identitate Electronică Românească (CEI). Această politică acoperă:

1. **Aplicația EidKit Demo** — aplicație mobilă pentru Android și iOS
2. **Serviciul EidKit SSO** — identity provider OIDC la `idp.eidkit.ro`

Operator de date: **Cătălin Toma** (persoană fizică) · Contact: [hello@eidkit.ro](mailto:hello@eidkit.ro)

---

## 1. Aplicația EidKit Demo

### Ce date colectăm

**Aplicația în sine nu colectează nicio dată personală.**

Toate datele citite de pe cipul cărții de identitate (nume, CNP, fotografie, adresă etc.) rămân exclusiv pe dispozitivul tău. Nu sunt transmise, stocate sau procesate pe servere externe de către aplicație.

**Excepție — fluxul SSO:** Dacă deschizi un link `eidkit://auth` (de exemplu, prin scanarea unui cod QR pe un site partener), aplicația va trimite datele tale de identitate (nume, dată de naștere, adresă) și dovada criptografică asociată (hash-uri, semnătura cipului, certificate) către `idp.eidkit.ro` prin HTTPS. Acest flux este inițiat exclusiv de tine, explicit, prin scanarea codului QR și introducerea PIN-ului. A se vedea secțiunea 2 pentru detalii.

### Date tehnice de diagnosticare

Aplicația folosește [Sentry](https://sentry.io) pentru raportarea erorilor tehnice (crash-uri). Sentry poate colecta:

- Informații despre dispozitiv (model, versiune sistem de operare)
- Stiva de apeluri (stack trace) în cazul unui crash
- **Nu sunt incluse date personale sau date citite de pe card**

Rapoartele de eroare sunt folosite exclusiv pentru îmbunătățirea stabilității aplicației.

### Permisiuni

| Permisiune | Motiv |
|-----------|-------|
| NFC | Citirea cipului de pe cartea de identitate electronică |
| Stocare (Android API 26–28) | Salvarea PDF-urilor generate în folderul Downloads |
| Rețea | Exclusiv pentru fluxul SSO opțional (POST dovadă criptografică) |

---

## 2. Serviciul EidKit SSO

EidKit SSO este un identity provider OIDC care permite autentificarea cu buletinul electronic pe site-uri partenere. Dacă te autentifici pe un site care folosește EidKit SSO, intri sub incidența acestei secțiuni.

### Ce date procesăm și de ce

| Date | Scop | Temeiul legal |
|------|------|--------------|
| Dovadă criptografică (hash-uri, semnătură cip, certificate) | Verificarea că buletinul este autentic și a fost emis de MAI | Consimțământ explicit (inițiezi tu fluxul prin scanarea QR și introducerea PIN) |
| Nume, prenume, dată de naștere | Transmis site-ului partener conform scope-urilor solicitate | Consimțământ explicit |
| Adresă | Transmis site-ului partener dacă scope-ul `address` este solicitat | Consimțământ explicit |
| CNP (hash SHA-256) | Generarea unui identificator unic stabil (`sub`) — CNP-ul brut nu este transmis site-ului | Consimțământ explicit |
| CNP (în clar) | Numai dacă scope-ul `cei:cnp` este solicitat explicit de site | Consimțământ explicit |

### Ce NU stocăm

- **Nu există bază de date** cu date ale utilizatorilor pe serverele EidKit
- **Sesiunile sunt în memorie**, cu TTL de 5 minute — se șterg automat
- **Codurile de autorizare** au TTL de 60 de secunde și sunt șterse după prima utilizare
- **Nu stocăm** copii ale datelor tale de identitate după emiterea token-ului

### Cui transmitem datele

Datele de identitate (conform scope-urilor aprobate de tine) sunt transmise exclusiv **site-ului partener** care a inițiat cererea de autentificare. EidKit acționează ca intermediar tehnic de verificare, nu ca destinatar final al datelor tale.

Site-urile partenere au propriile politici de confidențialitate și sunt responsabile de modul în care utilizează datele primite.

### Drepturile tale (GDPR)

Deoarece nu stocăm date cu caracter personal, cele mai multe drepturi GDPR (acces, rectificare, ștergere) se exercită față de site-ul partener care a primit datele tale, nu față de EidKit. Totuși, poți contacta [hello@eidkit.ro](mailto:hello@eidkit.ro) pentru orice nelămurire.

---

## 3. Cookie-uri și tracking

Nici aplicația mobilă, nici serverul `idp.eidkit.ro` nu folosesc cookie-uri de tracking, publicitate sau analiză terță parte.

---

## 4. Modificări ale politicii

Orice modificare semnificativă va fi publicată pe această pagină cu o dată de actualizare revizuită. Continuarea utilizării serviciului după publicarea modificărilor constituie acceptarea acestora.

---

## 5. Contact

Pentru orice întrebare legată de confidențialitate sau pentru exercitarea drepturilor GDPR:
[hello@eidkit.ro](mailto:hello@eidkit.ro)
