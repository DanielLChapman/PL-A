const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const apiController = require('../controllers/apiController');
const { catchErrors } = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', playlistController.homePage);

/* GET new  html page. */
router.get('/addPlayList', 
			authController.isLoggedIn, 
			playlistController.newPlayList);

/* GET Edit html page. */
router.get('/editPlayList/:playlist_id', 
			authController.isLoggedIn, 
			catchErrors(playlistController.editPlayList));

/* Post create html */
router.post('/addPlayList', 
	authController.isLoggedIn,
	catchErrors(playlistController.checkAndCreatePlayList));

/* GET edit html page. */
router.get('/editVideos/:playlist_id', catchErrors(playlistController.editVideosInPlayList));


router.get('/myPlaylists', authController.isLoggedIn, catchErrors(playlistController.getMyPlaylists));

router.get('/watch/:slug', catchErrors(playlistController.watchPlaylist));

router.get('/search/', playlistController.search);

router.get('/popular', 
	playlistController.getPopularPlaylists);

router.get('/api', 
	authController.isLoggedIn, 
	catchErrors(userController.apiIntroPage));

router.get('/reddit', 
	authController.isLoggedIn, 
	catchErrors(playlistController.reddit));

//Verify
//Register
//Login
router.get('/login', userController.login);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/register', userController.register);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', authController.isLoggedIn, catchErrors(userController.updateAccount));

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

router.post('/register', 
	userController.validateRegister,
	userController.actualRegister,
	authController.login);

router.delete('/delete',
	authController.isLoggedIn,
	catchErrors(userController.deleteAccount));





module.exports = router;
