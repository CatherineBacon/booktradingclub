import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class extends Component {
	handleSubmit(event) {
	    event.preventDefault();

	    const title = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
	    const author = ReactDOM.findDOMNode(this.refs.authorInput).value.trim();

	    this.props.addBook(title, author);

	    // clear form
	    ReactDOM.findDOMNode(this.refs.titleInput).value = '';
	    ReactDOM.findDOMNode(this.refs.authorInput).value = '';
	  }

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
	        		{this.props.books.title}
				</div>
			);
		} else {
			return <div>Please login</div>
		}

	}

}