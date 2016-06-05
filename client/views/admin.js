import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

let shipments = new ReactiveVar();
let displayTexts = new ReactiveVar();
let activeWebhooks = new ReactiveVar();
let daysUntil = new ReactiveVar();

Template.adminPanel.onCreated(() => {
});

Template.adminPanel.helpers({
	events() {
		console.log("GETTING EVENTS ", Event.find().fetch())
		return Event.find().fetch();
	},
	banks() {
		return Meteor.call('getBanks');
	},
	shipments() {
		Meteor.call('getShipments', (err, result) => {
			shipments.set(result);
		});
		return shipments.get();
	},	
	displayTexts() {
		Meteor.call('getEventType', 'TEXT', (err, text) => {
			displayTexts.set(text);
		});
		return displayTexts.get();
	},
	activeWebhooks() {
		Meteor.call('getEventType', 'WEBHOOK', (err, text) => {
			activeWebhooks.set(text);
		});
		return activeWebhooks.get();
	},
	pollingInterval() {
		if(this.data.pollingInterval < 60) {
			return this.data.pollingInterval.toString().concat(" ", this.data.pollingInterval == 1 ? "minute" : "minutes");
		}
		else if(this.data.pollingInterval < 1440) {
			return (this.data.pollingInterval / 60).toString().concat(" ", this.data.pollingInterval == 60 ? "hour" : "hours");
		}
		else {
			return (this.data.pollingInterval / 1440).toString().concat(" ", this.data.pollingInterval == 1440 ? "day" : "days");
		}
	},
	daysUntil() {
		Meteor.call('getEventType', 'UNTIL', (err, text) => {
			daysUntil.set(text);
		});
		return daysUntil.get();
	}
});

Template.adminPanel.events({
	'click #login': () => {
		let username = $('#username').val();
		let password = $('#password').val();

		Meteor.loginWithPassword($('#username').val(), $('#password').val());

	},
	'click #submitShippingNumber': () => {
		Meteor.call('addShipment', $('#shippingNumber').val());
	},
	'click #submitText': () => {
		Event.insert({
			type: 'TEXT',
			data: {
				text: $('#textDisplay').val()
			}
		})
	},
	'click #submitWebhook': () => {
		Event.insert({
			type: 'WEBHOOK',
			data: {
				url: $('#webhookURL').val(),
				pollingInterval: $('#frequency').val()
			}
		})
	},
	'click #submitDaysUntil': () => {
		Event.insert({
			type: 'UNTIL',
			data: {
				date: $('#date').val(),
				title: $('#daysUntilTitle').val()
			}
		})
	},
	'click .removeBtn': (e) => {
		Event.remove({ _id: e.currentTarget.id });
	}
});