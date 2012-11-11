module.exports =
{ middleware: middleware
, auth: promise
}

var users = require('../storage').users
  , atob = require('atob')
  , Q = require('q')

function promise(req) {
	var data = req.header('Authorization')
	if(data) {
		data = atob(data.match(/.*? (.*)/)[1]).split(':')
		return users.auth(data[0], data[1])
	}
	return Q.reject()
}

function middleware(req, res, next) {
	promise(req)
		.then(function(user) {
			req.user = user
			return next()
		}, function(err) {
			res.send(401)
		})
}
