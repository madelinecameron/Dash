const Forecast = new (require('forecast.io'))({
  APIKey: process.env.FORECAST_IO_KEY
});
const easypost = require('node-easypost')(process.env.EASYPOST_KEY);
const plaidEnv = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'https://tartan.plaid.com';
const Plaid = require('plaid');
const plaid = new Plaid.Client(process.env.PLAID_KEY, process.env.PLAID_SECRET, plaidEnv);
const async = require('async');

Meteor.methods({
	getShipment: (shipmentCode) => {
		easypost.Tracker.retrieve({ 
		    tracking_code: shipmentCode
		  }, function (err, tracking) {
		    console.log("TRACKING: ", err, tracking);
		});
	},
	getBanks: () => {
		async.parallel([
			(done) => {
				Plaid.getInstitutions(plaidEnv, (err, result) => {
					console.log(err, result);
					done();
				});
			},
			(done) => {
				plaid.getLongtailInstitutions({}, (err, result) => {
					console.log("ERR: ", err, result);
					done();
				});
			}
		], (err, results) => {
			if(err) {
				console.log("An error occurred:", err);
			}
			else {
				console.log(results);
			}
		})
	},
	addShipment: (trackingCode) => {
		console.log("CARRIER: ", shippingCompany(trackingCode))
		easypost.Tracker.create({
			tracking_code: trackingCode,
			carrier: shippingCompany(trackingCode)
		}, (err, res) => {
			if(err) console.log("Error occurred:", err);
			return;
		});
	},
	getShipments: () => {
		var Future = Npm.require("fibers/future");
  		var fut = new Future();
		easypost.Tracker.all({}, (err, shipments) => {
			if(err) console.log("Error occurred:", err);
			fut.return(shipments.trackers);
		});
		return fut.wait()
	},
	getShipment: (trackingCode) => {
		easypost.Tracker.retrieve({
			tracking_code: trackingCode
		}, (err, shipment) => {
			if(err) console.log("Error occurred:", err);
			return shipment;
		})
	},
	getEventType: (type) => {
		return Event.find({
			type: type
		}).fetch();
	}
})

const shippingCompany = (trackingCode) => {
	if(trackingCode.match(/(1Z)(\d{16})/)) return 'UPS';
	if(trackingCode.match(/^[0-9]{12,22}$/)) return 'FEDEX';
	if(trackingCode.match(/\b(94|92)(0|7)(0|5|7|8|2)(1|5|3|8)(\d{17})/) || trackingCode.match(/(EA)(\d{9})(US)/)) return 'USPS';
}