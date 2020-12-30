import { ClassNames } from '@emotion/react';
import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';

export type ModalProps = Omit<ReactModal['props'], 'isOpen'> & {
  className?: string;
  isOpen?: boolean;
};

export const Modal = (props: ModalProps) => {
  const { isOpen = true, children, ...restProps } = props;

  return (
    <ClassNames>
      {({ css }) => (
        <ReactModal
          isOpen={isOpen}
          portalClassName={css({
            display: 'grid',
            gridTemplate: `'main' 1fr/1fr`,
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            '& > *': {
              gridArea: 'main',
            },
            zIndex: 1,
            pointerEvents: 'none',
          })}
          overlayClassName={css({
            pointerEvents: 'all',
            display: 'grid',
            gridTemplateColumns: '1fr [main] 2fr 1fr',
            gridTemplateRows: '1fr [main] 2fr 1fr',
            alignItems: 'center',
            justifyItems: 'center',
            overflow: 'hidden',
            background: 'hsla(220, 5%, 15%, 0.8)',
          })}
          css={{
            gridArea: 'main',
            outline: 'none',
            maxHeight: '100%',
            display: 'grid',
            gridTemplate: `'main' minmax(auto, 1fr) / minmax(auto, 1fr)`,
            alignItems: 'center',
            justifyItems: 'center',
          }}
          {...restProps}
        >
          {children}
        </ReactModal>
      )}
    </ClassNames>
  );
};
