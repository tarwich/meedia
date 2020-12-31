import { css, useTheme } from '@emotion/react';
import { startCase } from 'lodash';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { basename } from 'path';
import React, { Fragment, useEffect } from 'react';
import { IoArrowUp } from 'react-icons/io5';
import { Link, useRouteMatch } from 'react-router-dom';
import { Api } from './api';
import { MenuItem } from './menu-item';
import { DefaultTheme } from './theme';
import { HBox } from './ui/hbox';
import { VBox } from './ui/vbox';
import { Video } from './video';

const WIDTH = 300;

type LocalFile = {
  name: string;
  base: string;
  ext: string;
  fullPath: string;
  type: string;
};

type GallaryPageProps = {
  api: Api;
};

const ALLOWED_FILES = ['video', 'image', 'application/x-directory'];

const PLAYABLE_FILES = new Set(['mp4', 'webm']);

const isPlayable = (file: LocalFile) => PLAYABLE_FILES.has(file.ext);

export const GallaryPage = observer(({ api }: GallaryPageProps) => {
  const match = useRouteMatch();
  // @ts-ignore
  const directory: string = match.params['0']
    .split(/[\/\\]/)
    .slice(1)
    .join('/');
  const theme = useTheme() as DefaultTheme;

  const store = useLocalObservable(() => ({
    listing: [] as LocalFile[],

    get playableFiles() {
      return new Map(
        store.listing.filter(isPlayable).map((file) => [file.name, file])
      );
    },

    get files() {
      return store.listing.filter((file) => {
        if (file.type === 'application/x-directory') return false;
        if (!isPlayable(file) && store.playableFiles.get(file.name))
          return false;
        return true;
      });
    },

    get directories() {
      return store.listing.filter(
        (file) => file.type === 'application/x-directory'
      );
    },
  }));

  useEffect(() => {
    api
      .get<{ files: LocalFile[] }>(`/list`, { path: directory })
      .then((response) => {
        store.listing = response.files.filter((file) => {
          return ALLOWED_FILES.find((prefix) => file.type?.startsWith(prefix));
        });
      });
  }, [directory]);

  return (
    <VBox css={{ overflow: 'auto' }}>
      <HBox
        css={{
          gap: theme.spacing(),
        }}
      >
        {directory
          .split('/')
          .filter(Boolean)
          .reduce(
            (list, part) =>
              list.concat(
                '',
                `${list.slice(-1)[0]}/${part}`.replace('//', '/')
              ),
            ['/']
          )
          .map((url, i, list) =>
            url === '' ? (
              <span key={i}>/</span>
            ) : i === list.length - 1 ? (
              <span key={url}>{basename(url) || '(root)'}</span>
            ) : (
              <Link key={url} to={url}>
                {basename(url) || '(root)'}
              </Link>
            )
          )}
      </HBox>
      <VBox css={{ padding: 0, overflow: 'auto' }}>
        <HBox
          grid
          css={{
            gridAutoFlow: 'row',
            gridTemplateColumns: `repeat(auto-fill, minmax(calc(10% + 50px), auto))`,
          }}
        >
          {store.directories.map((directory) => (
            <Link
              key={directory.fullPath}
              to={`/${escape(directory.fullPath)}`}
              css={{
                textDecoration: 'none',
              }}
            >
              <MenuItem>{startCase(directory.name)}</MenuItem>
            </Link>
          ))}
        </HBox>
        <HBox
          grid
          css={{
            gridAutoFlow: 'row',
            gridTemplateColumns: `repeat(auto-fit, minmax(200px, auto))`,
          }}
        >
          {store.files.map((file) => {
            return <Video file={file} key={file.fullPath} api={api} />;
          })}
        </HBox>
      </VBox>
    </VBox>
  );
});
