import React from 'react';
import { render } from 'react-dom';
import { Api } from './api';
import { Application } from './app';

const root =
  document.querySelector('#meedia') ||
  document.body.appendChild(document.createElement('div'));
root.id = 'meedia';

const api = new Api();

render(<Application api={api} />, root);
