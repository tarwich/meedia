import { Box, Button } from '@chakra-ui/core';
import React, { useState } from 'react';

export const Video = ({ file = '' }) => {
  const [isStreaming, setStreaming] = useState(false);

  return (
    <Box>
      <Box>
        <img src={`/thumb/${file}`} width="100%" />
      </Box>
      <Box>{file}</Box>
      <Button onClick={() => setStreaming(!isStreaming)}>Watch</Button>
      {isStreaming && (
        <video autoPlay={true} controls={true} src={`/stream/${file}`}></video>
      )}
    </Box>
  );
};
