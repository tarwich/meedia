import { useTheme } from '@emotion/react';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { resolve } from 'path';
import { useEffect } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import { Api } from '../api';
import { Dialog, DialogProps } from '../modal/dialog';
import { HBox } from '../ui/hbox';
import { IconButton } from '../ui/icon-button';
import { DefaultTheme } from '../ui/theme';
import { VBox } from '../ui/vbox';

type LocalFile = {
  base: string;
  fullPath: string;
  type: string;
};

export const FileEntry = ({
  file,
  onDelete,
}: {
  file: LocalFile;
  onDelete(): void;
}) => {
  const theme = useTheme() as DefaultTheme;

  return (
    <HBox
      css={{
        border: '1px solid hsl(220, 20%, 90%)',
        borderRadius: theme.borderRadius,
        placeItems: 'center start',
      }}
    >
      {file.base}
      <IconButton onClick={onDelete}>
        <IoCloseCircle />
      </IconButton>
    </HBox>
  );
};

export type DeleteDirectoryDialogProps = {
  api: Api;
  directory: string;
  onRequestClose?(): void;
};

export const DeleteDirectoryDialog = observer(
  ({ directory, api, ...restProps }: DeleteDirectoryDialogProps) => {
    const history = useHistory();
    const store = useLocalObservable(() => ({
      state: 'init' as 'init' | 'busy' | 'ready',
      entries: [] as LocalFile[],

      get directories() {
        return store.entries.filter(
          (entry) => entry.type === 'application/x-directory'
        );
      },

      get files() {
        return store.entries.filter(
          (entry) => entry.type !== 'application/x-directory'
        );
      },
    }));

    useEffect(() => {
      api
        .get<{ files: LocalFile[] }>('browse', { path: directory })
        .then((results) => {
          runInAction(() => {
            store.entries = results?.files;
            store.state = 'ready';
          });
        });
    }, [directory]);

    return (
      <Dialog
        title={'Delete Directory'}
        actions={{
          cancel: () => restProps.onRequestClose?.(),
          delete: async () => {
            if (store.entries.length) return;

            store.state = 'busy';

            await api.post('action/rmdir', { path: directory });
            history.push(resolve(history.location.pathname, '../'));
            restProps.onRequestClose?.();
          },
        }}
        {...restProps}
      >
        {(() => {
          if (store.state === 'init') return 'Working...';

          if (store.directories.length) {
            return (
              <VBox>
                You will need to go delete the following folders before deleting
                this folder:
                <HBox>
                  {store.directories.map((directory) => (
                    <span key={directory.fullPath}>{directory.base}</span>
                  ))}
                </HBox>
              </VBox>
            );
          }

          if (store.files.length) {
            return (
              <VBox>
                Please delete the following files first
                <HBox
                  css={{
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(200px, auto))',
                  }}
                >
                  {store.files.map((file) => (
                    <FileEntry
                      key={file.fullPath}
                      file={file}
                      onDelete={() => {
                        api
                          .post('action/unlink', {
                            file: file.fullPath,
                          })
                          .then(() => {
                            store.entries = store.files.filter(
                              (other) => other.fullPath !== file.fullPath
                            );
                          });
                      }}
                    />
                  ))}
                </HBox>
              </VBox>
            );
          }

          return 'Click DELETE to confirm';
        })()}
      </Dialog>
    );
  }
);
