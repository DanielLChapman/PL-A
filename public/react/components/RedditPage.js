import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grabRedditData } from '../actions/index';

import RedditForm from '../containers/reddit_form';
import RedditDisplay from '../containers/reddit_display';

class RedditPage extends Component {
	constructor (props) {
		super(props);
		this.state = {
			isLoading: false,
			isReadyToSubmit: false,
			formFinished: false,
			hasAtleastOneVideo: false,
			urls: []
		};
		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.isLoadingInfo = this.isLoadingInfo.bind(this);
		this.renderRedditRight = this.renderRedditRight.bind(this);
		this.resetPage = this.resetPage.bind(this);
		this.finishForm = this.finishForm.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			urls: nextProps.videos
		})
	}
 
	handleButtonClick (e) {
		//this.props.generateNewAPIKey();
	}

	isLoadingInfo() {
		this.setState({
			isLoading: true
		});
	};
	renderRedditRight() {
		return (
			<div className='reddit-right'>
				<RedditDisplay data={this.state.urls} />
			</div>
		)
	}
	resetPage() {
		this.setState({
			isLoading: false
		});
	}

	finishForm(name, description, tags, privatePassword, password, sharedEdit, editPassword) {
		if (this.state.hasAtleastOneVideo) {
			this.setState({
				formFinished: true,
				isReadyToSubmit: true
			});
		} else {
			this.setState({
				formFinished: true
			});
		}
	}

	returnValidVideos() {
		if (videoArray.length > 0) {
			if (this.state.formFinished) {
				this.setState({
					urls: videoArray,
					hasAtleastOneVideo: true
				});
			}
			this.setState({
				urls: videoArray,
				hasAtleastOneVideo: true
			});
		} 
	}

	render () {
		let display = null, submitButton = null;
		if (this.state.isLoading) {
			display = <div className="reddit-right"><div className="Loader"></div></div>
		}
		if (this.state.isLoading && this.props.videos != null && this.props.videos.length > 0) {
			display = this.renderRedditRight();
		}
		if (this.state.isReadyToSubmit) {
			submitButton = <button className="btn btn-primary" onClick={() => {this.resetPage()}}>Submit</button>;
		}
		return (
			<div className="empty-div">
				<div className="reddit-left">
					<RedditForm loading={this.isLoadingInfo} submit={this.finishForm}/>
					<button className="btn btn-primary" onClick={() => {this.resetPage()}}>Reset</button>
					{submitButton}
				</div>
				{display}

			</div>
		);
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ grabRedditData }, dispatch);
}

function mapStateToProps ({ videos }) {
	return { videos };// {videos } === { videos: videos }
}

export default connect(mapStateToProps, mapDispatchToProps)(RedditPage);



