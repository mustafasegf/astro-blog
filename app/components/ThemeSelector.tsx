import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    let effectiveTheme: "light" | "dark" =
      newTheme === "dark" ? "dark" : "light";
    if (newTheme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    const codeTheme = effectiveTheme === "dark" ? "dracula" : "github-light";
    document.documentElement.dataset.theme = effectiveTheme;
    document.documentElement.dataset.code = codeTheme;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyTheme(e.target.value as Theme);
  };

  return (
    <select
      aria-label="Theme selector"
      name="theme-selector"
      id="theme-selector"
      className="cursor-pointer focus-visible:outline-none dark:bg-gray-800 dark:text-gray-50"
      value={theme}
      onChange={handleChange}
    >
      <option value="dark">Dark</option>
      <option value="light">Light</option>
      <option value="system">System</option>
    </select>
  );
}
