import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Books = new Mongo.Collection('books');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('books', function booksPublication() {
    return Books.find();
  });
}

Meteor.methods({
  'books.insert'(title, author) {
    check(title, String);
    check(author, String);

    // make sure user is logged in before inserting book
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Books.insert({
      title,
      author,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      tradeProposed: false,
      proposedById: '',
      proposedByUsername: ''
    });
  },

  'books.declineTrade'(book) {
    Books.update(book._id, {
      $set: {
        tradeProposed: false,
        proposedById: '',
        proposedByUsername: ''
      }
    });
  },

  'books.tradeBooks'(firstBook, secondBookId) {
    check(firstBook, Object);
    check(secondBookId, String);

    if (firstBook.owner != Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    let secondBook = Books.find({ _id: secondBookId }).fetch();

    let ownerOne = firstBook.owner;
    let usernameOne = firstBook.username;
    let ownerTwo = secondBook[0].owner;
    let usernameTwo = secondBook[0].username;

    Books.update(firstBook._id, {
      $set: {
        owner: ownerTwo,
        username: usernameTwo,
        tradeProposed: false,
        proposedById: '',
        proposedByUsername: ''
      }
    });
    Books.update(secondBookId, {
      $set: {
        owner: ownerOne,
        username: usernameOne,
        tradeProposed: false,
        proposedById: '',
        proposedByUsername: ''
      }
    });
  },

  'books.remove'(book) {
    check(book._id, String);
    check(book.owner, String);

    if (book.owner != Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Books.remove(book._id);
  },

  'books.toggleTradeProposed'(book) {
    check(book._id, String);
    check(book.tradeProposed, Boolean);
    check(book.owner, String);

    if (!book.tradeProposed && Meteor.userId() == book.owner) {
      throw new Meteor.Error('not-authorized');
    }

    let proposedById = '';
    let proposedByUsername = '';
    if (!book.tradeProposed) {
      proposedById = Meteor.userId();
      proposedByUsername = Meteor.user().username;
    }

    if (book.tradeProposed && Meteor.userId() != book.proposedById) {
      throw new Meteor.Error('not-authorized');
    }

    Books.update(book._id, {
      $set: {
        tradeProposed: !book.tradeProposed,
        proposedById: proposedById,
        proposedByUsername: proposedByUsername
      }
    });
  }
});
