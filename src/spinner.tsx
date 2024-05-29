import { keyframes } from "@emotion/react";
import React from "react";

type Props = JSX.IntrinsicElements["svg"] & {
  size?: number | string;
  strokeColor?: string,
};

export const Spinner = React.forwardRef<SVGSVGElement, Props>(({
  size = "1em",
  strokeColor = "currentcolor",
  ...rest
}, ref) => {
  return (
    <svg
      ref={ref}
      viewBox="0 0 50 50"
      css={{
        width: size,
        height: size,
        animation: `2s linear infinite none ${keyframes({
          "0%": { transform: "rotate(0)" },
          "100%": { transform: "rotate(360deg)" },
        })}`,
        "& > circle": {
          fill: "none",
          stroke: strokeColor,
          strokeWidth: 4,
          strokeDasharray: 83, // 2/3 of circumference
          strokeLinecap: "round",
        },

      }}
      {...rest}
    >
      <circle cx="25" cy="25" r="20" />
    </svg>
  );
});
