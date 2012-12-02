module.exports =
{ requireUser: requireUser
, loadUser: loadUser
}

var users = require('../storage').users
  , atob = require('atob')
  , Q = require('q')

function promise(req) {
	var data
	if(req.cookies && req.cookies['x-user-token']) {
		return users.get(req.cookies['x-user-token'])
	}
	if(data = req.header('Authorization')) {
		data = atob(data.match(/.*? (.*)/)[1]).split(':')
		return users.auth(data[0], data[1])
	}
	return Q.reject()
}

function loadUser(req, res, next) {
	promise(req)
		.then(function(user) {
			req.user = user
			next()
		}, function() {
			next()
		})
}

function requireUser(req, res, next) {
	if(req.user) {
		return next()
	}

	if(req.accepts('html')) {
		return res.render(
			  'users/access-form'
			, { action: 'login', 'btn-text': 'Login' }
			, function(err, html) {
				res.send(401, html)
			}
		)
	}
	res.send(401)
}
