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
  , middleware = require('../middleware')

function start(settings) {
	if(!settings.port) {
		throw new Error('Port should be given.')
	}

	app.use(express.static('./client'))
	app.use(express.bodyParser())
	app.use(express.cookieParser())
	app.use(function(req, res, next) {
		req.finc = {}
		next()
	})
	require('../middleware').currentPage.setup(app)
	app.use(require('./render').middleware(app))
	app.use(middleware.auth.loadUser)
	routes.setup(app, settings)
	return Q.ninvoke(server, 'listen', settings.port)
}
function stop() {
	return Q.ninvoke(server, 'close')
}
