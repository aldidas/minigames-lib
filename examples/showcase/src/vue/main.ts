import { createApp } from 'vue';

import { copyToClipboard } from '../shared/dom';
import App from './App.vue';
import { INSTALL_SNIPPET } from './snippets';
import '../shared/theme.css';

const installButton = document.querySelector<HTMLButtonElement>('#copy-install');
installButton?.addEventListener('click', () => copyToClipboard(INSTALL_SNIPPET, installButton));

const mount = document.getElementById('app');
if (!mount) throw new Error('Missing #app');

createApp(App).mount(mount);
