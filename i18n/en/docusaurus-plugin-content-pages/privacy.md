---
title: Privacy Policy
description: Privacy policy for the EidKit Demo app and EidKit SSO service
---

# Privacy Policy

*Last updated: April 30, 2026*

---

## Who we are

**EidKit** is an SDK and authentication service for the Romanian Electronic Identity Card (CEI). This policy covers:

1. **EidKit Demo app** — mobile application for Android and iOS
2. **EidKit SSO service** — OIDC identity provider at `idp.eidkit.ro`

Data controller: **Cătălin Toma** (individual) · Contact: [hello@eidkit.ro](mailto:hello@eidkit.ro)

---

## 1. EidKit Demo App

### What data we collect

**The app itself collects no personal data.**

All data read from the identity card chip (name, CNP, photo, address, etc.) stays exclusively on your device. It is not transmitted, stored, or processed on any external server by the app.

**Exception — SSO flow:** If you open an `eidkit://auth` link (for example by scanning a QR code on a partner website), the app will send your identity data (name, date of birth, address) and the associated cryptographic proof (hashes, chip signature, certificates) to `idp.eidkit.ro` over HTTPS. This flow is initiated solely by you, explicitly, by scanning the QR code and entering your PIN. See section 2 for details.

### Technical diagnostic data

The app uses [Sentry](https://sentry.io) for technical error reporting (crash reports). Sentry may collect:

- Device information (model, OS version)
- Call stack (stack trace) in the event of a crash
- **No personal data or card data is included**

Error reports are used solely to improve app stability.

### Permissions

| Permission | Reason |
|-----------|--------|
| NFC | Reading the chip on the electronic identity card |
| Storage (Android API 26–28) | Saving generated PDFs to the Downloads folder |
| Network | Exclusively for the optional SSO flow (POST cryptographic proof) |

---

## 2. EidKit SSO Service

EidKit SSO is an OIDC identity provider that enables authentication with the Romanian ID card on partner websites. If you authenticate on a site that uses EidKit SSO, this section applies to you.

### What data we process and why

| Data | Purpose | Legal basis |
|------|---------|-------------|
| Cryptographic proof (hashes, chip signature, certificates) | Verifying the card is genuine and was issued by the Romanian MAI | Explicit consent (you initiate the flow by scanning the QR and entering your PIN) |
| Name, given name, date of birth | Passed to the partner website according to the requested scopes | Explicit consent |
| Address | Passed to the partner website if the `address` scope is requested | Explicit consent |
| CNP (SHA-256 hash) | Generating a stable unique identifier (`sub`) — the raw CNP is not shared with the website | Explicit consent |
| CNP (in plain text) | Only if the `cei:cnp` scope is explicitly requested by the website | Explicit consent |

### What we do NOT store

- **There is no database** of user data on EidKit servers
- **Sessions are in-memory**, with a 5-minute TTL — deleted automatically
- **Authorization codes** have a 60-second TTL and are deleted after first use
- **We do not retain** copies of your identity data after the token has been issued

### Who we share data with

Identity data (according to the scopes you approved) is transmitted exclusively to the **partner website** that initiated the authentication request. EidKit acts as a technical verification intermediary, not as the final recipient of your data.

Partner websites have their own privacy policies and are responsible for how they use the data they receive.

### Your rights (GDPR)

Because we do not store personal data, most GDPR rights (access, rectification, erasure) should be exercised with the partner website that received your data, not with EidKit. However, you can contact [hello@eidkit.ro](mailto:hello@eidkit.ro) with any questions.

---

## 3. Cookies and tracking

Neither the mobile app nor the `idp.eidkit.ro` server uses tracking, advertising, or third-party analytics cookies.

---

## 4. Policy changes

Any significant changes will be published on this page with a revised update date. Continued use of the service after changes are published constitutes acceptance of those changes.

---

## 5. Contact

For any privacy-related questions or to exercise your GDPR rights:
[hello@eidkit.ro](mailto:hello@eidkit.ro)
