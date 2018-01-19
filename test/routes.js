process.env.SECRET = "test";
process.env.KEY = "test";

let mongoose = require("mongoose");

let Playlist = require('../models/Playlist');
let User = require('../models/User');
let API = require('../models/API');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

let cookie = null,
	playlistData = null,
	apiKey = null;

chai.use(chaiHttp);

const userRegisterCredentials = {
  name: 'Test',
  email: 'example@foo.bar', 
  password: 'foobar',
  passwordConfirm: 'foobar'
}

const userLoginCredentials = {
  email: 'example@foo.bar', 
  password: 'foobar'
}

const playlistCredentials = {
	name: "Next",
	description: "Test",
	views: 0,
	videos: {
		videoID: 'iNs9IZAeFQU',
		site: 'youtube',
		order: 0
	},
	private: false,
	sharedEdit: false,
	tags: ["Barb", "Bar"]
};

const playlistCredentialsAPI = {
	name: "Next",
	description: "Test",
	views: 0,
	videos: ["https://www.youtube.com/watch?v=ltVuZlf4w8c"],
	private: false,
	sharedEdit: false,
	tags: ["Barb", "Bar"]
};

const playlistCredentialsPassword = {
	name: "Next",
	description: "Test",
	views: 0,
	videos: {
		videoID: 'iNs9IZAeFQU',
		site: 'youtube',
		order: 0
	},
	private: true,
	password: 'Bubba',
	sharedEdit: false,
	tags: ["Barb", "Bar"]
};

describe('GET Routes', () => {

	it('it should GET the index', (done) => {
	chai.request(app)
	    .get('/')
	    .end((err, res) => {
	        res.should.have.status(200);
	    	done();
	    });
	});

	it('it should GET the login page', (done) => {
	chai.request(app)
	    .get('/login')
	    .end((err, res) => {
	        res.req.path.should.include('/login');
	    	done();
	    });
	});

	it('it should GET the addPlaylist page but then redirect', (done) => {
	chai.request(app)
	    .get('/addPlaylist')
	    .end((err, res) => {
	        res.req.path.should.include('/login');
	    	done();
	    });
	});

	it('it should GET the account page but then redirect', (done) => {
	chai.request(app)
	    .get('/account')
	    .end((err, res) => {
	        res.req.path.should.include('/login');
	    	done();
	    });
	});

	it('it should GET the editPlaylist page then redirect', (done) => {
	chai.request(app)
	    .get('/editPlaylist/1')
	    .end((err, res) => {
	        res.req.path.should.equal('/login');
	    	done();
	    });
	});
	it('it should GET the editVideoPage then redirect if the playlist doesnt exist', (done) => {
	chai.request(app)
	    .get('/editVideos/1')
	    .end((err, res) => {
	        res.req.path.should.equal('/');
	    	done();
	    });
	});
	it('it should GET the myPlaylist page then redirect', (done) => {
	chai.request(app)
	    .get('/myPlaylists')
	    .end((err, res) => {
	        res.req.path.should.equal('/login');
	    	done();
	    });
	});
	it('it should GET the watch page and redirect if a playlist doesnt exist', (done) => {
	chai.request(app)
	    .get('/watch/1')
	    .end((err, res) => {
	        res.req.path.should.equal('/');
	    	done();
	    });
	});
	it('it should GET the search page', (done) => {
	chai.request(app)
	    .get('/search')
	    .end((err, res) => {
	        res.should.have.status(200);
	    	done();
	    });
	});
	it('it should GET the popular page', (done) => {
	chai.request(app)
	    .get('/popular')
	    .end((err, res) => {
	        res.should.have.status(200);
	    	done();
	    });
	});
	it('it should GET the login page', (done) => {
	chai.request(app)
	    .get('/login')
	    .end((err, res) => {
	    	res.req.path.should.equal('/login');
	        res.should.have.status(200);
	    	done();
	    });
	});
	it('it should GET the register page', (done) => {
	chai.request(app)
	    .get('/register')
	    .end((err, res) => {
	        res.should.have.status(200);
	    	done();
	    });
	});
	it('it should GET the api page but then redirect', (done) => {
	chai.request(app)
	    .get('/api')
	    .end((err, res) => {
	        res.req.path.should.equal('/login');
	    	done();
	    });
	});

	it ('should get the reddit page but then redirect', (done) => {
		chai.request(app)
			.get('/reddit')
			.end((err, res) => {
				res.req.path.should.equal('/login');
				done();
			});
	});
});

describe('GET Routes with login', () => {
	before(function(done){
		chai.request.agent(app)
			.post('/register')
			.send(userRegisterCredentials)
			.end(function(err, res) {
				cookie = res.request.cookies;
				res.should.have.status(200);
				res.req.path.should.equal('/');
				chai.assert(cookie != null);
				done();
			});
	});

	after(function(done){
		User.remove({}, (err) => { 
        	done();         
        });  
	});


	it('it should GET the api page ', (done) => {
	chai.request.agent(app)
	    .get('/api')
	    .set('Cookie', cookie)
	    .end((err, res) => {
	    	res.req.path.should.equal('/api');
	        res.should.have.status(200);
	    	done();
	    });
	});

	it ('should get the reddit page but then redirect', (done) => {
		chai.request(app)
			.get('/reddit')
			.set('Cookie', cookie)
			.end((err, res) => {
				res.req.path.should.equal('/reddit');
				done();
			});
	})

	it('it should GET the addPlaylist page', (done) => {
	chai.request(app)
	    .get('/addPlaylist')
	    .set('Cookie', cookie)
	    .end((err, res) => {
	    	res.req.path.should.equal('/addPlaylist');
	        res.should.have.status(200);
	    	done();
	    });
	});
	it('it should GET the editPlaylist page then redirect home', (done) => {
	chai.request(app)
	    .get('/editPlaylist/1')
	    .set('Cookie', cookie)
	    .end((err, res) => {
	        res.req.path.should.equal('/');
	    	done();
	    });
	});

	it('it should GET the myPlaylist page then redirect', (done) => {
	chai.request(app)
	    .get('/myPlaylists')
	    .set('Cookie', cookie)
	    .end((err, res) => {
	    	res.req.path.should.equal('/myPlaylists');
	        res.should.have.status(200);
	    	done();
	    });
	});
	it('it should GET the account page but then not redirect', (done) => {
	chai.request(app)
	    .get('/account')
	    .set('Cookie', cookie)
	    .end((err, res) => {
	        res.req.path.should.include('/account');
	        res.should.have.status(200);
	    	done();
	    });
	});

	it('it should GET the account page but then redirect', (done) => {
	chai.request(app)
	    .post('/account')
	    .set('Cookie', cookie)
	    .send({
	    	name: 'Test-2',
	    	email: 'a@aol.com'
	    })
	    .end((err, res) => {
	        res.redirects[0].split('/')[3].should.include('account');
	        res.should.have.status(200);
	    	done();
	    });
	});

	describe('grabbing information about a playlist', () => {
		it('should grab the view information', (done) => {
			chai.request(app)
				.post(`/internal/api/v1/grabPlaylist/1111/view`)
				.set('Cookie', cookie)
				.end((err, res) => {
					res.should.not.have.status(404);
					done();
				})
		});

		it('should grab the edit information', (done) => {
			chai.request(app)
				.post(`/internal/api/v1/grabPlaylist/1111/edit`)
				.set('Cookie', cookie)
				.end((err, res) => {
					res.should.not.have.status(404);
					done();
				})
		});
	});
});

