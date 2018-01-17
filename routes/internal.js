const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const apiController = require('../controllers/apiController');
const { catchErrors } = require('../handlers/errorHandlers');


/* API */
/* internal */
router.get('/api/v1/grabUsersAPIKeys',
	authController.isLoggedIn,
	catchErrors(userController.apiGrabAPIKeys));

router.get('/api/v1/generateNewAPIKey',
	authController.isLoggedIn,
	catchErrors(userController.generateNewAPIKey));

router.delete('/api/v1/deleteAPIKey', 
	authController.isLoggedIn,
	catchErrors(userController.deleteAPIKey));


router.post('/api/v1/grabPlaylist/:playlist_id/:type', 
	catchErrors(playlistController.checkPermissions),
	catchErrors(playlistController.grabPlaylist));

router.post('/api/v1/editVideosForPlayList/:playlist_id', 
	authController.isLoggedIn, 
	catchErrors(playlistController.updatePlayList));


module.exports = router;