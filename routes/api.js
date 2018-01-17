const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const apiController = require('../controllers/apiController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/v1/search', catchErrors(playlistController.searchPlaylists));

router.get('/v1/getPopularVideos', catchErrors(playlistController.getPopularPlaylistsAPI));

/* Public Use */

/* get all playlists */

router.get('/v1/playlist/',
	catchErrors(apiController.logEntry),
	catchErrors(playlistController.indexPlaylists));

/* get information about a single playlist */

router.get('/v1/playlist/:slug',
	catchErrors(apiController.logEntry),
	catchErrors(playlistController.checkPermissions),
	catchErrors(playlistController.grabPlaylist));

/* get information about my playlists */
router.post('/v1/user/playlists',
	catchErrors(apiController.logEntry),
	catchErrors(apiController.findUser),
	catchErrors(playlistController.grabMyPlaylistsAPI));

/* Key Required */
//create
router.post('/v1/playlist/',
	catchErrors(apiController.logEntry),
	apiController.sanitizeInfo,
	catchErrors(apiController.findUser),
	catchErrors(playlistController.createPlayList));

//patch
router.patch('/v1/playlist/',
	catchErrors(apiController.logEntry),
	catchErrors(apiController.findUser),
	apiController.prepareChanges,
	catchErrors(playlistController.updatePlayList));

//delete
router.delete('/v1/playlist/:playlist_id',
	catchErrors(apiController.logEntry),
	catchErrors(apiController.findUser),
	catchErrors(playlistController.checkPermissions),
	catchErrors(playlistController.deletePlaylist));



module.exports = router;