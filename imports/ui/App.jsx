import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Grid, Row, Panel, Col, PageHeader } from 'react-bootstrap';

import { Books } from '../api/books.js';

import Book from './Book.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import MyBooks from './MyBooks.jsx';
import AllBooks from './AllBooks.jsx';
import Profile from './Profile.jsx';
import MySuccessfulTrades from './MySuccessfulTrades.jsx';
import Menu from './components/Menu.jsx';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">

          <Route render={({ history }) => <Menu history={history} />} />

          <h5 className="pull-right"><AccountsUIWrapper /></h5>

          <Route
            exact
            path="/"
            render={() => (
              <Grid>
                <Row>
                  <PageHeader>
                    Welcome to Book Exchange!
                  </PageHeader>
                </Row>
                <Row>
                  <Col sm={6}>
                    <Panel>Catalogue your books online</Panel>
                  </Col>
                  <Col sm={6}>
                    <Panel>See all of the books our users own</Panel>
                  </Col>
                  <Col sm={6}>
                    <Panel>
                      Request to borrow other users books
                    </Panel>
                  </Col>
                  <Col sm={6}>
                    <Panel>
                      Manage trades with users from all over the word
                    </Panel>
                  </Col>
                </Row>
              </Grid>
            )}
          />

          <Route path="/mysuccessfultrades" component={MySuccessfulTrades} />

          <Route path="/profile" component={Profile} />

          <Route path="/mybooks" component={MyBooks} />

          <Route path="/allbooks" component={AllBooks} />

        </div>
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
