VP.seats = (function() {

	return { init: init
	       , toggleSubmitButton: toggleSubmitButton
	       }

	function toggleSubmitButton() {
		$$('.js-btn-occupy-seat').disabled = !this.occupantName || !this.seat
	}

	function init(event) {
		$('.event-seats').on('click', '.event-seats__row__seat', function(event) {
			var seat = event.target
			  , seatId = seat.dataset.id
			if(seat.classList.contains('event-seats__row__seat--occupied')) {
				// todo: notify user of error
				console.log('err')
				return
			}
			if(this.seat) {
				$('.event-seats__row__seat[data-id="' + this.seat.id + '"]')
					.removeClass('event-seats__row__seat--selected')
			}
			if(this.seat && this.seat.id == seatId) {
				this.seat = null
			} else {
				this.seat = { id: seatId }
				$('.event-seats__row__seat[data-id="' + this.seat.id + '"]')
					.addClass('event-seats__row__seat--selected')
			}
			this.toggleSubmitButton()
		}.bind(this))
		$('.js-occupant-name').on('change', function(event) {
			this.occupantName = event.target.value
			this.toggleSubmitButton()
		}.bind(this))
		$('.js-btn-occupy-seat').on('click', function() {
			var occupantName = $('.js-occupant-name').val()
			  , seatId = this.seat.id
			$.ajax(
				{ url: '/seats/' + event
				, method: 'post'
				, data: { seat: seatId, occupant: occupantName }
				})
				.then(function() {
					console.log('seat updated..')
				})
		}.bind(this))
	}
})()
