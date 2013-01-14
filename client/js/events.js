;(function() {
	$.page('/event', function(ctx) {
		// setup seat functionality
		var eventId = 1//ctx.params.id
		VP.seats.init(eventId)
	})
})()
