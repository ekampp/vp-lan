module.exports = function setup(app) {
	app.get('/events', getEvents)
	app.post('/events', addEvent)

	app.get('/events/:id', getEvent)
	app.put('/events/:id', updateEvent)
}

var storage = require('../storage')

function getEvents(req, res) {
	storage.events.getAll().then(function(events) {
		res.send(events)
	})
}
function addEvent() {}

function updateEvent() {}
function getEvent() {}
