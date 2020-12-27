import { useTheme } from "@emotion/react";
import { CSSProperties, ReactNode } from "react";
import { DefaultTheme } from "../theme";

export type VBoxProps = {
  className?: string;
  grid?: boolean;
  children?: ReactNode;
};

const gridCss: CSSProperties = {
  display: "grid",
  gridAutoFlow: "row",
};

const flexCss: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

export const VBox = (props: VBoxProps) => {
  const { children, grid, ...restProps } = props;
  const theme = useTheme() as DefaultTheme;

  return (
    <div
      css={{
        ...(grid ? gridCss : flexCss),
        gap: theme.gap,
      }}
      {...restProps}
    >
      {children}
    </div>
  );
};
