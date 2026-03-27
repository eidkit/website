---
id: overview
title: Prezentare generală
sidebar_position: 1
---

# EidKit — Prezentare generală

EidKit este un SDK pentru Android și iOS care permite interacțiunea cu **Cartea de Identitate Electronică (CEI) românească** prin NFC.

## Ce este CEI?

Cartea de Identitate Electronică (CEI) este un document biometric emis din 2021 de Ministerul Afacerilor Interne (MAI). Cipul contactless al cardului conține:

| Date | Acces |
|------|-------|
| Identitate de bază (nume, CNP, dată de naștere, naționalitate) | PIN de autentificare 4 cifre |
| Adresă și date despre document | PIN de autentificare 4 cifre |
| Fotografie față (JPEG, ~24 KB) | Fără PIN (~7s) |
| Imagine semnătură olografă (JPEG, ~2.6 KB) | Fără PIN (~1.5s) |
| Cheie de semnătură electronică | PIN de semnătură 6 cifre |

Toată comunicarea cu cipul folosește protocolul **PACE** (Password Authenticated Connection Establishment), cu cheia derivată din **CAN** (Card Access Number) — numărul de 6 cifre tipărit pe fața cardului.

## Ce face EidKit

EidKit gestionează tot procesul, de la managementul sesiunii NFC până la verificările criptografice:

- **Stabilire cheie PACE** — derivă cheile de sesiune din CAN, deschide un canal criptat cu cipul
- **Autentificare pasivă** — verifică hash-urile grupurilor de date față de Certificatul Semnatarului de Documente și rădăcina CSCA (certificatul MAI inclus în SDK), confirmând că documentul a fost emis de MAI și că datele nu au fost modificate
- **Citire KYC** — citește identitate, date personale, fotografie și imaginea semnăturii din applet-urile cardului
- **Semnare documente** — se autentifică cu cheia de non-repudiere și produce o semnătură ECDSA-SHA384 peste un hash de document
- **Autentificare activă** — challenge/response cu cheia de autentificare a cipului, confirmând că cipul este autentic și nu a fost clonat; returnează un `CeiIdentityClaim` JWT semnat

## Puncte de intrare în SDK

| Clasă | Scop |
|-------|------|
| `EidKit` | Punct principal de intrare — configurare SDK, obținere builder-e |
| `CeiReader` | Builder pentru sesiuni de citire KYC |
| `CeiSigner` | Builder pentru sesiuni de semnare documente |

## Cerințe minime

| Platformă | Versiune minimă |
|-----------|----------------|
| Android | API 26 (Android 8.0) |
| iOS | iOS 15 |

## Pași următori

- [Ghid rapid Android](/docs/android-quickstart)
- [Ghid rapid iOS](/docs/ios-quickstart)
