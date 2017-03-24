import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const SuccessfulTrades = new Mongo.Collection('successfulTrades');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('successfulTrades', function tradesPublication() {
    return SuccessfulTrades.find();
  });
}

Meteor.methods({
  'succesfulTrades.insert'(firstBook, secondBook, owner, trader) {
    SuccesfulTrades.insert({
      swapped: [(title: 'title')],
      gained: [
        (title: 'new book'),
        (preiousOwner: 'trader'),
        (previousUsername: 'trader')
      ],
      createdAt: new Date()
    });
  }
});
