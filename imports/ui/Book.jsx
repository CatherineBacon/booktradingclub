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
    if(this.props.book.owner==Meteor.userId()) return true;
    if(this.props.book.tradeProposed && this.props.book.proposedById!=Meteor.userId()){
      return true;
    }
    return false;
  }

  render() {
    const bookClassName = this.props.book.tradeProposed ? 'tradeProposed' : '';

    return (
      <span className={bookClassName}>
        {this.props.page!='MyBooks' ? (
          <input
            type='checkbox'
            readOnly
            checked={this.props.book.tradeProposed}
            onClick={this.toggleTradeProposed.bind(this)}
            hidden={this.hideTradeCheckbox()}
          /> ) : null
        }
        <span className='text'>{this.props.book.title} by {this.props.book.author}</span>
        
        <button 
          className='delete' 
          onClick={this.deleteThisBook.bind(this)} 
          hidden={this.props.book.owner!=Meteor.userId() } 
        >
          &times;
        </button>

      </span>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
};
