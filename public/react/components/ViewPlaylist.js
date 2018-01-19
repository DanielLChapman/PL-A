import React, { Component } from 'react';

import Video from './Video';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grabVideos } from '../actions/index';

var REACT_ID = '';
class ViewPlaylist extends Component {
	constructor (props) {
		super(props);
		this.state = {
			REACT_ID: '',
			order: 0,
			hasError: false
		};

		this.renderPlaylist = this.renderPlaylist.bind(this);
		this.validateOrder = this.validateOrder.bind(this);
		this.nextVideo = this.nextVideo.bind(this);
		this.prevVideo = this.prevVideo.bind(this);
	}
	componentDidCatch(error, info) {
		// You can also log the error to an error reporting service
		//INPUT LOGGING HERE
	    // Display fallback UI
	    this.setState({ hasError: true });
	  }

	componentWillMount () {
		REACT_ID = document.querySelector('.video-container').getAttribute('reactID');
		this.props.grabVideos(REACT_ID, 'view');
		let order = parseInt(document.querySelector('.video-container').getAttribute('order'));
		this.setState({
			REACT_ID: REACT_ID,
			order
		});
	}
	componentWillReceiveProps (nextProps) {
		this.validateOrder(nextProps.playlist.videos.length, this.state.order);
	}
	validateOrder (lengthToCompare, newOrder) {
		let currentOrder = newOrder;
		if (currentOrder >= lengthToCompare) {
			currentOrder = 0;
		} else if (currentOrder < 0) {
			currentOrder = lengthToCompare - 1;
		};
		this.setState({
			order: currentOrder
		});
	}

	renderPlaylist (videos) {
		return <Video autoplay={true} video={videos[this.state.order]} nextVideo={this.nextVideo} />
	}

	nextVideo () {
		let tempOrder = parseInt(this.state.order) + 1;
		this.validateOrder(this.props.playlist.videos.length, tempOrder);
	}

	prevVideo () {
		let tempOrder = parseInt(this.state.order) - 1;
		this.validateOrder(this.props.playlist.videos.length, tempOrder);
	}

	render () {
		let data = null;
		if (this.props.playlist != null) {
			data = this.renderPlaylist(this.props.playlist.videos);
		}

		return (
			<div className='empty-div view-playlist-box'>
				<div onClick={this.nextVideo} className="video-switch-button next-video-box btn btn-primary">Next → </div>
				<div onClick={this.prevVideo} className="video-switch-button prev-video-box btn btn-primary"> ← Prev </div>
				{data}
			</div>
		);
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ grabVideos }, dispatch);
}

function mapStateToProps ({ playlist }) {
	let returnValue = null;
	if (playlist != null) {
		returnValue = playlist[0];
	}
	return { playlist: returnValue };// {videos } === { videos: videos }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPlaylist);
