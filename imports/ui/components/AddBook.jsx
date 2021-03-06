import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { SimpleSelect } from 'react-selectize';
import { _ } from 'lodash';
import googleBooks from 'google-books-search';
import { Form, FormGroup, FormControl } from 'react-bootstrap';

import '/node_modules/react-selectize/themes/index.css';

export default class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBook: null,
      options: []
    };
    // Debounced version of search so we don't hit api too much
    this.handleSearch = _.debounce(this._search, 500);
  }

  handleChange(selection) {
    const selectedBook = _.get(selection, 'value', null);

    this.setState({
      selectedBook
    });

    if (!selectedBook) return;

    Meteor.call('books.insert', selectedBook, err => {
      if (err) {
        return console.log(err.reason);
      }
      this.setState({
        selectedBook: null
      });
    });
  }

  _search(search) {
    // Performs search via google books api
    if (!search) {
      return this.setState({ options: [] });
    }
    googleBooks.search(search, (error, results) => {
      if (error) {
        return console.log(error);
      }
      this.setState({ options: results });
    });
  }

  bookToOption(book) {
    if (!book) return null;

    const authors = _.get(book, 'authors');
    const label = authors
      ? `${book.title} - ${authors.join(', ')}`
      : book.title;
    return {
      label,
      value: book
    };
  }

  render() {
    const { options, selectedBook } = this.state;
    const mappedOptions = options.map(this.bookToOption);

    return (
      <SimpleSelect
        placeholder="Search for Title or Author"
        options={mappedOptions}
        onSearchChange={this.handleSearch.bind(this)}
        onValueChange={this.handleChange.bind(this)}
        theme="bootstrap3"
        value={this.bookToOption(selectedBook)}
      />
    );
  }
}
