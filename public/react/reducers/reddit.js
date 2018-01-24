import { combineReducers } from 'redux';
import redditReducers from './reducer_reddit';

const RedditReducer = combineReducers({
	videos: redditReducers
});

export default RedditReducer;
