import { AppkitConfig } from "./config";

export * from "./config";
export * from "./err";


/**
 * Applies focus outline with a default width of 2.5px to elements. This should
 * always be used instead of a custom focus property to ensure consistency
 * throughout the design. If `({ inset: true })` is declared, the focus will be
 * on the inside of the focused element with a negative offset equal to the
 * outline's width. Otherwise is also possible to declare an additional offset
 * (usually 1) for elements with a similar color to the outline to make it
 * stand out more.
 */
export const focusStyle = (config: AppkitConfig, { width = 2.5, inset = false, offset = 0 }) => ({
    "&:focus-visible": {
        outline: `${width}px solid ${config.colors.focus}`,
        outlineOffset: `${inset ? -width : offset}px`,
    },
} as const);
