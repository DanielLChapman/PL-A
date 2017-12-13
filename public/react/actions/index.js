import axios from 'axios';

export const VIDEO_SCRUB = 'VIDEO_SCRUB';
export const VIDEO_MOVE_UP = 'VIDEO_MOVE_UP';
export const VIDEO_MOVE_DOWN = 'VIDEO_MOVE_DOWN';
export const GRAB_VIDEOS = 'GRAB_VIDEOS';
export const DELETE_VIDEO = 'DELETE_VIDEO';
export const GET_VIDEOS_TO_VIEW = 'GET_VIDEOS_TO_VIEW';
export const SEARCH_PLAYLISTS = 'SEARCH_PLAYLISTS';
export const GRAB_API_KEYS = 'GRAB_API_KEYS';
export const GENERATE_API_KEY = 'GENERATE_API_KEY';
export const DELETE_API_KEY = 'DELETE_API_KEY';

export const REGEX_OBJ = {
	regYouTubeCom: /^(https?:\/\/)?(www\.)youtube.com\/(watch\?v=)\S{11}/,
	regYoutuBe: /^(https:\/\/)(youtu)\.(be)\/\S{11}/,
	VimeoCom: /^(https:\/\/)(vimeo)\.(com)\/[a-zA-Z0-9]{8}/,
	VimeoPlayer: /^(https:\/\/)(player)\.(vimeo)\.(com)\/(video)\/[a-zA-Z0-9]{8}/,
	DaiLy: /^(http:\/\/)(dai)\.(ly)\/[a-zA-Z0-9]{7}/,
	DailyMotionCom: /^(http:\/\/)?(www|m)\.(dailymotion)\.(com\/)(video)\/[a-zA-Z0-9]{7}/,
	Streamable: /^(https:\/\/)((www|m)?.)?(streamable)\.(com)\/[a-zA-Z0-9]{5}/
};

var test = null;
function urlSplitter (ele, order = 0) {
	switch (true) {
	case REGEX_OBJ.regYouTubeCom.test(ele):
		test = ele.split('v=')[1];
		test = test.substring(0, 11);
		return {
			id: null,
			site: 'youtube',
			videoID: test,
			order
		};
	case REGEX_OBJ.regYoutuBe.test(ele):
		test = ele.split('be/')[1];
		test = test.substring(0, 11);
		return {
			id: null,
			site: 'youtube',
			videoID: test,
			order
		};
	case REGEX_OBJ.VimeoCom.test(ele):
		test = ele.split('com/')[1];
		test = test.substring(0, 8);
		return {
			id: null,
			site: 'vimeo',
			videoID: test,
			order
		};
	case REGEX_OBJ.VimeoPlayer.test(ele):
		test = ele.split('/video/')[1];
		test = test.substring(0, 8);
		return {
			id: null,
			site: 'vimeo',
			videoID: test,
			order
		};
	case REGEX_OBJ.DaiLy.test(ele):
		test = ele.split('ly/')[1];
		test = test.substring(0, 7);
		return {
			id: null,
			site: 'dailymotion',
			videoID: test,
			order
		};
	case REGEX_OBJ.DailyMotionCom.test(ele):
		test = ele.split('/video/')[1];
		test = test.substring(0, 7);
		return {
			id: null,
			site: 'dailymotion',
			videoID: test,
			order
		};
	case REGEX_OBJ.Streamable.test(ele):
		test = ele.split('/')[3];
		return {
			id: null,
			site: 'streamable',
			videoID: test,
			order
		};
	default:
		return {error: 'Not Sure What Happened. Try Again Or Send Us An Email Here'};
	}
}

export function scrubURL (element) {
	const url = element;
	const data = urlSplitter(url);

	return {
		type: VIDEO_SCRUB,
		payload: data
	};
}

export function grabVideos (reactID, type, password) {
	const url = `/api/v1/grabPlaylist/${reactID}/${type}`;

	const data = axios.post(url, {
		password
	});

	return {
		type: GRAB_VIDEOS,
		payload: data
	};
}

export function searchVideos (searchTerm) {
	const url = `/api/v1/search?q=${searchTerm}`;
	const data = axios.get(url);

	return {
		type: SEARCH_PLAYLISTS,
		payload: data
	}
}

export function moveVideoUp (elementID, elementOrder) {
	const data = {
		id: elementID,
		order: elementOrder
	};
	return {
		type: VIDEO_MOVE_UP,
		payload: data
	};
}

export function moveVideoDown (elementID, elementOrder) {
	const data = {
		id: elementID,
		order: elementOrder
	};
	return {
		type: VIDEO_MOVE_DOWN,
		payload: data
	};
}

export function deleteVideo (elementID) {
	const data = elementID;
	return {
		type: DELETE_VIDEO,
		payload: data
	};
}

export function grabAPIKeys () {
	const url = '/internal/api/v1/grabUsersAPIKeys';
	const data = axios.get(url);

	return {
		type: GRAB_API_KEYS,
		payload: data
	}
}

export function generateNewAPIKey () {
	const url = '/internal/api/v1/generateNewAPIKey';
	const data = axios.get(url);

	return {
		type: GENERATE_API_KEY,
		payload: data
	}
}

export function deleteAPIKey (key) {
	const url = '/internal/api/v1/deleteAPIKey';
	const data = axios.delete(url, {
		params: {
			apiKey: key
		}
	});

	return {
		type: DELETE_API_KEY,
		payload: data
	}
}
