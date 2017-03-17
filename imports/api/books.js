import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Books = new Mongo.Collection('books');

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
		});
	},

	'books.remove'(bookId) {
		check(bookId, String);

		Books.remove(bookId);
	},

	'books.toggleTradeProposed'(bookId, tradeProposed) {
		check(bookId, String);
		check(tradeProposed, Boolean);

		Books.update(bookId, { $set: { tradeProposed: tradeProposed} });
	},
});