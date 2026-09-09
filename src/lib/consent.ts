/**
 * Minimal consent management. Analytics (GTM) loads only after the visitor
 * accepts. The decision is stored locally and pushed to the dataLayer using
 * Google Consent Mode v2 semantics, so GTM tags can key off it.
 */
export type Consent = 'granted' | 'denied';
const KEY = 'dp_consent_v1';

export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(v: Consent): void {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* private mode */
  }
  pushConsent(v);
  window.dispatchEvent(new CustomEvent('dp:consent', { detail: v }));
}

export function pushConsent(v: Consent): void {
  window.dataLayer = window.dataLayer ?? [];
  // gtag-style consent update for Consent Mode v2
  window.dataLayer.push(['consent', 'update', { analytics_storage: v, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', functionality_storage: 'granted', security_storage: 'granted' }]);
  window.dataLayer.push({ event: 'consent_update', consent_analytics: v });
}

let loaded = false;
export function loadGtm(id: string): void {
  if (loaded || !id) return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}
