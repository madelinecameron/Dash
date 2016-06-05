Meteor.publish('currentEvents', () => {
	let currentDate = moment();
	let currentMonth = moment().month();
	let currentYear = moment().year();

	return Event.find({
		$or: [
			{ type: 'SHIPPING' },
			{
				active_start: {
					day: {
						$gt: currentDate.date(),
						$lt: currentDate.add(10, 'days')
					},
					month: {
						$gt: currentMonth,
						$lt: currentDate.month()
					},
					year: {
						$gt: currentYear,
						$lt: currentDate.year()
					}
				}
			}
		]
	})

	events = [ shippingEvents, nearEvents ];

	return events;
})