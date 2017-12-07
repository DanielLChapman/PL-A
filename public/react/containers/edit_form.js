import React, { Component } from 'react';
import axios from 'axios';

export default class EditForm extends Component {
	constructor (props) {
		super(props);
		this.state = {
			id: this.props.playlist._id,
			name: this.props.playlist.name,
			description: this.props.playlist.description,
			private: this.props.playlist.private,
			password: this.props.playlist.password,
			sharedEdit: this.props.playlist.sharedEdit,
			editPassword: this.props.playlist.editPassword,
			tags: this.props.playlist.tags[0]
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.renderPasswordField = this.renderPasswordField.bind(this);
	}

	handleInputChange (event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	onFormSubmit (event) {
		event.preventDefault();
		axios.post(`/api/v1/editVideosForPlayList/${this.props.reactID}`, {
			updateType: 'playlist',
			playlist: this.state
		})
			.then(function (response) {
				console.log('Success');
        alet('Successfully Updated');
			})
			.catch(function (error) {
				console.log('Error');
			});
	}

	renderPasswordField (target) {
		if (target === 'password') {
			return (
				<div className="password-field" style={{position: 'relative', marginTop: '-10px'}}>
					<br />
					<label htmlFor="password">Please Enter A Password</label>
					<input className="form-control" type="text" name="password" onChange={this.handleInputChange} value={this.state.password} />
				</div>
			);
		} else {
			return (
				<div className="password-field" style={{position: 'relative', marginTop: '-10px'}}>
					<br />
					<label htmlFor="editPassword">Please Enter A Password</label>
					<input className="form-control" type="text" name="editPassword" onChange={this.handleInputChange} value={this.state.editPassword} />
				</div>
			);
		}
	}

	render () {
		let password = null;
		let editPassword = null;
		this.state.private ? password = this.renderPasswordField('password') : password = null;
		this.state.sharedEdit ? editPassword = this.renderPasswordField('editPassword') : editPassword = null;

		return (

			<form onSubmit={this.onFormSubmit} className="card" style={{color: 'white'}}>
				<div className="form-group">
					<label htmlFor="name">Name</label>
					<input className="form-control" type="text" name="name" onChange={this.handleInputChange} value={this.state.name}/>
				</div>
				<div className="form-group">
					<label htmlFor="description">Description</label>
					<input className="form-control" type="text" name="description" onChange={this.handleInputChange} value={this.state.description}/>
				</div>
				<div className="form-group">
					<label htmlFor="private">Should this playlist be private?</label>
					<br />
					<p className="private-text-area" style={{display:"inline-block", paddingRight: "5px"}}>{this.state.private.toString()}</p>
					<input className="pivate-check-box" type="checkbox" name="private" style={{display:"inline-block", paddingLeft: "10px"}} onChange={this.handleInputChange} checked={this.state.private}/>
					<br />
					<div>
						{password}
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="sharedEdit">Do you want to add a password so multiple people can edit this playlist?</label>
					<br />
					<p className="private-text-area" style={{display:"inline-block", paddingRight: "5px"}}>{this.state.sharedEdit.toString()}</p>
					<input className="pivate-check-box" type="checkbox" name="sharedEdit" style={{display:"inline-block", paddingLeft: "10px"}} onChange={this.handleInputChange} value={this.state.sharedEdit}/>
					<br />
					<div>
						{editPassword}
					</div>
				</div>
				<div className="form-group"><label htmlFor="tags">Tags</label>
					<textarea className="form-control" rows="2" type="text" name="tags" onChange={this.handleInputChange} value={this.state.tags}></textarea>
					<p>Please separate each tag with a comma</p>
				</div>
				<div className="form-group">
					<input className="btn btn-primary" type="submit" defaultValue="Save" />
				</div>
			</form>
		);
	}
}
