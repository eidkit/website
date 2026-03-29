---
slug: romanian-id-card-address-problem
title: "Your New Romanian ID Card Has Your Address. Your Bank Doesn't Know How to Read It."
authors: [catalin]
date: 2026-03-27
tags: [cei, kyc, identity, romania, nfc, domicile]
description: >
  Romania's new electronic identity card no longer prints your home address. The address is on the chip — but most banks, notaries, and institutions can't read it. Here's what's happening and what it means for the software being built around it.
image: /img/blog/en/address-problem-og-en.png
keywords:
  - carte electronica de identitate adresa domiciliu
  - CEI adresa lipsa banca
  - romanian electronic id card address nfc
  - CEI KYC address verification
  - read address from romanian id card nfc
  - buletin electronic adresa domiciliu
---

*This is the first article in our series on Romania's electronic identity card. The second covers [what the 2024 electronic signature law means for the CEI](/blog/romania-electronic-signature-law-2024-cei).*

Something quietly changed when Romania rolled out its new electronic identity card — the *Carte Electronică de Identitate*, or CEI. The home address disappeared from the physical card. No more printed street, number, city, county on the back. That information is now stored exclusively on the chip inside the card, readable only via NFC or a card reader.

In theory, this is an upgrade. The address can be updated electronically when you move, without needing to reissue the card. In practice, it has created a slow-motion crisis that is now visibly breaking down.

---

## The Problem in One Sentence

Millions of Romanians now carry an ID card that legally contains their home address — but cannot hand it to a bank teller, notary, or civil servant in a way they can read it.

As of this week, the Romanian government has logged [over 300 formal complaints](https://www.digi24.ro/stiri/actualitate/social/guvernul-anunta-solutii-la-sesizarile-romanilor-privind-cartea-de-identitate-electronica-principala-problema-lipsa-adresei-3697043) in the "Passport and Identity Card" category alone on its fara-hartie.gov.ro platform. The most reported issue by far: the missing printed address. Banks, notaries, schools, ANAF offices, and local authorities are all asking for a separate *adeverință de domiciliu* — a paper certificate proving the address that is already, technically, on the document they are holding.

One person described arriving at a notary for a property transaction and being turned away because the CEI "was not sufficient to prove domicile." Another went to open a bank account, same story. [A 34-year-old recounted](https://www.capital.ro/obligatoriu-pentru-romanii-cu-buletin-electronic-documentul-de-care-au-nevoie-cetatenii-care-au-carte-de-identitate-electronica.html): *"I got the electronic ID because I understood it was more modern and secure. Nobody told me I'd need a separate certificate every time I have to prove my address."*

This is what happens when infrastructure moves before institutions are ready to use it.

---

## What the Government's Fix Looks Like

To its credit, the government has moved quickly. On March 25, 2026 — two days ago — [civil registry offices were instructed](https://ziare.com/carte-electronica-identitate/probleme-banci-notari-2002776) to look up applicants' addresses themselves in the national database, rather than conditioning service on a physical document.

Banks have received direct database access to the population registry and, according to the government announcement, no longer need to ask for the certificate.

For notaries, a similar mechanism is being tested.

And for everyone else — citizens who need to show address proof somewhere that doesn't have database access yet — the Ministry of Internal Affairs has [launched a mobile app called **RoCEIReader**](https://www.avocatnet.ro/articol_70442/Problema-adresei-de-pe-noile-buletine-rezolvat%C4%83-MAI-a-lansat-o-aplica%C8%9Bie-care-cite%C8%99te-informa%C8%9Biile-de-pe-c%C4%83r%C8%9Bile-electronice-de-identitate.html). You tap your card, enter the 6-digit CAN code and your 4-digit PIN, and the app reads the address off the chip and lets you save it as a PDF.

It is available for Android. The iOS version is "coming soon."

:::caution The shape of this solution
The government's answer to "institutions can't read the chip" is a consumer app for citizens to read the chip themselves and produce a PDF. That PDF is then presented to the institution that couldn't read the chip.

The problem has been partially converted from a technical integration challenge into paperwork — digital paperwork, but paperwork. It works, and it is better than nothing. But it illustrates the gap between what the CEI *is* — a cryptographically secure NFC smart card with a verified, government-signed dataset — and what most systems are currently prepared to do with it.
:::

---

## The Options for Reading the Address

For anyone building software that needs a verified home address in Romania, the transition has real consequences. The old workflow — ask the user for a scan of their ID card, OCR the address from the back — no longer works. The address is not on the back.

The alternatives, roughly in order of robustness:

**Government database lookup**
Banks have been given direct access to the DGEP population registry. Clean, no NFC required, no user interaction beyond a CNP. Access requires a formal agreement with the government authority and is not available to arbitrary private companies on request.

**NFC chip read**
The card is read directly using the CAN code printed on its front face. This gives you the address as the government has it — cryptographically signed, verifiable against the Ministry's certificate chain, no dependency on a third-party database. The address lives in the card's EDATA applet, behind a PACE secure channel and a 4-digit PIN. Reading it correctly requires handling some Romanian-specific data formats that standard ICAO libraries do not cover out of the box.

**User-produced certificate**
The workaround the government is now facilitating via RoCEIReader. Legally valid. Introduces a manual step for the user, a 6-month validity window on the certificate, and friction at exactly the point where onboarding flows tend to lose people.

---

## The Larger Pattern

The address issue is the most visible symptom, but the CEI is capable of considerably more than any institution has caught up to yet.

The chip contains biometric data, a face photo, and two cryptographic keys backed by MAI-issued certificates. One key is for advanced electronic signatures — under Law 214/2024, a document signed with this certificate carries the same legal weight as a handwritten signature. The other is for active authentication: a challenge-response proof that the chip is genuine and not cloned.

And yet [ANAF's own tax filing platform rejects the CEI's signature](https://validsoftware.ro/probleme-cu-cartea-electronica-de-identitate-ce-nu-functioneaza-si-ce-solutii-ofera-guvernul-martie-2026/). It only accepts signatures from separately purchased qualified certificates sold by commercial providers. The card grants you a legally valid signature. The government's own portal won't accept it.

The card is ahead of the ecosystem. The ecosystem is catching up, institution by institution. Banks have caught up on address verification. Notaries are close. ANAF has not caught up on signatures. The same pattern will repeat for every institution that needs to interact with these cards over the next two to three years.

---

## What Reading the Chip Actually Involves

For the technically curious: the CEI chip runs the PACE protocol (Password Authenticated Connection Establishment) using AES-256 to establish a secure channel before anything is readable. After the channel is open, reading personal data requires selecting the correct applet, completing PIN verification, and parsing the response in a Romanian-specific ASN.1 format that is not the same as the ICAO MRZ format most libraries expect.

Passive authentication — verifying that the data on the chip is signed by MAI and hasn't been tampered with — should always run before trusting anything read from the card. It chains from the data groups through the document signing certificate up to the Ministry's CSCA root.

None of this is exotic. But it is specific, and the specifics matter. The card is not something you can integrate with by reading the standard ICAO documentation and adapting a passport reader. The Romanian implementation has its own applet structure, its own data formats, and its own sequence requirements that are not publicly documented in a complete way anywhere.

---

From July 2025, the CEI became the only identity card model being issued nationally. Every identity document issued in Romania from here forward contains a chip the bearer cannot show to most institutions in a form they can read.

That gap will close gradually. The question for anyone building in this space is how long they are willing to wait for it to close, and whether the interim solution — user-produced PDF certificates of what's already on the card — is acceptable friction for their product.

---

---

*We write about the Romanian CEI — its capabilities, its integration challenges, and the regulatory context around it. If a topic here is relevant to something you're building, feel free to [reach out](mailto:hello@eidkit.ro).*
