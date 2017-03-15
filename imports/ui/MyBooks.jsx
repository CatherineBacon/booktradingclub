import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Books } from '../api/books.js';

export default class extends Component {
	handleSubmit(event) {
	    event.preventDefault();

	    const title = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
	    const author = ReactDOM.findDOMNode(this.refs.authorInput).value.trim();

	    Books.insert({
	      title,
	      author,
	      createdAt: new Date(),
	      owner: Meteor.userId(),
	      username: Meteor.user().username,
	    });

	    // clear form
	    ReactDOM.findDOMNode(this.refs.titleInput).value = '';
	    ReactDOM.findDOMNode(this.refs.authorInput).value = '';
	  }

	render() {
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
	}

}