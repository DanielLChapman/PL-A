import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import ReduxPromise from "redux-promise";

import SearchPage from './components/SearchPage';
import searchReducers from "./reducers/searchPlaylists";


const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(searchReducers)}>
    <SearchPage />
  </Provider>,
  document.querySelector('.search-container')
);
