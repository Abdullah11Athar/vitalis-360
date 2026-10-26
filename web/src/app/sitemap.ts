import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vitalis.brewcraft.shop';

  const routes = [
    '',
    '/patient',
    '/patient/dashboard',
    '/patient/detail',
    '/patient/advisor',
    '/patient/lifestyle',
    '/patient/sleep',
    '/doctor/rounds',
    '/doctor/intelligence',
    '/emergency/triage',
    '/emergency/alert',
    '/emergency/logs',
    '/audits/nyquist',
    '/audits/governance',
    '/audits/forensic',
    '/billing/ledger',
    '/billing/claims',
    '/billing/analysis',
    '/settings',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
