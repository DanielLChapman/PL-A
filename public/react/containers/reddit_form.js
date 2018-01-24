import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { grabRedditData } from '../actions/index';

let errorSyling = {
	subreddit: {color: 'black'},
	count: {color: 'black'},
	type: {color: 'black'},
	time: {color: 'black'},
	name: {color: 'black'}
}

class RedditForm extends Component {
	constructor (props) {
		super(props);
		this.state = {
			subreddit: 'videos',
			type: 'top',
			count: 1,
			time: 'day',
			view: 'initial',
			name: '',
			description: '',
			private: false,
			password: null,
			sharedEdit: false,
			editPassword: null,
			tags: []
		};
		this.onInputChange = this.onInputChange.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.redditForm = this.redditForm.bind(this);
		this.submitted = this.submitted.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		if (!this.displayPlayList) {
			this.setState({
				subreddit: 'videos',
				type: 'top',
				count: 1,
				time: 'day',
				view: 'initial',
				name: '',
				description: '',
				private: false,
				password: '',
				sharedEdit: false,
				editPassword: '',
				tags: []
			});
		}
	}

	onInputChange (event) {
		const target = event.target;
		const name = target.name;
		if (name === "count") {
			if (target.value > 100) {
				target.value = 100;
			}
		}
		this.setState({
			[name]: target.value
		});

	}

	onFormSubmit (event) {
		event.preventDefault();
		var errors = [];
		//validation
		if (event.target.name === "reddit-form") {

			//validation
			if (this.state.subreddit.length <= 0 || typeof this.state.subreddit == 'undefined') {
				errors.push('Subreddit is invalid');
				errorSyling.subreddit = {color: 'red'};
			} else { errorSyling.subreddit = {color: 'black'}; };
			if (['new', 'top', 'hot'].indexOf(this.state.type) === -1) {
				errors.push('invalid type');
				errorSyling.type = {color: 'red'};
			} else { 
				errorSyling.type = {color: 'black'}; 
			};
			if (isNaN(this.state.count) || parseInt(this.state.count) <= 0 || parseInt(this.state.count) > 100) {
				errors.push('Count is invalid');
				errorSyling.count = {color: 'red'};
			} else { 
				errorSyling.count = {color: 'black'}; 
			};
			if (['hour', 'day', 'week', 'month', 'year', 'all'].indexOf(this.state.time) === -1) {
				errors.push('Invalid Time');
				errorSyling.time = {color: 'red'};
			} else { errorSyling.time = {color: 'black'}; };

			//if errors
			if (errors.length) {
				alert(errors.map((x) => {
					return x
				}));
				this.setState({
					view: 'initial'
				});
			} else {
				this.props.loading();
				this.props.grabRedditData(this.state.subreddit, this.state.type, this.state.count, this.state.time);
				this.setState({
					view: "submitted"
				});
			}
		} else {
			if (this.state.name == null || this.state.name == '' ) {
				errors.push('Name is invalid');
				errorSyling.name = {color: 'red'};
			} else { errorSyling.name = {color: 'black'}}
			if (errors.length) {
				alert(errors.map((x) => {
					return x
				}));
				this.setState({
					view: 'submitted'
				});
			} else {
				this.props.submit(this.state.name, this.state.description, this.state.tags, this.state.private, this.state.password, this.state.sharedEdit, this.state.editPassword)
			}

		}
	}

	renderPasswordField (target) {
		if (target === 'password') {
			return (
				<div className="password-field" style={{position: 'relative', marginTop: '-10px'}}>
					<br />
					<label htmlFor="password">Please Enter A Password</label>
					<input className="form-control" type="text" name="password" onChange={this.onInputChange} value={this.state.password} />
				</div>
			);
		} else {
			return (
				<div className="password-field" style={{position: 'relative', marginTop: '-10px'}}>
					<br />
					<label htmlFor="editPassword">Please Enter A Password</label>
					<input className="form-control" type="text" name="editPassword" onChange={this.onInputChange} value={this.state.editPassword} />
				</div>
			);
		}
	}

	redditForm() {
		return (<form onSubmit={this.onFormSubmit} name="reddit-form" className="input-group" style={{display: "inline-block", width: "300px", top: "7px", position: "relative"}}>
				<div className="form-group">
					<label htmlFor="subreddit" style={errorSyling.subreddit}>Which Subreddit</label>
					<input
						name="subreddit"
						placeholder="Enter Subreddit Here"
						className="form-control"
						value={this.state.subreddit}
						onChange={this.onInputChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="count" style={errorSyling.count}>1-100, How Many Results</label>
					<input
						name="count"
						type="number"
						placeholder="Enter Amount (max. 100)"
						className="form-control"
						value={this.state.count}
						onChange={this.onInputChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="type" style={errorSyling.type}>Choose Which Option</label>
					<select className="form-control" name="type" onChange={this.onInputChange} value={this.state.type}>
						<option value="top">Top</option>
						<option value="hot">Hot</option>
						<option value="new">New</option>
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="time" style={errorSyling.time}>Choose Timing Option</label>
					<select className="form-control" name="time" onChange={this.onInputChange} value={this.state.time}>
						<option value="hour">Hour</option>
						<option value="day">Day</option>
						<option value="week">Week</option>
						<option value="month">Month</option>
						<option value="year">Year</option>
						<option value="all">All</option>
					</select>
				</div>
				<button type="submit" className="btn btn-primary" style={{marginTop: '10px'}}>Submit</button>
			</form>);
	}

	submitted() {
		let password = null;
		let editPassword = null;
		this.state.private ? password = this.renderPasswordField('password') : password = null;
		this.state.sharedEdit ? editPassword = this.renderPasswordField('editPassword') : editPassword = null;

		return (
			<div className="reddit-form-loader">
				<h3>Loading Content From Reddit<br />In the meantime <br />Fill out the following information:</h3>
				<form onSubmit={this.onFormSubmit} name="information" className="card" style={{color: 'white'}}>
					<div className="form-group">
						<label htmlFor="name" style={errorSyling.name}>Name</label>
						<input className="form-control" type="text" name="name" onChange={this.onInputChange} value={this.state.name}/>
					</div>
					<div className="form-group">
						<label htmlFor="description">Description</label>
						<input className="form-control" type="text" name="description" onChange={this.onInputChange} value={this.state.description}/>
					</div>
					<div className="form-group"><label htmlFor="tags">Tags</label>
						<textarea className="form-control" rows="2" type="text" name="tags" onChange={this.onInputChange} value={this.state.tags}></textarea>
						<p>Please separate each tag with a comma</p>
					</div>
					<div className="form-group">
						<label htmlFor="private">Should this playlist be private?</label>
						<br />
						<p className="private-text-area" style={{display:"inline-block", paddingRight: "5px"}}>{this.state.private.toString()}</p>
						<input className="pivate-check-box" type="checkbox" name="private" style={{display:"inline-block", paddingLeft: "10px"}} onChange={this.onInputChange} checked={this.state.private}/>
						<br />
						<div>
							{password}
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="sharedEdit">Do you want to add a password so multiple people can edit this playlist?</label>
						<br />
						<p className="private-text-area" style={{display:"inline-block", paddingRight: "5px"}}>{this.state.sharedEdit.toString()}</p>
						<input className="pivate-check-box" type="checkbox" name="sharedEdit" style={{display:"inline-block", paddingLeft: "10px"}} onChange={this.onInputChange} value={this.state.sharedEdit}/>
						<br />
						<div>
							{editPassword}
						</div>
					</div>
					<button type="submit" className="btn btn-primary" style={{marginTop: '10px'}}>Save</button>
				</form>
			</div>
		)
	}

	render () {
		let display = null;

		if (!this.props.displayPlayList) {
			display = this.redditForm();
		} else {
			display = this.submitted();
		}
		return (
			display
		);
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({grabRedditData}, dispatch);
}

export default connect(null, mapDispatchToProps)(RedditForm);
