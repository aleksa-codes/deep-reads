export const siteConfig = {
  // Basic site info
  title: 'DeepReads',
  author: 'DeepReads',
  description: 'A curated collection of deep, insightful articles and reads from across the web.',
  url: 'https://deepreads.netlify.app',

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
    email: 'contact@deepreads.com',
  },

  // Navigation
  navigation: [
    { href: '/reads', label: 'Reads' },
    { href: '/tags', label: 'Tags' },
  ],
};

export type SiteConfig = typeof siteConfig;
