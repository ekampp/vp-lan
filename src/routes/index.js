module.exports =
{ setup: setup
}

var users = require('./users')
  , web = require('./web')
  , events = require('./events')

function setup(app, settings) {
	web(app, settings)
	users(app, settings)
	events(app, settings)
}
