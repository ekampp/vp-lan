module.exports =
{ setup: setup
}

var users = require('./users')

function setup(app, settings) {
	users(app, settings)
}
