import React from "react";
import { useContext, useState } from "react";
import { bug } from "./err";


export type ColorScheme = {
  /** The current color scheme. */
  scheme: "light" | "dark";

  /**
   * Whether the color scheme is derived from the `prefers-color-scheme` media
   * query alone, without any user override.
   */
  isAuto: boolean;

  /** Updates the current color scheme. */
  update: (pref: "light" | "dark" | "auto") => void;
};

const LOCAL_STORAGE_KEY = "colorScheme";

const ColorSchemeContext = React.createContext<ColorScheme | null>(null);

/**
 * Returns current information about the color scheme and a way to change it. If
 * the color scheme changes, components using this hook are rerendered.
 */
export const useColorScheme = (): ColorScheme => useContext(ColorSchemeContext)
  ?? bug("missing color scheme context provider");

/**
 * Provides the context for `useColorScheme`.
 *
 * The whole color scheme system works as follows: the resolved/active color
 * scheme is stored as `data-color-scheme` attributes on the `<html>` tag. CSS
 * code can now declare variables and other properties on `html` dependent on
 * said attribute. It is either "light" or "dark". CSS code should also handle
 * the case of the attribute being absent, even though it should never happen.
 * For example:
 *
 * ```css
 * html[data-color-scheme="light"], html:not([data-color-scheme]) {
 *   --some-color: white;
 * }
 *
 * html[data-color-scheme="dark"] {
 *   --some-color: black;
 * }
 * ```
 *
 * This `data-color-scheme` attribute is derived from the `prefers-color-scheme`
 * media query and from a user override (stored in local storage with key
 * `colorScheme`). In order to set the attribute as early as possible, you
 * should copy the following into a `<script>` section in your `index.html`.
 *
 * ```javascript
 * const scheme = window.localStorage.getItem("colorScheme");
 *   document.documentElement.dataset.colorScheme = (scheme === "dark" || scheme === "light")
 *     ? scheme
 *     : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
 * ```
 *
 * With that done, you can use this `ColorSchemeProvider` and `useColorScheme`
 * to get the current color scheme in React code, as well as change it. The
 * `update` function returned by `useColorScheme` updates the local storage,
 * the HTML attribute and the values in the context (causing all subscribed
 * components to rerender).
 */
export const ColorSchemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Retrieve the scheme that was selected when the page was loaded. This is
  // set inside `index.html`.
  const initialScheme = document.documentElement.dataset.colorScheme === "dark"
    ? "dark" as const
    : "light" as const;
  const [scheme, setScheme] = useState(initialScheme);

  // Next, check whether there are some preferences stored in local storage.
  const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  const [isAuto, setIsAuto] = useState(stored !== "dark" && stored !== "light");

  const context: ColorScheme = {
    scheme,
    isAuto,
    update: pref => {
      // Update preference in local storage
      window.localStorage.setItem(LOCAL_STORAGE_KEY, pref);

      // Update the two states `isAuto` and `scheme` (for other JS code),
      // but also the attribute on `<html>` (for CSS code).
      setIsAuto(pref === "auto");
      const scheme = (pref === "dark" || pref === "light")
        ? pref
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setScheme(scheme);
      document.documentElement.dataset.colorScheme = scheme;
    },
  };

  return (
    <ColorSchemeContext.Provider value={context}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
