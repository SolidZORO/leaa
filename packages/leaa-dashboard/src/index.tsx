import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

const renderComponent = (Component: any) => {
  ReactDOM.render(<Component />, document.getElementById('app'));
};

renderComponent(App);

// Webpack Hot Module Replacement API
if ((module as any).hot) {
  (module as any).hot.accept('./App', () => {
    renderComponent(App);
  });
}
