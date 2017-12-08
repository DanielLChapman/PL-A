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
		};
		this.handleButtonClick = this.handleButtonClick.bind(this);
	}

	componentWillMount () {
		this.props.grabAPIKeys();

	}

	handleButtonClick(e) {
		this.props.generateNewAPIKey();
	}

	render () {
		return (
			<section className='API-Window  col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2'>
				<div style={{width: '100%', float: 'left'}}>
					<button onClick={(e) => this.handleButtonClick(e)} className="btn btn-primary col-md-4 col-md-offset-4">Generare New Key</button>
				</div>
				<div style={{width: '100%', float: 'left'}}>
					<API_table />
				</div>
			</section>
		);
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ grabAPIKeys, generateNewAPIKey }, dispatch);
}

export default connect(null, mapDispatchToProps)(APIApp);



