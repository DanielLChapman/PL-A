import React, { Component } from 'react';
import axios from 'axios';
import { TIMES_IN_MILI, getTimePast } from './SearchPage';

export const defaultPlaylist = {
	name: '##aa##',
	description: '',
	_id: 'abc123',
	createdAt: Date.now(),
	slug: '#',
	user: {
		name: ''
	}
}


export default class PopularPageApp extends Component {
	constructor (props) {
		super(props);
		this.state = ({
			numToShow: 10,
			timeRange: TIMES_IN_MILI.one_day,
			playlists: [defaultPlaylist]
		});
		this.updateListOfPlaylists = this.updateListOfPlaylists.bind(this);
		this.adjustTime = this.adjustTime.bind(this);
	}

	componentWillMount() {
		this.updateListOfPlaylists(this.state.timeRange);
	}

	updateListOfPlaylists(time) {
		axios.get(`/api/v1/getPopularVideos?time=${time}&num=${this.state.numToShow}`)
		.then((response) => {
			this.setState({
				playlists: response.data,
				timeRange: time
			});
		})
		.catch(function (error) {
			console.log(error);
		 });
	}

	renderPlayListCard(p) {
		if (p.name !== "##aa##" ) {
			var tempP = Object.assign({}, p);
			if (tempP.name.length > 35 ) {
				tempP.name = tempP.name.substr(0, 32) + "...";
			}
			if (tempP.description.length > 100 ) {
				tempP.description = tempP.description.substr(0, 97) + "...";
			}
			return (
				<div className='popular-card' key={tempP._id} >
					<h4>{tempP.name}</h4>
					<h6 style={{color: "rgba(17,17,17,.4"}}>{tempP.user.name} || {getTimePast(tempP)}</h6>
					<h5>{tempP.description}</h5>
					<a href={`/viewPlaylist/${tempP.slug}`}><h6 style={{paddingBottom: '5px'}}>Click Here To Watch!</h6></a>
				</div>
			)
		}
		else {
			return (
				<div key="p.name"></div>
			)
		}
	}

	adjustTime(time) {
		this.updateListOfPlaylists(time)
	}

	render () {
		let playlists = this.state.playlists;
		let display = playlists.map(this.renderPlayListCard);
		return (
			<div className="empty-div">
				<h1 className="title-text-of-page">Most Viewed Videos</h1>
				<div className="popular-time-selection btn-group">
					<button onClick={ () => {this.adjustTime(TIMES_IN_MILI.one_hour)} } 
						type="button" className="btn btn-primary">Past Hour</button>
					<button onClick={ () => {this.adjustTime(TIMES_IN_MILI.one_day)} }
						type="button" className="btn btn-primary">Past Day</button>
					<button onClick={ () => {this.adjustTime(TIMES_IN_MILI.one_week)}}
						type="button" className="btn btn-primary">Past Week</button>
					<button onClick={ () => {this.adjustTime(TIMES_IN_MILI.one_month)}}
						type="button" className="btn btn-primary">Past Month</button>
					<button onClick={ () => {this.adjustTime(TIMES_IN_MILI.one_year)}}
						type="button" className="btn btn-primary">Past Year</button>
				</div>
				<div className="popular-playlist-display">
					{display}
				</div>
			</div>
		)
	}
}
