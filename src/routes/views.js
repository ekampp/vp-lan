module.exports = function setup(app, settings) {
	app.get(/\/views\/(.*)/, getView)
	views = settings.views
}

var Q = require('q')
  , fs = require('fs')
  , path = require('path')
  , views

function getView(req, res) {
	fs.readFile(path.join(views, req.params[0] + '.mustache'), 'utf8', function(err, contents) {
		if(err) {
			return res.send(404)
		}
		res.set('Content-Type', 'text/plain')
		res.send(contents)
	})
}