---
slug: romania-electronic-signature-law-2024-cei
title: "Romania's 2024 Electronic Signature Law, Explained. What Your ID Card Can Sign — and What It Can't."
authors: [catalin]
date: 2026-03-28
tags: [electronic-signature, law-214-2024, cei, eidas, romania]
description: >
  Romania's Law 214/2024 entered into force in October 2024 and reshaped the legal framework for electronic signatures. The new ID card gives you a legally valid signature — but not in every context. Here's what the law actually says, where it works, and where the gap between law and infrastructure still bites.
image: /img/blog/law-214-og.png
keywords:
  - Romania electronic signature law 2024
  - Law 214/2024 Romania
  - CEI advanced electronic signature legal effect
  - Romanian ID card signature validity
  - qualified vs advanced electronic signature Romania
  - CEI signature ANAF SPV
---

*This is the second article in our series on Romania's electronic identity card. The first covers [the address problem that's quietly breaking KYC flows](/blog/romanian-id-card-address-problem).*

On 8 October 2024, Romania's [Law 214/2024](https://legislatie.just.ro/Public/DetaliiDocument/285178) on the use of electronic signatures entered into force — the most significant piece of legislation in this domain since the country first regulated electronic signatures in 2001. It repealed the old law, clarified the legal framework for all three signature types recognised under European eIDAS regulation, and for the first time gave a clear legal basis to the signature embedded in the new electronic identity card.

Many people read this as a simple announcement: *your ID card can now sign documents with legal weight.* The reality is more nuanced — and the nuance has immediate practical consequences for anyone building software that involves signed documents, or for individuals trying to understand what their card actually does.

---

## Three Types of Signature, Three Levels of Security

The law, following the EU's eIDAS Regulation, recognises three types of electronic signature. They are not interchangeable.

**Simple Electronic Signature (SES)**
The most basic level. Examples: typing your name at the end of an email, or attaching a PNG image of your signature to a Word document. The law recognises its legal effect in limited circumstances: acts valued below half the gross minimum wage (~925 RON currently), where the other party acknowledges the document through conduct (for instance, by performing the obligations in it), or where both parties — both legal entities — have agreed in writing in advance to accept this signature type.

**Advanced Electronic Signature (AdES)**
A step up. Must be uniquely linked to the signatory, capable of identifying them, created using data under the signatory's exclusive control, and able to detect any subsequent modification to the signed document. The CEI signature falls into this category — it is created using a certificate issued by the Ministry of Internal Affairs, stored on the card's chip, under the holder's control via PIN.

**Qualified Electronic Signature (QES)**
The highest level. An advanced signature that is additionally created using a qualified signature creation device and based on a qualified certificate issued by a qualified trust service provider (QTSP) — an entity accredited and supervised by the state. Romania has several such providers: certSIGN, DigiSign, CertDigital, Trans Sped and others. The certificate is obtained separately, at cost, usually on a USB token or in the cloud.

The CEI signature is **not qualified.** It is advanced, with a certificate issued by a public authority — which places it in a subcategory with broader legal effects than an ordinary advanced signature, but still below qualified.

---

## What the CEI Signature Can Do, per Art. 4 of Law 214/2024

Article 4(5) of the law states that an advanced electronic signature has the same legal effects as a handwritten signature **if** at least one of the following conditions is met:

**a)** the act was signed with an advanced electronic signature created with a certificate issued by a Romanian public authority or institution **or** by a qualified trust service provider

**b)** the electronic document is acknowledged by the party against whom it is invoked — including through performance of the document's obligations

**c)** the parties have expressly agreed, in a separate document signed by hand or with a qualified electronic signature, that they will give the advanced signature the legal effects of a handwritten signature

The CEI satisfies condition **(a)** directly: the certificate is issued by MAI, which is a Romanian public authority. This means that for any act the law requires in written form as a **condition of proof** (*ad probationem*), or for which it imposes no particular form, the CEI signature is equivalent to a handwritten signature — with no further conditions required.

Practical examples where it works: service agreements, consultancy contracts, employment contracts (under GEO 36/2021 which explicitly permits AdES for individual employment contracts), official correspondence, administrative applications, commercial agreements between professionals.

---

## What the CEI Signature Cannot Do

There are two categories where the CEI's advanced signature is not sufficient, regardless of what the law says in theory.

### 1. Acts Requiring Written Form *ad validitatem*

Some legal acts are valid only if they are in written form — not as a condition of proof, but as a condition of validity. Examples: mortgage agreements, donation contracts, articles of association for legal entities. The law says that for these acts, the electronic form is valid if the document is signed with a qualified signature **or** with an advanced signature that produces the effects of a handwritten signature under the conditions of the law.

The CEI can technically satisfy this condition (MAI certificate = public authority = condition (a) met), but in practice notaries and public registries require a qualified signature. They are within their rights to do so, since the law does not prohibit them from imposing stricter technical requirements in their internal procedures.

### 2. Automated Government Platforms — the Practical Problem

**ANAF / SPV:** As of the date of this post, [the ANAF Private Virtual Space does not recognise the CEI signature](https://validsoftware.ro/probleme-cu-cartea-electronica-de-identitate-ce-nu-functioneaza-si-ce-solutii-ofera-guvernul-martie-2026/). Platforms with automated validation check certificates without human intervention and accept only qualified signatures. You can sign a document correctly and legally with your CEI, and the platform will reject it automatically. This applies to: tax declarations D212, D112, D300, and any other filing through SPV.

**ONRC:** Same situation. Registration of corporate acts, statutory amendments, any legally binding operation at the Trade Registry requires a qualified signature.

**SICAP/SEAP:** Participation in public procurement requires a qualified signature.

The technical reason: these platforms were built and configured before the CEI existed at national scale. [Automated validation accepts only qualified certificates](https://alfasign.ro/semnatura-electronica-de-pe-cei-in-relatie-cu-statul/) — the only ones with a well-defined structure that can be validated instantly. The CEI's advanced certificate, though legally valid, does not pass through the same technical channel.

:::caution An important distinction
The law does not say the CEI signature is legally refused by ANAF. The problem is not legal — it is technical. A document signed with a CEI is valid. The platform cannot process it. These are two different things, and the confusion between them has caused considerable frustration.
:::

---

## An Exception Worth Knowing: Closed Electronic Systems

Art. 4(5)(d) of the law allows an advanced signature to produce the effects of a handwritten signature within a **closed electronic system** — a platform used by a defined set of participants, subject to a security audit process. This means a private company can build a signing flow that accepts CEI signatures and give them full legal weight in its internal operations or customer-facing processes, if the system architecture meets the law's conditions.

This is the space where the private sector can and should move faster than the state.

---

## The CEI Certificate: a Few Technical Details

Law 214/2024 contains a specific provision for the CEI certificate: by way of exception from the general two-year rule for advanced signatures, the certificate issued by MAI and inscribed on the electronic identity card is valid for **up to five years** (Art. 3(5)). The exact validity is set by MAI at issuance.

The certificate covers the advanced electronic signature. It is not a qualified certificate. If you need a qualified signature for SPV or ONRC, you must obtain a separate certificate from an accredited provider — certSIGN, DigiSign, CertDigital or another on the list approved by the Authority for the Digitalisation of Romania.

---

## Where It Works Well Now: The Private Sector

If the automated government platforms are the problematic exception, the entire private sector is open territory. The CEI certificate is issued by MAI — a public authority — which means it satisfies condition (a) of Art. 4(5) directly. Any company building a signing flow with the CEI needs no additional conditions: no prior written agreement between parties, no tacit acknowledgement. The signature is valid from the first use.

The domains with the strongest practical potential:

**HR and employment contracts.** GEO 36/2021 explicitly permits advanced electronic signatures for individual employment contracts and all related HR documents. Companies hiring remotely or processing large volumes of HR paperwork need exactly this — verified identity and a signed contract in the same flow.

**Fintech and financial onboarding.** Service agreements, mandate documents, consent forms, credit agreements (excluding mortgages which require a notary). A fintech building its onboarding on CEI gets identity verification, domicile address, and a legally valid signature in a single NFC interaction.

**Real estate — rental.** Lease contracts are *ad probationem*, not *ad validitatem*. The CEI's advanced signature is entirely sufficient. Proptech platforms eliminating in-person attendance at lease signings have the legal foundation to do so.

**Insurance.** Policy contracts, broker mandates, damage claim declarations. The ASF (Financial Supervisory Authority) has actively pushed toward digital workflows. Insurance companies need identity verification at onboarding *and* a signature on policy documents — the CEI handles both.

**Telecommunications.** Subscription contracts are standard commercial agreements, fully valid with an advanced signature. Orange, Vodafone, Digi — each currently has massive onboarding friction.

**Private healthcare.** Consent forms, treatment agreements, admission documents for private clinic networks.

**Freelance and B2B collaboration platforms.** Collaboration agreements, service contracts between professionals. Under Law 214/2024, B2B contracts between professionals with a prior written agreement are valid with any advanced electronic signature.

**Legal services.** Client retainer agreements, mandates (*împuterniciri*), internal document flows for law firms.

**Banking — customer-facing contracts.** Distinct from the SPV/ANAF problem: banking service contracts with individuals, investment mandate agreements, onboarding documents for new accounts — all of these are private relationships, not interactions with automated government platforms. The CEI signature is valid.

What all these domains have in common: they need verified identity *and* a signature *and* they benefit from eliminating friction in their onboarding or signing process. The CEI is the only mechanism available in Romania that delivers all three simultaneously, from a phone, without additional hardware, without a visit to an office.

---

## What Comes Next

The situation is not fixed. The government has indicated it is working on making state platforms technically compatible with the CEI signature, though no public deadline has been committed to. Pressure is building from several directions: the number of CEI cards in circulation is growing quickly, the eIDAS 2.0 Regulation requires institutions to accept recognised electronic identification means, and the EUDI Wallet — the EU digital identity wallet — must be available in Romania by the end of 2026.

For now, the practical picture is straightforward: the CEI signature works well in private-sector relationships and anywhere a human reviews the document. It does not yet work on automated government platforms.

---

*We write about the Romanian CEI — its capabilities, its integration challenges, and the regulatory context around it. If a topic here is relevant to something you're building, feel free to [reach out](mailto:hello@eidkit.ro).*
