import { useTheme } from '@emotion/react';
import { HTMLAttributes, ReactNode } from 'react';
import { DefaultTheme } from './theme';
import { HBox } from './hbox';

export type ButtonProps = {
  className?: string;
  children?: ReactNode;
  onClick?: HTMLAttributes<HTMLButtonElement>['onClick'];
};

export const Button = (props: ButtonProps) => {
  const { children, ...restProps } = props;
  const theme = useTheme() as DefaultTheme;

  return (
    <HBox
      {...restProps}
      css={[
        {
          border: '1px solid hsl(220, 20%, 50%)',
          background: 'hsl(220, 20%, 90%)',
          borderRadius: theme.borderRadius,
          cursor: 'pointer',
          '&:hover': {
            border: '1px solid hsl(220, 20%, 53%)',
            background: 'hsl(220, 20%, 93%)',
          },
          '&:active': {
            border: '1px solid hsl(220, 20%, 47%)',
            background: 'hsl(220, 20%, 87%)',
          },
        },
        // @ts-ignore
        props.css,
      ]}
    >
      {children}
    </HBox>
  );
};
