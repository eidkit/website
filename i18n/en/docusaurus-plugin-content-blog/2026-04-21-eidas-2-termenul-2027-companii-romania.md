---
slug: eidas-2-2027-deadline-romanian-companies
title: "2027 Is Closer Than It Looks. What eIDAS 2.0 Means for Companies in Romania."
authors: [catalin]
date: 2026-04-21
tags: [eidas, eudi-wallet, kyc, regulation, romania, banking, fintech]
description: >
  By the end of 2027, banks, fintechs, insurers and telecoms in Romania will be legally required to accept the EUDI Wallet for user authentication. 2026 is the preparation year. Here is what that means in practice.
image: /img/blog/eidas-2027-og.png
keywords:
  - eIDAS 2.0 Romania companies 2027
  - EUDI Wallet Romania banks fintech obligations
  - European digital identity wallet Romania 2026
  - eIDAS 2 strong customer authentication Romania
  - digital identity regulation Romania
  - CEI EUDI Wallet integration
---

On 4 December 2024, the European Commission published the first implementing acts of Regulation (EU) 2024/1183 — eIDAS 2.0. Twenty days later, they entered into force. Since then, the clock has been running.

The deadlines are legal, not aspirational. By the end of 2026, every EU Member State must make at least one certified European Digital Identity Wallet available to citizens. By the end of 2027, private companies in regulated sectors are required to accept it. And the sectors that fall under this obligation include, explicitly, banks, payment service providers, insurers, and telecoms.

If you work in any of these domains in Romania, 2026 is the year to understand what this transition involves — not 2027.

---

## What the EUDI Wallet Is, and Its Connection to the Electronic ID Card

The EUDI Wallet is a standardised mobile app in which citizens can store and present verified identity credentials — their identity card, driving licence, diplomas, professional qualifications, and other attributes. Users control what data they share and with whom, through selective disclosure: you can prove you are over 18 without revealing your exact date of birth, or confirm you are a resident of a Member State without giving your full address.

The connection to the Romanian CEI is direct and intentional. The Director of DGEP, Cătălin Giulescu, has publicly stated that [the electronic identity card is "an intermediary" in the digitisation process](https://validsoftware.ro/portofelul-digital-european-eudi-wallet-ce-este-cand-vine-si-ce-trebuie-sa-faca-firmele-si-institutiile-din-romania/) — the platform on which Romania's EUDI Wallet will be built. The CEI chip, with its MAI-issued digital certificates, is the primary enrollment mechanism for the wallet. Without CEI, there is no Romanian EUDI Wallet.

Romania is already participating in the EUDIW-PACT pilot project coordinated by the French Ministry of the Interior, alongside 24 other Member States. On 17-18 March 2026, cross-border interoperability tests took place in Bucharest in a live environment — working credential exchange between different Member States.

---

## The Timeline, Clearly

| Deadline | Obligation |
|----------|------------|
| **24 Dec 2024** | First implementing acts enter into force — clock starts |
| **31 Dec 2026** | Each Member State provides at least one certified EUDI Wallet |
| **31 Dec 2026** | Public and semi-public bodies required to accept it |
| **31 Dec 2027** | **Private companies in regulated sectors required to accept it** |

Article 5f(2) of the Regulation is direct: private companies already legally required to use strong user authentication — Strong Customer Authentication — must accept the EUDI Wallet at the user's request, within 36 months of the implementing acts entering into force. The legal basis for SCA in financial services is PSD2. If you are a bank or fintech processing payments, the obligation is certain.

Penalties for non-compliance reach **€5 million or 1% of global turnover**, whichever is higher.

---

## Why 2026 Is the Year to Act, Not 2027

There is a common trap in how companies read regulatory deadlines: they see 2027 and plan for 2027. The problem is that an enterprise-level integration does not complete in a few weeks.

Implementation experts estimate that a full integration, from decision to production, takes between 9 and 18 months for a mid-to-large organisation. A bank with legacy systems, procurement processes, internal audit requirements, and well-defined release cycles will be at the upper end of that range, not the lower.

Companies that start in 2027 will go live in 2028 — after the mandatory deadline. Companies that start in 2026 will be ready on time, and will have gained a competitive advantage: they can offer customers EUDI Wallet authentication before it becomes the standard.

Chambers & Partners, in their Romania FinTech analysis, confirm explicitly: [in practice, 2026 is the preparatory year](https://chambers.com/content/item/7008) to achieve wallet acceptance and adapt onboarding flows for 2027.

---

## What to Prepare, Concretely

**1. Map your identity flows**

The first step is not technical — it is a business exercise. Any company under the obligation must identify every point in its products and services where strong authentication or identity verification occurs: KYC onboarding, authentication for significant transactions, contract signing, access to sensitive data. These are the points that must accept EUDI Wallet credentials.

**2. Register as a Relying Party**

Companies that want to accept the EUDI Wallet must register as a *relying party* with the competent national authority. Without registration, you cannot request credentials from user wallets. The registration process is not instant — it involves identifying your legal entity, specifying the attributes you intend to access, and the business reasons why you need them.

**3. Technical integration**

The technical standards for interacting with the EUDI Wallet — OpenID4VP for credential presentation, OpenID4VCI for issuance, SD-JWT for selective disclosure — are established through the implementing acts. Integration means implementing these protocols alongside existing systems, not replacing them.

**4. Redesign KYC data flows**

The Regulation mandates data minimisation — you may only request the attributes necessary for the given transaction. If you currently have a KYC flow that collects all available data, you will need to redesign it to request selectively only what is needed for each context. This is an architectural change, not just a UI change.

---

## The Situation in Romania: Solid Foundation, Operational Uncertainty

Romania is not starting from scratch. The CEI is already in national rollout, with over 1.5 million cards issued and a target of 5 million by mid-2026. ROeID exists as a government SSO application. EUDI Wallet interoperability tests have already taken place on Romanian soil.

What is missing is operational clarity for the private sector. A recent [Accace](https://www.accace.com/eidas-2-in-romania/) report finds that while legal alignment exists through Law 214/2024, many companies lack clarity on short-term practical requirements. Awareness remains limited outside heavily regulated sectors.

There is also an honest nuance to add: at the European level, some Member States [may not meet the 2026 deadline](https://www.biometricupdate.com/202512/will-the-eudi-wallet-be-ready-in-2026-experts-say-probably-not) for wallet availability, due to the technical complexity and standards still being finalised in parallel. But the 2027 deadline for the private sector is independent of the exact wallet launch timing — the acceptance obligation exists regardless. And in Romania, the CEI is already available and functional as the foundation.

---

## The Connection to Today's Identity Infrastructure

There is a direct continuity between what is available now and what will be mandatory in 2027. The EUDI Wallet in Romania will be populated with data from the CEI. NFC-based KYC flows that read the CEI chip today are architecturally compatible with what accepting EUDI Wallet credentials will require tomorrow — the same assurance level, the same identity data source, the same MAI certificates in the verification chain.

Companies integrating CEI NFC reading today for onboarding and identity verification are not building a temporary solution. They are building the identity infrastructure they will need in 2027 — with one or two years ahead of the legal obligation.

---

*We write about the Romanian CEI — its capabilities, its integration challenges, and the regulatory context around it. If a topic here is relevant to something you're building, feel free to [reach out](mailto:hello@eidkit.ro).*
