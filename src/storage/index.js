exports = module.exports =
{ users: require('./users')
, events: require('./events')
, static: require('./static')
, games: require('./games')
, reset: reset
}

var Q = require('q')

function reset() {
	return Q.all(
	[ exports.users.reset()
	, exports.events.reset()
	, exports.static.reset()
	, exports.games.reset()
	])
}
