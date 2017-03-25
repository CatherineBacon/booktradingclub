import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Books } from '../api/books.js';

// Book component - represents a single book
export default class Book extends Component {
  toggleTradeProposed() {
    Meteor.call('books.toggleTradeProposed', this.props.book);
  }

  deleteThisBook() {
    Meteor.call('books.remove', this.props.book);
  }

  hideTradeCheckbox() {
    if (this.props.book.owner == Meteor.userId()) return true;
    if (
      this.props.book.tradeProposed &&
      this.props.book.proposedById != Meteor.userId()
    ) {
      return true;
    }
    return false;
  }

  render() {
    const bookClassName = this.props.book.tradeProposed ? 'tradeProposed' : '';
    const { book } = this.props;

    return (
      <span className={bookClassName}>
        {this.props.page != 'MyBooks'
          ? <input
              type="checkbox"
              readOnly
              checked={book.tradeProposed}
              onClick={this.toggleTradeProposed.bind(this)}
              hidden={this.hideTradeCheckbox()}
            />
          : null}
        <span className="text">
          {book.title}
          {' '}
          by
          {' '}
          {book.author || <em>unknown</em>}
          {book.image && <img src={book.image} />}
        </span>

        <button
          className="delete"
          onClick={this.deleteThisBook.bind(this)}
          hidden={book.owner != Meteor.userId()}
        >
          ×
        </button>

      </span>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired
};
