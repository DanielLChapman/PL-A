import React, { Component } from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { scrubURL, REGEX_OBJ, validateVideosFromReddit } from '../actions/index';

let t = null,
	numErrors = 0;

class RedditDisplay extends Component {
	constructor (props) {
		super(props);
		this.state = {
			data: null
		}
		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.renderEditable = this.renderEditable.bind(this);
		this.checkTableValues = this.checkTableValues.bind(this);
	}
	componentDidMount() {
		if (this.props.data != null && this.props.data.length > 0) {
			this.setState({
				data: this.props.data[0]
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.data
		});
	}
	checkTableValues() {
		// console.log(this.state.data);
		// const data = this.state.data.map((i) => {
		// 	return this.validateUrl(i.url);
		// });
		// this.setState({
		// 	data: data
		// });
	}
	handleButtonClick(e, r) {
	}
	renderEditable(cellInfo) {
	    return (
		    <div
		        style={{ backgroundColor: "#fafafa" }}
		        contentEditable
		        suppressContentEditableWarning
		        onBlur={e => {
		          const data = this.state.data;
		          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
		          this.setState({ data });
		        }}
		        dangerouslySetInnerHTML={{
		          __html: this.state.data[cellInfo.index][cellInfo.column.id]
		        }}
		    />
	    );
  	}

	render () {
		let data = this.state.data;

		const columns = [
			{
				Header: 'URL',
				accessor: 'url',
				Cell: this.renderEditable
			}, {
				Header: 'Valid',
				accessor: 'validUrl',
				Cell: (row) => {
					if (!row.original.validUrl) {
						console.log('here');
						return (<div onClick={(e) => this.handleButtonClick(e, row)} style={{color: 'red', float: 'left', marginLeft: '5px', marginTop: '-2px'}}>
									!
									&nbsp;Remove
								</div>);
					} else {
						return (<div style={{color: 'green'}}>
							✓
						</div>);
					}
				}
			}
		];

		let reactTable = null;
		if (data != null) {
			reactTable = 
			<div>
				<button onClick={() => {this.props.validateVideosFromReddit(this.state.data)}} className="btn btn-primary" style={{width: '100%'}}>Check Values Again</button>
				<ReactTable data={data} columns={columns} />
			</div>
		}
		return (

			<div>	
				{reactTable}
			</div>
		);
	}
};

function mapDispatchToProps (dispatch) {
	return bindActionCreators({ validateVideosFromReddit }, dispatch);
}

export default connect(null, mapDispatchToProps)(RedditDisplay);
