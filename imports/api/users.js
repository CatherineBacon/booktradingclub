import { Meteor } from 'meteor/meteor';

if(Meteor.isServer && this.userId) {
	Meteor.publish('Meteor.users.additionalinfo', function () {
		return Meteor.users.find(
			{ _id: this.userId },
			{ fields: {
				'realName': 1
			} }
		)
	});
}


/** Meteor.subscribe('Meteor.users.additionalinfo') **/
