import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Api } from './api';
import { GallaryPage } from './gallary-page';
import { ChakraProvider } from '@chakra-ui/core';

/**
 *
 * @param {object} props
 * @param {Api} props.api
 */
export const Application = ({ api }) => {
  return (
    <ChakraProvider>
      <div>
        <h1>Meedia</h1>
        <Router>
          <Route path="*">
            <GallaryPage api={api} />
          </Route>
        </Router>
      </div>
    </ChakraProvider>
  );
};
