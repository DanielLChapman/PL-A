import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { scrubURL, REGEX_OBJ } from '../actions/index';

class VideoBar extends Component {
	constructor (props) {
		super(props);

		this.state = {
			url: '',
			validUrl: false };
		this.onInputChange = this.onInputChange.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.validateUrl = this.validateUrl.bind(this);
	}

	onInputChange (event) {
		this.validateUrl(event.target.value);
	}

	validateUrl (ele = this.state.url, length = 0) {
		// make submit not work and border around input red until the url is a valid one
		if (REGEX_OBJ.regYouTubeCom.test(ele) || REGEX_OBJ.regYoutuBe.test(ele) ||
			REGEX_OBJ.VimeoCom.test(ele) || REGEX_OBJ.VimeoPlayer.test(ele) ||
			REGEX_OBJ.DaiLy.test(ele) || REGEX_OBJ.DailyMotionCom.test(ele) || REGEX_OBJ.Streamable.test(ele)) {
			this.setState({
				validUrl: true,
				url: ele
			});
		} else {
			this.setState({
				validUrl: false,
				url: ele
			});
		}
	};

	onFormSubmit (event) {
		event.preventDefault();
		if (this.state.validUrl) {
			this.props.scrubURL(this.state.url);
			this.setState({ url: '', validUrl: false });
		}
	}

	render () {
		let ButtonStyle = {
			backgroundColor: '#FD583F',
			cursor: 'not-allowed'
		}
		if (this.state.validUrl) {
			ButtonStyle = {
				backgroundColor: '#337ab7',
				cursor: 'pointer'
			}
		}
		return (
			<form onSubmit={this.onFormSubmit} className="form-inline">
				<div className="form-group">
					<input
						placeholder="Enter Urls Here"
						className="form-control"
						value={this.state.url}
						onChange={this.onInputChange}
					/>
				</div>
				<button type="submit" style={ButtonStyle} className="btn btn-primary button submitButton">Submit</button>
			</form>
		);
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({scrubURL}, dispatch);
}

export default connect(null, mapDispatchToProps)(VideoBar);
