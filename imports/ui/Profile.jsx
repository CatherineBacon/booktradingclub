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
      country: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { fullName, city, country } = this.state;

    Meteor.call('Meteor.users.additionalinfo.update', fullName, city, country);
  }

  render() {
    if (!this.props.currentUser) return <div>Please login</div>;

    const { fullName, city, country } = this.props.currentUser;

    return (
      <div>
        <h2>Profile</h2>
        <p><b>username</b>: {Meteor.user().username}</p>
        <p><b>email address</b>: {Meteor.user().emails[0].address}</p>
        {fullName && <p><b>full name</b>: {fullName}</p>}
        {city && <p><b>town/city</b>: {city}</p>}
        {country && <p><b>country</b>: {country}</p>}

        <h4>Update Profile</h4>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label>
            Full name:
            <input
              type="text"
              name="fullName"
              onChange={this.handleInputChange}
              value={this.state.fullName}
            />
          </label>
          <label>
            Town/City:
            <input
              type="text"
              name="city"
              onChange={this.handleInputChange}
              value={this.state.city}
            />
          </label>
          <label>
            Country:
            <input
              type="text"
              name="country"
              onChange={this.handleInputChange}
              value={this.state.country}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default createContainer(
  () => {
    Meteor.subscribe('Meteor.users.additionalinfo');

    return {
      currentUser: Meteor.user()
    };
  },
  Profile
);
