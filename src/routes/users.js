module.exports = function setup(app) {
	app.get('/users', middleware.auth.requireUser, getUsers)
	app.post(/^\/user(s?)$/, createUser)

	app.get('/user', middleware.auth.requireUser, getUser)
	app.get('/users/:id', middleware.auth.requireUser, getUser)

	app.put('/user', middleware.auth.requireUser, updateUser)
	app.put('/users/:id', middleware.auth.requireUser, updateUser)
	app.post('/users/:id', middleware.auth.requireUserRole('admin'), updateUser)
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

function getUserQuery(val) {
	return +val ? +val : { username: val }
}

function getUser(req, res) {
	if(req.params.id) {
		var search = getUserQuery(req.params.id)
		storage.users.get(search)
			.then(function(user) {
				user = removeSecretProps(req.user, user)
				if(req.user
				&& req.user.conformsToRole('admin')
				&& req.accepts('html')
				) {
					return res.render('users/profile-edit', user)
				}
				res.send(user)
			},
			function() {
				res.send(404)
			})
		return
	}
	var user = removeSecretProps(req.user, req.user)
	if(req.accepts('html')) {
		return res.render('users/profile-edit', user)
	}
	res.send(user)
}
function getUsers(req, res) {
	storage.users.getAll().then(function(users) {
		res.send(users.map(removeSecretProps.bind(null, req.user)))
	})
}

function updateUser(req, res) {
	var search = getUserQuery(req.params.id)
	storage.users.update(search, req.body).then(function(user) {
		res.send(200, user)
	})
}

function removeSecretProps(currentUser, user) {
	var attr = _(user.attributes).clone()
	delete attr._id
	delete attr.password
	attr['sel-current-role'] = function(role) {
		return role == this.role
		     ? 'selected'
		     : ''
	}
	attr['other-user'] = currentUser && currentUser.id != user.id
	return attr
}
