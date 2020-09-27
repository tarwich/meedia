import { Box, useTheme } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { Api } from './api';
import { Image } from './image';
import { Video } from './video';

/**
 * @param {object} props
 * @param {Api} props.api
 */
export const GallaryPage = ({ api }) => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([''].filter(Boolean));

  const { sizes } = useTheme();

  useEffect(() => {
    api.get('/browse').then((response) => {
      setFiles(response.files);
      setLoading(false);
    });
  }, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(auto-fill, ${sizes['48']})`}
      gridGap={5}
      p={5}
    >
      {files.map((file) => (
        /.*\.(gif|png|jpe?g)$/i.test(file) ? <Image key={file} file={file} /> : <Video key={file} file={file} />
      ))}
    </Box>
  );
};
