import React, { StrictMode as ReactStrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { fluentXboxTheme } from './internal/components/theme';
import Popup from './internal/Popup';
import { store } from './internal/state/store';

/*
 * Page rendered when the user clicks the action button in their toolbar.
 */

initializeIcons();

ReactDOM.render(
  <ReactStrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider theme={fluentXboxTheme}>
        <Popup />
      </ThemeProvider>
    </ReduxProvider>
  </ReactStrictMode>,
  document.getElementById('root'),
);
