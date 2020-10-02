import { Box, Button } from '@chakra-ui/core';
import React, { useState } from 'react';

export const Video = ({ file = '' }) => {
  const [isStreaming, setStreaming] = useState(false);

  return (
    <Box>
      {isStreaming ? (
        <video
          autoPlay={true}
          controls={true}
          src={`/stream/${escape(file)}`}
          loop={true}
        ></video>
      ) : (
        <Box>
          <img src={`/thumb/${escape(file)}`} width="100%" />
        </Box>
      )}
      <Box>{file}</Box>
      <Button onClick={() => setStreaming(!isStreaming)}>Watch</Button>
    </Box>
  );
};
