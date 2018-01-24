import React, { Component } from 'react';

const jsonCreateString = `{
 "apiKey": "XXXXXX",
 "playlist": {
  "name": "XXXXXX",
  "description": "XXXXXX",
  "tags": [
    "xxx",
    "xxx",
    "xxx",
    "xxx",
    "xxx",
    "xxx"
  ],
  "private": false,
  "password": "xxxxxx",
  "sharedEdit": false,
  "editPassword": "xxxxxxx",
  "videos": [
    "URL",
    "URL",
    "URL",
    "URL",
    "URL"
  ]
 }
}`

const jsonCreateResponseString = `{
"playlist": {
  "id": "XXXXX"
  "user": "XXXX",
  "slug": "XXXX",
  "name": "XXXX",
  "description": "XXXXX",
  "tags": [
  	"XX",
  	"XX"
  ]
},
"url": "https://example.com/watch/:slug",
"invalidURLS": [
  "URL",
  "URL"
  ]
}`

const jsonGetPlaylistIndex = `{
  "data": [
   {
	"slug": "xxxxxx",
	"name": "xxxxxxxx",
	"description": "xxxxxxx",
	"user": {
		"name": "xxxxx"
	},
	"views": Y,
	"tags": [
		"XX",
		"XX"
	]

   }
  ]
}`

const jsonGetMyPlaylists = `
[ { 
	_id: 'This is the playlist ID',
	slug: 'This is the slug',
	updatedAt: '',
	createdAt: '',
	name: 'Name of the Playlist',
	description: 'Description of Playlist',
	tags: [ 'string', 'string' ],
	sharedEdit: false,
	private: false,
	videos: [ [Object] ],
	views: 0 },
{
	_id: 'This is the playlist ID',
	slug: 'This is the slug',
	updatedAt: '',
	createdAt: '',
	name: 'Name of the Playlist',
	description: 'Description of Playlist',
	tags: [ 'string', 'string' ],
	sharedEdit: false,
	private: false,
	videos: [ [Object] ],
	views: 0 }
 ]`

const jsonPatch = `{
	"apiKey": "XXXXX",
	"slug": "XXXX", //this is the current one
	"changes": 
	  {
	  "playlistChanges": {
		//Only use whichever is needed. 
		//EXAMPLE: If the name isnt being changed, then omit it
		"name": "XXXXXX",
		"description": "XXXXXX",
		"tags": [
		 "xxx",
		 "xxx",
		 "xxx",
		 "xxx",
		 "xxx",
		 "xxx"
		],
		"private": false,
		"password": "xxxxxx",
		"sharedEdit": false,
		"editPassword": "xxxxxxx",
		"videos": [
		 "https://www.youtube.com/watch?v=_Pom2EYv3NM",
		 "https://www.youtube.com/watch?v=_Pom2EYv3NM",
		 "https://www.youtube.com/watch?v=_Pom2EYv3NM",
		 "https://www.youtube.com/watch?v=_Pom2EYv3NM",
		 "https://www.youtube.com/watch?v=_Pom2EYv3NM"
		]
	  }
	}
}
`

const jsonPatchResponse = `{
	success: 'Success',
	playlist: { 
		_id: 'This is the playlist ID',
		slug: 'This is the slug',
		updatedAt: '',
		createdAt: '',
		name: 'Name of the Playlist',
		description: 'Description of Playlist',
		tags: [ 'string', 'string' ],
		sharedEdit: false,
		private: false,
		videos: [ [Object] ],
		views: 0 } ,
	invalidURLS: []
}`


export default class API_Information extends Component {
	constructor (props) {
		super(props);
		this.state = {
			openCreate: false,
			openGrab: false,
			openGrab2: false,
			openGrab3: false,
			openUpdate: false,
			openDelete: false,
		}
		this.switchSectionStyling = this.switchSectionStyling.bind(this);
	}

	switchSectionStyling (type) {
		switch (type) {
			case 'openCreate':
				this.setState({
					openCreate: !this.state.openCreate
				});
				break;
			case 'openGrab':
				this.setState({
					openGrab: !this.state.openGrab
				});
				break;
			case 'openGrab2':
				this.setState({
					openGrab2: !this.state.openGrab2
				});
				break;
			case 'openGrab3':
				this.setState({
					openGrab3: !this.state.openGrab3
				});
				break;
			case 'openUpdate':
				this.setState({
					openUpdate: !this.state.openUpdate
				});
				break;
			case 'openDelete':
				this.setState({
					openDelete: !this.state.openDelete
				});
				break;
			default:
				return 'Error';
		}
	}


	render () {
		let openCreateStyle = {display: 'none'};
		let	openGrabStyle = {display: 'none'};
		let	openGrabStyle2 = {display: 'none'};
		let	openGrabStyle3 = {display: 'none'};
		let	openUpdateStyle = {display: 'none'};
		let	openDeleteStyle = {display: 'none'};
		if (this.state.openCreate) {
			openCreateStyle = {display: 'block'};
		}
		if (this.state.openGrab) {
			openGrabStyle = {display: 'block'};
		}
		if (this.state.openGrab2) {
			openGrabStyle2 = {display: 'block'};
		}
		if (this.state.openGrab3) {
			openGrabStyle3 = {display: 'block'};
		}
		if (this.state.openUpdate) {
			openUpdateStyle = {display: 'block'};
		}
		if (this.state.openDelete) {
			openDeleteStyle = {display: 'block'};
		}
		return (
			<section style={{textAlign: 'center'}}>	
				<h2>How To Use</h2>
				<h4 onClick={this.props.switchRender}>First, Generate an API Key from the previous page, click HERE to return</h4>
				<br />
				<h2 onClick={() => this.switchSectionStyling('openGrab')}>Grab All Playlist <i className="fas fa-caret-down"></i></h2>
				<section style={openGrabStyle} className="col-xs-12 col-md-12 ">
					<div className="col-xs-4 col-xs-offset-4 col-md-4 " >
						<h3>Get Request To: /api/v1/playlist/</h3>
					</div>
					<div className="col-xs-4 col-xs-offset-4 col-md-4 ">
						<h5>Response: </h5>
						<pre style={{textAlign: 'left'}}>
							{jsonGetPlaylistIndex}
						</pre>
						<h5>Alternatives to JSON coming soon</h5>
					</div>
				</section>
				<h2 onClick={() => this.switchSectionStyling('openGrab2')}>Grab Information About Single Playlist <i className="fas fa-caret-down"></i></h2>
				<section style={openGrabStyle2} className="col-xs-12 col-md-12 ">
					<div className="col-xs-4 col-xs-offset-4 col-md-4 " >
						<h3>Get Request To: /api/v1/playlist/:slug</h3>
						<h5>Slug is the identification at the end of the url for the particular playlist</h5>
						<h5>i.e. /watch/thisistheslug </h5>
					</div>
					<div className="col-xs-4 col-xs-offset-4 col-md-4 ">
						<h5>Response: </h5>
						<pre style={{textAlign: 'left'}}>
							{jsonGetPlaylistIndex}
						</pre>
						<h5>Alternatives to JSON coming soon</h5>
					</div>
				</section>
				<h2 onClick={() => this.switchSectionStyling('openGrab3')}>Grab All Your Playlists <i className="fas fa-caret-down"></i></h2>
				<section style={openGrabStyle3} className="col-xs-12 col-md-12 ">
					<div className="col-xs-4 col-xs-offset-4 col-md-4 " >
						<h3>Post Request To: /api/v1/user/playlists</h3>
						<pre style={{width: '100%'}}>
{`{
	'apiKey': 'Insert apiKey'
}`}
						</pre>
					</div>
					<div className="col-xs-4 col-xs-offset-4 col-md-4 ">
						<h5>Response: </h5>
						<pre style={{width: '100%'}}>
							{jsonGetMyPlaylists}
						</pre>
						<h5>Alternatives to JSON coming soon</h5>
					</div>
				</section>
				<h2 onClick={() => this.switchSectionStyling('openCreate')}>Create A New Playlist <i className="fas fa-caret-down"></i></h2>
				<section style={openCreateStyle} className="col-xs-12 col-md-12 ">
					<h3>How To Prepare Data: </h3>
					<div className="tab-content" >
						<div id="jsonCreate" className="tab-pane fade in active">
							<h5 className="col-xs-4 col-xs-offset-4 col-md-4 col-md-offset-4">JSON:</h5>
							<section className="col-xs-4 col-xs-offset-4 col-md-4 col-md-offset-4">
								<h5 style={{textAlign: 'left'}}> 
								<pre style={{width: '100%'}}>
									{jsonCreateString}
								</pre>
								</h5>
							</section>
						</div>
						
					</div>
					<div className="col-xs-4 col-xs-offset-4 col-md-4 " >
						<h3>Post JSON To: /api/v1/playlist/</h3>
						<h6>If Private or sharedEdit are false, then password or editPassword respectfully will be discarded</h6>
						<h6>Videos will be validated and in the response any that dont pass validation will be kicked back. Playlist wont save unless at least 1 video works.</h6>
						<h6>Also, name is required</h6>
					</div>
					<div className="col-xs-4 col-xs-offset-4 col-md-4 ">
						<h5>Response: </h5>
						<pre style={{textAlign: 'left'}}>
							{jsonCreateResponseString}
						</pre>
						<h5>Response will be either a JSON Object with the new playlist object, a url, and any invalid URLs. Or an JSON error with messages of what is missing.</h5>
						<h5>Alternatives to JSON coming soon</h5>
					</div>
				</section>
				<h2 onClick={() => this.switchSectionStyling('openUpdate')}>Update a Playlist <i className="fas fa-caret-down"></i></h2>
				<section style={openUpdateStyle} className="col-xs-12 col-md-12 ">
					<h3>How To Prepare Data: </h3>
					<div className="tab-content" >
						<div id="jsonCreate" className="tab-pane fade in active">
							<h5 className="col-xs-4 col-xs-offset-4 col-md-4 col-md-offset-4">JSON:</h5>
							<section className="col-xs-4 col-xs-offset-4 col-md-4 col-md-offset-4">
								<h5 style={{textAlign: 'left'}}> 
								<pre style={{width: '100%'}}>
									{jsonPatch}
								</pre>
								</h5>
							</section>
						</div>
						
					</div>
					<div className="col-xs-4 col-xs-offset-4 col-md-4 " >
						<h3>Patch JSON Request To: /api/v1/playlist/</h3>
						<h6>If Private or sharedEdit are false, then password or editPassword respectfully will be discarded</h6>
						<h6>Videos will be validated and in the response any that dont pass validation will be kicked back. Playlist wont save unless at least 1 video works.</h6>
					</div>
					<div className="col-xs-4 col-xs-offset-4 col-md-4 ">
						<h5>Response: </h5>
						<pre style={{textAlign: 'left'}}>
							{jsonPatchResponse}
						</pre>
						<h5>Response will be either a JSON Object with the new playlist object and a successful message. Or an JSON error with messages of what is missing.</h5>
						<h5>Alternatives to JSON coming soon</h5>
					</div>
				</section>
				<h2 onClick={() => this.switchSectionStyling('openDelete')}>Delete a Playlist <i className="fas fa-caret-down"></i></h2>
				<section style={openDeleteStyle} className="col-xs-12 col-md-12 ">
					<div className="col-xs-4 col-xs-offset-4 col-md-4 " >
						<h3>Delete Request To: /api/v1/playlist/:playlist_id</h3>
						<h6>Playlist ID can be found through one of the previous calls</h6>
						<h6>You also must include your apiKey like: </h6>
						<pre style={{width: '100%'}}>
{`{
	'apiKey': 'Insert apiKey'
}`}
						</pre>
					</div>
					<div className="col-xs-4 col-xs-offset-4 col-md-4 ">
						<h5>Response: </h5>
						<h5>Response will either be a successful JSON string or an error message</h5>
					</div>
				</section>
			</section>
		);
	}
};
