import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "@/lib/i18n";
import { PAGES, DEFAULT_LOCALE } from "@/lib/consts";
import { ThemeSelector } from "./ThemeSelector";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslation(DEFAULT_LOCALE);

  return (
    <header className="flex flex-col max-w-screen-xl lg:py-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8 z-10 md:pt-2 relative">
      <div className="p-4 flex flex-row items-center justify-between">
        <Link
          to="/"
          className="flex gap-3 items-center text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark:text-white focus:outline-none focus:shadow-outline"
        >
          {t("site.title")}
        </Link>
        <button
          className="md:hidden text-gray-500 w-10 h-10 relative focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-200 ease-in-out ${
                isOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-200 ease-in-out ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-200 ease-in-out ${
                isOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </div>
        </button>
      </div>
      <nav
        className={`${
          isOpen ? "flex" : "hidden md:flex"
        } md:mt-0 md:items-center px-4 flex-grow pb-4 md:pb-0 flex-col gap-2 transition-all ease-out md:transition-none md:justify-center md:flex-row`}
      >
        <div className="flex flex-col flex-grow text-center gap-2 md:justify-center md:items-center md:flex md:flex-row md:mx-auto">
          {PAGES.map((item) =>
            item.children && item.children.length > 0 ? (
              <NavDropdown key={item.title} item={item} t={t} />
            ) : (
              <HeaderLink key={item.title} href={item.href}>
                {t(item.title as any)}
              </HeaderLink>
            ),
          )}
        </div>
        <ThemeSelector />
        <LanguageSelector />
      </nav>
    </header>
  );
}

function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={href}
      className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}

function NavDropdown({
  item,
  t,
}: {
  item: (typeof PAGES)[number];
  t: ReturnType<typeof useTranslation>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onClick={() => setIsOpen(false)}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="mt-[2px] py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        {t(item.title as any)}
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          className={`inline w-4 h-4 mb-[2px] transition-transform duration-200 transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute mt-2 bg-white right-0 w-full origin-top-right rounded-md md:w-48 outline-2 border border-gray-300">
          <div className="px-2 py-2 rounded-md shadow dark:bg-gray-800">
            {item.children?.map((subitem) => (
              <HeaderLink key={subitem.title} href={subitem.href}>
                {t(subitem.title as any)}
              </HeaderLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LanguageSelector() {
  return (
    <select
      aria-label="Change language"
      className="cursor-pointer focus-visible:outline-none dark:bg-gray-800 dark:text-gray-50"
    >
      <option value="/id">id 🇮🇩</option>
    </select>
  );
}
