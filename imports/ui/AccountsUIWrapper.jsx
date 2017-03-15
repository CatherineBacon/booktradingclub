import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class AccountsUIWrapper extends Component {
	componentDidMount() {
		// Use Meteor Blaze to render login buttoms
		this.view = Blaze.render(Template.loginButtons,
			ReactDOM.findDOMNode(this.refs.container));
	}

	componentWillUnmount() {
		// Clean up Blaze view
		Blaze.remove(this.view);
	}

	render() {
		// Just render a placeholder container that will be filled in
		return (
			<div>
				<span ref='container' />
				NEED TO BE ABLE TO ADD NAME, TOWN, COUNTRY TO PROFILE
			</div>
		)
	}
}