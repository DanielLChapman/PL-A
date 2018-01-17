const mongoose = require('mongoose');
const User = mongoose.model('User');
const Playlist = mongoose.model('Playlist');
const API = mongoose.model('API');
const requestIp = require('request-ip');
const xml = require('xml');

const REGEX_OBJ = {
	regYouTubeCom: /^(https?:\/\/)?(www\.)youtube.com\/(watch\?v=)\S{11}/,
	regYoutuBe: /^(https:\/\/)(youtu)\.(be)\/\S{11}/,
	VimeoCom: /^(https:\/\/)(vimeo)\.(com)\/[a-zA-Z0-9]{8}/,
	VimeoPlayer: /^(https:\/\/)(player)\.(vimeo)\.(com)\/(video)\/[a-zA-Z0-9]{8}/,
	DaiLy: /^(http:\/\/)(dai)\.(ly)\/[a-zA-Z0-9]{7}/,
	DailyMotionCom: /^(http:\/\/)?(www|m)\.(dailymotion)\.(com\/)(video)\/[a-zA-Z0-9]{7}/,
	Streamable: /^(https:\/\/)((www|m)?.)?(streamable)\.(com)\/[a-zA-Z0-9]{5}/
};

function sanitizeVideos(videos) {
	let videosToSubmit = [],
		invalidURLS = [];
	for (var x = 0; x < videos.length; x++) {
		let temp = urlSplitter(videos[x], x);
		if (typeof temp === 'object') {
			videosToSubmit.push(temp);
		} else {
			invalidURLS.push(temp);
		}
	}
	return {
		valid: videosToSubmit,
		invalid: invalidURLS
	};
	
}

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
	}
	apiModel.ipAddress = requestIp.getClientIp(req); 
	apiModel.action = Object.keys(req.route.methods)[0];
	if (apiModel.action === "post" || apiModel.action === "patch") {
		if (typeof req.body.apiKey === 'undefined') {
			var error = {
				'error': 'Something Went Wrong, either API Key was missing or we had trouble reading your data'
			};
			return 	res.status(500).json(error);
		}
		try {
			apiModel.name = req.body.playlist.name;
		}catch(e) {
			if (req.body.slug) {
				let playlist = await Playlist.findOne({slug: req.body.slug});
				apiModel.name = playlist.name;
			} else {
				return res.status(500).json({error: 'Missing playlist name'});
			}
		}
	}
	else if (apiModel.action === "get") {
		apiModel.apiKey = "Not Required";
		apiModel.name = "Not Required";
	}
	apiModel.userAgent = req.headers['user-agent']
	req.body.apiModel = apiModel;

	const api = new API(apiModel);
	await api.save(function(err) {
	});

	return next();
}

exports.sanitizeInfo =  (req, res, next) => {
	//videos
	let videosToSubmit = [], invalidURLS = [];
	let playlist = req.body.playlist;
	const videos = playlist.videos;
	let error = {};
	if (videos.length > 0) {
		let returnTemp = sanitizeVideos(videos);
		videosToSubmit = returnTemp.valid;
		invalidURLS = returnTemp.invalid;
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

exports.prepareChanges = (req, res, next) => {
	let videosToSubmit = [], invalidURLS = [];
	let error = {},
		playlist = null;
	try {
		playlist = req.body.changes.playlistChanges;
	} catch(err) {
		return res.status(500).json("You didn't include any data");
	}
	if (playlist == null || typeof playlist === 'undefined') {
		return res.status(500).json("You didn't include any data");
	}
	let videos = playlist.videos;

	if (videos != null && videos.length > 0) {
		let returnTemp = sanitizeVideos(videos);
		videosToSubmit = returnTemp.valid;
		invalidURLS = returnTemp.invalid;
	};
	req.body.playlist = playlist;
	req.body.playlist.videos = videosToSubmit;
	if (videosToSubmit.length === 0) {
		try {
			delete req.body.playlist.videos;
		} catch(err) {
			console.log(err);
		}
	}
	req.body.invalidURLS = invalidURLS;
	req.body.updateType = 'playlist';

	return next();
};

exports.findUser = async (req, res, next) => {
	if (req.body.apiKey == null && req.user == null) {
		return res.status(500).json('Missing API Key');
	}
	const apiKey = req.body.apiKey;
	let user;
	if (req.user == null) {
		user = await User.findOne({
			$text: {
				$search: apiKey
			}
		});
	}
	try {
		req.body.playlist.user = user;
	} catch (err) {
		res.locals.user = user;
	}
	if (user == null && req.user == null) {
		return res.status(500).json('Invalid API Key');
	}
	next();
}
