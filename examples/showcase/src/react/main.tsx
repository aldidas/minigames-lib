import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { copyToClipboard } from '../shared/dom';
import App from './App';
import { INSTALL_SNIPPET } from './snippets';
import '../shared/theme.css';

const installButton = document.querySelector<HTMLButtonElement>('#copy-install');
installButton?.addEventListener('click', () => copyToClipboard(INSTALL_SNIPPET, installButton));

const mount = document.getElementById('root');
if (!mount) throw new Error('Missing #root');

createRoot(mount).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
