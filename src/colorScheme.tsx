import React from "react";
import { useContext, useState } from "react";
import { bug } from "./err";


export const COLOR_SCHEMES = ["light", "dark", "light-high-contrast", "dark-high-contrast"] as const;
export type ColorScheme = typeof COLOR_SCHEMES[number];

export type ColorSchemeContext = {
  /** The current color scheme. */
  scheme: ColorScheme;

  /**
   * Whether the color scheme is derived from the `prefers-color-scheme` media
   * query alone, without any user override.
   */
  isAuto: boolean;

  /** Updates the current color scheme. */
  update: (pref: ColorScheme | "auto") => void;
};

const LOCAL_STORAGE_KEY = "colorScheme";

const ColorSchemeContext = React.createContext<ColorSchemeContext | null>(null);

/**
 * Returns current information about the color scheme and a way to change it. If
 * the color scheme changes, components using this hook are rerendered.
 */
export const useColorScheme = (): ColorSchemeContext => useContext(ColorSchemeContext)
  ?? bug("missing color scheme context provider");

export type ColorSchemeProviderProps = React.PropsWithChildren<{
  /**
   * List of allowed color schemes. By default all four supported schemes are
   * allowed. If your app does not support high contrast mode, you can pass a
   * subset of those here (most likely `["light", "dark"]). This must contain
   * at least 2 elements and must contain either `dark` or `light`!
   */
  allowedSchemes?: ColorScheme[];
}>;

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
 *
 * /* Same for "light-high-contrast" and "dark-high-contrast" if you support those
 * ```
 *
 * This `data-color-scheme` attribute is derived from the `prefers-color-scheme`
 * media query and from a user override (stored in local storage with key
 * `colorScheme`). In order to set the attribute as early as possible, you
 * should copy the following into a `<script>` section in your `index.html`.
 *
 * ```javascript
 * let scheme = window.localStorage.getItem("colorScheme");
 * const isValid = ["light", "dark", "light-high-contrast", "dark-high-contrast"].includes(scheme);
 * if (!isValid) {
 *   const lightness = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
 *   const contrast = window.matchMedia("(prefers-contrast: more)").matches ? "-high-contrast" : "";
 *   scheme = `${lightness}${contrast}`;
 * }
 * document.documentElement.dataset.colorScheme = scheme;
 * ```
 *
 * If you don't support high contrast schemes, remove the relevant code.
 *
 * With that done, you can use this `ColorSchemeProvider` and `useColorScheme`
 * to get the current color scheme in React code, as well as change it. The
 * `update` function returned by `useColorScheme` updates the local storage,
 * the HTML attribute and the values in the context (causing all subscribed
 * components to rerender).
 */
export const ColorSchemeProvider: React.FC<ColorSchemeProviderProps> = ({
  allowedSchemes = COLOR_SCHEMES,
  children,
}) => {
  if (allowedSchemes.length < 2) {
    return bug("`allowedSchemes` for ColorSchemeProvider need to have at least 2 schemes");
  }
  if (!allowedSchemes.includes("light") && !allowedSchemes.includes("dark")) {
    return bug("`allowedSchemes` must contain either 'light' or 'dark'");
  }

  const isValidScheme = (v: string | undefined | null): v is ColorScheme => {
    return !!v && (allowedSchemes as readonly string[]).includes(v);
  };

  // Retrieve the scheme that was selected when the page was loaded. This is
  // set inside `index.html`.
  const attrValue = document.documentElement.dataset.colorScheme;
  const initialScheme = isValidScheme(attrValue) ? attrValue : "light" as const;
  const [scheme, setScheme] = useState(initialScheme);

  // Next, check whether there are some preferences stored in local storage.
  const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  const [isAuto, setIsAuto] = useState(!isValidScheme(stored));

  const context: ColorSchemeContext = {
    scheme,
    isAuto,
    update: pref => {
      if (pref !== "auto" && !isValidScheme(pref)) {
        return bug("Passed forbidden color scheme to `update`");
      }

      // Update preference in local storage
      window.localStorage.setItem(LOCAL_STORAGE_KEY, pref);

      // Update the two states `isAuto` and `scheme` (for other JS code),
      // but also the attribute on `<html>` (for CSS code).
      setIsAuto(pref === "auto");

      // If it is set to "auto" we need to figure out the best scheme given
      // browser preferences. This is a bit more complicated due to
      // `allowedSchemes`.
      let scheme = pref !== "auto"
        ? pref
        : (() => {
          const lightness = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          const contrast = window.matchMedia("(prefers-contrast: more)").matches ? "-high-contrast" : "";

          // Check if the perfect scheme is supported, and if so, use it.
          const perfectMatch = `${lightness}${contrast}` as const;
          if (allowedSchemes.includes(perfectMatch)) {
            return perfectMatch;
          }

          // Next, check the inverse high contrast scheme. If the browser
          // says "prefers high contrast", then thats likely way more important
          // to the user than having the correct lightness.
          const inverseLightness = lightness === "light" ? "dark" : "light";
          const inverseHighContrast = `${inverseLightness}${contrast}` as const;
          if (allowedSchemes.includes(inverseHighContrast)) {
            return inverseHighContrast;
          }

          // If `contrast` is empty string, this point is unreachable as either
          // `light` or `dark` must be part of `allowedSchemes`. If it is
          // `-high-contrast`, then `allowedSchemes` contains no high contrast
          // schemes. And since there are at least two themes, the remaining
          // themes must be `light` and `dark`. Thus we can just:
          return lightness;
        })();

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
