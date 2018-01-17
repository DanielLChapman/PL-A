const mongoose = require('mongoose');
const User = mongoose.model('User');
const Playlist = mongoose.model('Playlist');
const promisify = require('es6-promisify');
const url = require('url');

/* Plain Page Rendering */

exports.homePage = async (req, res) => {
	res.render('index', {title: 'Index'});
}

exports.newPlayList = (req, res) => {
	res.render('editPlaylist', {title: 'New Playlist'})
}

exports.editPlayList = async(req, res) => {
	const user = await User.findOne({email: req.user.email});
	let playlist = null;
	if (req.params.playlist_id.match(/^[0-9a-fA-F]{24}$/)) {
		playlist = await Playlist.findOne({_id: req.params.playlist_id});
	}
	if (playlist != null && (playlist.user.toString() === user._id.toString())) {
		res.render('editPlaylist', {title: 'Edit Playlist', playlist})
	} else {
		req.flash('Error', 'You dont have permission to access this page.');
		res.redirect('/');
	}
}

exports.editVideosInPlayList = async(req, res) => {
	let playlist = null;
	if (req.params.playlist_id.match(/^[0-9a-fA-F]{24}$/)) {
		playlist = await Playlist.findOne({_id: req.params.playlist_id});
	}
	if (playlist == null) {
		return res.redirect('/');
	}
	res.render('editVideos', { title: 'Edit Videos', id: req.params.playlist_id});
}

exports.getMyPlaylists = async(req, res) => {
	const user = await User.findOne({email: req.user.email});
	var playlists = await Playlist.find({user: user._id})
	res.render('myPlaylists', {title: 'My Playlists', playlists});
}

exports.grabMyPlaylistsAPI = async(req, res) => {
	const user = await User.findOne({email: req.user.email});
	var playlists = await Playlist.find({user: user._id})
	res.json(playlists);
}

exports.watchPlaylist = async(req, res) => {
	const playlist = await Playlist.findOneAndUpdate({slug: req.params.slug}, { $inc: {views: 1}} );
	var order = req.query.order || 0;
	if (playlist == null) {
		return res.redirect('/');
	}
	res.render('watch', {title: playlist.name, id: playlist._id, order});
}

exports.search = (req, res) => {
	res.render('search', {title: 'Search'});
}

exports.getPopularPlaylists = (req, res) => {
	res.render('popular', {title: 'Popular'});
}


/* Logic */

//Middle Ware

//Permission Check
exports.checkPermissions = async(req, res, next) => {
	//figure out playlist
	var playlist = null;
	if (req.params.playlist_id) {
		playlist = await Playlist.findOne({_id: req.params.playlist_id}).populate('user');
	} else if (req.params.slug) {
		playlist = await Playlist.findOne({slug: req.params.slug}).populate('user');
		req.params.type = 'view';
	}

	//if one isnt found, return an error
	if (playlist == null) {
		return res.json('Cant find specific playlist, please check the slug or id');
	}
	res.locals.playlist = playlist;
	//If there is a user
	if (req.user != null) {
		//double check that we have the full user
		const user = await User.findOne({email: req.user.email});
		//if they match up to the user on the playlist
		if (playlist.user._id.toString() === user._id.toString()) {
			return next();
		}
		//else, we check for passwords
	}
	//If no user or user didnt add up, we see if there is an api key
	if (req.body.apiKey) {
		//if there is, we try to use it
		const apiKey = req.body.apiKey;
		const user = await User.findOne({
			$text: {
				$search: apiKey
			}
		});
		//if we fail to find a user, 
		if (user != null) {
			if (playlist.user.toString() === user._id.toString()) {
				return next();
			}
		} else {
			res.json('Invalid API Key');
		}
	}
	//Otherwise lets check passwords
	//If param is to edit
	if (req.params.type === 'edit') {
		//check for a shared edit password and check if there is one in the body and if they match up
		if (playlist.sharedEdit && req.body.password.toString() === playlist.editPassword.toString()) {
			return next();
		} 
		else {
			//otherwise get the hell out
			return res.json('Password Required');
		}
	} else if (req.params.type === 'view') {
		//For viewing
		if (!playlist.private) {
			//IF the playlist isnt private. Who cares, let them view
			return next();
		}
		else {
			//Otherwise, check for a password
			if (req.body.password == null) {
				//If no password, kick them out
				return res.json('Password Required');
			}
			else if ( req.body.password.toString() === playlist.password.toString() ) {
				//If the password matches, let them view
				return next();
			} else {
				//If the password is wrong, send them back but dont tell them the password was wrong.
				return res.json('Password Required');
			}
		} 
	} else if (req.body.apiModel.action === "delete") {
		if (playlist.sharedEdit && req.body.password.toString() === playlist.editPassword.toString()) {
			return next();
		} 
		else {
			//otherwise get the hell out
			return res.json('Password Required');
		}
	}
}



//CREATE FUNCTIONS

//HTML
exports.checkAndCreatePlayList = async (req,res) => {
	if (req.body.private === "on" || req.body.private === true) {
		req.body.private = true;
	}
	else {
		req.body.private = false;
	}
	if (req.body.sharedEdit === "on") {
		req.body.sharedEdit = true;
	}
	else {
		req.body.sharedEdit = false;
	}
	const user = await User.findOne({email: req.user.email});
	req.body.user = user;
	let tempTags = req.body.tags;
	req.checkBody('name', 'You Must Supply a Name!').notEmpty();
	if (!Array.isArray(req.body.tags)) {
		tempTags = req.body.tags.split(',');

		for (let x = 0; x < tempTags.length; x++) {
			tempTags[x] = tempTags[x].trim();
		}
	}
	req.body.tags = tempTags;
	const errors = req.validationErrors();
	if (errors) {
		req.flash('error', errors.map(err => err.msg));
		res.render('editPlaylist', {title: 'Register', body: req.body, flashes: req.flash() 
		});
		return;
	}
	const playlist = new Playlist(req.body);
	await playlist.save((err) => {	
		if (err != null) {
			console.log(err);
		}
	});

	res.redirect('/editVideos/' + playlist._id);
}

//API
exports.createPlayList = async(req, res) => {
	const playlist = new Playlist(req.body.playlist);
	await playlist.save();
	const returnObj = {
		playlist: {
			id: playlist._id,
			user: playlist.user.name,
			slug: playlist.slug,
			name: playlist.name,
			description: playlist.description,
			tags: playlist.tags
		},
		url: `/watch/${playlist.slug}`,
		invalidURLS: req.body.invalidURLS
	}
	res.status(201).json(returnObj);
}

//UPDATE
//HTML
exports.updatePlayList = async(req, res) => {
	let user = null;
	if (res.locals.user) {
		user = res.locals.user;
	}
	else if (req.body.user == null) {
		user = await User.findOne({email: req.user.email});
	}
	var playlist = null
	if (req.params.playlist_id) {
		playlist = await Playlist.findOne({_id: req.params.playlist_id});
	} else if (req.body.slug) {
		playlist = await Playlist.findOne({slug: req.body.slug});
	} else if (req.body.playlist.slug) {
		playlist = await Playlist.findOne({slug: req.params.slug});
	}

	if ((playlist.user.toString() === user._id.toString()) ||
		(playlist.sharedEdit && req.body.editPassword.toString() === playlist.editPassword.toString())) {
		if (req.body.updateType === 'videos') {
			playlist.videos = req.body.videos;
			await playlist.save();
		} else if (req.body.updateType === 'playlist') {
			if (!Array.isArray(req.body.playlist.tags) && req.body.playlist.tags!= null) {
				let tempTags = req.body.playlist.tags.split(',');

				for (let x = 0; x < tempTags.length; x++) {
					tempTags[x] = tempTags[x].trim();
				}
				req.body.playlist.tags = tempTags;
			}

			Object.assign(playlist, req.body.playlist);
			await playlist.save();
		} else {
			return res.status(500).json({'Error': 'No updateType set'});
		}
		res.json({'success': 'Success', playlist: playlist});
	}
	else {
		return res.json('Password Required');
	}
}



//INDEX
exports.indexPlaylists = async(req, res) => {
	var playlists = await Playlist.find({private: false}, {
		name: true,
		description: true,
		slug: true,
		user: true,
		views: true,
		tags: true,
		_id: false
	}).populate('user');

	playlists.map(x => {
		x.user._id = undefined;
		x.user.email = undefined;
		x.user.apiKeys = undefined;
	})

	res.json(playlists);
}

//SHOW
exports.grabPlaylist = async(req,res) => {
	var playlist = res.locals.playlist;
	if (playlist == null) {
		console.log('error');
		return res.status(500).json('error');
	}
	if (req.params.slug) {
		req.params.type = 'view';
	}
	var returnValue = null;
	if (req.params.type === 'view') {
		returnValue = {
			name: playlist.name,
			description: playlist.description,
			slug: playlist.slug,
			user: {
				name: playlist.user.name
			},
			videos: playlist.videos,
			tags: playlist.tags
		};
	} else {
		returnValue = playlist;
		var tempTags = playlist.tags;
		for (let x = 0; x < tempTags.length; x++) {
			tempTags[x] = tempTags[x].trim();
		}
		returnValue.tags = tempTags.join(', ');
		returnValue.user = {
			name: returnValue.user.name,
			email: returnValue.user.email
		};
	}
	res.json(returnValue);
}



//SEARCHING API
exports.searchPlaylists = async(req, res) => {
	const playlists = await Playlist.find( {
		$text: {
			$search: req.query.q,
		},
		private: false 
	}, {
		name: true,
		description: true,
		_id: true,
		slug: true,
		user: true,
		views: true,
		createdAt: true,
		score: {
			$meta: 'textScore'
		}
	}).sort({
		score: { $meta: 'textScore'}
	}).limit(5).populate('user');

	playlists.map(x => {
		x.user._id = undefined;
		x.user.email = undefined;
	})

	res.json(playlists);
}

//POPULAR API
exports.getPopularPlaylistsAPI = async(req, res) => {
	const time = req.query.time ||  1000*60*60*24;
	const limiter = req.query.num || 10;
	var playlists = await Playlist.find( {
			createdAt: {
				$gt: (Date.now() - time)
			},
			private: false
		}, {
			name: true,
			description: true,
			_id: true,
			slug: true,
			user: true,
			views: true,
			createdAt: true,
			private: true
		}).sort({
			views: 1
		}).limit(parseInt(limiter)).populate('user');

	playlists.map(x => {
		x.user._id = undefined;
		x.user.email = undefined;
		x.user.apiKeys = undefined;
	})

	res.json(playlists);

}

//DELETE
exports.deletePlaylist = async(req, res) => {
	Playlist.remove({ _id: res.locals.playlist._id}, function(err) {
		if (!err) {
			return res.status(202).json('Successfully Deleted');
		} else {
			return res.status(500).json({'Error': err});
		}
	});
}