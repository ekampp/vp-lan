module.exports =
{ start: start
, stop: stop
}

var express = require('express')
  , http = require('http')
  , Q = require('q')
  , app = express()
  , server = http.createServer(app)

  , routes = require('../routes')

function start(settings, done) {
	if(!settings.port) {
		throw new Error('Port should be given.')
	}

	app.use(express.static('./client'))
	app.use(express.cookieParser())
	require('../middleware').currentPage.setup(app)
	app.use(require('./render').middleware(app))
	routes.setup(app)
	return Q.ninvoke(server, 'listen', settings.port)
}
function stop() {
	return Q.ninvoke(server, 'close')
}
