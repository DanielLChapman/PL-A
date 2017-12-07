import { combineReducers } from 'redux';
import VideoReducer from './reducer_watch';

const watchReducer = combineReducers({
	playlist: VideoReducer
});

export default watchReducer;
