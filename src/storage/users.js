module.exports =
{ add: add
, get: get
, getAll: getAll
, update: update
, auth: auth
, reset: reset
}

var Q = require('q')
  , users = {}
  , nextId = 1
  , User = require('../models').User

function reset() {
	users = {}
	nextId = 1
	return Q.resolve()
}

function add(data) {
	if(arguments.length > 1) {
		return Q.all(Array.prototype.map.call(arguments, function(user) {
			return add(user)
		}))
	}
	if(!data.username) {
		return Q.reject('no username')
	}
	if(!data.id) {
		data.id = nextId
	}
	nextId = Math.max(data.id, nextId) + 1
	users[data.id] = data
	return Q.resolve(data)
}

function update(user, data) {
	delete users[user.username]
	Object.keys(data).forEach(function(key) {
		user[key] = data[key]
	})
	users[user.username] = user
	return Q.resolve(user)
}

function getAll() {
	return Q.all(Object.keys(users).map(function(key) {
		return new User(users[key]).resolveDependencies()
	}))
}

function get(data) {
	var user
	if(data.username) {
		return getAll().then(function(users) {
			var user
			if(!users.some(function(u) {
				user = u
				return u.username === data.username
			})) {
				throw new Error('unknown user')
			}
			return new User(user).resolveDependencies()
		})
	} else {
		user = users[data.id || data]
	}
	if(user) {
		return new User(user).resolveDependencies()
	} else {
		return Q.reject(new Error('unknown user'))
	}
}

function auth(username, password) {
	return get({ username: username }).then(function(user) {
		if(user && user.password == password) {
			return user
		}
		throw new Error('unknown credentials')
	})
}
