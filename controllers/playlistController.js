const mongoose = require('mongoose');
const User = mongoose.model('User');
const Playlist = mongoose.model('Playlist');
const promisify = require('es6-promisify');
const url = require('url');

exports.homePage = async (req, res) => {
	res.render('index', {title: 'Index'});
}

exports.newPlayList = (req, res) => {
	res.render('editPlaylist', {title: 'Edit Playlist'})
}

exports.editPlayList = async(req, res) => {
	const user = await User.findOne({email: req.user.email});
	const playlist = await Playlist.findOne({_id: req.params.playlist_id});
	if ((playlist.user.toString() === user._id.toString())) {
		res.render('editPlaylist', {title: 'Edit Playlist', playlist})
	} else {
		res.redirect('/');
	}
}

exports.checkAndCreate = async (req,res) => {
	if (req.body.private === "on") {
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
	var tempTags = req.body.tags.split(',');
	for (let x = 0; x < tempTags.length; x++) {
		tempTags[x] = tempTags[x].trim();
	}
	req.body.tags = tempTags;
	const playlist = new Playlist(req.body);
	await playlist.save();

	res.redirect('/editVideos/' + playlist._id);
}

exports.editVideosInPlayList = async(req, res) => {
	res.render('editVideos', { title: 'Edit Videos', id: req.params.playlist_id});
}

exports.checkPermissions = async(req, res, next) => {
	const playlist = await Playlist.findOne({_id: req.params.playlist_id});
	if (req.user != null) {
		const user = await User.findOne({email: req.user.email});
		if (playlist.user.toString() === user._id.toString()) {
			return next();
		} 
	}
	if (req.params.type === 'edit') {
		if (playlist.sharedEdit && req.body.password.toString() === playlist.editPassword.toString()) {
			return next();
		} 
		else {
			return res.json('Password Required');
		}
	} else if (req.params.type === 'view') {
		if (!playlist.private) {

			return next();
		}
		else if (playlist.private && req.body.password.toString() === playlist.password.toString()) {
			return next();
		} 
		else {
			return res.json('Password Required');
		}
	}
}

exports.grabPlaylist = async(req,res) => {
	const playlist = await Playlist.findOne({_id: req.params.playlist_id});
	var returnValue = null;
	if (req.params.type === 'view') {
		returnValue = {
			name: playlist.name,
			description: playlist.description,
			slug: playlist.slug,
			user: playlist.user,
			videos: playlist.videos
		};
	} else {
		returnValue = playlist;
		var tempTags = playlist.tags;
		for (let x = 0; x < tempTags.length; x++) {
			tempTags[x] = tempTags[x].trim();
		}
		returnValue.tags = tempTags.join(', ');
	}
	res.json(returnValue);
}

exports.updatePlayList = async(req, res) => {
	const user = await User.findOne({email: req.user.email});
	const playlist = await Playlist.findOne({_id: req.params.playlist_id});

	if ((playlist.user.toString() === user._id.toString()) ||
		(playlist.sharedEdit && req.body.editPassword.toString() === playlist.editPassword.toString())) {
		if (req.body.updateType === 'videos') {
			playlist.videos = req.body.videos;
			await playlist.save();
			return res.json('success');
		} else if (req.body.updateType === 'playlist') {
			/*const updatedPlaylist = await Playlist.findOneAndUpdate(
				{ _id: req.body.playlist._id },
				{ $set: req.body.playlist },
			);*/
			let tempTags = req.body.playlist.tags.split(',');

			for (let x = 0; x < tempTags.length; x++) {
				tempTags[x] = tempTags[x].trim();
			}
			req.body.playlist.tags = tempTags;

			const update = promisify(Playlist.update, Playlist);
			await update(playlist, req.body.playlist);

			res.json('Success');
		}
	}
	else {
		return res.json('Password Required');
	}


}

exports.getMyPlaylists = async(req, res) => {
	const user = await User.findOne({email: req.user.email});
	var playlists = await Playlist.find({user: user._id})
	res.render('myPlaylists', {title: 'My Playlists', playlists});
}

exports.watchPlaylist = async(req, res) => {
	const playlist = await Playlist.findOneAndUpdate({slug: req.params.slug}, { $inc: {views: 1}} );
	var order = req.query.order || 0;
	res.render('watch', {title: playlist.name, id: playlist._id, order});
}

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

exports.search = (req, res) => {
	res.render('search', {title: 'Search'});
}

exports.getPopularPlaylists = (req, res) => {
	res.render('popular', {title: 'Popular'});
}

exports.getPopularPlaylistsAPI = async(req, res) => {
	const time = req.query.time ||  1000*60*60*24;
	const limiter = req.query.num || 10;
	var playlists = await Playlist.find( {
			createdAt: {
				$gt: (Date.now() - time)
			}
		}, {
			name: true,
			description: true,
			_id: true,
			slug: true,
			user: true,
			views: true,
			createdAt: true,
		}).sort({
			views: 1
		}).limit(parseInt(limiter)).populate('user');

	playlists.map(x => {
		x.user._id = undefined;
		x.user.email = undefined;
	})

	res.json(playlists);

}

exports.createPlayList = async(req, res) => {
	const playlist = new Playlist(req.body.playlist);
	await playlist.save();
	const returnObj = {
		playlist,
		url: `/watch/${playlist.slug}`,
		invalidURLS: req.body.invalidURLS
	}
	res.json(returnObj);
}
