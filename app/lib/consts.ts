// Website metadata
export const SITE_URL: string =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://blog.mus.sh";

export const TWITTER_HANDLE: string = "mustafasegf";

// Navigation
export type Page = {
  title: string;
  href: string;
  children?: Page[];
};

export const PAGES: Page[] = [];

// i18n
export const DEFAULT_LOCALE = "id";

export const LOCALES = {
  id: "id",
} as const;

export type Locale = keyof typeof LOCALES;

export const ui = {
  id: {
    "nav.home": "Beranda",
    "nav.blog": "Blog",
    "nav.about": "Tentang",
    "nav.title": "Minggu Ini Ngapain",
    "nav.description": "Blog pribadi yang berisi catatan, tutorial, dan opini.",
    "home.description":
      "Blog pribadi yang berisi catatan, tutorial, dan opini. Sering kali lupa minggu ini udah ngapain aja. Jadi kita bloging aja biar inget",
    "about.description":
      "Saya Mustafa, mahasiswa universitas indonesia fakultas ilmu komputer. Hobi saya ngoprek linux dan rust",
    "site.title": "Minggu Ini Ngapain",
    "site.description":
      "Blog pribadi yang berisi catatan harian, tutorial, dan opini.",
  },
} as const;

export type UIKey = keyof (typeof ui)["id"];
