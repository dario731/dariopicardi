/**
 * JSON-LD builders. Person / Organization / WebSite are emitted on every page
 * (see components/layout/Seo.astro); page-specific nodes are built here and
 * passed in. Every claim in `knowsAbout`, `alumniOf` and `worksFor` is
 * verified — see docs/VERIFIED-CONTENT.md.
 */
import { site, sameAs, localeMeta, type Locale } from '@data/site';

const abs = (path: string) => `${site.url}${path === '/' ? '' : path}`;

export const ids = {
  person: `${site.url}/#person`,
  org: `${site.url}/#organization`,
  website: `${site.url}/#website`,
};

export function personLd() {
  return {
    '@type': 'Person',
    '@id': ids.person,
    name: site.name,
    givenName: site.givenName,
    familyName: site.familyName,
    url: site.url,
    image: `${site.url}/media/dario-picardi-portrait.jpg`,
    jobTitle: site.role,
    description: site.description,
    nationality: { '@type': 'Country', name: 'Italy' },
    homeLocation: { '@type': 'Place', name: site.location.label },
    workLocation: { '@type': 'Place', name: 'Miami Beach, Florida' },
    worksFor: { '@id': ids.org },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Università della Calabria' },
      { '@type': 'CollegeOrUniversity', name: 'Universidad de Valencia' },
    ],
    knowsLanguage: ['it', 'en', 'es', 'pt'],
    knowsAbout: [
      'International business development',
      'Market entry',
      'Distribution and commerce',
      'Beauty and fragrance industry',
      'Duty-free and travel retail',
      'Joint ventures and licensing',
      'Strategic investment',
      'Luxury real estate in Miami',
      'Business, wealth and lifestyle ecosystems',
    ],
    sameAs: sameAs(),
  };
}

export function organizationLd() {
  return {
    '@type': 'Organization',
    '@id': ids.org,
    name: site.organization.name,
    legalName: site.organization.legalName,
    url: site.organization.url,
    foundingDate: site.organization.foundingYear,
    founder: { '@id': ids.person },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.office.streetAddress,
      addressLocality: site.office.addressLocality,
      addressRegion: site.office.addressRegion,
      postalCode: site.office.postalCode,
      addressCountry: site.office.addressCountry,
    },
    department: site.organization.divisions.map((name) => ({ '@type': 'Organization', name, parentOrganization: { '@id': ids.org } })),
  };
}

export function websiteLd(locale: Locale = 'en') {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: site.url,
    name: site.name,
    inLanguage: localeMeta[locale].hreflang,
    about: { '@id': ids.person },
    publisher: { '@id': ids.person },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${site.url}/perspectives?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webPageLd(o: { name: string; description: string; path: string; type?: string; image?: string; datePublished?: string; dateModified?: string }) {
  return {
    '@type': o.type ?? 'WebPage',
    '@id': `${abs(o.path)}#webpage`,
    url: abs(o.path),
    name: o.name,
    description: o.description,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.person },
    ...(o.type === 'ProfilePage' ? { mainEntity: { '@id': ids.person } } : {}),
    ...(o.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: o.image } } : {}),
    ...(o.datePublished ? { datePublished: o.datePublished } : {}),
    ...(o.dateModified ? { dateModified: o.dateModified } : {}),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function articleLd(o: { title: string; description: string; path: string; image?: string; datePublished: string; dateModified?: string; section?: string; keywords?: string[]; wordCount?: number }) {
  return {
    '@type': 'Article',
    '@id': `${abs(o.path)}#article`,
    headline: o.title,
    description: o.description,
    url: abs(o.path),
    mainEntityOfPage: { '@id': `${abs(o.path)}#webpage` },
    image: o.image ? [o.image] : [`${site.url}${site.seo.defaultImage}`],
    datePublished: o.datePublished,
    dateModified: o.dateModified ?? o.datePublished,
    author: { '@id': ids.person },
    publisher: { '@id': ids.person },
    inLanguage: 'en',
    ...(o.section ? { articleSection: o.section } : {}),
    ...(o.keywords?.length ? { keywords: o.keywords.join(', ') } : {}),
    ...(o.wordCount ? { wordCount: o.wordCount } : {}),
  };
}

export function contactPageLd(o: { name: string; description: string; path: string }) {
  return { ...webPageLd({ ...o, type: 'ContactPage' }) };
}

export function collectionPageLd(o: { name: string; description: string; path: string }) {
  return webPageLd({ ...o, type: 'CollectionPage' });
}

/** Wrap nodes in a graph. Person/Organization/WebSite are added by Seo.astro. */
export function graph(...nodes: Record<string, unknown>[]) {
  return nodes;
}
