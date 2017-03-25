import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Grid, Row, Col, Clearfix } from 'react-bootstrap';

import { Books } from '../api/books.js';

import Book from './Book.jsx';
import Trader from './Trader.jsx';
import AddBook from './components/AddBook.jsx';

class MyBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlyShowProposed: false
    };
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

  renderTradeRequests() {
    let books = this.props.books;
    let filteredBooks = books.filter(
      book => book.owner == Meteor.userId() && book.tradeProposed
    );

    return filteredBooks.map(book => {
      let traderBooks = books.filter(b => book.proposedById == b.owner);

      return (
        <div key={book._id}>
          <Book book={book} page="MyBooks" />
          <Trader book={book} traderBooks={traderBooks} />
        </div>
      );
    });
  }

  renderBooks() {
    let books = this.props.books;
    let filteredBooks = books.filter(book => book.owner == Meteor.userId());

    if (this.state.onlyShowProposed) {
      filteredBooks = filteredBooks.filter(book => book.tradeProposed);
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
    Meteor.subscribe('books');
    if (this.props.currentUser) {
      return (
        <Grid>
          <h2>My Books</h2>

          <h4>Add book</h4>
          <AddBook />
          <Row>
            <h4>
              Your trade requests (
              {this.props.youProposedTradeCount}
              {' '}
              outstanding)
            </h4>
            <ul>{this.renderYourRequests()}</ul>
          </Row>
          <Row>
            <h4>
              Trade requests for your books (
              {this.props.tradeProposedCount}
              {' '}
              waiting)
            </h4>
          </Row>
          <Row>
            <div>{this.renderTradeRequests()}</div>
          </Row>
          <Row>
            <h4>My books</h4>
          </Row>
          <Row>
            <label className="onlyShowProposed">
              <input
                type="checkbox"
                readOnly
                checked={this.state.onlyShowProposed}
                onClick={this.toggleOnlyShowProposed.bind(this)}
              />
              Only show books where a trade has been proposed
            </label>
          </Row>
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
