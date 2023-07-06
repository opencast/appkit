import { AppkitConfig } from "./config";

export * from "./button";
export * from "./colorScheme";
export * from "./config";
export * from "./err";
export * from "./floating";
export * from "./header";
export * from "./util";


/**
 * Applies focus outline with a default width of 2.5px to elements. This should
 * always be used instead of a custom focus property to ensure consistency
 * throughout the design. If `({ inset: true })` is declared, the focus will be
 * on the inside of the focused element with a negative offset equal to the
 * outline's width. Otherwise is also possible to declare an additional offset
 * (usually 1) for elements with a similar color to the outline to make it
 * stand out more.
 *
 * In your application, you likely want to define your own wrapper for this with
 * a fixed first parameter:
 *
 * ```
 * import { focusStyle as appkitFocusStyle } from "@opencast/appkit";
 *
 * export const focusStyle = (options?: Parameters<typeof appkitFocusStyle>[1]) =>
 *   appkitFocusStyle(MY_APPKIT_CONFIG, options);
 * ```
 *
 * Where `MY_APPKIT_CONFIG` is what you pass to the `AppkitConfigProvider`, or
 * `DEFAULT_CONFIG` if you don't override the config.
 */
export const focusStyle = (
  config: AppkitConfig,
  options?: { width?: number; inset?: boolean; offset?: number },
) => {
  const width = options?.width ?? 2.5;
  const inset = options?.inset ?? false;
  const offset = options?.offset ?? 0;
  return {
    "&:focus-visible": {
      outline: `${width}px solid ${config.colors.focus}`,
      outlineOffset: `${inset ? -width : offset}px`,
    }
  } as const;
};
