import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { QrCode, Smartphone, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

function BrowserFrame({ src }: { src: string }): ReactNode {
  return (
    <div className="browser-frame">
      <div className="browser-frame__bar">
        <span className="browser-frame__dot browser-frame__dot--red" />
        <span className="browser-frame__dot browser-frame__dot--yellow" />
        <span className="browser-frame__dot browser-frame__dot--green" />
      </div>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="browser-frame__video"
      />
    </div>
  );
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return value;
}

function StatItem({ target, label }: { target: number; label: string }) {
  const value = useCountUp(target);
  return (
    <div className="sso-stats__item">
      <span className="sso-stats__number">{value.toLocaleString('ro-RO')}</span>
      <span className="sso-stats__label">{label}</span>
    </div>
  );
}

function StatsBar(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const idpUrl = (siteConfig.customFields?.idpUrl as string) || 'https://idp.eidkit.ro';
  const [stats, setStats] = useState<{ clients: number; verifications: number } | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`${idpUrl}/api/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!ref.current || !stats) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [stats]);

  if (!stats) return null;

  return (
    <div className="sso-stats" ref={ref}>
      <StatItem
        target={visible ? stats.clients : 0}
        label={translate({ id: 'sso.stats.clients', message: 'aplicații integrate' })}
      />
      <StatItem
        target={visible ? stats.verifications : 0}
        label={translate({ id: 'sso.stats.verifications', message: 'autentificări' })}
      />
    </div>
  );
}

function HowItWorksStep({ icon, step, title, description }: { icon: ReactNode; step: string; title: string; description: string }) {
  return (
    <div className="sso-step">
      <div className="sso-step__icon">{icon}</div>
      <div className="sso-step__number">{step}</div>
      <div className="sso-step__title">{title}</div>
      <p className="sso-step__description">{description}</p>
    </div>
  );
}

function CitizenSection(): ReactNode {
  return (
    <section className="sso-section sso-section--citizen">
      <div className="container">
        <h2 className="sso-section__title">
          <Translate id="sso.citizen.title">Cum funcționează pentru clienții tăi</Translate>
        </h2>
        <p className="sso-section__subtitle">
          <Translate id="sso.citizen.subtitle">
            Utilizatorii tăi se autentifică pe site-ul tău cu buletinul electronic — fără parolă, fără formular.
          </Translate>
        </p>

        <div className="sso-steps">
          <HowItWorksStep
            icon={<QrCode size={32} strokeWidth={1.5} />}
            step="1"
            title={translate({ id: 'sso.step1.title', message: 'Scanează codul QR' })}
            description={translate({ id: 'sso.step1.description', message: 'Site-ul afișează un cod QR. Deschizi aplicația EidKit pe telefon și îl scanezi.' })}
          />
          <div className="sso-steps__arrow"><ArrowRight size={24} /></div>
          <HowItWorksStep
            icon={<Smartphone size={32} strokeWidth={1.5} />}
            step="2"
            title={translate({ id: 'sso.step2.title', message: 'Introdu CAN și PIN' })}
            description={translate({ id: 'sso.step2.description', message: 'Introduci CAN-ul (6 cifre de pe față cardului) și PIN-ul de 4 cifre setat la MAI.' })}
          />
          <div className="sso-steps__arrow"><ArrowRight size={24} /></div>
          <HowItWorksStep
            icon={<CreditCard size={32} strokeWidth={1.5} />}
            step="3"
            title={translate({ id: 'sso.step3.title', message: 'Atinge cardul' })}
            description={translate({ id: 'sso.step3.description', message: 'Apropii cartea de identitate de spatele telefonului. Identitatea este verificată criptografic — ești autentificat.' })}
          />
        </div>

        <div className="sso-privacy">
          <ShieldCheck size={20} strokeWidth={1.5} />
          <p>
            <Translate id="sso.citizen.privacy">
              Datele partajate (nume, dată de naștere, adresă) provin direct din cipul cărții de identitate, verificate de MAI — nu sunt introduse manual de tine. CNP-ul nu este niciodată transmis site-ului dacă nu este solicitat explicit.
            </Translate>
          </p>
        </div>

        <div className="sso-clients">
          <p className="sso-clients__label">
            <Translate id="sso.citizen.clients_label">Site-uri care acceptă autentificarea cu buletin:</Translate>
          </p>
          <ul className="sso-clients__list">
            <li>
              <Link href="https://primariatm.eidkit.ro">
                Primăria Timișoara <span className="sso-clients__pill">demo</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function DeveloperSection(): ReactNode {
  return (
    <section className="sso-section sso-section--developer">
      <div className="container">
        <h2 className="sso-section__title">
          <Translate id="sso.developer.title">Adaugă autentificarea cu buletin pe platforma ta</Translate>
        </h2>
        <p className="sso-section__subtitle">
          <Translate id="sso.developer.subtitle">
            EidKit SSO funcționează ca orice alt provider OIDC — același flux ca Google Sign-In sau Apple Sign-In. Utilizatorii tăi se autentifică prin atingerea cardului, tu primești date verificate de MAI.
          </Translate>
        </p>

        <div className="sso-value-grid">
          <div className="sso-value-item">
            <div className="sso-value-item__title">
              <Translate id="sso.developer.value1.title">Un tap = cont nou sau autentificare</Translate>
            </div>
            <p>
              <Translate id="sso.developer.value1.body">Nu există diferență între înregistrare și login. Prima atingere a cardului creează contul automat — fără formular, fără email, fără parolă.</Translate>
            </p>
          </div>
          <div className="sso-value-item">
            <div className="sso-value-item__title">
              <Translate id="sso.developer.value2.title">Date verificate, nu auto-declarate</Translate>
            </div>
            <p>
              <Translate id="sso.developer.value2.body">Numele, data nașterii și adresa vin direct din cipul cărții de identitate, verificate criptografic de MAI. Nu depinzi de ce introduce utilizatorul.</Translate>
            </p>
          </div>
          <div className="sso-value-item">
            <div className="sso-value-item__title">
              <Translate id="sso.developer.value3.title">Zero trust — card fizic + PIN obligatorii</Translate>
            </div>
            <p>
              <Translate id="sso.developer.value3.body">Serverul nu emite niciun token fără dovadă criptografică că utilizatorul deține cardul fizic și cunoaște PIN-ul. Legătura criptografică între identitate și cip (Chip Authentication, BSI TR-03110) face extrem de dificil și detectabil atacul de separare a dovezilor — orice tentativă lasă o urmă forensică permanentă. Nicio parolă capturată, niciun screenshot, nicio clonare nu pot trece verificarea.</Translate>
            </p>
          </div>
          <div className="sso-value-item">
            <div className="sso-value-item__title">
              <Translate id="sso.developer.value4.title">Integrare standard OIDC</Translate>
            </div>
            <p>
              <Translate id="sso.developer.value4.body">Client ID, Client Secret, redirect URI — exact ca orice alt provider. Dacă ai integrat vreodată Google sau GitHub OAuth, știi deja tot ce ai nevoie.</Translate>
            </p>
          </div>
        </div>

        <div className="sso-cta-block">
          <p className="sso-cta-block__text">
            <Translate id="sso.developer.cta.text">
              Contactează-ne pentru acces și îți configurăm primul client OIDC.
            </Translate>
          </p>
          <div className="sso-cta-block__buttons">
            <Link className="button button--lg button--primary" href="mailto:hello@eidkit.ro?subject=EidKit%20SSO%20Access">
              <Translate id="sso.developer.cta.button">Contactează-ne pentru acces</Translate>
            </Link>
            <Link className="button button--lg button--secondary" to="/docs/sso/integration">
              <Translate id="sso.developer.cta.docs">Documentație integrare</Translate>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SsoPage(): ReactNode {
  const pocVideoUrl = useBaseUrl('/img/eidkit_poc.mp4');
  return (
    <Layout
      title={translate({ id: 'sso.page.title', message: 'SSO — Autentificare cu buletinul electronic' })}
      description={translate({
        id: 'sso.page.description',
        message: 'Adaugă autentificarea cu Cartea de Identitate Electronică românească pe site-ul tău. Standard OIDC, fără parole, date verificate de MAI.',
      })}
    >
      <header className="sso-hero">
        <div className="container sso-hero__container">
          <div className="sso-hero__content">
            <h1 className="sso-hero__title">
              <Translate id="sso.hero.title">Autentificare cu buletinul electronic</Translate>
            </h1>
            <p className="sso-hero__subtitle">
              <Translate id="sso.hero.subtitle">
                Un tap cu cartea de identitate înlocuiește înregistrarea și autentificarea — fără parolă, fără formular, cu date verificate de MAI.
              </Translate>
            </p>
          </div>
          <div className="sso-hero__demo">
            <BrowserFrame src={pocVideoUrl} />
          </div>
        </div>
        <div className="container">
          <StatsBar />
        </div>
      </header>
      <main>
        <CitizenSection />
        <DeveloperSection />
      </main>
    </Layout>
  );
}
