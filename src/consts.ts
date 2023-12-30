// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Website metadata
export const SITE_URL: string = "https://astrostarter.zank.studio";
export const SITE_TITLE: string = "Minggu Ini Ngapain";
export const SITE_DESCRIPTION: string = "Blog pribadi yang berisi catatan harian, tutorial, dan opini.";

// SEO metadata
export const TWITTER_CREATOR: string = "@xxx";

// Navigation
type Page = {
	title: string;
	href: string;
	children?: Page[];
};

export const PAGES = [
	{
		title: "nav.home",
		href: "/",
		children: [],
	},
	{
		title: "nav.blog",
		href: "/blog",
		children: [],
	},
	{
		title: "nav.about",
		href: "/about",
		children: [],
	},
] as const;

// i18n
export const DEFAULT_LOCALE = "id";

export const LOCALES = {
	id: "id 🇮🇩", // the `defaultLocale` value must present in `locales` keys
};

export const ui = {
	id: {
		"nav.home": "Beranda",
		"nav.blog": "Blog",
		"nav.about": "Tentang",
		"nav.title": "Minggu Ini Ngapain",
		"nav.description": "Blog pribadi yang berisi catatan, tutorial, dan opini.",
		"home.description":
			"Blog pribadi yang berisi catatan, tutorial, dan opini. Sering kali lupa minggu ini udah ngapain aja. Jadi kita bloging aja biar inget",
		"about.description": "Saya Mustafa, mahasiswa universitas indonesia fakultas ilmu komputer. Hobi saya ngoprek linux dan rust",
	},
} as const;
