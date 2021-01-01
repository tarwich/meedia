import { useTheme } from '@emotion/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Api } from '../api';
import { Dialog } from '../modal/dialog';
import { DefaultTheme } from '../ui/theme';
import { VBox } from '../ui/vbox';

export const MakeDirectoryDialog = observer(
  ({
    api,
    basePath,
    ...restProps
  }: {
    className?: string;
    children?: string;
    onRequestClose?(): void;
    basePath: string;
    api: Api;
  }) => {
    const theme = useTheme() as DefaultTheme;
    const history = useHistory();
    const store = useLocalObservable(() => ({
      name: '',
      busy: false,

      createDirectory: async () => {
        if (store.busy) return;
        store.busy = true;

        await api.post('action/mkdir', { path: `${basePath}/${store.name}` });
        history.push(`${basePath}/${store.name}`)
        restProps.onRequestClose?.();
      },
    }));

    return (
      <Dialog
        title={'Create Directory'}
        actions={{
          cancel: () => restProps.onRequestClose?.(),
          createDirectory: store.createDirectory,
        }}
        {...restProps}
      >
        {store.busy ? (
          'Busy...'
        ) : (
          <VBox css={{ padding: theme.padding }}>
            <input
              type="text"
              placeholder="Name"
              value={store.name}
              autoFocus={true}
              onChange={(event) => (store.name = event.target.value)}
            />
          </VBox>
        )}
      </Dialog>
    );
  }
);
