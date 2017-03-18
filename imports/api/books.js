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

		if(!book.tradeProposed && Meteor.userId()==book.owner){
			throw new Meteor.Error('not-authorized');
		}
		Books.update(book._id, { $set: { tradeProposed: !book.tradeProposed} });
	},
});