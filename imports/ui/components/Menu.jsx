import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Nav, NavItem, Navbar, Row, Col } from 'react-bootstrap';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

export default class Menu extends Component {
  handleSelect(eventKey, event) {
    event.preventDefault();

    const routes = [
      '/',
      '/mybooks',
      '/mysuccessfultrades',
      '/allbooks',
      'profile'
    ];

    this.props.history.push(routes[eventKey]);
  }

  render() {
    return (
      <Row>
        <Col>
          <Navbar inverse>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">Book Exchange!</a>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav onSelect={this.handleSelect.bind(this)} pullRight>
              <NavItem eventKey={0} href="#">Home</NavItem>
              <NavItem eventKey={1} href="#">My Books</NavItem>
              <NavItem eventKey={2} href="#">
                My Succesful Trades
              </NavItem>
              <NavItem eventKey={3} href="#">All Books</NavItem>
              <NavItem eventKey={4} href="#">Profile</NavItem>
            </Nav>
          </Navbar>

          <h5 className="pull-right"><AccountsUIWrapper /></h5>
        </Col>
      </Row>
    );
  }
}
