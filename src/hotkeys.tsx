import React, { ReactNode } from "react";
import { useColorScheme } from "./colorScheme";
import { useAppkitConfig } from "./config";


export type KeyCombinationContainerProps = {
  children: React.ReactNode[];
  className?: string;
};

/** A combination of multiple keys pressed at the same time, connected with "+". */
export const KeyCombinationContainer: React.FC<KeyCombinationContainerProps> = ({
  children, className,
}) => {
  const config = useAppkitConfig();

  return (
    <div {...{ className }} css={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      color: config.colors.neutral70,
    }}>
      {children.map((child, i) => <React.Fragment key={i}>
        {i !== 0 && "+"}
        {child}
      </React.Fragment>)}
    </div>
  );
};

export type SingleKeyContainerProps = React.PropsWithChildren<{
  className?: string;
}>;

/**
 * Looks like a single keyboard key. Can contain a short text and/or icon. The
 * actual content has to be provided, but should follow these rules:
 *
 * - up/down/right/left: only icon `<LuArrow* />`
 * - escape: "Esc"
 * - period and comma: "." and ","
 * - shift: Text ("Shift") followed by `<LuArrowBigUp />`
 * - tab: Text ("Tab") followed by `icons/tab-key.svg` (in appkit)
 */
export const SingleKeyContainer: React.FC<SingleKeyContainerProps> = ({ className, children }) => {
  const config = useAppkitConfig();
  const { isDark, isHighContrast } = useColorScheme();
  const shadowColor = isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)";

  return (
    <div {...{ className }} css={{
      border: `1px solid ${config.colors.neutral50}`,
      borderRadius: 4,
      padding: "2px 6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      height: 36,
      minWidth: 36,
      fontSize: 16,
      boxShadow: isHighContrast ? "none" : `0 0 6px ${shadowColor}`,
      backgroundColor: isDark ? config.colors.neutral15 : config.colors.neutral05,
      color: isDark ? config.colors.neutral90 : config.colors.neutral80,
      cursor: "default",
      svg: {
        fontSize: 20,
      },
    }}>
      {children}
    </div>
  );
};

export type ShortcutGroupOverviewProps = {
  /** The text between different alternatives, usually "or" with translations. */
  alternativeSeparator: string;
  /** Title of this group. */
  title: string;
  shortcuts: {
    /** Description of what the shortcut does. */
    label: string;
    /** For each alternative key combination, one `KeyCombinationContainer`. */
    combinations: ReactNode[];
  }[];
};

/** Element of shortcut overview */
export const ShortcutGroupOverview: React.FC<ShortcutGroupOverviewProps> = ({
  alternativeSeparator,
  title,
  shortcuts,
}) => {
  const config = useAppkitConfig();

  return (
    <section css={{
      container: "shortcut-group / inline-size",
      margin: "32px 0",
      ":first-of-type": {
        marginTop: 16,
      },
    }}>
      <h2 css={{ fontSize: 18, marginBottom: 8 }}>{title}</h2>
      <div css={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
      }}>
        {shortcuts.map(({ label, combinations }, i) => (
          <div
            key={i}
            css={{
              width: "calc(33.33% - 24px / 3)",
              "@container shortcut-group (width < 780px)": {
                width: "calc(50% - 12px / 2)",
              },
              "@container shortcut-group (width < 510px)": {
                width: "100%",
              },
              backgroundColor: config.colors.neutral10,
              borderRadius: 4,
              padding: "10px 16px",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "start",
              gap: 8,
            }}
          >
            <div css={{ overflowWrap: "anywhere" }}>{label}</div>
            <div css={{
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}>
              {combinations.map((combination, i) => <React.Fragment key={i}>
                {i > 0 && alternativeSeparator}
                {combination}
              </React.Fragment>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
