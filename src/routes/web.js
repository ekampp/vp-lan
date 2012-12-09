module.exports = function setup(app) {
	app.get('/', static)
	app.get('/info', static)
	//app.get('/', render('index'))
	app.get('/signup', render('users/access-form', { action: 'users', 'btn-text': 'Signup' }))
	app.get('/login', render('users/access-form', { action: 'login', 'btn-text': 'Login' }))
	app.post('/login', login)
	app.get('/logout', logout)
}

var bodyParser = require('express').urlencoded
  , storage = require('../storage')

function login(req, res) {
	var data = req.body
	storage.users.auth(data.username, data.password)
		.then(
			function(user) {
				res.cookie('x-user-token', user.id)
				res.redirect('/')
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
	var key = req.path
	storage.static
		.get(key)
		.then(function(data) {
			req.currentPage = data.name
			res.render('static', data)
		})
}

function logout(req, res) {
	res.clearCookie('x-user-token')
	res.redirect('/')
}
function render(view, data) {
	return function(req, res) {
		res.render(view, data)
	}
}
