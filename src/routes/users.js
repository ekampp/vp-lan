module.exports = function setup(app) {
	app.get('/users', middleware.auth.requireUser, getUsers)
	app.post(/\/user(s?)/, createUser)

	app.get('/user', middleware.auth.requireUser, getUser)
	app.get('/users/:id', middleware.auth.requireUser, getUser)

	app.put('/user', middleware.auth.requireUser, updateUser)
	app.put('/users/:id', middleware.auth.requireUser, updateUser)
}

var middleware = require('../middleware')
  , storage = require('../storage')
  , Q = require('q')
  , _ = require('underscore')

function createUser(req, res) {
	var user = req.user
	if(user) {
		return storage.users.update(user, req.body)
			.then(function() {
				res.redirect('/')
			})
	} else {
		return storage.users.add(req.body)
			.then(function(user) {
				res.cookie('x-user-token', user.id)
				res.redirect('/')
			},
			function() {
				res.send(400)
			})
	}
}
function getUser(req, res) {
	if(req.params.id) {
		var search = +req.params.id
			? +req.params.id
			: { username: req.params.id }
		storage.users.get(search)
			.then(function(user) {
				res.send(removeSecretProps(user))
			},
			function() {
				res.send(404)
			})
		return
	}
	res.send(removeSecretProps(req.user))
}
function getUsers(req, res) {
	storage.users.getAll().then(function(users) {
		res.send(users.map(removeSecretProps))
	})
}
function updateUser() {}

function removeSecretProps(user) {
	var attr = _(user.attributes).clone()
	delete attr._id
	delete attr.password
	return attr
}
