module.exports = function setup(app) {
	app.get('/', render('index'))
	app.get('/signup', render('users/form', { action: 'users', 'btn-text': 'Signup' }))
	app.get('/login', render('users/form', { action: 'login', 'btn-text': 'Login' }))
	app.post('/login', bodyParser(), login)
}

var bodyParser = require('express').urlencoded
  , storage = require('../storage')

function login(req, res) {
	var data = req.body
	storage.users.auth(data.username, data.password)
		.then(
			function(user) {
				res.cookie('x-user-token', user.username)
				res.redirect('/')
			},
			function() {
				res.render(
				  'signup'
				, { action: 'login', 'btn-text': 'Login', msg: 'Login failed' }
				, function(err, html) { res.send(401, html) }
				)
			}
		)
}

function render(view, data) {
	return function(req, res) {
		res.render(view, data)
	}
}
