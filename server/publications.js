Meteor.publish('currentEvents', () => {
	return Event.find();
})