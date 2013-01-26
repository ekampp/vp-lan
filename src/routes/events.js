module.exports = function setup(app) {
	app.get('/event', function(req, res) {
		req.params.id = 1
		getEvent(req, res)
	})
	app.get('/events', getEvents)
	app.post('/events', middleware.auth.requireUser, addEvent)

	app.get('/events/add', middleware.auth.requireUser, showEventForm)

	app.get('/events/:id', getEvent)
	app.put('/events/:id', middleware.auth.requireUser, updateEvent)
}

var storage = require('../storage')
  , middleware = require('../middleware')
  , format = require('util').format
  , Q = require('q')

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
	Q.all(
	[ storage.events.get(req.params.id)
	, storage.static.get('event').get('html')
	]).then(function(args) {
		var event = args[0]
		  , text = args[1]
		event.text = text
		if(req.accepts('html')) {
			var partials =
			    { seats: 'events/tables'
			    , 'seats-legend': 'events/seats-legend'
			    }
			res.render('events/item', transformEvent(event), partials)
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
	event['tables'] = (function(seats) {
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
	})(event.seats.toArray())

	return event
}
