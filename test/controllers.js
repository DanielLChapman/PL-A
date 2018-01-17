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
});

describe('User Controller', () => {
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

  it('it should expect the number of users to increase', (done) => {
    User.count({}, function( err, count){
        chai.assert(count == 1);
        done();
    });
  });

  it('should log out', (done) => {
    chai.request(app)
      .get('/logout')
      .send('Cookie', cookie)
      .end((err, res) => {
        res.request.cookies.should.be.empty;
        res.req.path.should.equal('/');
        done();
      });
  });

  it('should fail register', (done) => {
    chai.request.agent(app)
      .post('/register')
      .end((err, res) => {
        res.req.path.should.equal('/register');
        done();
      })
  });

  it('should fail register because of invalid email', (done) => {
    userRegisterCredentials.email = "Boo";
    chai.request.agent(app)
      .post('/register')
      .send(userRegisterCredentials)
      .end((err, res) => {
        res.req.path.should.equal('/register');
        userRegisterCredentials.email = 'example@foo.bar';
        done();
      })
  });

  it('should request login but fail', (done) => {
    chai.request.agent(app)
      .post('/login')
      .end((err, res) => {
        res.req.path.should.equal('/login');
        done();
      })
  })
  it('should log in', (done) => {
    chai.request.agent(app)
      .post('/login')
      .send(userLoginCredentials)
      .end((err, res) => {
        cookie = res.request.cookies;
        chai.assert(cookie != null);
        res.req.path.should.equal('/');
        done();
      });
  });

  it('should fail to update account', (done) => {
    chai.request.agent(app)
      .post('/account')
      .send({
        name: 'Wow'
      })
      .set('Cookie', cookie)
      .end((err, res) => {
        res.req.path.should.equal('/account');
        User.findOne({name: 'Wow'}, function(error, account) {
          chai.assert(account == null);
          done();
        });
      });
  });

  it('should update account', (done) => {
    chai.request.agent(app)
      .post('/account')
      .send({
        name: 'Wow',
        email: userLoginCredentials.email
      })
      .set('Cookie', cookie)
      .end((err, res) => {
        User.findOne({name: 'Wow'}, function(error, account) {
          chai.assert(account != null);
          done();
        });
      });
  });

  describe('Generating a new API key', () => {
      it('it should try to create an API key but fail', (done) => {
      chai.request.agent(app)
        .get('/internal/api/v1/generateNewAPIKey')
        .end((err, res) => {
          res.req.path.should.include('/login');
          done();
        })
      });

      it('it should try to create an API key and succeed', (done) => {
      chai.request.agent(app)
        .get('/internal/api/v1/generateNewAPIKey')
        .set('Cookie', cookie)
        .end((err, res) => {
          playlistData = JSON.parse(res.text);
          res.should.have.status(200);
          playlistData.apiKey.should.not.be.empty;
          apiKey = playlistData.apiKey;
          done();
        })
      });

      it('it should verify the delete API Key works', (done) => {
      chai.request.agent(app)
        .delete(`/internal/api/v1/deleteAPIKey?apiKey=${apiKey}`)
        .set('Cookie', cookie)
        .end((err, res) => {
          playlistData = JSON.parse(res.text);
          res.should.have.status(200);
          chai.assert(apiKey === playlistData['api key']);
          done();
        })
      });

      it('it should try to create an API key and succeed', (done) => {
      chai.request.agent(app)
        .get('/internal/api/v1/generateNewAPIKey')
        .set('Cookie', cookie)
        .end((err, res) => {
          playlistData = JSON.parse(res.text);
          res.should.have.status(200);
          playlistData.apiKey.should.not.be.empty;
          apiKey = playlistData.apiKey;
          done();
        })
      });

      it('it should verify the API grab route works', (done) => {
      chai.request.agent(app)
        .get('/internal/api/v1/grabUsersAPIKeys')
        .set('Cookie', cookie)
        .end((err, res) => {
          playlistData = JSON.parse(res.text);
          res.should.have.status(200);
          playlistData.apiKeys.should.not.be.empty;
          chai.assert(apiKey === playlistData.apiKeys[0]);
          done();
        })
      });

      
    });
  describe('User Delete', () => {

    it('should create 2 playlists', (done) => {
      chai.request.agent(app)
        .post('/addPlaylist')
        .set('Cookie', cookie)
        .send(playlistCredentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.req.path.should.include('/editVideos/');
        });
      chai.request.agent(app)
        .post('/addPlaylist')
        .set('Cookie', cookie)
        .send(playlistCredentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.req.path.should.include('/editVideos/');
          done();
        });
    })

    it('should have 2 playlists', (done) => {
      chai.request(app)
        .get(`/api/v1/playlist`)
        .set('Cookie', cookie)
        .end((err, res) => {
          Playlist.count({}, function( err, count){
              chai.assert(count == 2);
          });
          done();
        });
    });

    it('should delete the user', (done) => {
      chai.request.agent(app)
        .delete('/delete')
        .set('Cookie', cookie)
        .end((err, res) => {
          res.req.path.should.equal('/');
          User.count({}, function( err, count){
              chai.assert(count == 0);
          });
          done();
        });
    });

    it('Dependent Destroy', (done) => {
      Playlist.count({}, function( err, count){
          chai.assert(count == 0);
      });
      done();
    });

  });

});

describe('Playlist Controller', () => {
  before(function(done){
    chai.request.agent(app)
      .post('/register')
      .send(userRegisterCredentials)
      .end(async function(err, res) {
        cookie = res.request.cookies;
        res.should.have.status(200);
        res.req.path.should.equal('/');
        chai.assert(cookie != null);
        done();
      });
  });

  after(function(done){
    User.remove({}, (err) => {        
        }); 
        Playlist.remove({}, (err) => {     
        }); 
        API.remove({}, (err) => {  
          done();   
        });
  });

  it('it should create a playlist', (done) => {
    chai.request.agent(app)
      .post('/addPlaylist')
      .set('Cookie', cookie)
      .send(playlistCredentials)
      .end((err, res) => {
        res.should.have.status(200);
        res.req.path.should.include('/editVideos/');
        done();
      })
  });

  it('it should expect the number of playlists to increase', (done) => {
    Playlist.count({}, function( err, count){
        chai.assert(count == 1);
      done();
    });
  });

  it('it should search and return a playlist', (done) => {
    chai.request(app)
      .get(`/api/v1/search?q=${'Next'}`)
      .end((err, res) => {
        playlistData = JSON.parse(res.text)[0];
        playlistData.name.should.equal('Next');
        done();
      })
  });

  it('it should get the popular playlists and return a single playlist', (done) => {
    chai.request(app)
      .get(`/api/v1/getPopularVideos`)
      .end((err, res) => {
        var tempJSON = JSON.parse(res.text)[0];
        tempJSON.name.should.equal('Next');
        done();
      })
  });

  it('it should get the popular playlists and return a single playlist', (done) => {
    chai.request(app)
      .get(`/api/v1/getPopularVideos`)
      .end((err, res) => {
        var tempJSON = JSON.parse(res.text)[0];
        tempJSON.name.should.equal('Next');
        done();
      })
  });

  it('it should create a second playlist', (done) => {
    chai.request.agent(app)
      .post('/addPlaylist')
      .set('Cookie', cookie)
      .send(playlistCredentialsPassword)
      .end((err, res) => {
        res.should.have.status(200);
        res.req.path.should.include('/editVideos/');
        done();
      })
  });

  it('it should get the popular playlists and return a single playlist', (done) => {
    chai.request(app)
      .get(`/api/v1/getPopularVideos`)
      .end((err, res) => {
        var tempJSON = JSON.parse(res.text);
        chai.assert(tempJSON.length == 1);
        tempJSON[0].name.should.equal('Next');
        done();
      })
  });

  it('it should search and return a single playlist', (done) => {
    chai.request(app)
      .get(`/api/v1/search?q=${'Barb'}`)
      .end((err, res) => {
        playlistData = JSON.parse(res.text);
        playlistData.length.should.equal(1);
        done();
      })
  });

  it('it should get the index of playlists but only return 1', (done) => {
    chai.request(app)
      .get(`/api/v1/playlist`)
      .end((err, res) => {
        playlistData = JSON.parse(res.text);
        playlistData.length.should.equal(1);
        done();
      })
  });

  it('it should expect the number of API logs to increase', (done) => {
    API.count({}, function( err, count){
        chai.assert(count != 0);
      done();
    });
  });

  it('it should get information about a single playlist', (done) => {
    chai.request(app)
      .get(`/api/v1/playlist/${'next'}`)
      .end((err, res) => {
        playlistData = JSON.parse(res.text);
        chai.assert(playlistData.name === "Next");
        done();
      })
  });

  it('it should get information about a single private playlist but then fail', (done) => {
    chai.request(app)
      .get(`/api/v1/playlist/${'next-1'}`)
      .end((err, res) => {
        playlistData = JSON.parse(res.text);
        playlistData.should.include('please check the slug or id');
        done();
      })
  });

  it('it should get information about a single private playlist but then fail', (done) => {
    chai.request(app)
      .get(`/api/v1/playlist/${'next-2'}`)
      .end((err, res) => {
        playlistData = JSON.parse(res.text);
        playlistData.should.include('Password Required');
        done();
      })
  });

  it('it should get information about a single private playlist', (done) => {
    chai.request(app)
      .get(`/api/v1/playlist/${'next-2'}`)
      .set('Cookie', cookie)
      .end((err, res) => {
        playlistData = JSON.parse(res.text);
        chai.assert(playlistData.name === "Next");
        done();
      })
  });
});

describe('Playlist Routes that require key', () => {
  let playlistToMessAroundWith = null;
  before(function(done){
    chai.request.agent(app)
      .post('/register')
      .send(userRegisterCredentials)
      .end(async function(err, res) {
        cookie = res.request.cookies;
        res.should.have.status(200);
        res.req.path.should.equal('/');
        chai.assert(cookie != null);
        done();
      });
  });

  after(function(done){
    User.remove({}, (err) => {        
        }); 
        Playlist.remove({}, (err) => {     
        }); 
        API.remove({}, (err) => {  
          done();   
        });
  });
  describe('Trying to Create a Playlist', () => {
    it('it should try to create a playlist', (done) => {
    chai.request.agent(app)
      .post('/api/v1/playlist')
      .end((err, res) => {
        playlistData = JSON.parse(res.text);
        res.should.have.status(500);
        playlistData.error.should.include('Something Went Wrong');
        done();
      })
    });
    describe('Generating a new API key', () => {

      it('it should try to create an API key and succeed', (done) => {
      chai.request.agent(app)
        .get('/internal/api/v1/generateNewAPIKey')
        .set('Cookie', cookie)
        .end((err, res) => {
          playlistData = JSON.parse(res.text);
          res.should.have.status(200);
          playlistData.apiKey.should.not.be.empty;
          apiKey = playlistData.apiKey;
          done();
        })
      });

    });
    describe('Creating a new playlist', () => {
      it('it should try to create a playlist but fail without credentials', (done) => {
      chai.request.agent(app)
        .post('/api/v1/playlist')
        .send({
          'apiKey': apiKey
        } )
        .end((err, res) => {
          playlistData = JSON.parse(res.text);
          res.should.have.status(500);
          playlistData.error.should.include('Missing');
          done();
        })
      });

      it('it should try to create a playlist and succeed', (done) => {
        chai.request.agent(app)
          .post('/api/v1/playlist')
          .send({
            apiKey: apiKey,
            playlist: playlistCredentialsAPI
          } )
          .end((err, res) => {
            playlistData = JSON.parse(res.text);
            playlistData.playlist.name.should.include('Next');
            playlistToMessAroundWith = playlistData;
            done();
          })
        });
    });
    describe('updating a playlist', () => {
      it('should update a playlist and fail for no api key', (done) => {
        chai.request.agent(app)
          .patch('/api/v1/playlist')
          .end((err, res) => {
            playlistData = JSON.parse(res.text);
            res.should.have.status(500);
            playlistData.error.should.include('Something Went Wrong');
            done();
          })
      });
      it('should update a playlist and fail for no name or slug', (done) => {
        chai.request.agent(app)
          .patch('/api/v1/playlist')
          .send({
            apiKey: apiKey
          })
          .end((err, res) => {
            playlistData = JSON.parse(res.text);
            res.should.have.status(500);
            playlistData.error.should.include("Missing playlist name");
            done();
          })
      });
      it('should update a playlist and fail for no data', (done) => {
        chai.request.agent(app)
          .patch('/api/v1/playlist')
          .send({
            apiKey: apiKey,
            slug: playlistToMessAroundWith.playlist.slug
          })
          .end((err, res) => {
            playlistData = JSON.parse(res.text);
1
            res.should.have.status(500);
            playlistData.should.include("You didn't");
            done();
          })
      });

      it('should update a playlist and succeed', (done) => {
        chai.request.agent(app)
          .patch('/api/v1/playlist')
          .send({
            apiKey: apiKey,
            slug: playlistToMessAroundWith.playlist.slug,
            changes: {
                  playlistChanges: {
                    name: 'Tammy'
                  }
                }
          })
          .end((err, res) => {
            playlistData = JSON.parse(res.text);
            res.should.have.status(200);
            playlistData.success.should.include("Success");
            done();
          })
      });
    });

    describe('grabbing information about a playlist', () => {
      it('should grab the view information', (done) => {
        chai.request(app)
          .post(`/internal/api/v1/grabPlaylist/${playlistToMessAroundWith.playlist.id}/view`)
          .set('Cookie', cookie)
          .end((err, res) => {
            res.should.have.status(200);
            playlistData = JSON.parse(res.text);
            playlistData.name.should.include("Tammy");
            done();
          })
      });

      it('should grab the edit information', (done) => {
        chai.request(app)
          .post(`/internal/api/v1/grabPlaylist/${playlistToMessAroundWith.playlist.id}/edit`)
          .set('Cookie', cookie)
          .end((err, res) => {
            res.should.have.status(200);
            playlistData = JSON.parse(res.text);
            playlistData.name.should.include("Tammy");
            done();
          })
      });
    });

    describe('updating with internal', () => {
      it('should update the videos', (done) => {
        chai.request(app)
          .post(`/internal/api/v1/editVideosForPlayList/${playlistToMessAroundWith.playlist.id}`)
          .set('Cookie', cookie)
          .send({
            updateType: 'videos',
            videos: [{
              videoID: 'iNs9IZAeFQU',
              site: 'youtube',
              order: 0
            },{
            videoID: 'iNs9IZAeFQU',
            site: 'youtube',
            order: 5
          }]})
          .end((err, res) => {
            res.should.have.status(200);
            playlistData = JSON.parse(res.text);
            playlistData.playlist.name.should.include("Tammy");
            done();
          });
      });
      it('should update the information', (done) => {
        chai.request(app)
          .post(`/internal/api/v1/editVideosForPlayList/${playlistToMessAroundWith.playlist.id}`)
          .set('Cookie', cookie)
          .send({
            updateType: 'playlist',
            playlist: {
              name: 'Maria'
            }
          })
          .end((err, res) => {
            res.should.have.status(200);
            playlistData = JSON.parse(res.text);
            playlistData.playlist.name.should.include("Maria");
            done();
          });
      });
    });

    describe('Deleting', () => {
      it('should delete the playlist', (done) => {
        let playlistCount = null;
        Playlist.count({}, function( err, count){
            playlistCount = count;
        });
        chai.request(app)
          .delete(`/api/v1/playlist/${playlistToMessAroundWith.playlist.id}`)
          .set('Cookie', cookie)
          .end((err, res) => {
            res.should.have.status(202);
            Playlist.count({}, function( err, count){
                chai.assert( (playlistCount-1) === count)
            });
            done();
          });
      });
    });
  });

});
