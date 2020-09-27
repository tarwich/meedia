import { Box, Button, Link, useTheme } from '@chakra-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import { Api } from './api';
import { Video } from './video';

/**
 * @param {object} props
 * @param {Api} props.api
 */
export const GallaryPage = ({ api }) => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([''].filter(Boolean));
  const [directory, setDirectory] = useState('');

  const { sizes } = useTheme();

  useEffect(() => {
    api.get(`/browse/${directory}`).then((response) => {
      setFiles(response.files);
      setLoading(false);
    });
  }, [directory]);

  return (
    <Box>
      <Box display="flex" gridGap={5}>
        {Boolean(directory.split('/').filter(Boolean).length > 0) && (
          <Fragment>
            <Link onClick={() => setDirectory('')}>(root)</Link>/
          </Fragment>
        )}

        {directory
          .split('/')
          .filter(Boolean)
          .map((segment, i, parts) => {
            if (i === parts.length - 1) {
              return <span>{segment}</span>;
            }

            return (
              <Fragment key={i}>
                <Link
                  onClick={() => setDirectory(parts.slice(0, i + 1).join('/'))}
                >
                  {segment}
                </Link>
                /
              </Fragment>
            );
          })}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={`repeat(auto-fill, ${sizes['48']})`}
        gridGap={5}
        p={5}
      >
        {files.map((file) => {
          // if (/.*\.(gif|png|jpe?g)$/i.test(file)) return <Image key={file} file={file} />;

          if (file.endsWith('/')) {
            return (
              <Box key={file}>
                {file}
                <Button
                  onClick={() =>
                    setDirectory(
                      `${directory}/${file}`.replace(/(^\/+|\/(?=\/))/g, '')
                    )
                  }
                >
                  Enter
                </Button>
              </Box>
            );
          }

          return <Video key={file} file={`${directory}${file}`} />;
        })}
      </Box>
    </Box>
  );
};
