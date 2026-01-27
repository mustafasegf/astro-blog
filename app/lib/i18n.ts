import { ui, DEFAULT_LOCALE, type UIKey, type Locale } from "./consts";

export function useTranslation(locale: Locale = DEFAULT_LOCALE) {
  return function t(key: UIKey): string {
    return ui[locale]?.[key] ?? ui[DEFAULT_LOCALE][key] ?? key;
  };
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && firstSegment in ui) {
    return firstSegment as Locale;
  }

  return DEFAULT_LOCALE;
}

export function localizeUrl(url: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) {
    return url;
  }
  return `/${locale}${url.startsWith("/") ? url : `/${url}`}`;
}
