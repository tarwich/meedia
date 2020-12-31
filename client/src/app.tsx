import { Global, Interpolation, useTheme } from '@emotion/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import QRCode from 'qrcode.react';
import { IoDocumentTextOutline, IoQrCode } from 'react-icons/io5';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Api } from './api';
import { BossView } from './boss-view';
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
    bossMode: !!localStorage.getItem('boss'),

    setBossMode(value: boolean) {
      store.bossMode = value;
      if (value) localStorage.setItem('boss', 'yes');
      else localStorage.removeItem('boss');
    },
  }));
  const theme = useTheme() as DefaultTheme;

  if (store.bossMode) return <BossView setBossMode={store.setBossMode} />;

  return (
    <VBox css={{ gap: 0, overflow: 'auto' }}>
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
        <h2>Meedia</h2>

        {/* Boss Button */}
        <IconButton onClick={() => store.setBossMode(true)}>
          <IoDocumentTextOutline />
        </IconButton>

        {/* QR Code */}
        <IconButton onClick={() => (store.showQrCode = true)}>
          <IoQrCode />
        </IconButton>
        <Dialog
          isOpen={!!store.showQrCode}
          onRequestClose={() => (store.showQrCode = false)}
        >
          <QRCode
            value={location.href}
            includeMargin={true}
            size={theme.spacing(35)}
            css={{ gridArea: 'main', borderRadius: theme.spacing(3) }}
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
