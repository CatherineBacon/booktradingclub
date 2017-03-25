import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Thumbnail, Button, Glyphicon, Checkbox } from 'react-bootstrap';

import { Books } from '../api/books.js';

const defaultImage = '/image/book.png';

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
    const canDelete = book.owner == Meteor.userId();

    return (
      <Thumbnail
        src={book.image || defaultImage}
        alt="cover picture"
        className={bookClassName}
      >

        <h3 className={bookClassName}>

          <strong>{book.title}</strong>
          {' '}
          by
          {' '}
          {book.author || <em>unknown</em>}
          {' '}
          {canDelete &&
            <Button
              bsStyle="danger"
              bsSize="xsmall"
              className="delete"
              onClick={this.deleteThisBook.bind(this)}
            >
              <Glyphicon glyph="remove" />
            </Button>}
        </h3>

        {this.props.page != 'MyBooks'
          ? <h3 hidden={this.hideTradeCheckbox()}>
              <Checkbox
                readOnly
                checked={book.tradeProposed}
                onClick={this.toggleTradeProposed.bind(this)}
                inline
              >
                Trade
              </Checkbox>
            </h3>
          : null}
      </Thumbnail>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired
};
