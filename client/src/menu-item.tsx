import { css, CSSObject, useTheme } from '@emotion/react';
import { ReactNode } from 'react';
import { IoFolder } from 'react-icons/io5';
import { DefaultTheme } from './ui/theme';
import { HBox } from './ui/hbox';

type MenuItemProps = {
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  css?: CSSObject;
};

export const MenuItem = (props: MenuItemProps) => {
  const theme = useTheme() as DefaultTheme;
  const {
    icon = <IoFolder css={{ fill: 'white' }} />,
    children,
    className,
    css: parentCss,
  } = props;

  return (
    <HBox
      css={[
        {
          padding: 0,
          gap: theme.padding,
          overflow: 'hidden',
          borderRadius: theme.borderRadius,
          border: '1px solid hsl(220, 5%, 50%)',
          alignItems: 'center',
          justifyItems: 'center',
        },
        className,
        parentCss,
      ]}
    >
      <HBox
        grid
        css={{
          background: 'hsl(220, 5%, 50%)',
          alignSelf: 'normal',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        {icon}
      </HBox>
      <div>{children}</div>
    </HBox>
  );
};
