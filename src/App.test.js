import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

it('renders without crashing', () => {
  const storeFake = (state) => ({
    default: () => { },
    subscribe: () => { },
    dispatch: () => { },
    getState: () => ({ ...state })
  });
  const store = storeFake({
    file: { fileAvailable: false }
  });

  const div = document.createElement('div');
  const root = ReactDOM.createRoot(div);
  root.render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );
  root.unmount();
});