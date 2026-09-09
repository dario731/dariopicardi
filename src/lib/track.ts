/**
 * Centralised tracking bus. Nothing here knows about GA4 or GTM IDs — it only
 * pushes typed events to window.dataLayer, so Google Tag Manager (loaded when
 * PUBLIC_GTM_ID is set and consent is granted) can map them to any vendor.
 * Attribution (UTM, referrer, landing page) is captured once per session and
 * attached to every contact-form payload.
 */
export type TrackEvent =
  | 'page_view'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'contact_form_error'
  | 'cta_click'
  | 'navigation_click'
  | 'biz_style_visit'
  | 'bns_luxury_visit'
  | 'perspective_view'
  | 'perspective_share'
  | 'perspective_engaged'
  | 'scroll_depth'
  | 'media_play'
  | 'bio_download'
  | 'social_profile_click'
  | 'email_click'
  | 'phone_click'
  | 'outbound_click'
  | 'framework_interaction'
  | 'map_interaction'
  | 'consent_update';

export interface TrackParams {
  page_type?: string;
  cta_name?: string;
  cta_location?: string;
  area_of_interest?: string;
  perspective_slug?: string;
  perspective_category?: string;
  share_channel?: string;
  percent?: number;
  destination?: string;
  item?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface Attribution {
  lead_source: string;
  original_source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  landing_page: string;
  referrer: string;
  page_url: string;
  session_first_seen: string;
  browser_language: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const ATTR_KEY = 'dp_attribution';
const FIRST_KEY = 'dp_first_touch';

function classifySource(ref: string, params: URLSearchParams): string {
  if (params.get('utm_source')) return `${params.get('utm_source')}/${params.get('utm_medium') ?? 'utm'}`;
  if (params.get('gclid')) return 'google/cpc';
  if (params.get('fbclid')) return 'meta/paid-social';
  if (!ref) return 'direct';
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '');
    if (/google\./.test(host)) return 'google/organic';
    if (/bing\.com|duckduckgo|yahoo\./.test(host)) return `${host}/organic`;
    if (/linkedin|instagram|facebook|x\.com|twitter|youtube|tiktok/.test(host)) return `${host}/social`;
    if (/chatgpt|openai|perplexity|claude\.ai|gemini|copilot/.test(host)) return `${host}/ai-search`;
    if (/bizandstyledna|bns-luxury/.test(host)) return `${host}/ecosystem`;
    return `${host}/referral`;
  } catch {
    return 'referral';
  }
}

/** Capture attribution on first paint. Safe to call on every page; UTMs are preserved for the session. */
export function captureAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : '';
    const now = new Date().toISOString();
    const pick = (k: string) => params.get(k) ?? undefined;
    let first = window.localStorage.getItem(FIRST_KEY);
    const session = window.sessionStorage.getItem(ATTR_KEY);
    const current: Attribution = session
      ? (JSON.parse(session) as Attribution)
      : {
          lead_source: classifySource(ref, params),
          original_source: '',
          utm_source: pick('utm_source'),
          utm_medium: pick('utm_medium'),
          utm_campaign: pick('utm_campaign'),
          utm_content: pick('utm_content'),
          utm_term: pick('utm_term'),
          gclid: pick('gclid'),
          fbclid: pick('fbclid'),
          landing_page: window.location.pathname,
          referrer: ref,
          page_url: window.location.href,
          session_first_seen: now,
          browser_language: navigator.language,
        };
    // A new UTM-tagged visit inside the same session overrides the session source.
    if (session && params.get('utm_source')) {
      current.lead_source = classifySource(ref, params);
      current.utm_source = pick('utm_source');
      current.utm_medium = pick('utm_medium');
      current.utm_campaign = pick('utm_campaign');
      current.utm_content = pick('utm_content');
      current.utm_term = pick('utm_term');
    }
    if (!first) {
      first = current.lead_source;
      window.localStorage.setItem(FIRST_KEY, first);
    }
    current.original_source = first;
    current.page_url = window.location.href;
    window.sessionStorage.setItem(ATTR_KEY, JSON.stringify(current));
    return current;
  } catch {
    return null;
  }
}

export function getAttribution(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(ATTR_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : captureAttribution();
  } catch {
    return null;
  }
}

export function track(event: TrackEvent, params: TrackParams = {}): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    language: document.documentElement.lang,
    page_type: document.body.dataset.pageType,
    page_path: window.location.pathname,
    ...params,
  });
}

/** Wire declarative tracking: any element with data-track="event" and data-track-* params. */
export function bindDeclarativeTracking(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-track]').forEach((el) => {
    if (el.dataset.trackBound) return;
    el.dataset.trackBound = '1';
    el.addEventListener('click', () => {
      const event = el.dataset.track as TrackEvent;
      const params: TrackParams = {};
      for (const [k, v] of Object.entries(el.dataset)) {
        if (k.startsWith('track') && k !== 'track' && k !== 'trackBound') {
          const key = k
            .slice(5)
            .replace(/^[A-Z]/, (m) => m.toLowerCase())
            .replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
          params[key] = v;
        }
      }
      track(event, params);
    });
  });

  root.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    if (a.dataset.autoBound) return;
    a.dataset.autoBound = '1';
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith('mailto:')) {
      a.addEventListener('click', () => track('email_click', { cta_location: a.closest('section, footer, header')?.id || undefined }));
      return;
    }
    if (href.startsWith('tel:')) {
      a.addEventListener('click', () => track('phone_click', { cta_location: a.closest('section, footer, header')?.id || undefined }));
      return;
    }
    if (!/^https?:/.test(href)) return;
    try {
      const url = new URL(a.href);
      if (url.origin === window.location.origin) return;
      const host = url.hostname.replace(/^www\./, '');
      a.addEventListener('click', () => {
        if (/bizandstyledna\.com$/.test(host)) track('biz_style_visit', { destination: url.href, cta_location: a.closest('section, footer, header')?.id || undefined });
        else if (/bns-luxury\.com$|bnsluxury\.com$/.test(host)) track('bns_luxury_visit', { destination: url.href, cta_location: a.closest('section, footer, header')?.id || undefined });
        else if (/linkedin|instagram|x\.com|twitter|youtube/.test(host)) track('social_profile_click', { destination: host });
        else track('outbound_click', { destination: host, cta_location: a.closest('section, footer, header')?.id || undefined });
      });
    } catch {
      /* ignore malformed */
    }
  });
}

/** Scroll-depth milestones (25/50/75/100) — once per page view. */
export function bindScrollDepth(): void {
  if (typeof window === 'undefined') return;
  const fired = new Set<number>();
  const marks = [25, 50, 75, 100];
  let ticking = false;
  const check = () => {
    ticking = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = Math.round((window.scrollY / max) * 100);
    for (const m of marks) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track('scroll_depth', { percent: m });
      }
    }
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    },
    { passive: true },
  );
}
