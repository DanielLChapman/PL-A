import React, { Component } from 'react';

import SearchBar from '../containers/search_bar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchVideos } from '../actions/index';

export const TIMES_IN_MILI = {
	one_hour: 1000*60*60,
	one_day: 1000*60*60*24,
	one_week: 1000*60*60*24*7,
	one_month: 1000*60*60*24*7*4,
	one_year: 1000*60*60*24*7*4*12,
};

export function getTimePast(p) {
	let currentTime = Date.now();
	let oldTime = new Date(p.createdAt);
	let timePast = null;

	if (p !== undefined) {
		if ( Math.floor((currentTime - oldTime)/TIMES_IN_MILI.one_day) >= 1) {
			timePast = "Created " + ((currentTime - oldTime)/TIMES_IN_MILI.one_day).toFixed(2) + " Days Ago ";
		} 
		else { 
			timePast = "Created " + ((currentTime - oldTime)/TIMES_IN_MILI.one_hour).toFixed(2) + " Hours Ago ";
		}
	}

	return timePast;
}
 
class SearchPageApp extends Component {
	constructor (props) {
		super(props);
		this.state = ({
			selectedObject: null
		});
		this.setSelectedObject = this.setSelectedObject.bind(this);
		this.displayTitleCard = this.displayTitleCard.bind(this);
	}

	setSelectedObject(p) {
		if (p !== this.state.selectedObject) {
			this.setState({
				selectedObject: p
			});
		};
	}

	displayTitleCard(p) {
		var tempP = Object.assign({}, p);
		if (this.state.selectedObject && tempP._id === this.state.selectedObject._id) {
			tempP.style = {border: "3px solid orange"};
		}
		else {
			tempP.style = {border: "0px solid black"};
		}
		if (tempP.name.length > 35 ) {
			tempP.name = tempP.name.substr(0, 32) + "...";
		}
		if (tempP.description.length > 38 ) {
			tempP.description = tempP.description.substr(0, 35) + "...";
		}

		return (
			<section key={p._id} style={tempP.style} className='search-card' onClick={() => {this.setSelectedObject(p)}}>
				<h4 style={{color: "black"}}>{tempP.name}</h4>
				<h5 style={{color: "black"}}>{tempP.description}</h5>
			</section>
		);
	}
	render () {

		let displayStyle = { display: "none "};
		let searchContentToExpand = null;
		if (this.state.selectedObject) {
			displayStyle = { display: "block" };

			let timePast = getTimePast(this.state.selectedObject);

			searchContentToExpand = (
				<div>	
					<h2>{this.state.selectedObject.name}</h2>
					<h6 style={{color: "rgba(17,17,17,.4"}}>{this.state.selectedObject.user.name} || {timePast}</h6>
					<h4>{this.state.selectedObject.description}</h4>
					<br />
					<a href={`/viewPlaylist/${this.state.selectedObject.slug}`}><h5>Click Here To View</h5></a>
				</div>
			);
		}

		return (
			<div className="empty-div">
				<section className="search-area col-xs-12 col-sm-12 col-md-4">
					<h2>Search: <SearchBar /></h2>
					<div className="search-results ">
						{ this.props.playlists.map(this.displayTitleCard) }
					</div>
				</section>
				<section style={displayStyle} className="search-info-sheet col-xs-12 .col-sm-12 col-md-4 col-md-offset-4" >
					{searchContentToExpand}
				</section>
			</div>
		)
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ searchVideos }, dispatch);
}

function mapStateToProps ({ playlists }) {
	return { playlists };// {videos } === { videos: videos }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPageApp);
