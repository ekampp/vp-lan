module.exports = function setup(app) {
	app.get('/seats/:event', getSeats)
	app.put('/seats/:event/:id', updateSeat)
}

var storage = require('../storage')

function updateSeat() {}
function getSeats(req, res) {
	storage.events.get(req.params.event).get('seats').then(function(seats) {
		res.send(seats)
	})
}
