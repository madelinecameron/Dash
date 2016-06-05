Event.allow({
	insert: (userId, doc) => {
		return userId;
	},
	remove: (userId, doc) => {
		return userId;
	}
})