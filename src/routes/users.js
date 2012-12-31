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
  , l10n = require('../l10n')
  , Q = require('q')
  , _ = require('underscore')

function createUser(req, res) {
	var user = req.user
	if(user) {
		if(req.body.role
		&& req.body.role != user.role
		) {
			return res.send(400, 'cannot change own role')
		}
		return storage.users.update(user, req.body)
			.then(function(user) {
				req.finc.msg = l10n.get('users', 'UPDATE OK')
				req.finc.status = 'ok'
				getUsers(req, res)
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
	return +val ? { id: +val } : { username: val }
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
		if(req.accepts('html')) {
			var data =
			    { users: users
			    }
			return res.render('users/list', data)
		}
		res.send(users.map(removeSecretProps.bind(null, req.user)))
	})
}

function updateUser(req, res) {
	var search = getUserQuery(req.params.id || req.user.id)
	if(( search.id == req.user.id
	  || search.username == req.user.username
	)
	&& req.body.role
	&& req.body.role != req.user.role
	) {
		return res.send(400, 'cannot change own role')
	}
	storage.users.update(search, req.body).then(function(user) {
		if(req.accepts('html')) {
			req.finc.msg = l10n.get('users', 'UPDATE OK')
			req.finc.status = 'ok'
			return getUser(req, res)
		}
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
