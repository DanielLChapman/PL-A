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


let userRegisterCredentials = {
  name: 'Test',
  email: 'example@foo.bar', 
  password: 'foobar',
  passwordConfirm: 'foobar'
};

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

const playlistCredentialsFull = {
  name: "Next-3",
  description: "Test",
  views: 0,
  videos: {
    videoID: 'iNs9IZAeFQU',
    site: 'youtube',
    order: 0
  },
  private: true,
  password: 'Test',
  sharedEdit: true,
  editPassword: 'Test',
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

describe('Testing User Model Validation', () => {
  describe('Invalid Credentials', () => {
    after(function(done){
      User.remove({}, (err) => { 
            done();         
          });  
    });
    it('it should GET the register', (done) => {
      chai.request(app)
          .get('/register')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
      });

    it('should not register with an invalid name', (done) => {
      delete userRegisterCredentials.name;
      chai.request.agent(app)
        .post('/register')
        .send(userRegisterCredentials)
        .end(function(err, res) {
          res.should.have.status(200);
          res.req.path.should.equal('/register');
          res.request.cookies.should.be.empty;
          done();
        });
    });

    it('should not register with an invalid email', (done) => {
      userRegisterCredentials.name = "Dax"
      delete userRegisterCredentials.email;
      chai.request.agent(app)
        .post('/register')
        .send(userRegisterCredentials)
        .end(function(err, res) {
          res.should.have.status(200);
          res.req.path.should.equal('/register');
          res.request.cookies.should.be.empty;
          done();
        });
    });

    it('should not register with an invalid email - 2', (done) => {
      userRegisterCredentials.email = "Bod";
      chai.request.agent(app)
        .post('/register')
        .send(userRegisterCredentials)
        .end(function(err, res) {
          res.should.have.status(200);
          res.req.path.should.equal('/register');
          res.request.cookies.should.be.empty;
          done();
        });
    });
    it('should not register with an invalid email - 3', (done) => {
      userRegisterCredentials.email = "Bod@aa";
      chai.request.agent(app)
        .post('/register')
        .send(userRegisterCredentials)
        .end(function(err, res) {
          res.should.have.status(200);
          res.req.path.should.equal('/register');
          res.request.cookies.should.be.empty;
          done();
        });
    });

    it('should not register with an empty password', (done) => {
      userRegisterCredentials.email = "Bod@aa.com";
      delete userRegisterCredentials.password
      chai.request.agent(app)
        .post('/register')
        .send(userRegisterCredentials)
        .end(function(err, res) {
          res.should.have.status(200);
          res.req.path.should.equal('/register');
          res.request.cookies.should.be.empty;
          done();
        });
    });

    it('should not register with an empty password confirm', (done) => {
      userRegisterCredentials.password = "Bod";
      delete userRegisterCredentials.passwordConfirm
      chai.request.agent(app)
        .post('/register')
        .send(userRegisterCredentials)
        .end(function(err, res) {
          res.should.have.status(200);
          res.req.path.should.equal('/register');
          res.request.cookies.should.be.empty;
          done();
        });
    });

    it('should not register with a different password and passwordConfirm', (done) => {
      userRegisterCredentials.password = "Bod";
      userRegisterCredentials.passwordConfirm = ".com";
      chai.request.agent(app)
        .post('/register')
        .send(userRegisterCredentials)
        .end(function(err, res) {
          res.should.have.status(200);
          res.req.path.should.equal('/register');
          res.request.cookies.should.be.empty;
          done();
        });
    });
  });
});

describe('Testing Playlist Model Validation', () => {
  before(function(done){
    userRegisterCredentials = {
      name: 'Test',
      email: 'example@foo.bar', 
      password: 'foobar',
      passwordConfirm: 'foobar'
    };
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
    }); 
    Playlist.remove({}, (err) => {     
    }); 
    API.remove({}, (err) => {  
      done();   
    });
  });

  it('it should try to create a playlist and fail for no name', (done) => {
    delete playlistCredentials.name;
    chai.request.agent(app)
      .post('/addPlaylist')
      .set('Cookie', cookie)
      .send(playlistCredentials)
      .end((err, res) => {
        res.should.have.status(200);
        res.req.path.should.include('/addPlaylist');
        done();
      })
  });

  it ('should create a playlist', (done) => {
    playlistCredentials.name = "Test";
    chai.request.agent(app)
      .post('/addPlaylist')
      .set('Cookie', cookie)
      .send(playlistCredentials)
      .end((err, res) => {
        res.should.have.status(200);
        res.req.path.should.include('/editVideos/');
        done();
      });
  });

  it ('should create a second playlist with the same specifications', (done) => {
    chai.request.agent(app)
      .post('/addPlaylist')
      .set('Cookie', cookie)
      .send(playlistCredentials)
      .end((err, res) => {
        res.should.have.status(200);
        res.req.path.should.include('/editVideos/');
        Playlist.count({}, function( err, count){
            chai.assert(count == 2);
            done();
        });
      });
  });

  it ('should create a full', (done) => {
    playlistCredentials.name = "Test";
    chai.request.agent(app)
      .post('/addPlaylist')
      .set('Cookie', cookie)
      .send(playlistCredentialsFull)
      .end((err, res) => {
        res.should.have.status(200);
        res.req.path.should.include('/editVideos/');
        done();
      });
  });

  it('gets the 3 playlists', (done) => {
    chai.request.agent(app)
      .get('/api/v1/user/playlists')
      .set('Cookie', cookie)
      .end((err, res) => {
        playlistData = JSON.parse(res.text);
        done();
      });
  });

  it('checks the slugs of the 2 playlists that are the same to make sure they are different', (done) => {
    chai.assert(playlistData[0].slug !== playlistData[1].slug);
    done();
  });


  it('checks the make up of the data model', (done) => {
    let cP = playlistData[2];
    cP.slug.should.not.be.empty;
    cP.description.should.not.be.empty;
    cP.views.should.equal(0)
    cP.videos.should.not.equal(null);
    cP.private.should.not.equal(null)
    cP.sharedEdit.should.not.equal(null);
    cP.slug.should.not.be.empty;
    cP.password.should.equal('Test');
    cP.editPassword.should.equal('Test');
    cP.tags.should.not.equal(null);
    chai.assert(cP.user != null);
    chai.assert(cP.updatedAt != null);
    chai.assert(cP.createdAt != null);
    done();
  });
});

describe('API Model', () => {
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
    }); 
    Playlist.remove({}, (err) => {     
    }); 
    API.remove({}, (err) => {  
      done();   
    });
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
    });
  });
  describe('Generating a few different requests', () => {
    it('should make a few requests', (done) => {
      chai.request.agent(app)
        .get('/api/v1/playlist')
        .set('apiKey', apiKey)
        .end((err, res) => {
          done();
        });
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
    it('Testing API Models', (done) => {
      let count = 0;
      API.find({}, function( err, api){
        api.map((a) => {
          count++;
          chai.assert(a._id != null);
          chai.assert(a.updatedAt != null);
          chai.assert(a.createdAt != null);
          chai.assert(a.apiKey != null);
          chai.assert(a.ipAddress != null);
          chai.assert(['post', 'patch', 'get'].includes(a.action));
          chai.assert(a.name != null);
          chai.assert(a.userAgent != null);
        });
        chai.assert(count === 3);
        done();
      });
    });
  });
});

