;(function() {
	$.page('/events/:id', function(ctx) {
		// setup seat functionality
		VP.seats.init(ctx.params.id)
	})
})()
