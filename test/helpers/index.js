var httpHelper = require('./http-helper')
  , server = require('./server')
  , storage = require('../../src/storage')

module.exports =
{ httpHelper: httpHelper
, server: server
, storage: storage
, common:
  { setup: setup
  }
}

function setup(mocha) {
	mocha.before(function() {
		return server.start(settings.server)
	})
	mocha.after(function() {
		return server.stop()
	})
	mocha.beforeEach(function() {
		return server.reset()
	})
}