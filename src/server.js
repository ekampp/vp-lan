module.exports =
{ start: start
, stop: stop
}

var express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)

  , routes = require('./routes')

function start(settings, done) {
	routes.setup(app)
	server.listen(settings.port, done)
}
function stop(done) {
	server.close(done)
}
