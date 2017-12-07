import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import ReduxPromise from "redux-promise";

import ViewPlaylist from './components/ViewPlaylist';
import watchReducers from "./reducers/watchVideos";


const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(watchReducers)}>
    <ViewPlaylist />
  </Provider>,
  document.querySelector('.video-container')
);
