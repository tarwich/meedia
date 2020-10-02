import { Box, Button, useTheme } from '@chakra-ui/core';
import { basename, normalize } from 'path';
import React, { Fragment, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  useRouteMatch,
} from 'react-router-dom';
import { Api } from './api';
import { Video } from './video';

const WIDTH = 250;

/**
 * @param {object} props
 * @param {Api} props.api
 */
export const GallaryPage = ({ api }) => {
  const [files, setFiles] = useState([''].filter(Boolean));
  // const [directory, setDirectory] = useState('');
  const match = useRouteMatch();
  /** @type {string} */
  // @ts-ignore
  const directory = match.params['0'].slice(1);

  useEffect(() => {
    setFiles([]);

    api.get(`/browse/${directory}`).then((response) => {
      setFiles(
        response.files.map(
          /** @param {string} file */
          (file) => `${directory}${file}`
        )
      );
    });
  }, [directory]);

  return (
    <Box>
      <Box display="flex" border="1px solid gray">
        <Box>
          <Link to="..">(..)</Link>
        </Box>
      </Box>
      <Box display="grid" gridTemplateColumns={`repeat(auto-fill, ${WIDTH}px)`}>
        {files.map((file) => {
          const base = basename(file);

          return (
            <Box key={file}>
              {file.endsWith('/') ? (
                <Link to={`/${escape(file)}`}>{base}</Link>
              ) : (
                  <Video file={file} />
                )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
