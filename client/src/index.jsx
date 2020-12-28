import { ThemeProvider } from '@emotion/react';
import { configure } from 'mobx';
import React from 'react';
import { render } from 'react-dom';
import { Api } from './api';
import { Application } from './app';
import { THEME } from './theme';
import './index.css'

const root =
  document.querySelector('#meedia') ||
  document.body.appendChild(document.createElement('div'));
root.id = 'meedia';

configure({ enforceActions: 'never' });

const api = new Api();

render(
  <ThemeProvider theme={THEME}>
    <Application api={api} />
  </ThemeProvider>,
  root
);
