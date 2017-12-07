import { VIDEO_SCRUB, VIDEO_MOVE_UP, VIDEO_MOVE_DOWN, GRAB_VIDEOS, DELETE_VIDEO } from '../actions/index';

// NEED TO PREVENT DUPLICATE ORDERS

export default function (state = [], action) {
	var videosToSort = null;
	switch (action.type) {
	case VIDEO_SCRUB:
		action.payload.order = state[0].videos.length;
		action.payload.id = state[0].videos.length;
		state[0].videos.push(action.payload);
		return [...state, state[0]];
	case VIDEO_MOVE_UP:
		videosToSort = state[0].videos;
		for (var x = 0; x < videosToSort.length; x++) {
			if (videosToSort[x].id === action.payload.id /*||
					videosToSort[x].order === (action.payload.order + 1)*/) {
				videosToSort[x].order += 1;
			}
		}
		videosToSort.sort(function (a, b) { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); });
		state[0].videos = videosToSort;
		return [...state];
	case VIDEO_MOVE_DOWN:
		videosToSort = state[0].videos;
		for (let x = 0; x < videosToSort.length; x++) {
			if (videosToSort[x].id === action.payload.id /*||
					videosToSort[x].order === (action.payload.order - 1)*/) {
				videosToSort[x].order -= 1;
			}
		}
		videosToSort.sort(function (a, b) { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); });
		state[0].videos = videosToSort;
		return [...state];
	case GRAB_VIDEOS:
		if (action.payload.data !== 'Password Required') {
			let x = action.payload.data.videos;
			x.map(function (i) {
				i.id = i._id;
			});
			action.payload.data.videos = x;
			return [...state, action.payload.data];
		} else {
			return [...state, action.payload.data];
		}
	case DELETE_VIDEO:
		var videosToSearch = state[0].videos;
		for (var i = 0; i < videosToSearch.length; i++) {
			if (videosToSearch[i].id === action.payload) {
				videosToSearch.splice(i, 1);
				i--;
			}
		}
		return [...state];
	default:
		return state;
	}
}
