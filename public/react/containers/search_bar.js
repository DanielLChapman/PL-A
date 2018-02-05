import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchVideos } from '../actions/index';

class VideoBar extends Component {
	constructor (props) {
		super(props);

		this.state = {
			value: ''
		};
		this.onInputChange = this.onInputChange.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
	}

	onInputChange (event) {
		this.props.searchVideos(event.target.value);
		this.setState({
			value: event.target.value
		});
	}

	onFormSubmit (event) {
		event.preventDefault();
		if (this.state.validUrl) {
			this.setState({ value: ''});
		}
	}

	render () {
		return (
			<form onSubmit={this.onFormSubmit} className="input-group search-input-bar">
				<input
					placeholder="Enter Search Here"
					className="form-control"
					value={this.state.value}
					onChange={this.onInputChange}
				/>
			</form>
		);
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({searchVideos}, dispatch);
}

export default connect(null, mapDispatchToProps)(VideoBar);
