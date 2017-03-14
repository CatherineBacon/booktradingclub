import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Books } from '../api/books.js';

import Book from './Book.jsx'
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideTradeProposed: false,
    };
  }

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
    return (
      <div className='container'>
        <header>
          <h1>Book Exchange!</h1>
        </header>

        <AccountsUIWrapper />

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
  }
}

App.propTypes = {
  books: PropTypes.array.isRequired,
  availableToTradeCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  return {
    books: Books.find({}, {
      sort: { createdAt: -1 }
    }).fetch(),
    availableToTradeCount: Books.find({ tradeProposed: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
