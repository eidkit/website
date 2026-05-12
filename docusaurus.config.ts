import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import * as fs from 'fs';
// Load .env.development (or .env.production) if present
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const config: Config = {
  customFields: {
    iosVersion: '0.1.9',
    androidVersion: '0.1.7',
    appStoreUrl: 'https://apps.apple.com/us/app/eidkit-app/id6761855403',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=ro.eidkit.app',
    idpUrl: process.env.DOCUSAURUS_IDP_URL || 'https://idp.eidkit.ro',
  },
  title: 'EidKit',
  tagline: 'Infrastructură pentru Cartea de Identitate Electronică Românească',
  favicon: 'img/favicon.svg',

  url: 'https://eidkit.ro',
  baseUrl: '/',

  organizationName: 'eidkit',
  projectName: 'eidkit-website',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en'],
    localeConfigs: {
      ro: { label: 'Română', direction: 'ltr', htmlLang: 'ro' },
      en: { label: 'English', direction: 'ltr', htmlLang: 'en' },
    },
  },

  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      { trackingID: 'G-0590LWR94E', anonymizeIP: true },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: undefined,
        },
        blog: {
          showReadingTime: true,
          postsPerPage: 10,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/eidkit-social-card.png',
    navbar: {
      title: '',
      logo: {
        alt: 'EidKit',
        src: 'img/logo.svg',
        srcDark: 'img/logo-white.svg',
      },
      items: [
        {
          to: '/sso',
          label: 'SSO',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Dezvoltatori',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/eidkit',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'SSO', to: '/sso' },
            { label: 'Overview', to: '/docs/overview' },
            { label: 'Ghid rapid', to: '/docs/quickstart' },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'hello@eidkit.ro',
              href: 'mailto:hello@eidkit.ro',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/eidkit',
            },
            {
              label: 'Politică de confidențialitate',
              to: '/privacy',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} EidKit.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['kotlin', 'swift', 'groovy'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
