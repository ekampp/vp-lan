module.exports = function setup(app) {
	app.get('/users', auth.middleware, getUsers)
	app.post(/\/user(s?)/, bodyParser(), createUser)

	app.get('/user', auth.middleware, getUser)
	app.get('/users/:id', auth.middleware, getUser)

	app.put('/user', auth.middleware, updateUser)
	app.put('/users/:id', auth.middleware, updateUser)
}

var auth = require('../middleware/auth')
  , bodyParser = require('express').urlencoded
  , storage = require('../storage')
  , Q = require('q')

function createUser(req, res) {
	auth.auth(req).then(
		function(user) {
			return storage.users.update(user, req.body)
				.then(function() {
					res.send(200)
				})
		},
		function() {
			return storage.users.add(req.body)
				.then(function() {
					res.send(200)
				})
		})
}
function getUser(req, res) {
	res.send(200)
}
function getUsers() {}
function updateUser() {}
