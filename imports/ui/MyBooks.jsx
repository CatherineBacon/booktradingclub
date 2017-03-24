import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Books } from '../api/books.js';

import Book from './Book.jsx';
import Trader from './Trader.jsx';

class MyBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlyShowProposed: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    const title = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
    const author = ReactDOM.findDOMNode(this.refs.authorInput).value.trim();

    this.addBook(title, author);

    // clear form
    ReactDOM.findDOMNode(this.refs.titleInput).value = '';
    ReactDOM.findDOMNode(this.refs.authorInput).value = '';
  }

  addBook(title, author) {
    Meteor.call('books.insert', title, author);
    //also update user with books they own??
  }

  toggleOnlyShowProposed() {
    this.setState({
      onlyShowProposed: !this.state.onlyShowProposed
    });
  }

  renderYourRequests() {
    let books = this.props.books;
    let filteredBooks = books.filter(
      book => book.proposedById == Meteor.userId()
    );
    return filteredBooks.map(book => {
      return (
        <li key={book._id}>
          <Book book={book} />
        </li>
      );
    });
  }

  renderTradeRequests() {
    let books = this.props.books;
    let filteredBooks = books.filter(
      book => book.owner == Meteor.userId() && book.tradeProposed
    );

    return filteredBooks.map(book => {
      let traderBooks = books.filter(b => book.proposedById == b.owner);

      return (
        <li key={book._id}>
          <Book book={book} page="MyBooks" />
          <Trader book={book} traderBooks={traderBooks} />
        </li>
      );
    });
  }

  renderBooks() {
    let books = this.props.books;
    let filteredBooks = books.filter(book => book.owner == Meteor.userId());

    if (this.state.onlyShowProposed) {
      filteredBooks = filteredBooks.filter(book => book.tradeProposed);
    }

    return filteredBooks.map(book => {
      return (
        <li key={book._id}>
          <Book book={book} page="MyBooks" />
        </li>
      );
    });
  }

  render() {
    Meteor.subscribe('books');
    if (this.props.currentUser) {
      return (
        <div>
          <h2>My Books</h2>

          <h4>Add book</h4>
          <form className="new-book" onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" ref="titleInput" placeholder="Title" />
            <input type="text" ref="authorInput" placeholder="Author" />
            <input type="submit" value="Add" />
          </form>

          <h4>
            Your trade requests ({this.props.youProposedTradeCount} outstanding)
          </h4>
          <ul>{this.renderYourRequests()}</ul>

          <h4>
            Trade requests for your books (
            {this.props.tradeProposedCount}
            {' '}
            waiting)
          </h4>
          <ul>{this.renderTradeRequests()}</ul>

          <h4>My books</h4>
          <label className="onlyShowProposed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.onlyShowProposed}
              onClick={this.toggleOnlyShowProposed.bind(this)}
            />
            Only show books where a trade has been proposed
          </label>
          <ul>
            {this.renderBooks()}
          </ul>
        </div>
      );
    } else {
      return <div>Please login</div>;
    }
  }
}

MyBooks.propTypes = {
  books: PropTypes.array.isRequired,
  tradeProposedCount: PropTypes.number.isRequired,
  youProposedTradeCount: PropTypes.number.isRequired
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
      ).fetch(),
      tradeProposedCount: Books.find({
        tradeProposed: { $ne: false },
        owner: Meteor.userId()
      }).count(),
      youProposedTradeCount: Books.find({
        tradeProposed: { $ne: false },
        proposedById: Meteor.userId()
      }).count(),
      currentUser: Meteor.user()
    };
  },
  MyBooks
);
