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