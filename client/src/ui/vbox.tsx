import { css, useTheme } from '@emotion/react';
import { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { DefaultTheme } from './theme';

export type VBoxProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  grid?: boolean;
  children?: ReactNode;
};

const gridCss: CSSProperties = {
  display: 'grid',
  gridAutoFlow: 'row',
};

const flexCss: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

export const VBox = (props: VBoxProps) => {
  const { children, grid, ...restProps } = props;
  const theme = useTheme() as DefaultTheme;

  return (
    <div
      {...restProps}
      css={[
        {
          ...(grid ? gridCss : flexCss),
          gap: theme.gap,
        },
        // @ts-ignore
        props.css,
      ]}
    >
      {children}
    </div>
  );
};
