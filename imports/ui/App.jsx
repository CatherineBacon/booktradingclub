import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Books } from '../api/books.js';

import Book from './Book.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import MyBooks from './MyBooks.jsx';
import AllBooks from './AllBooks.jsx';

class App extends Component {

  addBook(title, author) {
    Books.insert({
      title,
      author,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  }

  render() {
    return (
      <div className='container'>
        <header>
          <h1>Book Exchange!</h1>
        </header>

        <AccountsUIWrapper />

        <MyBooks addBook={this.addBook} />

        <AllBooks />

      </div>
    );
  }
}

App.propTypes = {
  books: PropTypes.array.isRequired,
  availableToTradeCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  return {
    books: Books.find({}, {
      sort: { createdAt: -1 }
    }).fetch(),
    availableToTradeCount: Books.find({ tradeProposed: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
