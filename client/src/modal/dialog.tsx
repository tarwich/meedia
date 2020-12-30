import { useTheme } from '@emotion/react';
import { IoCloseCircle } from 'react-icons/io5';
import { DefaultTheme } from '../theme';
import { IconButton } from '../ui/icon-button';
import { VBox } from '../ui/vbox';
import { Modal, ModalProps } from './modal';

export type DialogProps = ModalProps & {};

export const Dialog = (props: DialogProps) => {
  const { children, ...restProps } = props;
  const theme = useTheme() as DefaultTheme;

  return (
    <Modal
      css={{
        padding: theme.gap,
        border: '1px solid hsl(220, 20%, 40%)',
        borderRadius: theme.borderRadius * 2,
        background: 'hsl(40, 10%, 98%)',
        gridTemplate: `'main' 1fr/1fr`,
      }}
      {...restProps}
    >
      <IconButton
        onClick={props.onRequestClose}
        css={{
          gridArea: 'main',
          alignSelf: 'start',
          justifySelf: 'end',
          transform: `translate(${theme.spacing(5)}px, -${theme.spacing(5)}px)`,
        }}
      >
        <IoCloseCircle />
      </IconButton>
      <VBox
        css={{
          gridArea: 'main',
        }}
      >
        {children}
      </VBox>
    </Modal>
  );
};
