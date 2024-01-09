import { ReactElement, ReactNode, forwardRef, useRef } from "react";
import { CSSObject, jsx } from "@emotion/react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";

import {
  useAppkitConfig, Floating, FloatingContainer, FloatingContainerProps, FloatingHandle,
  FloatingTrigger, ProtoButton, focusStyle, useColorScheme, match, useFloatingItemProps,
} from ".";



export type WithHeaderMenuProps = {
  /** Props for `HeaderMenu` */
  menu: Omit<HeaderMenuProps, "close">,
  /** Overrides for the floating container */
  floatingContainer?: Partial<FloatingContainerProps>,
  children: ReactElement;
};

/**
 * Adds a `HeaderMenu` with the given `children` as its trigger.
 */
export const WithHeaderMenu: React.FC<WithHeaderMenuProps> = ({ children, menu, floatingContainer }) => {
  const ref = useRef<FloatingHandle>(null);

  return (
    <FloatingContainer
      ref={ref}
      placement="bottom"
      trigger="click"
      ariaRole="menu"
      arrowSize={12}
      viewPortMargin={12}
      borderRadius={8}
      distance={6}
      {...floatingContainer}
    >
      <FloatingTrigger>{children}</FloatingTrigger>
      <HeaderMenu close={() => ref.current?.close()} {...menu} />
    </FloatingContainer>
  );
};

export type HeaderMenuItemDef = HeaderMenuItemProps & {
  css?: CSSObject;
  keepOpenAfterClick?: boolean;
};

export type HeaderMenuProps = {
    items: HeaderMenuItemDef[],
    label: string;
    /** Number of pixels below which the mobile view is used */
    breakpoint: number,
    /** Callback to close the floating menu */
    close: () => void;
};

/**
 * A floating menu for use in the header. Contains a number of items which are
 * specified by the props of `HeaderMenuItem`.
 */
export const HeaderMenu: React.FC<HeaderMenuProps> = ({ close, items, label, breakpoint }) => {
  const config = useAppkitConfig();
  const { scheme, isHighContrast } = useColorScheme();
  const itemProps = useFloatingItemProps();
  const bgColor = match(scheme, {
    "light": () => config.colors.neutral05,
    "dark": () => config.colors.neutral15,
    "dark-high-contrast": () => config.colors.neutral05,
    "light-high-contrast": () => config.colors.neutral05,
  });

  return (
    <Floating
      backgroundColor={bgColor}
      borderWidth={scheme !== "light" ? 1 : 0}
      padding={0}
      shadowBlur={isHighContrast ? 0 : 8}
    >
      <div
        onClick={e => {
          if (e.target === e.currentTarget) {
            close();
          }
        }}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            close();
          }
        }}
        css={{
          position: "relative",
          // Grey out background on mobile devices.
          [`@media (max-width: ${breakpoint}px)`]: {
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1001,
            backgroundColor: "#000000a0",
          },
        }}
      >
        <ul css={{
          borderRadius: 8,
          right: 0,
          margin: 0,
          paddingLeft: 0,
          overflow: "hidden",
          listStyle: "none",
          li: {
            ":first-of-type": { borderRadius: "8px 8px 0 0" },
            ":last-of-type": { borderRadius: "0 0 8px 8px" },
          },
          [`@media (max-width: ${breakpoint}px)`]: {
            backgroundColor: bgColor,
            borderRadius: "0 0 8px 8px",
            marginTop: 0,
            position: "fixed",
            left: 0,
            top: 0,
            li: { ":not(:first-of-type)": { borderRadius: 0 } },
          },
        }}>
          <ReturnButton onClick={close} breakpoint={breakpoint}>{label}</ReturnButton>
          {items.map(({ keepOpenAfterClick, ...props }, i) => <HeaderMenuItem
            key={i}
            {...itemProps(i)}
            {...props}
            onClick={e => {
              props?.onClick?.(e);
              if (!keepOpenAfterClick) {
                close();
              }
            }} />
          )}
        </ul>
      </div>
    </Floating>
  );
};



export type HeaderMenuItemProps = Omit<JSX.IntrinsicElements["li"], "ref"> & {
  icon?: JSX.Element;
  wrapper?: JSX.Element;
};

/**
 * An item in `HeaderMenu`.
 *
 * This always emits an outer `<li>`. If `wrapper` is set, that element is
 * direct child of the `<li>` and is modified to have a specific style. The
 * children passed to `wrapper` are some nodes containing the icon and the
 * `children` passed to this component. If `wrapper` is not set, the style is
 * instead applied to the `<li>`, which also contains said icon+children.
 */
export const HeaderMenuItem = forwardRef<HTMLElement, HeaderMenuItemProps>(
  ({ icon, children, wrapper, ...rest }, ref) => {
    const config = useAppkitConfig();
    const focusBgColor = useColorScheme().isHighContrast
      ? config.colors.neutral90
      : config.colors.neutral10;
    const focusTextColor = useColorScheme().isHighContrast
      ? config.colors.neutral05
      : config.colors.neutral90;

    const css = {
      display: "flex",
      gap: 16,
      alignItems: "center",
      minWidth: 160,
      padding: 12,
      textDecoration: "none",
      color: config.colors.neutral90,
      cursor: "pointer",
      whiteSpace: "nowrap",
      "& > svg": {
        maxHeight: 23,
        fontSize: 23,
        width: 24,
        strokeWidth: 2,
        "& > path": { strokeWidth: "inherit" },
      },
      ":hover, :focus": {
        backgroundColor: focusBgColor,
        color: focusTextColor,
      },
      ...focusStyle(config, { inset: true }),
    } as const;

    const { className, ...outerProps } = rest;
    const wrapperElem = wrapper ?? <></>;
    return (
      <li
        role="menuitem"
        {...outerProps}
        css={{
          ":not(:first-of-type)": {
            borderTop: `1px solid ${config.colors.neutral30}`,
          },
          ...!wrapper && css,
        }}
        {...!wrapper && {
          className,
          ref: r => typeof ref === "function" ? ref(r) : (ref ? ref.current = r : {}),
        }}
      >
        {jsx(wrapperElem.type, {
          key: wrapperElem.key,
          ...wrapperElem.props,
          children: <>
            {icon ?? <svg />}
            <div>{children}</div>
          </>,
          ...wrapper && {
            className,
            ref: (r: HTMLElement | null) => typeof ref === "function" ? ref(r) : (ref ? ref.current = r : {}),
          },
          ...wrapper && { css: [css, { borderRadius: "inherit" }] },
        })}
      </li>
    );
  });

/**
 * Helper to create props for a common kind of `HeaderItem`: one that is
 * basically a checkbox, e.g. the language or theme selection.
 */
export const checkboxMenuItem = ({ checked, onClick, children }: {
  checked: boolean,
  onClick: () => void,
  children: JSX.Element,
}): HeaderMenuItemDef => ({
  icon: checked ? <FiCheck /> : undefined,
  onClick,
  onKeyDown: e => {
    if (document.activeElement === e.currentTarget && e.key === "Enter") {
      onClick();
    }
  },
  tabIndex: 0,
  children,
  role: "checkbox",
  "aria-checked": checked,

  css: {
    ...checked && { cursor: "default" },
  },
});

type ReturnButtonProps = {
    onClick: () => void;
    children: ReactNode;
    breakpoint: number,
};

const ReturnButton: React.FC<ReturnButtonProps> = ({ onClick, breakpoint, children }) => {
  const config = useAppkitConfig();

  return (
    <div css={{
      borderBottom: `1px solid ${config.colors.neutral40}`,
      display: "flex",
      alignItems: "center",
      [`@media not all and (max-width: ${breakpoint}px)`]: {
        display: "none",
      },
    }}>
      <ProtoButton onClick={onClick} tabIndex={0} css={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: "24px 12px",
        opacity: 0.75,
        ":hover, :focus": { opacity: 1 },
        ...focusStyle(config, { inset: true }),
        "> svg": {
          maxHeight: 23,
          fontSize: 23,
          width: 24,
          strokeWidth: 2,
        },
      }}>
        <FiArrowLeft />
      </ProtoButton>
      <span css={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        color: config.colors.neutral60,
      }}>{children}</span>
    </div>
  );
};
