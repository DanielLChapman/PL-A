import { SEARCH_PLAYLISTS } from '../actions/index';

export default function (state = [], action) {
	var videosToSort = null;
	switch (action.type) {
	case SEARCH_PLAYLISTS:	
		return action.payload.data || state;
	default:
		return state;
	}
}
