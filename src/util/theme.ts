import { Optional } from "./types/types";

type Theme = "dark" | "light";

const code = function () {
  (window as any).__onThemeChange = function () {};

  let preferredTheme: Optional<Theme>;

  function setTheme(newTheme: Theme) {
    (window as any).__theme = newTheme;
    preferredTheme = newTheme;
    document.documentElement.dataset.theme = newTheme;
    (window as any).__onThemeChange(newTheme);
  }

  try {
    preferredTheme = (localStorage.getItem("theme") as Theme | null) ?? "dark";
  } catch (err) {}

  (window as any).__setPreferredTheme = function (newTheme: Theme) {
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (err) {}
  };

  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  darkQuery.addEventListener("change", function (e) {
    (window as any).__setPreferredTheme(e.matches ? "dark" : "light");
  });

  setTheme(preferredTheme || (darkQuery.matches ? "dark" : "light"));
};

export const getTheme = `(${code})();`;
