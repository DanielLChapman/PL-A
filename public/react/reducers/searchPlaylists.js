import { combineReducers } from 'redux';
import SearchReducer from './reducer_search';

const rootReducer = combineReducers({
	playlists: SearchReducer
});

export default rootReducer;
