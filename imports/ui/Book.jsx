import React, { Component, PropTypes } from 'react';

// Book component - represents a single book
export default class Book extends Component {
  render() {
    return (
      <li>Title: {this.props.book.title} Author: {this.props.book.author}</li>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
};
