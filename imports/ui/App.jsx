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


  renderBooks() {
    let filteredBooks = this.props.books;
    if (this.state.hideTradeProposed) {
        filteredBooks = filteredBooks.filter(book => !book.tradeProposed);
    }
    return filteredBooks.map((book) => (
        <Book key={book._id} book={book} />
    ));
  }

  render() {
    return (
      <div className='container'>
        <header>
          <h1>Book Exchange!</h1>
        </header>

        <AccountsUIWrapper />

        <MyBooks 
          addBook={this.addBook} 
          currentUser={this.props.currentUser}
        />

        <AllBooks />

      </div>
    );
  }
}

App.propTypes = {
  books: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    books: Books.find({}, {
      sort: { createdAt: -1 }
    }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
