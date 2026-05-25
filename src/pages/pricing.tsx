import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import {
  CheckCircle, ShieldCheck, Cpu, Smartphone, Globe, Database,
  MapPin, BarChart2, Mail,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

// ── Hero ─────────────────────────────────────────────────────────────────────

function PricingHero(): ReactNode {
  return (
    <header className="pricing-hero">
      <div className="container pricing-hero__container">
        <h1 className="pricing-hero__title">
          <Translate id="pricing.hero.title">Prețuri EidKit SSO</Translate>
        </h1>
        <p className="pricing-hero__subtitle">
          <Translate id="pricing.hero.subtitle">
            Platformă + per autentificare reușită. Fără costuri de setup, fără surprize.
          </Translate>
        </p>
        <Link
          className="button button--lg button--primary"
          href="mailto:hello@eidkit.ro?subject=EidKit%20SSO%20Acces"
        >
          <Translate id="pricing.hero.cta">Contactează-ne pentru acces</Translate>
        </Link>
      </div>
    </header>
  );
}

// ── Plan cards ────────────────────────────────────────────────────────────────

interface PlanFeature {
  text: string;
}

interface PlanProps {
  name: string;
  price: string;
  period?: string;
  annualNote?: string;
  included: string;
  overage: string;
  features: PlanFeature[];
  highlighted?: boolean;
  textPrice?: boolean;
  cta: string;
  ctaHref: string;
  badge?: string;
}

function PlanCard({ name, price, period, annualNote, included, overage, features, highlighted, textPrice, cta, ctaHref, badge }: PlanProps): ReactNode {
  return (
    <div className={`pricing-card${highlighted ? ' pricing-card--highlighted' : ''}`}>
      {badge && <div className="pricing-card__badge">{badge}</div>}
      <div className="pricing-card__name">{name}</div>
      <div className={`pricing-card__price${textPrice ? ' pricing-card__price--text' : ''}`}>
        {price}
        {period && <span className="pricing-card__period">{period}</span>}
      </div>
      <div className="pricing-card__annual-note">{annualNote ?? ' '}</div>
      <div className="pricing-card__included">{included}</div>
      <div className="pricing-card__overage">{overage}</div>
      <ul className="pricing-card__features">
        {features.map((f, i) => (
          <li key={i} className="pricing-card__feature">
            <CheckCircle size={14} className="pricing-card__check" />
            {f.text}
          </li>
        ))}
      </ul>
      <Link className={`button button--block${highlighted ? ' button--primary' : ' button--secondary'}`} href={ctaHref}>
        {cta}
      </Link>
    </div>
  );
}

function PlansSection(): ReactNode {
  const [annual, setAnnual] = useState(true);
  const period = translate({ id: 'pricing.period', message: '/lună' });

  return (
    <section className="pricing-section">
      <div className="container">

        {/* Billing toggle */}
        <div className="pricing-toggle">
          <span className={`pricing-toggle__label${!annual ? ' pricing-toggle__label--active' : ''}`}>
            <Translate id="pricing.billing.monthly">Lunar</Translate>
          </span>
          <button
            className={`pricing-toggle__switch${annual ? ' pricing-toggle__switch--on' : ''}`}
            onClick={() => setAnnual(a => !a)}
            aria-label="Toggle annual billing"
            type="button"
          >
            <span className="pricing-toggle__knob" />
          </button>
          <span className={`pricing-toggle__label${annual ? ' pricing-toggle__label--active' : ''}`}>
            <Translate id="pricing.billing.annual">Anual</Translate>
          </span>
          <span className="pricing-toggle__savings">
            <Translate id="pricing.billing.savings">10% reducere</Translate>
          </span>
        </div>

        <div className="pricing-cards">
          <PlanCard
            name="Starter"
            price={annual ? '€269' : '€299'}
            period={period}
            annualNote={annual ? translate({ id: 'pricing.billing.annual_note_starter', message: 'economisești €360/an' }) : undefined}
            included={translate({ id: 'pricing.starter.included', message: '1.000 autentificări incluse' })}
            overage={translate({ id: 'pricing.starter.overage', message: '€0.25 per autentificare suplimentară' })}
            highlighted={true}
            badge={translate({ id: 'pricing.recommended', message: 'Recomandat' })}
            features={[
              { text: translate({ id: 'pricing.feature.oidc', message: 'OIDC SSO standard' }) },
              { text: translate({ id: 'pricing.feature.sdk', message: 'SDK Android + iOS' }) },
              { text: translate({ id: 'pricing.feature.verified', message: 'Date verificate MAI: nume, CNP, dată naștere' }) },
              { text: translate({ id: 'pricing.feature.address', message: 'Adresă verificată din cip' }) },
              { text: translate({ id: 'pricing.feature.dashboard', message: 'Dashboard la dashboard.eidkit.ro' }) },
              { text: translate({ id: 'pricing.feature.support', message: 'Suport email' }) },
            ]}
            cta={translate({ id: 'pricing.cta.start', message: 'Începe acum' })}
            ctaHref="mailto:hello@eidkit.ro?subject=EidKit%20SSO%20Starter"
          />
          <PlanCard
            name="Growth"
            price={annual ? '€719' : '€799'}
            period={period}
            annualNote={annual ? translate({ id: 'pricing.billing.annual_note_growth', message: 'economisești €960/an' }) : undefined}
            included={translate({ id: 'pricing.growth.included', message: '5.000 autentificări incluse' })}
            overage={translate({ id: 'pricing.growth.overage', message: '€0.20 per autentificare suplimentară' })}
            features={[
              { text: translate({ id: 'pricing.feature.oidc', message: 'OIDC SSO standard' }) },
              { text: translate({ id: 'pricing.feature.sdk', message: 'SDK Android + iOS' }) },
              { text: translate({ id: 'pricing.feature.verified', message: 'Date verificate MAI: nume, CNP, dată naștere' }) },
              { text: translate({ id: 'pricing.feature.address', message: 'Adresă verificată din cip' }) },
              { text: translate({ id: 'pricing.feature.dashboard', message: 'Dashboard la dashboard.eidkit.ro' }) },
              { text: translate({ id: 'pricing.feature.webhooks', message: 'Webhook-uri + audit log' }) },
              { text: translate({ id: 'pricing.feature.priority', message: 'Suport prioritar' }) },
            ]}
            cta={translate({ id: 'pricing.cta.contact', message: 'Contactează-ne' })}
            ctaHref="mailto:hello@eidkit.ro?subject=EidKit%20SSO%20Growth"
          />
          <PlanCard
            name="Enterprise"
            textPrice={true}
            price={translate({ id: 'pricing.enterprise.price', message: 'Preț personalizat' })}
            included={translate({ id: 'pricing.enterprise.included', message: 'de la €0.10/auth la >50.000/lună' })}
            overage={translate({ id: 'pricing.enterprise.overage', message: 'Volum negociat' })}
            features={[
              { text: translate({ id: 'pricing.feature.everything', message: 'Tot din Growth' }) },
              { text: translate({ id: 'pricing.feature.sla', message: 'SLA dedicat' }) },
              { text: translate({ id: 'pricing.feature.onprem', message: 'Deployment on-premise disponibil' }) },
              { text: translate({ id: 'pricing.feature.msa', message: 'MSA + DPA personalizat' }) },
              { text: translate({ id: 'pricing.feature.dedicated', message: 'Suport dedicat' }) },
            ]}
            cta={translate({ id: 'pricing.cta.discuss', message: 'Contactează-ne' })}
            ctaHref="mailto:hello@eidkit.ro?subject=EidKit%20SSO%20Enterprise"
          />
        </div>

        {/* Pilot program callout */}
        <div className="pricing-pilot">
          <div className="pricing-pilot__icon">🚀</div>
          <div>
            <div className="pricing-pilot__title">
              <Translate id="pricing.pilot.title">Program Pilot — €150/lună</Translate>
            </div>
            <p className="pricing-pilot__body">
              <Translate id="pricing.pilot.body">
                Primii clienți care integrează EidKit SSO beneficiază de 3 luni la €150/lună cu toate funcționalitățile planului Starter incluse. La final, prețul se ajustează la planul standard în funcție de volumul real de utilizare.
              </Translate>
            </p>
            <Link href="mailto:hello@eidkit.ro?subject=EidKit%20SSO%20Pilot" className="button button--lg button--primary">
              <Translate id="pricing.pilot.cta">Aplică pentru pilot</Translate>
            </Link>
          </div>
        </div>

        {/* Model bullets */}
        <div className="pricing-model">
          {[
            translate({ id: 'pricing.model.1', message: 'Platformă (taxă lunară fixă) + per verificare reușită — nu per încercare' }),
            translate({ id: 'pricing.model.2', message: 'Fără costuri de setup' }),
            translate({ id: 'pricing.model.3', message: 'Fără contract minim (Starter și Growth)' }),
            translate({ id: 'pricing.model.4', message: 'Facturare lunară sau anuală (10% reducere anual)' }),
          ].map((text, i) => (
            <div key={i} className="pricing-model__item">
              <CheckCircle size={16} className="pricing-model__check" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Included in all plans ─────────────────────────────────────────────────────

function IncludedSection(): ReactNode {
  const items = [
    { icon: <Smartphone size={24} strokeWidth={1.5} />, title: translate({ id: 'pricing.included.sdk.title', message: 'SDK Android + iOS' }), body: translate({ id: 'pricing.included.sdk.body', message: 'Citire cip CEI via NFC, integrare nativă în aplicația ta mobilă.' }) },
    { icon: <Globe size={24} strokeWidth={1.5} />, title: translate({ id: 'pricing.included.oidc.title', message: 'OIDC SSO standard' }), body: translate({ id: 'pricing.included.oidc.body', message: 'Integrare ca Google Sign-In. Client ID, Client Secret, redirect URI — gata.' }) },
    { icon: <ShieldCheck size={24} strokeWidth={1.5} />, title: translate({ id: 'pricing.included.crypto.title', message: 'PACE + PA + AA + Chip Authentication' }), body: translate({ id: 'pricing.included.crypto.body', message: 'Verificare criptografică completă a cipului conform BSI TR-03110.' }) },
    { icon: <Database size={24} strokeWidth={1.5} />, title: translate({ id: 'pricing.included.data.title', message: 'Date verificate MAI' }), body: translate({ id: 'pricing.included.data.body', message: 'Nume, CNP, dată naștere, cetățenie — direct din cipul cărții de identitate.' }) },
    { icon: <MapPin size={24} strokeWidth={1.5} />, title: translate({ id: 'pricing.included.address.title', message: 'Adresă verificată din cip' }), body: translate({ id: 'pricing.included.address.body', message: 'Noua CEI nu mai tipărește adresa pe față — EidKit o citește direct din cip.' }) },
    { icon: <Cpu size={24} strokeWidth={1.5} />, title: translate({ id: 'pricing.included.stateless.title', message: 'Server stateless, GDPR by design' }), body: translate({ id: 'pricing.included.stateless.body', message: 'Nu stocăm date de identitate sau biometrice. Claims OIDC transmise direct aplicației tale.' }) },
    { icon: <BarChart2 size={24} strokeWidth={1.5} />, title: translate({ id: 'pricing.included.dashboard.title', message: 'Dashboard dezvoltatori' }), body: translate({ id: 'pricing.included.dashboard.body', message: 'Gestionare clienți OIDC, redirect URI-uri și statistici la dashboard.eidkit.ro.' }) },
  ];

  return (
    <section className="pricing-section pricing-section--alt">
      <div className="container">
        <h2 className="pricing-section__title">
          <Translate id="pricing.included.title">Inclus în toate planurile</Translate>
        </h2>
        <div className="pricing-included-grid">
          {items.map((item, i) => (
            <div key={i} className="pricing-included-item">
              <div className="pricing-included-item__icon">{item.icon}</div>
              <div className="pricing-included-item__title">{item.title}</div>
              <p className="pricing-included-item__body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Comparison table ──────────────────────────────────────────────────────────

function ComparisonSection(): ReactNode {
  return (
    <section className="pricing-section">
      <div className="container">
        <h2 className="pricing-section__title">
          <Translate id="pricing.comparison.title">Comparație cu alternativele</Translate>
        </h2>
        <div className="pricing-table-wrap">
          <table className="pricing-table">
            <thead>
              <tr>
                <th><Translate id="pricing.table.solution">Soluție</Translate></th>
                <th><Translate id="pricing.table.cost">Cost per verificare</Translate></th>
                <th><Translate id="pricing.table.assurance">Nivel asigurare eIDAS</Translate></th>
                <th><Translate id="pricing.table.address">Adresă verificată</Translate></th>
              </tr>
            </thead>
            <tbody>
              <tr className="pricing-table__row--highlight">
                <td><strong>EidKit SSO</strong></td>
                <td><strong>€0.25</strong></td>
                <td><strong><Translate id="pricing.table.high">High (cip CEI)</Translate></strong></td>
                <td>✓ <Translate id="pricing.table.from_chip">din cip MAI</Translate></td>
              </tr>
              <tr>
                <td>Sumsub</td>
                <td>$1.35–$1.85</td>
                <td><Translate id="pricing.table.substantial">Substantial (video KYC)</Translate></td>
                <td>✗ <Translate id="pricing.table.self_declared">auto-declarată</Translate></td>
              </tr>
              <tr>
                <td>Veriff</td>
                <td>$0.80–$1.89</td>
                <td><Translate id="pricing.table.substantial">Substantial (video KYC)</Translate></td>
                <td>✗ <Translate id="pricing.table.self_declared">auto-declarată</Translate></td>
              </tr>
              <tr>
                <td>Didit</td>
                <td>$0.33</td>
                <td><Translate id="pricing.table.substantial">Substantial (video KYC)</Translate></td>
                <td>✗ <Translate id="pricing.table.self_declared">auto-declarată</Translate></td>
              </tr>
              <tr>
                <td>ROeID</td>
                <td><Translate id="pricing.table.na">N/A</Translate></td>
                <td><Translate id="pricing.table.substantial">Substantial</Translate></td>
                <td>✗ <Translate id="pricing.table.public_only">sector public only</Translate></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

function FaqItem({ question, answer }: { question: string; answer: string }): ReactNode {
  return (
    <details className="pricing-faq__item">
      <summary className="pricing-faq__question">{question}</summary>
      <p className="pricing-faq__answer">{answer}</p>
    </details>
  );
}

function FaqSection(): ReactNode {
  const items = [
    {
      question: translate({ id: 'pricing.faq.q1', message: 'Ce este o "autentificare reușită"?' }),
      answer: translate({ id: 'pricing.faq.a1', message: 'O autentificare în care utilizatorul a parcurs complet fluxul (scanare QR, CAN + PIN, tap card) și serverul a emis un token OIDC valid. Sesiunile abandonate sau eșuate nu se taxează.' }),
    },
    {
      question: translate({ id: 'pricing.faq.q2', message: 'Pot testa înainte să plătesc?' }),
      answer: translate({ id: 'pricing.faq.a2', message: 'Da. Produsul necesită un card CEI real — nu există simulator. Te autentifici cu propriul buletin pe dashboard.eidkit.ro și primești imediat un client ID + redirect URI. Poți testa complet fluxul OIDC în producție înainte să ne contactezi pentru un plan plătit.' }),
    },
    {
      question: translate({ id: 'pricing.faq.q3', message: 'Am nevoie de un contract special cu MAI?' }),
      answer: translate({ id: 'pricing.faq.a3', message: 'Nu. EidKit citește cipul CEI folosind standardele publice ICAO 9303 și BSI TR-03110. Nu este necesară nicio aprobare specială din partea MAI.' }),
    },
    {
      question: translate({ id: 'pricing.faq.q4', message: 'Este conform cu GDPR?' }),
      answer: translate({ id: 'pricing.faq.a4', message: 'Da. Serverul EidKit este stateless — nu stocăm date de identitate sau biometrice. Datele sunt extrase din cip, verificate criptografic, și transmise ca claims OIDC direct către aplicația ta.' }),
    },
    {
      question: translate({ id: 'pricing.faq.q5', message: 'Ce lege guvernează semnătura electronică din CEI?' }),
      answer: translate({ id: 'pricing.faq.a5', message: 'Legea 214/2024 conferă semnăturii electronice avansate din CEI (emisă de MAI) valoare juridică egală cu semnătura olografă pentru actele ad probationem din sectorul privat.' }),
    },
  ];

  return (
    <section className="pricing-section pricing-section--alt">
      <div className="container pricing-faq">
        <h2 className="pricing-section__title">
          <Translate id="pricing.faq.title">Întrebări frecvente</Translate>
        </h2>
        <div className="pricing-faq__list">
          {items.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer CTA ────────────────────────────────────────────────────────────────

function FooterCta(): ReactNode {
  return (
    <section className="pricing-cta-section">
      <div className="container pricing-cta-section__inner">
        <Mail size={32} strokeWidth={1.5} className="pricing-cta-section__icon" />
        <h2 className="pricing-cta-section__title">
          <Translate id="pricing.footer.title">Gata să integrezi autentificarea cu buletinul?</Translate>
        </h2>
        <p className="pricing-cta-section__body">
          <Translate id="pricing.footer.body">
            Scrie-ne și îți configurăm primul client OIDC în aceeași zi.
          </Translate>
        </p>
        <div className="pricing-cta-section__buttons">
          <Link className="button button--lg button--primary" href="mailto:hello@eidkit.ro?subject=EidKit%20SSO%20Acces">
            <Translate id="pricing.footer.cta">hello@eidkit.ro</Translate>
          </Link>
          <Link className="button button--lg button--secondary" to="/docs/sso/integration">
            <Translate id="pricing.footer.docs">Documentație integrare</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PricingPage(): ReactNode {
  return (
    <Layout
      title={translate({ id: 'pricing.page.title', message: 'Prețuri — EidKit SSO' })}
      description={translate({
        id: 'pricing.page.description',
        message: 'Planuri EidKit SSO: Starter €299/lună, Growth €799/lună, Enterprise personalizat. Per autentificare reușită, fără costuri de setup.',
      })}
    >
      <PricingHero />
      <main>
        <PlansSection />
        <IncludedSection />
        <ComparisonSection />
        <FaqSection />
        <FooterCta />
      </main>
    </Layout>
  );
}
