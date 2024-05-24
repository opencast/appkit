import { Interpolation, Theme } from "@emotion/react";
import React from "react";
import { focusStyle, match, useAppkitConfig } from ".";

export type Kind = "normal" | "danger" | "happy";

type ButtonProps = JSX.IntrinsicElements["button"] & {
    kind?: Kind;
    extraCss?: Interpolation<Theme>;
};

/** A styled button */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ kind = "normal", extraCss, children, ...rest }, ref) => (
    <button ref={ref} type="button" css={css(kind, extraCss)} {...rest}>{children}</button>
  ),
);

const css = (kind: Kind, extraCss: Interpolation<Theme> = {}): Interpolation<Theme> => {
  const config = useAppkitConfig();

  const notDisabledStyle = match(kind, {
    "normal": () => ({
      border: `1px solid ${config.colors.neutral40}`,
      color: config.colors.neutral90,
      "&:hover, &:focus-visible": {
        border: `1px solid ${config.colors.neutral60}`,
        backgroundColor: config.colors.neutral15,
      },
      ...focusStyle(config, { offset: -1 }),
    }),

    "danger": () => ({
      border: `1px solid ${config.colors.danger4}`,
      color: config.colors.danger4,
      "&:hover, &:focus-visible": {
        border: `1px solid ${config.colors.danger5}`,
        backgroundColor: config.colors.danger4,
        color: config.colors.danger0,  // danger0BwInverted
      },
      ...focusStyle(config, { offset: 1 }),
    }),

    "happy": () => ({
      border: `1px solid ${config.colors.happy4}`,
      color: config.colors.happy1, // happy0BwInverted
      backgroundColor: config.colors.happy3,
      "&:hover, &:focus-visible": {
        border: `1px solid ${config.colors.happy5}`,
        backgroundColor: config.colors.happy4,
        color: config.colors.happy0,  // happy1BwInverted
      },
      ...focusStyle(config, { offset: 1 }),
    }),
  });

  return {
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 14px",
    gap: 12,
    whiteSpace: "nowrap",
    backgroundColor: config.colors.neutral10,
    transition: "background-color 0.15s, border-color 0.15s",
    textDecoration: "none",
    "& > svg": {
      fontSize: 20,
    },
    "&:disabled": {
      border: `1px solid ${config.colors.neutral25}`,
      color: config.colors.neutral40,
    },
    "&:not([disabled])": {
      cursor: "pointer",
      ...notDisabledStyle,
    },
    ...extraCss as Record<string, unknown>,
  };
};

export const buttonStyle = css;
