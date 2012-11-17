;(function() {
	var container = $$('.event-seats')
	  , deferred = $.defer()

	if(!container) {
		return
	}

	drawLegend($.create('<h2>Legend</h2><canvas>').appendTo(container).get(1))
	var canvas = $.create('<h2>Seats</h2><canvas>').appendTo(container).get(1)

	$.ajax(
	  { url: '/seats/1'
	  , success: deferred.resolve
	  , error: deferred.reject
	  , headers: { Accept: 'application/json' }
	  }
	)
	deferred.promise.then(function(seats) {
		drawSeats(canvas, seats)
	})
})()
