const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', playlistController.homePage);

/* GET new page. */
router.get('/addPlayList', 
			authController.isLoggedIn, 
			playlistController.newPlayList);

router.get('/popular', 
	playlistController.getPopularPlaylists);

/* GET Edit page. */
router.get('/editPlayList/:playlist_id', 
			authController.isLoggedIn, 
			catchErrors(playlistController.editPlayList));

/* Post create */
router.post('/addPlayList', 
	authController.isLoggedIn,
	catchErrors(playlistController.checkPlayList));

/* GET edit page. */
router.get('/editVideos/:playlist_id', catchErrors(playlistController.editVideosInPlayList));

router.get('/myPlaylists', authController.isLoggedIn, catchErrors(playlistController.getMyPlaylists));

router.get('/viewPlaylist/:slug', catchErrors(playlistController.watchPlaylist));

router.get('/login', userController.login);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/register', userController.register);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));

router.post('/updatePassword', 
	authController.isLoggedIn,
	authController.confirmedPasswords,
	catchErrors(authController.changePassword));

//forgot
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', 
	authController.confirmedPasswords, 
	catchErrors(authController.update)
);

router.get('/search/', playlistController.search);
//Verify
//Register
//Login
router.post('/register', 
	userController.validateRegister,
	userController.actualRegister,
	authController.login);

/* API */
router.get('/api', 
	authController.isLoggedIn, 
	catchErrors(userController.apiIntroPage));
router.post('/api/v1/grabPlaylist/:playlist_id/:type', 
	catchErrors(playlistController.checkPermissions),
	catchErrors(playlistController.grabPlaylist));

router.post('/api/v1/editVideosForPlayList/:playlist_id', 
	authController.isLoggedIn, 
	catchErrors(playlistController.updatePlayList));

router.get('/api/v1/search', catchErrors(playlistController.searchPlaylists));

router.get('/api/v1/getPopularVideos', catchErrors(playlistController.getPopularPlaylistsAPI));


module.exports = router;
