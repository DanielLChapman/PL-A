import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import ReduxPromise from "redux-promise";

import EditVideosApp from './components/EditVideosApp';
import rootReducers from "./reducers/editVideos";


const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(rootReducers)}>
    <EditVideosApp />
  </Provider>,
  document.querySelector('.editVideos')
);
