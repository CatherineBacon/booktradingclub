import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import UserInfo from '../api/users.js';

class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fullName: '',
			city: '',
			countrty: '',
		}

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		
		this.setState({
			[name]: value,
		}) 
	}

	handleSubmit(event) {
		event.preventDefault();

		const fullName = this.state.fullName;
		const city = this.state.city;
		const country = this.state.country;

		console.log(fullName, city, country)
	}
	
	render() {
		if(this.props.currentUser){
			return (
				<div>
					<h2>Profile</h2>
	       			<p><b>username</b>: {Meteor.user().username}</p>
	       			<p><b>email address</b>: {Meteor.user().emails[0].address}</p>

	       			<h4>Update Profile</h4>
	       			<form>
	       				<label>
	       					Full name:
	       					<input type='text' name='fullName' onChange={this.handleInputChange} value={this.state.fullName}/>
	       				</label>
	       				<label>
	       					Town/City:
	       					<input type='text' name='city' onChange={this.handleInputChange} value={this.state.city}/>
	       				</label>
	       				<label>
	       					Country:
	       					<input type='text' name='country' onChange={this.handleInputChange} value={this.state.country}/>
	       				</label>
	       				<input type='submit' value='Submit' onSubmit={this.handleSubmit}/>
	       			</form>
	       			{console.log(Meteor.user())}
				</div>
			);
		} else {
			return <div>Please login</div>
		}
		
	}
}


export default createContainer(() => {
	Meteor.subscribe('Meteor.users.additionalinfo');

  return {
    currentUser: Meteor.user(),
  };
}, Profile);