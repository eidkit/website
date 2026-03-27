import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
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

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/eidkit/eidkit-website/tree/main/',
        },
        blog: false,
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
              label: 'sales@eidkit.ro',
              href: 'mailto:sales@eidkit.ro',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/eidkit',
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
