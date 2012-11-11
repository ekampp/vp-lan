exports = module.exports =
{ users: require('./users')
, reset: reset
}

function reset() {
	return exports.users.reset()
}
