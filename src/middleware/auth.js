module.exports =
{ requireUser: requireUser
, requireUserRole: requireUserRole
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

function rejectRequest(req, res, code) {
	if(req.accepts('html')) {
		return res.render(
			  'users/access-form'
			, { action: 'login', 'btn-text': 'Login' }
			, function(err, html) {
				res.send(code, html)
			}
		)
	}
	res.send(code)
}

function requireUser(req, res, next) {
	if(req.user) {
		return next()
	}
	rejectRequest(req, res, 401)
}

function requireUserRole(role) {
	return function(req, res, next) {
		if(!req.user) {
			return rejectRequest(req, res, 401)
		}
		if(req.user.conformsToRole(role)) {
			return next()
		}
		rejectRequest(req, res, 403)
	}
}
