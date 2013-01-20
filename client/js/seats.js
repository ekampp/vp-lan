VP.seats = (function() {
	var view

	return { init: init
	       , toggleSubmitButton: toggleSubmitButton
	       }

	function toggleSubmitButton() {
		var disabled = !VP.user || !this.seat
		$('.js-btn-occupy-seat').forEach(function(seat) {
			seat.disabled = disabled
		})
	}

	function init(event) {
		$.ajax('/views/events/tables', function(res) {
			view = res.body
		})
		$('.interactable.event-seats').on('click', '.seat', function(event) {
			var seat = event.currentTarget
			  , seatId = seat.getAttribute('data-id')
			if(seat.className.match(/(^| )seat--occupied($| )/)) {
				// todo: notify user of error
				console.log('err')
				return
			}
			if(this.seat) {
				$('.seat[data-id="' + this.seat.id + '"]')
					.removeClass('seat--selected')
			}
			if(this.seat && this.seat.id == seatId) {
				this.seat = null
			} else {
				this.seat = { id: seatId }
				$('.seat[data-id="' + this.seat.id + '"]')
					.addClass('seat--selected')
			}
			this.toggleSubmitButton()
		}.bind(this))

		// We do not allow selecting seats if there is no user
		// The server should respond with 401 anyway!
		if(!VP.user) {
			return
		}
		$('.js-btn-occupy-seat').on('click', function() {
			var seatId = this.seat.id
			$.ajax(
				{ url: '/seats/' + event
				, method: 'post'
				, json: { seat: seatId }
				}, function() {
					$.ajax('/seats/' + event, function(res) {
						var compiled = $.to_html(view, { 'tables': tablesArr(res.body) } )
						$('.event-seats').html(compiled)
					})
				})
		}.bind(this))
	}

	function tablesArr(seats) {
		var tables = []
		  , added = 1
		for(var i = 0; i < seats.length; i+=4) {
			var table = { show: true }
			for(var j = 1; j <= 4; j++) {
				var seat = seats[i+j-1]
				table['occupant-' + j] = !!seat.occupant
				table['occupant-' + j + '-name'] = seat['occupant-name']
				table['seat-' + j + '-id'] = seat.id
			}
			tables.push(table)
			added ++
			if(added == 4) {
				added = 0
				tables.push({ show: false })
			}
		}
		return tables
	}
})()
