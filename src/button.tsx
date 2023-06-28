import React from "react";

/**
 * A mostly unstyled button used to build buttons. Always use this instead of
 * `<button>`.
 */
export const ProtoButton = React.forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
  ({ children, ...rest }, ref) => <button
    type="button"
    ref={ref}
    css={{
      border: "none",
      padding: 0,
      background: "none",
      color: "inherit",
      cursor: "pointer",
    }}
    {...rest}
  >{children}</button>,
);
