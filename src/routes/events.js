module.exports = function setup(app) {
	app.get('/events', getEvents)
	app.post('/events', middleware.auth.requireUser, addEvent)

	app.get('/events/add', middleware.auth.requireUser, showEventForm)

	app.get('/events/:id', getEvent)
	app.put('/events/:id', middleware.auth.requireUser, updateEvent)
}

var storage = require('../storage')
  , middleware = require('../middleware')
  , format = require('util').format

function getEvents(req, res) {
	storage.events.getAll().then(function(events) {
		if(req.accepts('html')) {
			res.render('events/list', { events: events.map(transformEvent) })
			return
		}
		res.send(events)
	})
	.done()
}

function showEventForm(req, res) {
	res.render('events/form')
}

function addEvent(req, res) {
	storage.events.add(req.body)
		.then(function(event) {
			res.send(200, event)
		})
		.done()
}

function updateEvent(req, res) {
	storage.events.update(req.params.id, req.body)
		.then(function(event) {
			res.send(event)
		})
		.fail(function(err) {
			if(err.message == 'not found') {
				return res.send(404)
			}
			res.send(500)
		})
}

function getEvent(req, res) {
	storage.events.get(req.params.id).then(function(event) {
		if(req.accepts('html')) {
			res.render('events/item', transformEvent(event), { seats: 'events/seats' })
			return
		}
		res.send(event)
	})
	.done()
}

function transformEvent(event) {
	var from = new Date(event.start)
	  , to = new Date(event.end)
	  , sameMonth = from.getMonth() == to.getMonth()
	event['friendly-when'] = format(
		  '%s/%s - %s/%s'
		, from.getDate()
		, from.getMonth()+1
		, to.getDate()
		, to.getMonth()+1)
	event['seats-left'] = function() {
		var left = this.seats.filter(function(seat) {
			return !seat.occupant
		}).length
		return left == 1 ? '1 seat left' : left + ' seats left'
	}
	event['seats-arr'] = (function(seats) {
		var rows = []
		seats.forEach(function(seat) {
			arrAtRow(seat.position[1]).seats[seat.position[0]] = seat
		})
		return rows

		function arrAtRow(idx) {
			if(!rows[idx]) {
				rows[idx] = { seats: [] }
			}
			return rows[idx]
		}
	})(event.seats)

	return event
}
