import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'overview',
      label: 'Overview',
    },
    'quickstart',
    {
      type: 'category',
      label: 'SSO',
      collapsed: false,
      items: ['sso/integration'],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: ['features/kyc', 'features/signing', 'features/active-auth', 'features/chip-auth'],
    },
    {
      type: 'doc',
      id: 'security-overview',
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Android',
          href: 'https://eidkit.ro/android-api/latest/index.html',
        },
        {
          type: 'link',
          label: 'iOS',
          href: 'https://eidkit.ro/ios-api/latest/documentation/eidkit',
        },
      ],
    },
  ],
};

export default sidebars;
