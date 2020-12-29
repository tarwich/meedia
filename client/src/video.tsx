import { useTheme } from '@emotion/react';
import { startCase } from 'lodash';
import { Fragment, useState } from 'react';
import { IoFilm, IoHourglass, IoPlay, IoReload } from 'react-icons/io5';
import { Api } from './api';
import { If } from './if';
import { DefaultTheme } from './theme';

export type VideoProps = {
  file: {
    name: string;
    type: string;
    ext: string;
    fullPath: string;
  };
  api: Api;
};

const WHITELIST = ['image/', 'video/mp4', 'video/webm'];

const isWhitelisted = (type: string) => {
  return !!WHITELIST.find((allow) => type.startsWith(allow));
};

export const Video = ({ file, api }: VideoProps) => {
  const [isStreaming, setStreaming] = useState(false);
  const [isConverting, setConverting] = useState(false);
  const [isConverted, setConverted] = useState(false);
  const theme = useTheme() as DefaultTheme;

  return (
    <div
      css={{
        display: 'grid',
        gridTemplate: `
          ' video' 200px
          ' name ' auto
          / 100%
        `,
        border: '1px solid hsl(220, 5%, 60%)',
        borderRadius: theme.borderRadius,
        alignItems: 'center',
        justifyItems: 'center',
        overflow: 'hidden',
        boxShadow: '2px 2px 4px 0px hsla(220, 5%, 10%, 0.2)',
      }}
    >
      <div
        css={{
          gridArea: 'video',
          width: '105%',
          height: '105%',
          background: `center / cover url('/thumb/${escape(file.fullPath)}')`,
          filter: 'blur(5px)',
          zIndex: -1,
        }}
      ></div>
      {isStreaming ? (
        file.type.startsWith('image/') ? (
          <img
            src={`/image/${file.fullPath}`}
            css={{
              gridArea: 'video',
              width: '100%',
            }}
          />
        ) : (
          <video
            autoPlay={true}
            controls={true}
            src={`/mp4/${escape(file.fullPath)}`}
            loop={true}
            css={{
              gridArea: 'video',
              width: '100%',
            }}
          ></video>
        )
      ) : (
        <Fragment>
          <img
            src={`/thumb/${escape(file.fullPath)}`}
            css={{
              width: '100%',
              gridArea: 'video',
            }}
          />

          <div
            css={{
              gridArea: 'video',
              display: 'grid',
              alignItems: 'center',
              justifyItems: 'center',
              border: '1px solid hsl(220, 50%, 30%)',
              background: 'hsla(220, 50%, 80%, 0.5)',
              borderRadius: '50%',
              padding: theme.spacing(),
              cursor: 'pointer',
            }}
            onClick={() => {
              if (isWhitelisted(file.type)) {
                setStreaming(true);
              } else {
                if (isConverted) {
                  location.reload();
                } else {
                  setConverting(true);
                  api.get('/convert', { file: file.fullPath }).then(() => {
                    setConverted(true);
                    setConverting(false);
                  });
                }
              }
            }}
          >
            {isWhitelisted(file.type) ? (
              <IoPlay
                css={{
                  gridArea: 'main',
                  width: theme.spacing(10),
                  height: theme.spacing(10),
                  color: 'hsl(220, 50%, 30%)',
                  transform: `translateX(${theme.spacing() - 1}px)`,
                }}
              />
            ) : isConverting ? (
              <IoHourglass
                css={{
                  gridArea: 'main',
                  width: theme.spacing(10),
                  height: theme.spacing(10),
                  color: 'hsl(0, 50%, 30%)',
                }}
              />
            ) : isConverted ? (
              <IoReload
                css={{
                  gridArea: 'main',
                  width: theme.spacing(10),
                  height: theme.spacing(10),
                  color: 'hsl(180, 50%, 30%)',
                }}
              />
            ) : (
              <IoFilm
                css={{
                  gridArea: 'main',
                  width: theme.spacing(10),
                  height: theme.spacing(10),
                  color: 'hsl(0, 50%, 30%)',
                }}
              />
            )}
          </div>
        </Fragment>
      )}

      {/* Name */}
      <div
        css={{
          gridArea: 'name',
          padding: theme.padding,
          boxSizing: 'content-box',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: `calc(100% - ${theme.padding * 2}px)`,
          background: 'white',
        }}
        title={file.name}
      >
        {startCase(file.name)}
      </div>

      {/* Extension */}
      <span
        css={{
          gridArea: 'name',
          alignSelf: 'end',
          justifySelf: 'end',
          background: 'hsl(220, 5%, 60%)',
          color: 'white',
          borderTopLeftRadius: theme.borderRadius,
          padding: `0 ${theme.padding}px`,
        }}
      >
        {file.ext}
      </span>
    </div>
  );
};
