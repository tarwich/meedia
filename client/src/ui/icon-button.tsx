import { Button, ButtonProps } from './button';

export type IconButtonProps = ButtonProps;

export const IconButton = (props: IconButtonProps) => {
  const { ...restProps } = props;

  return (
    <Button
      css={{
        borderRadius: '45%',
      }}
      {...restProps}
    />
  );
};
