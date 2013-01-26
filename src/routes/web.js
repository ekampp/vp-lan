module.exports = function setup(app) {
	app.get('/', static)
	app.get('/info', static)
	//app.get('/', render('index'))
	app.get('/signup', render(
	  'users/profile-edit'
	))
	app.get('/login', render(
	  'users/access-form'
	, { action: 'login'
	  , 'btn-text': l10n.get('users', 'BTN LOGIN')
	  }
	))
	app.post('/login', login)
	app.get('/logout', logout)
}

var bodyParser = require('express').urlencoded
  , storage = require('../storage')
  , l10n = require('../l10n')
  , _ = require('underscore')

function login(req, res) {
	var data = req.body
	storage.users.auth(data.username, data.password)
		.then(
			function(user) {
				res.cookie('x-user-token', user.id)
				res.redirect('/event')
			},
			function() {
				res.render(
				  'users/access-form'
				, { action: 'login', 'btn-text': 'Login', msg: 'Login failed' }
				, function(err, html) { res.send(401, html) }
				)
			}
		)
}

function static(req, res) {
	var url = req.path
	storage.static
		.getAll()
		.then(function(data) {
			data = _(data).find(function(row) {
				return row.url == url
			})
			if(req.accepts('html')) {
				req.currentPage = data.name
				res.render('static', data)
			} else {
				res.send(data)
			}
		})
		.done()
}

function logout(req, res) {
	res.clearCookie('x-user-token')
	res.redirect('/event')
}
function render(view, data) {
	return function(req, res) {
		res.render(view, data)
	}
}
