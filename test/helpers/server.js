var server = require('../../index')

module.exports =
{ start: server.start
, stop: server.stop
, reset: reset
}

function reset(done) {
	done()
}
