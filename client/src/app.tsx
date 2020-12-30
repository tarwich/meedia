import { Global, Interpolation, useTheme } from '@emotion/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { IoQrCode } from 'react-icons/io5';
import { QRCode } from 'react-qr-svg';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Api } from './api';
import { GallaryPage } from './gallary-page';
import { Dialog } from './modal/dialog';
import { DefaultTheme } from './theme';
import { HBox } from './ui/hbox';
import { IconButton } from './ui/icon-button';
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
    showQrCode: false,
  }));
  const theme = useTheme() as DefaultTheme;

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
        <IconButton onClick={() => (store.showQrCode = true)}>
          <IoQrCode />
        </IconButton>
        <Dialog
          isOpen={!!store.showQrCode}
          onRequestClose={() => (store.showQrCode = false)}
        >
          <QRCode
            fgColor={'black !important'}
            bgColor={'white'}
            value={location.href}
            width={'auto'}
            height={'auto'}
            css={{
              gridArea: 'main',
              maxWidth: '200px',
              maxHeight: '200px',
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
