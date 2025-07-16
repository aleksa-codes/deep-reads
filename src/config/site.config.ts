export const siteConfig = {
  // Basic site info
  title: 'Forest Designs',
  author: 'Forest Designs',
  description: 'We design and develop beautiful websites that help you stand out from the competition.',
  url: 'https://forestdesigns.netlify.app',

  // SEO & Metadata
  defaultLocale: 'en_US',
  twitter: {
    creator: undefined,
    site: undefined,
  },
  defaultOgImage: '/og-image.png',

  // Contact Information
  contact: {
    phone: '(123) 456-7890',
    email: 'contact@forestdesigns.com',
  },

  // Navigation
  navigation: [
    { href: '/', label: 'Home' },
    { href: '/design/', label: 'Design' },
    {
      href: '/our-work/',
      label: 'Our Work',
      dropdown: [
        { href: '/our-work/websites/', label: 'Websites' },
        { href: '/our-work/applications/', label: 'Applications' },
        { href: '/our-work/marketing/', label: 'Marketing' },
      ],
    },
    { href: '/blog/', label: 'Blog' },
    { href: '/components/', label: 'Components' },
  ],
};

export type SiteConfig = typeof siteConfig;
