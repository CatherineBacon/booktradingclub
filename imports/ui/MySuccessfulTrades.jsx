import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Row, Col, PageHeader } from 'react-bootstrap';

import { SuccessfulTrades } from '../api/successfulTrades.js';

class MySuccessfulTrades extends Component {
  render() {
    return (
      <Row>
        <Col>
          <PageHeader>My Successful Trades</PageHeader>
        </Col>
        {this.props.successfulTrades.map(trade => (
          <p key={trade._id}>
            {trade.ownerBookTitle}
            {' '}
            traded for
            {' '}
            {trade.traderBookTitle}
            {' '}
            with
            {' '}
            {trade.traderUsername} {moment(trade.createdAt).fromNow()}
          </p>
        ))}
      </Row>
    );
  }
}

MySuccessfulTrades.propTypes = {
  successfulTrades: PropTypes.array.isRequired
};

export default createContainer(
  () => {
    Meteor.subscribe('successfulTrades');

    return {
      successfulTrades: SuccessfulTrades.find(
        { owner: Meteor.userId() },
        {
          sort: { createdAt: -1 }
        }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  MySuccessfulTrades
);
