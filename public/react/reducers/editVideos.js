import { combineReducers } from 'redux';
import VideoReducer from './reducer_video';

const rootReducer = combineReducers({
	playlist: VideoReducer
});

export default rootReducer;
