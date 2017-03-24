import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Books } from '../api/books.js';

import Book from './Book.jsx';

export default class Trader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Decline Trade'
    };
  }

  renderTraderBooks() {
    let traderBooks = this.props.traderBooks;
    return traderBooks.map(book => (
      <option key={book._id} value={book._id}>
        {book.title} by {book.author}
      </option>
    ));
  }

  handleSubmit(event) {
    event.preventDefault();
    let choice = this.state.value;
    if (choice == 'Decline Trade') {
      Meteor.call('books.declineTrade', this.props.book);
      return;
    }
    let secondBook = this.props.traderBooks.filter(b => b._id == choice)[0];

    Meteor.call('books.tradeBooks', this.props.book, secondBook);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    if (!this.props.book.tradeProposed) {
      return <span />;
    }
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label>
          Trade proposed by {this.props.book.proposedByUsername}
        </label>
        <select
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
        >
          <option key="decline" value="Decline Trade">Decline Trade</option>
          {this.renderTraderBooks()}
        </select>
        <input type="submit" value="Go!" />
      </form>
    );
  }
}

Trader.propTypes = {
  book: PropTypes.object.isRequired,
  traderBooks: PropTypes.array.isRequired
};
