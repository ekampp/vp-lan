exports = module.exports =
{ users: require('./users')
, events: require('./events')
, static: require('./static')
, reset: reset
}

var Q = require('q')

function reset() {
	return Q.all(
	[ exports.users.reset()
	, exports.events.reset()
	, exports.static.reset()
	])
}
