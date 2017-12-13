import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grabAPIKeys, generateNewAPIKey } from '../actions/index';

import API_table from '../containers/api_table';

class APIApp extends Component {
	constructor (props) {
		super(props);
		this.state = {
			view: 'Information'
		};
		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.renderInitialView = this.renderInitialView.bind(this);
		//this.handleAXIOS = this.handleAXIOS.bind(this);
	}

	componentWillMount () {
		//this.handleAXIOS();
		this.props.grabAPIKeys();
	}
 
	handleButtonClick (e) {
		this.props.generateNewAPIKey();
	}


	renderInitialView () {
		return (
			<section className='API-Window  col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2'>
				<h3 style={{textAlign: 'center'}}>Generate API Keys for use in projects</h3>					
				<h4 style={{textAlign: 'center'}}>Do Not Share These Unless You Are Sure You Want Someone To Be Able To Act As You</h4>
				<div style={{width: '100%', float: 'left', marginBottom: '25px'}}>
					<button onClick={(e) => this.handleButtonClick(e)} className="btn btn-primary col-xs-12 col-xs-offset-0  col-md-4 col-md-offset-4">Generare New Key</button>
				</div>

				<div style={{width: '100%', float: 'left'}}>
					<API_table />
				</div>
			</section>
		)
	}
	renderInformation () {
		return (
			<div style={{textAlign: 'center'}}>	
				<h2>How To Use</h2>
				<h4>First, Generate an API Key from the previous page, click HERE to return</h4>
				<br />
				<h2>Create A New Playlist</h2>
				<h3>How To Prepare Data: </h3>
				<h5>JSON:</h5>
				<section className="col-xs-4 col-xs-offset-4 col-md-3 col-md-offset-5">
					<h5 style={{textAlign: 'left'}}> <code><br />
					{'{'}<br />
					  &nbsp;"apiKey": "XXXXXX",<br />
					  &nbsp;"playlist": {'{'}<br />
					    &nbsp;&nbsp;"name": "XXXXXX",<br />
					    &nbsp;&nbsp;"description": "XXXXXX",<br />
					    &nbsp;&nbsp;"tags": [<br />
					    &nbsp;&nbsp;&nbsp;  "xxx",<br />
					    &nbsp;&nbsp;&nbsp;  "xxx",<br />
					    &nbsp;&nbsp;&nbsp;  "xxx",<br />
					    &nbsp;&nbsp;&nbsp;  "xxx",<br />
					    &nbsp;&nbsp;&nbsp;  "xxx",<br />
					    &nbsp;&nbsp;&nbsp;  "xxx"<br />
					    &nbsp;&nbsp;],<br />
					    &nbsp;&nbsp;"private": false,<br />
					    &nbsp;&nbsp;"password": "xxxxxx",<br />
					    &nbsp;&nbsp;"sharedEdit": false,<br />
					    &nbsp;&nbsp;"editPassword": "xxxxxxx",<br />
					    &nbsp;&nbsp;"videos": [<br />
					     &nbsp;&nbsp;&nbsp; "URL",<br />
					      &nbsp;&nbsp;&nbsp; "URL",<br />
					      &nbsp;&nbsp;&nbsp; "URL",<br />
					      &nbsp;&nbsp;&nbsp; "URL",<br />
					      &nbsp;&nbsp;&nbsp; "URL"<br />
					    &nbsp;&nbsp;]<br />
					  &nbsp;{'}'}<br />
					{'}'}

				</code></h5>
				</section>
				<section className="col-xs-4 col-xs-offset-4 col-md-4 " >
					<h6>If Private or sharedEdit are false, then password or editPassword respectfully will be discarded</h6>
					<h6>Videos will be validated and in the response any that dont pass validation will be kicked back. Playlist wont save unless at least 1 video works.</h6>
				</section>
				<section className="col-xs-4 col-xs-offset-4 col-md-4 ">
					<h3>Post Data To: /api/createPlaylist/</h3>
					<h5>Response will be either a JSON Object with the new playlist object, a url, and any invalid URLs. Or an error with messages of what is missing.</h5>
				</section>
			</div>
		)
	}

	render () {
		const viewState = this.state.view;
		let display = null;
		if (viewState === 'Initial') {
			display = this.renderInitialView();
		}  else if (viewState === 'Information'){
			display = this.renderInformation();
		}
		return (
			<div>
				{display}
			</div>
		);
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ grabAPIKeys, generateNewAPIKey }, dispatch);
}

export default connect(null, mapDispatchToProps)(APIApp);



