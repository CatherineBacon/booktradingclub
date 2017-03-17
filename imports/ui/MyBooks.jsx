import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Books } from '../api/books.js';

import Book from './Book.jsx';

export default class extends Component {
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

	render() {
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
				</div>
			);
		} else {
			return <div>Please login</div>
		}

	}

}