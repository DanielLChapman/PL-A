import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import ReduxPromise from "redux-promise";

import APIApp from './components/APIApp';
import apiReducers from "./reducers/apiKeys";


const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(apiReducers)}>
    <APIApp />
  </Provider>,
  document.querySelector('.api-container')
);
