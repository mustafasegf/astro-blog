/**
 * From https://github.com/trktml/lotusforafrica/blob/main/src/utils/translationTools.ts
 */

import { getLocale } from "astro-i18n-aut";
import { ui, DEFAULT_LOCALE, LOCALES } from "@src/consts";


const handler = {
	get(target: any, prop: any, receiver: any) {
		return target[prop].replaceAll("\n", "<br/>");
	},
};

export const defaultLocale = DEFAULT_LOCALE;
export const locales = LOCALES;

/**
 *
 * @param link Localize a specific path
 * @param astroUrl
 * @returns
 */
export function localizePath(link: string | URL, astroUrl: string | URL): string {
	let locale = getLocale(astroUrl);
	let localizedLink: string = "";
	if (locale && locale !== defaultLocale) {
		let localeLink = `/${getLocale(astroUrl) ?? ""}/${link}`.replaceAll("//", "/") ?? "";
		localizedLink = localeLink;
	} else {
		localizedLink = String(link);
	}

	// localizedLink add last slash
	if (!localizedLink.endsWith("/")) {
		localizedLink += "/";
	}

	return localizedLink;
}

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split("/");
	if (lang in ui) return lang as keyof typeof ui;
	return DEFAULT_LOCALE;
}

export function useTranslations(lang: keyof typeof ui) {
	return function t(key: keyof (typeof ui)[typeof DEFAULT_LOCALE]) {
		return ui[lang][key] || ui[DEFAULT_LOCALE][key];
	};
}

export function useLang(url: URL) {
	const lang = getLangFromUrl(url);
	return useTranslations(lang);
}
