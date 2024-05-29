import { LuAlertTriangle, LuInfo } from "react-icons/lu";
import { match, useAppkitConfig } from ".";


type Props = JSX.IntrinsicElements["div"] & {
    kind: "error" | "info";
    iconPos?: "left" | "top";
};

/** A styled container for different purposes */
export const Card: React.FC<Props> = ({ kind, iconPos = "left", children, ...rest }) => {
  const config = useAppkitConfig();

  return (
    <div
      css={{
        display: "inline-flex",
        flexDirection: iconPos === "left" ? "row" : "column",
        borderRadius: 4,
        padding: "8px 16px",
        gap: 16,
        alignItems: "center",
        "& > svg": {
          fontSize: 24,
          minWidth: 24,
        },
        ...match(kind, {
          "error": () => ({
            backgroundColor: config.colors.danger0,
            border: `1.5px solid ${config.colors.danger0}`,
            color: config.colors.danger0BwInverted,
          }) as Record<string, string>,
          "info": () => ({
            backgroundColor: config.colors.neutral10,
          }),
        }),
      }}
      {...rest}
    >
      {match(kind, {
        "error": () => <LuAlertTriangle />,
        "info": () => <LuInfo css={{ color: config.colors.neutral60 }} />,
      })}
      <div>{children}</div>
    </div>
  );
};
