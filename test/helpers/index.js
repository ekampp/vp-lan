var httpHelper = require('./http-helper')
  , server = require('./server')

module.exports =
{ httpHelper: httpHelper
, server: server
, common:
  { setup: setup
  }
}

function setup(mocha) {
	mocha.before(function(done) {
		server.start(settings.server, done)
	})
	mocha.after(function(done) {
		server.stop(done)
	})
	mocha.beforeEach(function(done) {
		server.reset(done)
	})
}