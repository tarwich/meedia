import { startCase } from 'lodash';
import { useState } from 'react';
import { Api } from './api';

export type VideoProps = {
  file: {
    name: string;
    type: string;
    fullPath: string;
  };
  api: Api;
};

export const Video = ({ file, api }: VideoProps) => {
  const [isStreaming, setStreaming] = useState(false);
  const [isConverting, setConverting] = useState(false);
  const [isConverted, setConverted] = useState(false);

  if (file.type.startsWith('image/')) {
    return (
      <div>
        <img css={{ width: '100%' }} src={`image/${file.fullPath}`} />
      </div>
    );
  }

  if (
    file.type.startsWith('video/') &&
    file.type !== 'video/mp4' &&
    file.type !== 'video/webm'
  ) {
    return (
      <div>
        <div>
          <img src={`/thumb/${escape(file.fullPath)}`} width="100%" />
        </div>
        <div>{startCase(file.name)}</div>
        <button
          onClick={() => {
            if (isConverted) {
              location.reload();
              return;
            }

            setConverting(true);
            api.get('/convert', { file: file.fullPath }).then(() => {
              setConverting(false);
              setConverted(true);
            });
          }}
          disabled={isConverting}
        >
          {isConverting ? 'Converting...' : isConverted ? 'Reload' : 'Convert'}
        </button>
      </div>
    );
  }

  return (
    <div>
      {isStreaming ? (
        <video
          autoPlay={true}
          controls={true}
          src={`/mp4/${escape(file.fullPath)}`}
          loop={true}
          css={{
            width: '100%',
          }}
        ></video>
      ) : (
        <div>
          <img src={`/thumb/${escape(file.fullPath)}`} width="100%" />
        </div>
      )}
      <div>{startCase(file.name)}</div>
      <button onClick={() => setStreaming(!isStreaming)}>
        {isStreaming ? 'Close' : 'Watch'}
      </button>
    </div>
  );
};
