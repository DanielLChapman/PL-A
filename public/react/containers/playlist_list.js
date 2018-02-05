import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { moveVideoUp, moveVideoDown, deleteVideo } from '../actions/index';
import Video from '../components/Video';
import axios from 'axios';

class PlayListList extends Component {
	constructor (props) {
		super(props);
		this.state = {
			saved: true,
			numTimesUpdated: 0
		}
		this.renderVideo = this.renderVideo.bind(this);
		this.onMoveUp = this.onMoveUp.bind(this);
		this.onMoveDown = this.onMoveDown.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			if (this.state.numTimesUpdated > 0) {
				this.setState({
					saved: false,
					numTimesUpdated: parseInt(this.state.numTimesUpdated) + 1
				});
			} else {
				this.props.submit(true);
				this.setState({
					saved: true,
					numTimesUpdated: parseInt(this.state.numTimesUpdated) + 1
				});
			}
		}
	}
	onMoveUp (ID, order) {
		this.props.moveVideoUp(ID, order);
	}
	onMoveDown (ID, order) {
		this.props.moveVideoDown(ID, order);
	}
	onDelete (ID) {
		this.props.deleteVideo(ID);
	}
	renderVideo (videoData) {
		return (
			<div className="video-card" key={videoData.id + videoData.videoID}>
				<section className="video-card-video">
					<Video autoplay={false} video={videoData} />
				</section>
				<section className="video-card-info">
					<h4>{videoData.site}</h4>
					<h5>Order:</h5>
					<h6>{videoData.order}</h6>
				</section>
				<section className="video-card-interactions">
					<h5>Adjust Video</h5>
					<ul>
						<li onClick={ () => { this.onMoveUp(videoData.id, videoData.order); } }>Move Up</li>
						<li onClick={ () => { this.onMoveDown(videoData.id, videoData.order); } }>Move Down</li>
						<li onClick={ () => { this.onDelete(videoData.id); } }>Delete</li>
					</ul>
				</section>
			</div>
		);
	}

	onSubmit () {
		if (this.props.videos[0].videos.length > 0) {
			axios.post(`/internal/api/v1/editVideosForPlayList/${this.props.reactID}`, {
				updateType: 'videos',
				videos: this.props.videos[0].videos
			})
			.then((response) => {
				this.props.submit(true);
				this.setState({
					saved: true
				})
			})
			.catch(function (error) {
				console.log(error);
			});
		} else {
			alert('Cant save a playlist with 0 videos, at least 1 is required.');
		}
		/* if (this.state.validUrl) {
			this.props.scrubURL(this.state.url);
			this.setState({ url: '', validUrl: false });
		} */
	}
	render () {
		var dataToReturn, savedStyling, notice = null;
		try {
			dataToReturn = this.props.videos[0].videos.map(this.renderVideo);
		} catch (err) {
			// console.log(err);
		};
		if (this.state.saved) {
			if (this.state.numTimesUpdated > 1) {
				notice = "Successfully Updated";
			}
			savedStyling = {background: "#337ab7", cursor: "pointer"};
		} else {
			savedStyling = {background: "rgb(253, 88, 63)", cursor: "not-allowed"};
		}
		return (
			<div>	
				<h6 className="playListList-Notice">{notice}</h6>
				<button type="submit" onClick={this.onSubmit} style={{marginTop: '5px'}, savedStyling} className="btn btn-primary">Save Playlist</button>
				<section className="videosInPlaylists popular-playlist-display">
					{dataToReturn}
				</section>
			</div>
		);
	}
};

function mapDispatchToProps (dispatch) {
	return bindActionCreators({moveVideoUp, moveVideoDown, deleteVideo}, dispatch);
}

export default connect(null, mapDispatchToProps)(PlayListList);
