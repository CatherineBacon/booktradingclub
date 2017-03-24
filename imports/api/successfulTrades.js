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
  'successfulTrades.insert'(firstBook, secondBook) {
    check(firstBook, Object);
    check(secondBook, Object);

    SuccessfulTrades.insert({
      books: [
        {
          title: firstBook.title,
          id: firstBook._id,
          previousOwner: firstBook.owner,
          previousUsername: firstBook.username
        },
        {
          title: secondBook.title,
          id: secondBook._id,
          previousOwner: secondBook.owner,
          previousUsername: secondBook.username
        }
      ],
      createdAt: new Date()
    });
  }
});
