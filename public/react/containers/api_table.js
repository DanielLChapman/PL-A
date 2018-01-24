import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from 'react-table';

import {deleteAPIKey} from '../actions/index';


class API_table extends Component {
	constructor (props) {
		super(props);
		this.state = {

		}
		this.handleButtonClick = this.handleButtonClick.bind(this);
	}
	componentWillReceiveProps(nextProps) {

	}

	handleButtonClick(e, k) {
		this.props.deleteAPIKey(k.original['api key']);
	}

	render () {
		const data = this.props.apiKeys.map((i) => {
			return {
				'api key': i
			};
		});

		const columns = [{
			Header: 'API Key',
			accessor: 'api key'
		}, {
			Header: 'Delete',
			accessor: 'delete',
			Cell: row => (<button onClick={(e) => this.handleButtonClick(e, row)} className="btn btn-primary" style={{width: '100%'}}>Delete</button>)
		}];
		return (
			<div>	
				<ReactTable
					data={data}
					columns={columns} />
			</div>
		);
	}
};

function mapDispatchToProps (dispatch) {
	return bindActionCreators({deleteAPIKey}, dispatch);
}

function mapStateToProps ({ apiKeys }) {
	return { apiKeys };// {videos } === { videos: videos }
}

export default connect(mapStateToProps, mapDispatchToProps)(API_table);