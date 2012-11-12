exports = module.exports =
{ users: require('./users')
, events: require('./events')
, reset: reset
}

var Q = require('q')

function reset() {
	return Q.all(
	[ exports.users.reset()
	, exports.events.reset()
	])
}
