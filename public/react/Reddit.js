import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import ReduxPromise from "redux-promise";

import RedditPage from './components/RedditPage';
import RedditReducer from "./reducers/reddit";


const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(RedditReducer)}>
   <RedditPage />
  </Provider>,
  document.querySelector('.reddit-container')
);
