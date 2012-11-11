module.exports =
{ setup: setup
}

var users = require('./users')
  , web = require('./web')

function setup(app, settings) {
	web(app, settings)
	users(app, settings)
}
