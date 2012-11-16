module.exports = function setup(app) {
	app.get('/events', getEvents)
	app.post('/events', addEvent)

	app.get('/events/:id', getEvent)
	app.put('/events/:id', updateEvent)
}

var storage = require('../storage')
  , format = require('util').format

function getEvents(req, res) {
	storage.events.getAll().then(function(events) {
		if(req.accepts('html')) {
			res.render('events/list', { events: events.map(transformEvent) })
			return
		}
		res.send(events)
	})
}
function addEvent() {}

function updateEvent() {}
function getEvent(req, res) {
	storage.events.get(req.params.id).then(function(event) {
		if(req.accepts('html')) {
			res.render('events/item', transformEvent(event))
			return
		}
		res.send(event)
	})
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
			return !!seat.occupant
		}).length
		return left == 1 ? '1 seat left' : left + ' seats left'
	}
	return event
}
