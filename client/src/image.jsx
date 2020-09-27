import { Box } from '@chakra-ui/core';
import React from 'react';

export const Image = ({ file = '' }) => {
  return (
    <Box>
      <img src={`/image/${file}`} />
    </Box>
  );
};
