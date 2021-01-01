import { useTheme } from '@emotion/react';
import { last, startCase } from 'lodash';
import { IoCloseCircle } from 'react-icons/io5';
import { DefaultTheme } from '../ui/theme';
import { Button } from '../ui/button';
import { HBox } from '../ui/hbox';
import { IconButton } from '../ui/icon-button';
import { Modal, ModalProps } from './modal';

export type DialogProps = ModalProps & {
  title?: string;
  actions?: Record<string, () => void>;
};

export const Dialog = (props: DialogProps) => {
  const { actions, children, title, ...restProps } = props;
  const theme = useTheme() as DefaultTheme;

  const [, primaryCallback] = last(Object.entries(actions || {})) || [];

  return (
    <Modal
      css={{
        border: '1px solid hsl(220, 20%, 40%)',
        borderRadius: theme.borderRadius * 2,
        background: 'hsl(40, 10%, 98%)',
        gridTemplate: `[main] 1fr / 1fr`,
      }}
      {...restProps}
    >
      <IconButton
        onClick={props.onRequestClose}
        css={{
          gridArea: 'main',
          placeSelf: 'start end',
          transform: `translate(${theme.spacing(2)}px, -${theme.spacing(2)}px)`,
          borderRadius: '50%',
        }}
      >
        <IoCloseCircle />
      </IconButton>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          primaryCallback?.();
        }}
        css={{
          gridArea: 'main',
          display: 'grid',
          gridTemplate: `
            ' header  ' auto
            ' main    ' 1fr
            ' actions ' auto
            / 1fr
          `,
        }}
      >
        {title && (
          <HBox
            css={{
              placeSelf: 'normal',
              background: 'hsl(220, 30%, 90%)',
              borderBottom: '1px solid hsl(220, 20%, 80%)',
            }}
          >
            {title}
          </HBox>
        )}
        <div>{children}</div>
        {actions && (
          <HBox
            css={{
              gridArea: 'actions',
              placeContent: 'center end',
            }}
          >
            {Object.entries(actions).map(([name, callback]) => (
              <Button key={name} onClick={callback}>
                {startCase(name)}
              </Button>
            ))}
          </HBox>
        )}
      </form>
    </Modal>
  );
};
