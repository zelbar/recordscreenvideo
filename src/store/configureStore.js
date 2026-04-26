import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import * as Recording from './Recording';
import * as Resolution from './Resolution';
import * as File from './File';

export default function configureStore (history, initialState) {
  const reducers = {
    recording: Recording.reducer,
    resolution: Resolution.reducer,
    file: File.reducer
  };

  const middleware = [
    thunk
  ];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
  }

  const rootReducer = combineReducers({
    ...reducers
  });

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
