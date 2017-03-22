import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor'; 

import { Books } from '../api/books.js';

import Book from './Book.jsx';


export default class Trader extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: 'Decline Trade',
    };
  }

  renderTraderBooks() {
    let traderBooks = this.props.traderBooks;
    return traderBooks.map( book => (
      <option key={book._id} value={book._id}>
        {book.title} by {book.author}
      </option>
    ));
  }

  handleSubmit(event) {
    event.preventDefault();
    let choice = this.state.value;
    if(choice=='Decline Trade') {
      Meteor.call('books.declineTrade', this.props.book)
      return
    }
    Meteor.call('books.tradeBooks', this.props.book, choice)
    /// 
    // 2. should change book to exchanged = true, list exchange in both users 'Successful Trades list', 
    // book not show on all books list, email users OR swap owner of book. create separate collections for 
    // successful trades (books swapped, with whom with user email address) mark trade completes
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  render() {
    if(!this.props.book.tradeProposed) {
      return (
        <span></span> 
      );
    }
    return (
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label> 
            Trade proposed by {this.props.book.proposedByUsername}
          </label> 
          <select value={this.state.value} onChange={this.handleChange.bind(this)}>
            <option key='decline' value='Decline Trade'>Decline Trade</option>
            {this.renderTraderBooks()}
          </select>
          <input type="submit" value="Go!" />
        </form> 
    );
  }
}

Trader.propTypes = {
  book: PropTypes.object.isRequired,
  traderBooks: PropTypes.array.isRequired,
};

