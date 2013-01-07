module.exports =
{ setup: setup
}

var users = require('./users')
  , web = require('./web')
  , events = require('./events')
  , seats = require('./seats')
  , staticPages = require('./static-pages')
  , games = require('./games')
  , views = require('./views')
  , texts = require('./texts')
  , Q = require('q')

function setup(app, settings) {
	return Q.all(
	[ web(app, settings)
	, users(app, settings)
	, events(app, settings)
	, seats(app, settings)
	, staticPages(app, settings)
	, games(app, settings)
	, views(app, settings)
	, texts(app, settings)
	])
}
