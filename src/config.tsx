import React, { useContext } from "react";


/** Configuration of this library. */
export type AppkitConfig = {
  colors: {
    neutral0: string,
    neutral1: string,
    neutral2: string,
    neutral3: string,
    neutral4: string,
    neutral5: string,
    neutral6: string,
    neutral7: string,
    neutral8: string,
    neutral9: string,

    focus: string;
  },
  breakpoints: {
    small: number,
    medium: number,
    large: number,
  },
};

export const DEFAULT_APPKIT_CONFIG: AppkitConfig = {
  colors: {
    neutral0: "var(--color-neutral0)",
    neutral1: "var(--color-neutral1)",
    neutral2: "var(--color-neutral2)",
    neutral3: "var(--color-neutral3)",
    neutral4: "var(--color-neutral4)",
    neutral5: "var(--color-neutral5)",
    neutral6: "var(--color-neutral6)",
    neutral7: "var(--color-neutral7)",
    neutral8: "var(--color-neutral8)",
    neutral9: "var(--color-neutral9)",

    focus: "var(--color-focus)",
  },
  breakpoints: {
    small: 450,
    medium: 650,
    large: 900,
  },
};

const Context = React.createContext(DEFAULT_APPKIT_CONFIG);

/** Returns the current configuration for your component. */
export const useConfig = (): AppkitConfig => {
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
