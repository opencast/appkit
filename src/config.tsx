import React, { useContext } from "react";



/** Configuration of this library. */
export type AppkitConfig = {
  colors: ColorConfig,
  breakpoints: {
    small: number,
    medium: number,
    large: number,
  },
};

export type ColorConfig = {
  neutral05: string,
  neutral10: string,
  neutral15: string,
  neutral20: string,
  neutral25: string,
  neutral30: string,
  neutral40: string,
  neutral50: string,
  neutral60: string,
  neutral70: string,
  neutral80: string,
  neutral90: string,

  focus: string;
};

export const DEFAULT_CONFIG: AppkitConfig = {
  colors: {
    neutral05: "var(--color-neutral05)",
    neutral10: "var(--color-neutral10)",
    neutral15: "var(--color-neutral15)",
    neutral20: "var(--color-neutral20)",
    neutral25: "var(--color-neutral25)",
    neutral30: "var(--color-neutral30)",
    neutral40: "var(--color-neutral40)",
    neutral50: "var(--color-neutral50)",
    neutral60: "var(--color-neutral60)",
    neutral70: "var(--color-neutral70)",
    neutral80: "var(--color-neutral80)",
    neutral90: "var(--color-neutral90)",

    focus: "var(--color-focus)",
  },
  breakpoints: {
    small: 450,
    medium: 650,
    large: 900,
  },
};

const Context = React.createContext(DEFAULT_CONFIG);

/** Returns the current configuration for your component. */
export const useAppkitConfig = (): AppkitConfig => {
  return useContext(Context);
};


type AppkitConfigProviderProps = React.PropsWithChildren<{
  config: AppkitConfig;
}>;

/**
 * Allows you to set a custom configuration for appkit components that are
 * (indirect) children of this component.
 */
export const AppkitConfigProvider: React.FC<AppkitConfigProviderProps> = ({ config, children }) => (
  <Context.Provider value={config}>{children}</Context.Provider>
);
