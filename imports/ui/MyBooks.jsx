import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Books } from '../api/books.js';

import Book from './Book.jsx';

class MyBooks extends Component {

	handleSubmit(event) {
	   event.preventDefault();

	  const title = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
	  const author = ReactDOM.findDOMNode(this.refs.authorInput).value.trim();

	  this.addBook(title, author);

	  // clear form
	  ReactDOM.findDOMNode(this.refs.titleInput).value = '';
	  ReactDOM.findDOMNode(this.refs.authorInput).value = '';
	}

	addBook(title, author) {
    Meteor.call('books.insert', title, author);
    //also update user with books they own??
  };

  renderBooks() {
   	let filteredBooks = this.props.books;
   	filteredBooks = filteredBooks.filter( book => book.owner==Meteor.userId());
   	return filteredBooks.map((book) => (
   			<li key={book._id}>
     			<Book key={book._id} book={book} />
     		</li>
   	));
 	}

	render() {
		Meteor.subscribe('books');
		if(this.props.currentUser) {
			return (
				<div>
					<h2>My Books</h2>

        	<h4>Add book</h4>
        	<form className="new-book" onSubmit={this.handleSubmit.bind(this)} >
         		<input
	         		type='text'
	         		ref='titleInput'
	         		placeholder='Title'
	       		/>
	     			<input
	       			type='text'
	       			ref='authorInput'
	       			placeholder='Author'
	     			/>
	     			<input
	       			type='submit'
	       			value='Add'
      			/>
	     		</form>

	     		<h4>My books</h4>
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

MyBooks.propTypes = {
  books: PropTypes.array.isRequired,
  availableToTradeCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
	Meteor.subscribe('books');

  return {
    books: Books.find({}, {
      sort: { createdAt: -1 }
    }).fetch(),
    availableToTradeCount: Books.find({ tradeProposed: { $ne: true }, owner: { $ne: Meteor.userId() } }).count(),
    currentUser: Meteor.user(),
  };
}, MyBooks);