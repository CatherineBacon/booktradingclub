import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { Books } from '../api/books.js';

import Book from './Book.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import MyBooks from './MyBooks.jsx';
import AllBooks from './AllBooks.jsx';
import Profile from './Profile.jsx';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <header>
            <h1>Book Exchange!</h1>
          </header>

          <AccountsUIWrapper />

          <div>
            <Link to="/">Home</Link>
            <Link to="/mybooks">My Books</Link>
            <Link to="/allbooks">All Books</Link>
            <Link to="/profile">Profile</Link>
          </div>

          <Route
            exact
            path="/"
            render={() => (
              <div>
                <h1>Welcome to Book Exchange!</h1>
                <ul>
                  <li>List all your books</li>
                  <li>Find a book you'd like to read</li>
                  <li>
                    Arrange book exchanges with users from all over the world!
                  </li>
                </ul>
              </div>
            )}
          />

          <Route path="/profile" component={Profile} />

          <Route path="/mybooks" component={MyBooks} />

          <Route path="/allbooks" component={AllBooks} />

        </div>
      </Router>
    );
  }
}

App.propTypes = {
  books: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(
  () => {
    Meteor.subscribe('books');

    return {
      books: Books.find(
        {},
        {
          sort: { createdAt: -1 }
        }
      ).fetch()
    };
  },
  App
);
