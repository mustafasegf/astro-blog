import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { DEFAULT_LOCALE } from "@src/consts";
import { useLang } from "@src/utils/t";

/**
 * defaultLang RSS feed
 * Returns an RSS feed for the blog posts.
 * @param {Object} site - The site object.
 * @returns {Response} - The response object containing the RSS feed.
 */
export const get: APIRoute = async function get({ site, url }) {
	const t = useLang(url);

	const posts = await getCollection("blog", (entry) => entry.slug.startsWith(DEFAULT_LOCALE));

	const { body } = await rss({
		title: t("site.title"),
		description: t("site.description"),
		site: site!.href,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug.replace(`${DEFAULT_LOCALE}/`, "")}/`,
		})),
	});

	return new Response(body, {
		status: 200,
		statusText: "OK",
	});
};
