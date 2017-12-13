const mongoose = require('mongoose');
const User = mongoose.model('User');
const Playlist = mongoose.model('Playlist');
const API = mongoose.model('API');
const requestIp = require('request-ip');

const REGEX_OBJ = {
	regYouTubeCom: /^(https?:\/\/)?(www\.)youtube.com\/(watch\?v=)\S{11}/,
	regYoutuBe: /^(https:\/\/)(youtu)\.(be)\/\S{11}/,
	VimeoCom: /^(https:\/\/)(vimeo)\.(com)\/[a-zA-Z0-9]{8}/,
	VimeoPlayer: /^(https:\/\/)(player)\.(vimeo)\.(com)\/(video)\/[a-zA-Z0-9]{8}/,
	DaiLy: /^(http:\/\/)(dai)\.(ly)\/[a-zA-Z0-9]{7}/,
	DailyMotionCom: /^(http:\/\/)?(www|m)\.(dailymotion)\.(com\/)(video)\/[a-zA-Z0-9]{7}/,
	Streamable: /^(https:\/\/)((www|m)?.)?(streamable)\.(com)\/[a-zA-Z0-9]{5}/
};

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
		return ele
	}
}

exports.logEntry = async (req, res, next) => {
	let apiModel = {}
	if (req.body.apiKey) {
		apiModel.apiKey = req.body.apiKey
		apiModel.ipAddress = requestIp.getClientIp(req); 
		apiModel.action = req.route.path.split('/')[3];
		if (apiModel.action === "createPlaylist") {
			apiModel.name = req.body.playlist.name;
		}
		apiModel.userAgent = req.headers['user-agent']
	}
	req.body.apiModel = apiModel;
	const api = new API(apiModel);

	await api.save();

}

exports.sanitizeInfo =  (req, res, next) => {
	//videos
	let videosToSubmit = [], invalidURLS = [];
	const playlist = req.body.playlist;
	const videos = playlist.videos;
	let error = {};
	if (videos.length > 0) {
		/*
		Needs to be a reducer instead of map, but this should be small so a for loop
		should be fine
		videosToSubmit = videos.map((k, i) => {
			return urlSplitter(k, i);
		});*/
		for (var x = 0; x < videos.length; x++) {
			let temp = urlSplitter(videos[x], x);
			if (typeof temp === 'object') {
				videosToSubmit.push(temp);
			} else {
				invalidURLS.push(temp);
			}
		}
	};
	if (videosToSubmit.length <= 0 ) {
		error.videos = 'Requires at least 1 URL';
	}

	//playlist information
	if (typeof playlist.name === 'undefined') {
		error.name = 'Required';
	};
	if (typeof playlist.description === 'undefined') {
		error.description = 'Required';
	};
	if (typeof playlist.private === 'undefined') {
		playlist.private = false;
		playlist.password = undefined;
	};
	if (typeof playlist.sharedEdit === 'undefined') {
		playlist.sharedEdit = false;
		playlist.editPassword = undefined;
	};

	if (Object.keys(error).length > 0) {
		return res.status(500).json({"error": error, "invalidURLS": invalidURLS})
	}


	req.body.playlist.videos = videosToSubmit;
	req.body.invalidURLS = invalidURLS;

	next();
}

exports.findUser = async (req, res, next) => {
	const apiKey = req.body.apiKey;
	const user = await User.findOne({
		$text: {
			$search: apiKey
		}
	});
	req.body.playlist.user = user;
	if (typeof user === 'undefined') {
		return res.json('Invalid API Key');
	}
	next();
}