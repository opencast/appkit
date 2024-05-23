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
  neutral00: string,
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

  danger0: string,
  danger0BwInverted: string;
  danger1: string,
  danger1BwInverted: string;
  danger2: string,
  danger4: string,
  danger5: string,

  happy0: string;
  happy0BwInverted: string;
  happy1: string;
  happy1BwInverted: string;
  happy2: string;
  happy2BwInverted: string;

  accent8: string;
  accent7: string;
  accent6: string;
  accent5: string;
  accent4: string;

  focus: string;
};

export const DEFAULT_CONFIG: AppkitConfig = {
  colors: {
    neutral00: "var(--color-neutral00)",
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

    danger0: "var(--color-danger0)",
    danger0BwInverted: "var(--color-danger0-bw-inverted)",
    danger1: "var(--color-danger1)",
    danger1BwInverted: "var(--color-danger1-bw-inverted)",
    danger2: "var(--color-danger2)",
    danger4: "var(--color-danger4)",
    danger5: "var(--color-danger5)",

    happy0: "var(--color-happy0)",
    happy0BwInverted: "var(--color-happy0-bw-inverted)",
    happy1: "var(--color-happy1)",
    happy1BwInverted: "var(--color-happy1-bw-inverted)",
    happy2: "var(--color-happy2)",
    happy2BwInverted: "var(--color-happy2-bw-inverted)",

    accent8: "var(--color-accent8)",
    accent7: "var(--color-accent7)",
    accent6: "var(--color-accent6)",
    accent5: "var(--color-accent5)",
    accent4: "var(--color-accent4)",

    focus: "var(--color-accent8)",
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
