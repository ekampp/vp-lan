module.exports = function setup(app) {
	app.get('/seats/:event', getSeats)
	app.post('/seats/:event', middleware.auth.requireUser, occupySeat)
	app.put('/seats/:event/:id', updateSeat)
}

var storage = require('../storage')
  , bodyParser = require('express').urlencoded
  , middleware = require('../middleware')

function updateSeat() {}
function getSeats(req, res) {
	storage.events.get(req.params.event).get('seats').then(function(seats) {
		res.send(seats)
	})
}
function occupySeat(req, res) {
	storage.events.get(req.params.event)
		.then(function(event) {
			event.seats.forEach(function(seat) {
				if(seat.occupant == req.user.id) {
					delete seat.occupant
				}
			})
			return event.seats.find(function(seat) {
				return seat.id == req.body.seat
			})
		})
		.then(function(seat) {
			if(seat.occupant) {
				res.send(400, 'seat already taken')
				return
			}
			seat.occupant = req.user.id
			res.send(200, seat)
		})
		.done()
}
