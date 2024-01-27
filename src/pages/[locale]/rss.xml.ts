import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { DEFAULT_LOCALE, LOCALES } from "@src/consts";
import { useLang } from "@src/utils/t";

export const prerender = true;

/**
 * Generates an array of static paths for all supported locales.
 * @returns An array of objects containing the `params` property for each supported locale.
 */
export function getStaticPaths() {
	return Object.keys(LOCALES).map((locale) => ({ params: { locale } }));
}

/**
 * Generates an RSS feed for a specific locale.
 * @param params - An object containing the `locale` parameter.
 * @param redirect - A function to redirect the user to a different URL.
 * @param site - An object containing information about the current site.
 * @returns A response object containing the generated RSS feed.
 */
export const get: APIRoute = async function get({ params, redirect, site, url }) {
	const t = useLang(url);

	const locale = params.locale;

	if (!locale) {
		return new Response(null, {
			status: 400,
			statusText: "Bad Request",
		});
	}

	if (locale === DEFAULT_LOCALE) {
		return redirect("/rss.xml");
	}

	const posts = await getCollection("blog", (entry) => entry.slug.startsWith(locale));

	if (posts.length === 0) {
		return new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
	}

	const { body } = await rss({
		title: t("site.title"),
		description: t("site.description"),
		site: site!.href,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug.replace(`${locale}/`, "")}/`,
		})),
	});

	return new Response(body, {
		status: 200,
		statusText: "OK",
	});
};
