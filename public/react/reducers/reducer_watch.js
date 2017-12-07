import { GRAB_VIDEOS } from '../actions/index';

// NEED TO PREVENT DUPLICATE ORDERS

export default function (state = [], action) {
	switch (action.type) {
	case GRAB_VIDEOS:
		console.log(action.payload);
		if (action.payload.data !== 'Password Required') {
			var x = action.payload.data.videos;
			x.map(function (i) {
				i.id = i._id;
			});
			action.payload.data.videos = x;
			return [...state, action.payload.data];
		} else {
			return [...state, action.payload.data];
		}
	default:
		return state;
	}
}
