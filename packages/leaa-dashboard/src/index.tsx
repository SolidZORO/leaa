import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

const renderComponent = (AppComponent: React.ComponentClass | React.FunctionComponent): void => {
  ReactDOM.render(<AppComponent />, document.getElementById('app'));
};

renderComponent(App);

// Webpack Hot Module Replacement API
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./App', () => {
    renderComponent(App);
  });
}
