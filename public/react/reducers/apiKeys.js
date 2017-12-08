import { combineReducers } from 'redux';
import APIReducer from './reducer_api';

const apiReducer = combineReducers({
	apiKeys: APIReducer
});

export default apiReducer;
