import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grabRedditData, deleteRedditData } from '../actions/index';

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
			urls: [],
			formData: {},
			successfullyCreatedAPlaylist: false,
			mostRecentlyCreatedPlaylist: {},
			watchURL: ''
		};
		this.isLoadingInfo = this.isLoadingInfo.bind(this);
		this.renderRedditRight = this.renderRedditRight.bind(this);
		this.resetPage = this.resetPage.bind(this);
		this.finishForm = this.finishForm.bind(this);
		this.editForm = this.editForm.bind(this);
		this.submitInformation = this.submitInformation.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			urls: nextProps.videos
		})
	}

	isLoadingInfo() {
		this.setState({
			isLoading: true,
			shouldDisplayPlayListForm: true
		});
	};

	renderRedditRight() {
		let toReturn = null;
		if (this.state.isLoading) {
			toReturn = <div className="reddit-right"><div className="Loader"></div></div>
		}
		if (this.state.isLoading && this.props.videos != null && this.props.videos.length > 0) {
			toReturn = <div className='reddit-right'>
				<RedditDisplay data={this.state.urls} reset={this.resetPage}/>
			</div>
		}
		return toReturn;
	}
	resetPage() {
		this.props.deleteRedditData();
		this.setState({
			isLoading: false,
			shouldDisplayPlayListForm: false,
			isReadyToSubmit: false,
			formFinished: false,
			hasAtleastOneVideo: false,
			urls: [],
			formData: {},
			successfullyCreatedAPlaylist: false
		});
	}

	finishForm(name, description, tags, privatePassword, password, sharedEdit, editPassword) {
		let tempVideos = this.props.videos[0].map((x) => {
			return x.url;
		});
		this.setState({
			formFinished: true,
			formData: {
				name,
				description,
				tags,
				private: privatePassword,
				password,
				sharedEdit,
				editPassword,
				videos: tempVideos
			}
		});
	}
	editForm() {
		this.setState({
			formFinished: false
		})
	};

	submitInformation() {
		axios.post(`/api/v1/playlist`, {
			playlist: this.state.formData
			})
			.then((response) => {
				console.log(response);
				this.setState({
					successfullyCreatedAPlaylist: true,
					mostRecentlyCreatedPlaylist: response.data.playlist,
					watchURL: response.data.url
				})
			})
			.catch(function (error) {
				console.log(error);
			 });
	}

	render () {
		let displayRightHandInformation = null, 
			additionalRedditLeft = null,
			displayRedditLeft = null, 
			submitButton = null, 
			formDisplay = {display: 'block'};

		if (this.state.formData.name && this.state.formFinished && this.props.videos && this.props.videos[0].length > 0) {
			submitButton = <button className="btn btn-primary" style={{width: '100%', margin: '0 auto', marginTop: '20px'}} onClick={() => {this.submitInformation()}}>Save Playlist</button>
		}
		if (this.state.formFinished) {
			formDisplay = {display: 'none'};
			additionalRedditLeft =
				<div className="reddit-left">
					<h4>Information Is Saved. Click the button below to edit the information.</h4>
					<h4>Or Click the reset button to start over</h4>
					<h4>Otherwise when the videos are ready, you can save the playlist</h4>
					<button className="btn btn-primary" onClick={() => {this.editForm()}}>Edit</button>
					<button className="btn btn-primary" onClick={() => {this.resetPage()}}>Reset</button>
					{submitButton}
				</div>;
		}
		
		displayRedditLeft = 
				<div className="reddit-left" style={formDisplay}>
					<RedditForm displayPlayList={this.state.shouldDisplayPlayListForm} loading={this.isLoadingInfo} submit={this.finishForm} />
					<button className="btn btn-primary" onClick={() => {this.resetPage()}}>Reset</button>
				</div>;

		displayRightHandInformation = this.renderRedditRight();

		if (!this.state.successfullyCreatedAPlaylist) {
			return (
				<div className="empty-div">
					{displayRedditLeft}
					{additionalRedditLeft}
					{displayRightHandInformation}
				</div>
			)
		};
		return (
			<div className="empty-div" style={{textAlign: 'center'}}>
				<h3>Successfully Created A New Playlist</h3>
				<a href={this.state.watchURL}><h3>Click here to watch</h3></a>
				<h3 onClick={() => {this.resetPage()}} style={{cursor: 'pointer'}}>Click Here To Start Over</h3>
			</div>
		)
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ grabRedditData, deleteRedditData }, dispatch);
}

function mapStateToProps ({ videos }) {
	return { videos };// {videos } === { videos: videos }
}

export default connect(mapStateToProps, mapDispatchToProps)(RedditPage);



