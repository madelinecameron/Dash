import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.dashboard.onCreated(function helloOnCreated() {
});

Template.dashboard.helpers({
	events() {
		console.log("GETTING EVENTS ", Event.find().fetch())
		return Event.find().fetch();
	}
});

Template.dashboard.events({
});