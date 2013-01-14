VP.seats = (function() {
	var view

	return { init: init
	       , toggleSubmitButton: toggleSubmitButton
	       }

	function toggleSubmitButton() {
		$$('.js-btn-occupy-seat').disabled = !VP.user || !this.seat
	}

	function init(event) {
		$.ajax('/views/events/seats', function(res) {
			view = res.body
		})
		$('.interactable.event-seats').on('click', '.seat', function(event) {
			var seat = event.currentTarget
			  , seatId = seat.dataset.id
			if(seat.classList.contains('seat--occupied')) {
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
						var compiled = $.to_html(view, { 'seats-arr': seatsArr(res.body) } )
						$('.event-seats').html(compiled)
						console.log('seat updated..')
					})
				})
		}.bind(this))
	}

	function seatsArr(seats) {
		var rows = []
		seats.forEach(function(seat) {
			arrAtRow(seat.position[1]).seats[seat.position[0]] = seat
		})
		for(var i = 0; i < rows.length; i++) {
			rows[i] = arrAtRow(i)
		}
		return rows

		function arrAtRow(idx) {
			if(!rows[idx]) {
				rows[idx] = { seats: [] }
			}
			return rows[idx]
		}
	}
})()
