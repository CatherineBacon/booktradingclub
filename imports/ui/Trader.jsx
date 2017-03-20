import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor'; 

import { Books } from '../api/books.js';

import Book from './Book.jsx';


export default class Trader extends Component {

  renderTraderBooks() {
    let traderBooks = this.props.traderBooks;
    return traderBooks.map( book => (
      <li key={book._id}>
        {book.title} by {book.author}
      </li>
    ));
  }

  render() {
    if(!this.props.book.tradeProposed) {
      return (
        <span></span>
      );
    }
    return (
      <span>
        Trade proposed by {this.props.book.proposedByUsername}
        <ul>
          <li>Decline trade</li>
          {this.renderTraderBooks()}
        </ul>
      </span>
    );
  }
}

Trader.propTypes = {
  book: PropTypes.object.isRequired,
  traderBooks: PropTypes.array.isRequired,
};
