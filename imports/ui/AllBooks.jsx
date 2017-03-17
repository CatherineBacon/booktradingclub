import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Books } from '../api/books.js';

import Book from './Book.jsx';

class AllBooks extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
	    	hideTradeProposed: false,
	    };
	}

	toggleHideTradeProposed() {
    	this.setState({
      		hideTradeProposed: !this.state.hideTradeProposed,
    	});
  	}

  	renderBooks() {
    	let filteredBooks = this.props.books;
    	if (this.state.hideTradeProposed) {
      		filteredBooks = filteredBooks.filter(book => !book.tradeProposed);
    	}
    	return filteredBooks.map((book) => (
      		<Book key={book._id} book={book} />
    	));
  	}

	render() {
		if(this.props.currentUser){
			return (
				<div>
					<h2>All Books</h2>
	        		{/* Will need to remove books from count where user is owner */}
	        		<p>Books available to trade: {this.props.availableToTradeCount}</p>

			        <label className='hide-tradeProposed'>
			          <input
			            type='checkbox'
			            readOnly
			            checked={this.state.hideTradeProposed}
			            onClick={this.toggleHideTradeProposed.bind(this)}
			          />
			          Hide books where trade has been proposed
			        </label>
			        {/*Add second checkbox for hide my books*/}

			        <ul>
			          {this.renderBooks()}
			        </ul>
				</div>
			);
		} else {
			return <div>Please login</div>
		}
		
	}
}


AllBooks.propTypes = {
  books: PropTypes.array.isRequired,
  availableToTradeCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
	Meteor.subscribe('books');
	
  return {
    books: Books.find({}, {
      sort: { createdAt: -1 }
    }).fetch(),
    availableToTradeCount: Books.find({ tradeProposed: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, AllBooks);
