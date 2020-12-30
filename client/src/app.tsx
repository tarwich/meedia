import { ClassNames, Global, Interpolation } from '@emotion/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { CSSProperties } from 'react';
import { IoQrCode } from 'react-icons/io5';
import ReactModal from 'react-modal';
import { QRCode } from 'react-qr-svg';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Api } from './api';
import { GallaryPage } from './gallary-page';
import { Dialog } from './modal/dialog';
import { Button } from './ui/button';
import { HBox } from './ui/hbox';
import { VBox } from './ui/vbox';

export type ApplicationProps = {
  api: Api;
};

const BASE_CSS: Interpolation<any> = {
  display: 'grid',
  gridTemplate: `'main' 1fr/1fr`,
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  '& > *': {
    gridArea: 'main',
  },
};

export const Application = observer(({ api }: ApplicationProps) => {
  const store = useLocalObservable(() => ({
    showQrCode: true,
  }));

  return (
    <VBox css={{ gap: 0 }}>
      <Global
        styles={{
          '*': { boxSizing: 'border-box' },
          html: {
            height: '100%',
            ...BASE_CSS,
          },
          body: { ...BASE_CSS },
          '#meedia': { ...BASE_CSS },
        }}
      />
      <HBox
        grid
        css={{
          alignItems: 'center',
          gridTemplateColumns: '1fr auto',
        }}
      >
        <h1>Meedia</h1>
        <Button onClick={() => (store.showQrCode = true)}>
          <IoQrCode />
        </Button>
        <Dialog
          isOpen={!!store.showQrCode}
          onRequestClose={() => (store.showQrCode = false)}
        >
          <QRCode
            fgColor={'black !important'}
            bgColor={'white'}
            value={location.href}
            css={{
              gridArea: 'main',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </Dialog>
      </HBox>
      <Router>
        <Route path="*">
          <GallaryPage api={api} />
        </Route>
      </Router>
    </VBox>
  );
});
