import { useTheme } from '@emotion/react';
import { DefaultTheme } from './theme';
import { Button, ButtonProps } from './button';

export type IconButtonProps = ButtonProps;

export const IconButton = (props: IconButtonProps) => {
  const { ...restProps } = props;
  const theme = useTheme() as DefaultTheme;

  return (
    <Button
      css={{
        borderRadius: theme.borderRadius * 2,
      }}
      {...restProps}
    />
  );
};
