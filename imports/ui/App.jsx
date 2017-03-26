import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import { Books } from '../api/books.js';

import Book from './Book.jsx';
import MyBooks from './MyBooks.jsx';
import AllBooks from './AllBooks.jsx';
import Profile from './Profile.jsx';
import MySuccessfulTrades from './MySuccessfulTrades.jsx';
import Menu from './components/Menu.jsx';
import Home from './pages/Home.jsx';

class App extends Component {
  render() {
    return (
      <Router>
        <Grid>

          <Route render={({ history }) => <Menu history={history} />} />
          <Route exact path="/" render={() => <Home />} />

          <Route path="/mysuccessfultrades" component={MySuccessfulTrades} />

          <Route path="/profile" component={Profile} />

          <Route path="/mybooks" component={MyBooks} />

          <Route path="/allbooks" component={AllBooks} />

        </Grid>
      </Router>
    );
  }
}

App.propTypes = {
  books: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(
  () => {
    Meteor.subscribe('books');

    return {
      books: Books.find(
        {},
        {
          sort: { createdAt: -1 }
        }
      ).fetch()
    };
  },
  App
);
