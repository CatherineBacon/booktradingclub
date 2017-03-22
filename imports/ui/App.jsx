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

class App extends Component {

  render() {
    return (
      <Router>
        <div className='container'>
          <header>
            <h1>Book Exchange!</h1>
          </header>

          <AccountsUIWrapper />

          <Route exact path='/' render={ () => (
            <div>
              <h1>Welcome to Book Exchange!</h1>
              <Link to='/mybooks'>My Books</Link>
              <Link to='/allbooks'>All Books</Link>
            </div>
          )} />

          <Route path="/mybooks" component={MyBooks} />

          <Route path='/allbooks' component={AllBooks} />

        </div>
      </Router>
    );
  }
}

App.propTypes = {
  books: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('books');

  return {
    books: Books.find({}, {
      sort: { createdAt: -1 }
    }).fetch(),
  };
}, App);
