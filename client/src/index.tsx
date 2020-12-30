import { ThemeProvider } from '@emotion/react';
import { configure } from 'mobx';
import React from 'react';
import { render } from 'react-dom';
import { Api } from './api';
import { Application } from './app';
import { THEME } from './theme';
import './index.css';
import ReactModal from 'react-modal';

const root: HTMLElement =
  document.querySelector('#meedia') ||
  document.body.appendChild(document.createElement('div'));
root.id = 'meedia';

configure({ enforceActions: 'never' });

const api = new Api();
ReactModal.setAppElement(root);

render(
  <ThemeProvider theme={THEME}>
    <Application api={api} />
  </ThemeProvider>,
  root
);
