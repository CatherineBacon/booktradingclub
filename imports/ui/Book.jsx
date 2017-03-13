import React, { Component, PropTypes } from 'react';

import { Books } from '../api/books.js';

// Book component - represents a single book
export default class Book extends Component {
  toggleTradeProposed() {
    // only person who click checkbox should be able to uncheck it
    // box should not show for other users once ticked
      Books.update(this.props.book._id, {
        $set: { tradeProposed: !this.props.book.tradeProposed },
      });
  }

  deleteThisBook() {
    // eventually only owner should be able to delete book
    Books.remove(this.props.book._id);
  }

  render() {
    const bookClassName = this.props.book.tradeProposed ? 'tradeProposed' : '';

    return (
      <li className={bookClassName}>
        {/* will only want to show tickbox if user is not owner
          and box has not been checked by another user
          */}
        <input
          type='checkbox'
          readOnly
          checked={this.props.book.tradeProposed}
          onClick={this.toggleTradeProposed.bind(this)}
        />
        <span className='text'>Title: {this.props.book.title} Author: {this.props.book.author}</span>
        <button className='delete' onClick={this.deleteThisBook.bind(this)}>
          &times;
        </button>
      </li>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
};
