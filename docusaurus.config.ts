import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  customFields: {
    iosVersion: '0.1.1',
    androidVersion: '0.1.3',
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
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
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
