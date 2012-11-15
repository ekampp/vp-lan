module.exports =
{ setup: setup
}

var users = require('./users')
  , web = require('./web')
  , events = require('./events')
  , seats = require('./seats')
  , Q = require('q')

function setup(app, settings) {
	return Q.all(
	[ web(app, settings)
	, users(app, settings)
	, events(app, settings)
	, seats(app, settings)
	])
}
