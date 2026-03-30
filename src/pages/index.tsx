import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { IdCard, FileSignature, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

// Official Android robot SVG (Google brand asset, simple flat version)
function AndroidIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.523 15.341a.87.87 0 0 1-.87-.87V9.306a.87.87 0 1 1 1.74 0v5.165a.87.87 0 0 1-.87.87ZM6.477 15.341a.87.87 0 0 1-.87-.87V9.306a.87.87 0 1 1 1.74 0v5.165a.87.87 0 0 1-.87.87ZM8.304 5.93l-.953-1.65a.25.25 0 1 1 .433-.25l.965 1.672A6.257 6.257 0 0 1 12 5.097c.937 0 1.823.21 2.61.575l.966-1.673a.25.25 0 1 1 .433.25l-.953 1.65A6.197 6.197 0 0 1 18.174 9.1H5.826A6.197 6.197 0 0 1 8.304 5.93ZM10.3 7.826a.435.435 0 1 0-.87 0 .435.435 0 0 0 .87 0Zm4.27 0a.435.435 0 1 0-.87 0 .435.435 0 0 0 .87 0ZM5.826 9.97h12.348v7.402a1.24 1.24 0 0 1-1.24 1.24h-.806v2.519a.87.87 0 1 1-1.74 0v-2.52h-4.776v2.52a.87.87 0 1 1-1.74 0v-2.519h-.806a1.24 1.24 0 0 1-1.24-1.24V9.97Z" />
    </svg>
  );
}

// Apple logo SVG
function AppleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.32.07 2.24.72 3.01.75.96-.19 1.88-.87 3.17-.94 1.34-.07 2.61.47 3.46 1.46-3.07 1.78-2.58 5.85.36 7.07-.64 1.56-1.46 3.1-3 3.52ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

interface FeatureCard {
  icon: ReactNode;
  title: string;
  description: string;
}

function useFeatures(): FeatureCard[] {
  return [
    {
      icon: <IdCard size={28} strokeWidth={1.5} />,
      title: translate({ id: 'homepage.feature.kyc.title', message: 'KYC — Citire date card' }),
      description: translate({
        id: 'homepage.feature.kyc.description',
        message:
          'Citește câmpuri de identitate (nume, CNP, dată de naștere), fotografie față, imaginea semnăturii olografe și adresa completă din applet-ul EDATA — totul într-o singură atingere NFC.',
      }),
    },
    {
      icon: <FileSignature size={28} strokeWidth={1.5} />,
      title: translate({ id: 'homepage.feature.signing.title', message: 'Semnare documente' }),
      description: translate({
        id: 'homepage.feature.signing.description',
        message:
          'Produce o semnătură calificată ECDSA-SHA384 folosind cheia de non-repudiere de pe cipul cardului. Integrează direct într-un PDF PAdES/eIDAS sau trimite la serviciul tău de semnare.',
      }),
    },
    {
      icon: <ShieldCheck size={28} strokeWidth={1.5} />,
      title: translate({
        id: 'homepage.feature.activeauth.title',
        message: 'Autentificare activă',
      }),
      description: translate({
        id: 'homepage.feature.activeauth.description',
        message:
          'Verificare challenge-response că cipul este autentic și nu a fost clonat. Returnează material criptografic pentru verificare independentă în backend.',
      }),
    },
  ];
}

function Hero(): ReactNode {
  const logoUrl = useBaseUrl('/img/logo-white.svg');
  const demoVideoUrl = useBaseUrl('/img/demo.mp4');
  return (
    <header className="hero--eidkit">
      <div className="container hero__container">
        <div className="hero__content">
          <div className="hero__logo">
            <img src={logoUrl} alt="EidKit" height={48} />
          </div>
          <h1 className="hero__title">
            <Translate id="homepage.hero.title">
              Infrastructură pentru Cartea de Identitate Electronică Românească
            </Translate>
          </h1>
          <p className="hero__subtitle">
            <Translate id="homepage.hero.subtitle">
              Verifică identitatea, semnează documente și autentifică utilizatori printr-o
              singură atingere a cărții de identitate pe telefonul tău.
            </Translate>
          </p>
          <div>
            <Link className="button button--lg button--hero-primary" to="/docs/overview">
              <Translate id="homepage.hero.cta.docs">Citește documentația</Translate>
            </Link>
            <Link
              className="button button--lg button--hero-secondary"
              href="mailto:sales@eidkit.ro"
            >
              <Translate id="homepage.hero.cta.contact">Contactează-ne</Translate>
            </Link>
          </div>
          <div className="platform-badges">
            <span className="platform-badge">
              <AndroidIcon size={22} />
              Android · Kotlin
            </span>
            <span className="platform-badge">
              <AppleIcon size={22} />
              iOS · Swift
            </span>
          </div>
        </div>
        <div className="hero__demo">
          <video
            src={demoVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="hero__demo-video"
          />
        </div>
      </div>
    </header>
  );
}

function Features(): ReactNode {
  const features = useFeatures();
  return (
    <section className="features-section">
      <div className="features-grid">
        {features.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-card__icon">{f.icon}</div>
            <div className="feature-card__title">{f.title}</div>
            <p className="feature-card__description">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Infrastructură pentru Cartea de Identitate Electronică Românească"
      description={siteConfig.tagline}
    >
      <Head>
        <meta name="keywords" content="carte electronica identitate, CEI SDK, NFC identitate Romania, KYC Romania, semnatura electronica CEI, integrare buletin electronic, eIDAS Romania, Android iOS SDK identitate" />
      </Head>
      <Hero />
      <main>
        <Features />
      </main>
    </Layout>
  );
}
