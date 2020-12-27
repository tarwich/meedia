import { useTheme } from "@emotion/react";
import { CSSProperties, ReactNode } from "react";
import { DefaultTheme } from "../theme";

export type HBoxProps = {
  className?: string;
  grid?: boolean;
  children?: ReactNode;
};

const gridCss: CSSProperties = {
  display: "grid",
  gridAutoFlow: "column",
};

const flexCss: CSSProperties = {
  display: "flex",
  flexDirection: "row",
};

export const HBox = (props: HBoxProps) => {
  const { children, grid, ...restProps } = props;
  const theme = useTheme() as DefaultTheme;

  return (
    <div
      css={{
        ...(grid ? gridCss : flexCss),
        gap: theme.gap,
        padding: theme.padding,
      }}
      {...restProps}
    >
      {children}
    </div>
  );
};
