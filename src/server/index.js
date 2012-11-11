module.exports =
{ start: start
, stop: stop
}

var express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)

  , routes = require('../routes')

function start(settings, done) {
	app.use(express.cookieParser())
	app.use(require('./render').middleware)
	app.engine('mustache', require('consolidate').hogan)
	app.set('view engine', 'mustache')
	routes.setup(app)
	server.listen(settings.port, done)
}
function stop(done) {
	server.close(done)
}
