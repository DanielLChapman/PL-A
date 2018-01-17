import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grabAPIKeys, generateNewAPIKey } from '../actions/index';

import API_table from '../containers/api_table';
import API_Information from '../containers/api_information';

class APIApp extends Component {
	constructor (props) {
		super(props);
		this.state = {
			view: 'Initial'
		};
		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.renderInitialView = this.renderInitialView.bind(this);
		this.switchRendering = this.switchRendering.bind(this);
	}

	componentWillMount () {
		this.props.grabAPIKeys();
	}
 
	handleButtonClick (e) {
		this.props.generateNewAPIKey();
	}

	switchRendering(e) {
		if (this.state.view === 'Initial') {
			this.setState({
				view: 'Information' 
			});
		}
		else {
			this.setState({
				view: 'Initial'
			})
		}
	}


	renderInitialView () {
		return (
			<section style={{textAlign: 'center'}} className='API-Window  col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2'>
				<h3>Generate API Keys for use in projects</h3>					
				<h4>Do Not Share These Unless You Are Sure You Want Someone To Be Able To Act As You</h4>
				<div style={{width: '100%', float: 'left', marginBottom: '25px'}}>
					<button onClick={(e) => this.handleButtonClick(e)} className="btn btn-primary col-xs-12 col-xs-offset-0  col-md-4 col-md-offset-4">Generare New Key</button>
				</div>
				<h4 onClick={(e) => this.switchRendering(e) }>For information on how to use the API, click here</h4>
				<div style={{width: '100%', float: 'left'}}>
					<API_table />
				</div>
			</section>
		)
	}
	renderInformation () {
		return <API_Information switchRender={this.switchRendering}/>;
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



