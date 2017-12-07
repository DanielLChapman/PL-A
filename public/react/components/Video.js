import React, { Component } from 'react';
import Dailymotion from 'react-dailymotion';

export default class Video extends Component {
	constructor (props) {
		super(props);
		this.returnVideo = this.returnVideo.bind(this);
		this.startJS = this.startJS.bind(this);
	}

	componentWillMount () {

	}
	startJS () {
		if (this.props.autoplay) {
			switch (this.props.video.site) {
			case ('dailymotion'):
				window.tempFunction('dailymotion', this.props.video.videoID);
				break;
			case ('youtube'):
				window.tempFunction('youtube', this.props.video.videoID);
				break;
			case ('vimeo'):
				window.tempFunction('vimeo', this.props.video.videoID);
				break;
			default:
				return <h1>{this.props.video}</h1>;
			}
		}
	}
	componentDidMount () {
		this.startJS();
	}
	componentDidUpdate () {
		this.startJS();
	}

	returnVideo () {
		let url = '';
		switch (this.props.video.site) {
		case ('dailymotion'):
			url = 'http://www.dailymotion.com/embed/video/' + this.props.video.videoID;
			if (!this.props.autoplay) {
				return <iframe id="iframe" frameBorder="0" style={{width: '100%', height: '100%'}} src={url} allowFullScreen=""></iframe>;
			} else {
				return <div className="empty-div">
						<Dailymotion 
							video={this.props.video.videoID} 
							autoplay 
							onEnd={
								this.props.nextVideo
							} />
						</div>;
			}

		case ('youtube'):
			url = 'https://www.youtube.com/embed/' + this.props.video.videoID;
			if (this.props.autoplay) {
				url += '?autoplay=1&enablejsapi=1;';
			}
			return <iframe id="iframe" style={{width: '100%', height: '100%'}} src={url} frameBorder="0" allowFullScreen></iframe>;
		case ('vimeo'):
			url = 'https://player.vimeo.com/video/' + this.props.video.videoID;
			if (this.props.autoplay) {
				url += '?autoplay=1;';
			}
			return <iframe id="iframe" src={url} style={{width: '100%', height: '100%'}} frameBorder="0" allowFullScreen></iframe>;
		case ('streamable'):
			return <div dangerouslySetInnerHTML={{__html: this.props.video.videoID}} />;
		default:
			return <h1>{this.props.video}</h1>;
		}
	}

	render () {
		let display = null;
		display = this.props.video;
		if (display != null) {
			display = this.returnVideo();
		}

		return (
			<div className="empty-div video-div">
				{display}
			</div>
		);
	}
}
