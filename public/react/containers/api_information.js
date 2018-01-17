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

const jsonPatch = `{
   "apiKey": "f612eabc136492b9526893464c186c22",
   "slug": "XXXX", //this is the current one
   "changes": 
   	 {
   	    "playlistChanges": {
   	    	//Only use whichever is needed. 
   	    	//EXAMPLE: If the name isnt being changed, then omit it
   	    	"name": "XXXXXX",
   	    	"slug": "test-2", //put a new one here if you wish to change it
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

export default class API_Information extends Component {
	constructor (props) {
		super(props);
		this.state = {
			openCreate: false,
			openGrab: false,
			openGrab2: false
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
			default:
				return 'Error';
		}
	}


	render () {
		let openCreateStyle = {display: 'none'};
		let	openGrabStyle = {display: 'none'};
		let	openGrabStyle2 = {display: 'none'};
		if (this.state.openCreate) {
			openCreateStyle = {display: 'block'};
		}
		if (this.state.openGrab) {
			openGrabStyle = {display: 'block'};
		}
		if (this.state.openGrab2) {
			openGrabStyle2 = {display: 'block'};
		}
		return (
			<section style={{textAlign: 'center'}}>	
				<h2>How To Use</h2>
				<h4>First, Generate an API Key from the previous page, click HERE to return</h4>
				<br />
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
						<h3>Post JSON To: /api/playlist/</h3>
						<h6>If Private or sharedEdit are false, then password or editPassword respectfully will be discarded</h6>
						<h6>Videos will be validated and in the response any that dont pass validation will be kicked back. Playlist wont save unless at least 1 video works.</h6>
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
				<h2 onClick={() => this.switchSectionStyling('openGrab')}>Grab All Playlist <i className="fas fa-caret-down"></i></h2>
				<section style={openGrabStyle} className="col-xs-12 col-md-12 ">
					<div className="col-xs-4 col-xs-offset-4 col-md-4 " >
						<h3>Get Request To: /api/playlist/</h3>
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
						<h3>Get Request To: /api/playlist/:slug</h3>
					</div>
					<div className="col-xs-4 col-xs-offset-4 col-md-4 ">
						<h5>Response: </h5>
						<pre style={{textAlign: 'left'}}>
							{jsonGetPlaylistIndex}
						</pre>
						<h5>Alternatives to JSON coming soon</h5>
					</div>
				</section>
			</section>
		);
	}
};
