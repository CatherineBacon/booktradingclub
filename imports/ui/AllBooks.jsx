import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Grid, Row, Col, Clearfix } from 'react-bootstrap';

import { Books } from '../api/books.js';

import Book from './Book.jsx';

class AllBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideTradeProposed: false,
      hideMyBooks: false
    };
  }

  toggleHideTradeProposed() {
    this.setState({
      hideTradeProposed: !this.state.hideTradeProposed
    });
  }

  toggleHideMyBooks() {
    this.setState({
      hideMyBooks: !this.state.hideMyBooks
    });
  }

  renderBooks() {
    let filteredBooks = this.props.books;
    if (this.state.hideTradeProposed) {
      filteredBooks = filteredBooks.filter(book => !book.tradeProposed);
    }
    if (this.state.hideMyBooks) {
      filteredBooks = filteredBooks.filter(
        book => book.owner != Meteor.userId()
      );
    }

    let bookComponents = [];

    filteredBooks.forEach((book, i) => {
      bookComponents.push(
        <Col sm={4} key={book._id} className="clearfix">
          <Book book={book} page="AllBooks" />
        </Col>
      );

      if ((i + 1) % 3 == 0) {
        bookComponents.push(<Clearfix key={i} />);
      }
    });

    return bookComponents;
  }

  render() {
    if (this.props.currentUser) {
      return (
        <Grid>
          <h2>All Books</h2>

          <p>Books available to trade: {this.props.availableToTradeCount}</p>

          <label className="hide-tradeProposed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideTradeProposed}
              onClick={this.toggleHideTradeProposed.bind(this)}
            />
            Hide books where trade has been proposed
          </label>

          <label className="hide-myBooks">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideMyBooks}
              onClick={this.toggleHideMyBooks.bind(this)}
            />
            Hide my own books
          </label>

          <h4>Check the box to propose a trade</h4>

          <Row>
            {this.renderBooks()}
          </Row>
        </Grid>
      );
    } else {
      return <div>Please login</div>;
    }
  }
}

AllBooks.propTypes = {
  books: PropTypes.array.isRequired,
  availableToTradeCount: PropTypes.number.isRequired
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
      availableToTradeCount: Books.find({
        tradeProposed: { $ne: true },
        owner: { $ne: Meteor.userId() }
      }).count(),
      currentUser: Meteor.user()
    };
  },
  AllBooks
);
