import React, { Component } from 'react';

import VideoBar from '../containers/video_bar';
import PlayListList from '../containers/playlist_list';
import EditForm from '../containers/edit_form';

 

import { grabVideos } from '../actions/index';


var REACT_ID = '';

class EditVideosApp extends Component {
	constructor (props) {
		super(props);
		this.state = {
			view: 'Video',
			checkURLS: false,
			count: 0
		};
		this.renderTextInformation = this.renderTextInformation.bind(this);
		this.renderVideoInformation = this.renderVideoInformation.bind(this);
		this.renderPasswordInformation = this.renderPasswordInformation.bind(this);
		this.viewVideoInformation = this.viewVideoInformation.bind(this);
		this.viewVideos = this.viewVideos.bind(this);
		this.checkUrls = this.checkUrls.bind(this);
	}

	componentWillMount () {
		REACT_ID = document.querySelector('.editVideos').getAttribute('reactID');
		this.props.grabVideos(REACT_ID, 'edit');
	}

	renderPasswordInformation () {
		return (
			<div>
				<h2>Password required</h2>
			</div>
		);
	}

	renderTextInformation () {
		return (
			<div>
				<section className="row editPageButtons">
					<button className="btn btn-default" onClick={ this.viewVideos} >Edit Videos in Playlist</button>
				</section>
				<h2>Editing {this.props.playlist[0].name || `Playlist`}</h2>
				<EditForm reactID={REACT_ID} playlist={this.props.playlist[0]}/>
			</div>
		);
	}
	viewVideoInformation () {
		this.setState({
			view: 'Text', 
			count: parseInt(this.state.count) + 1
		});
	}
	viewVideos () {
		this.setState({
			view: 'Video', 
			count: parseInt(this.state.count) + 1
		});
	}
	checkUrls() {
		this.setState({
			checkURLS: !this.state.checkURLS, 
			count: parseInt(this.state.count) + 1
		})
	}

	renderVideoInformation () {
		let url = null;
		let urlDisplay = {display: 'none'};
		if (this.props.playlist[0] != null) {
			url = '/watch/' + this.props.playlist[0].slug;
		}
		if (this.state.checkURLS) {
			urlDisplay = {display: 'block'};
		}
		return (
			<div>
				<section className="row editPageButtons">
					<button className="btn btn-default" onClick={ this.viewVideoInformation }>Edit Information About Playlist</button>
					<a href={url} className="btn btn-default">View Playlist</a>
				</section>
				<div>
					<h2>Add Videos To Playlist</h2>
					<VideoBar />
					<section>
						<ul className="accepted-urls">
							<li style={{fontSize: '1.3em'}}>Accepted URLS 
								<i onClick={this.checkUrls} className="fa fa-question-circle-o" aria-hidden="true" style={{paddingLeft: '5px'}}></i>
							</li>
							<li style={urlDisplay}>https://youtu.be/XXXXXXXXXXX</li>
							<li style={urlDisplay}>https://www.youtube.com/watch?v=XXXXXXXXXXX</li>
							<li style={urlDisplay}>https://vimeo.com/XXXXXXXX</li>
							<li style={urlDisplay}>https://player.vimeo.com/video/XXXXXXXX</li>
							<li style={urlDisplay}>http://www.dailymotion.com/video/XXXXXXX</li>
							<li style={urlDisplay}>http://dai.ly/XXXXXXX</li>
							<li style={urlDisplay}>https://streamable.com/XXXXX</li>
						</ul>
					</section>
					<PlayListList reactID={REACT_ID} videos={this.props.playlist} view={this.state.count}/>
					
				</div>
			</div>
		);
	}

	render () {
		const passWordRequired = (this.props.playlist[0] === 'Password Required');
		const viewState = this.state.view;
		let display = null;
		if (passWordRequired) {
			display = this.renderPasswordInformation();
		} else if (viewState === 'Video') {
			display = this.renderVideoInformation();
		} else {
			display = this.renderTextInformation();
		}
		return (
			<div>
				{display}
			</div>
		);
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ grabVideos }, dispatch);
}

function mapStateToProps ({ playlist }) {
	return { playlist };// {videos } === { videos: videos }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVideosApp);
