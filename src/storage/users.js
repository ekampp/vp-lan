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

function reset() {
	users = {}
	return Q.resolve()
}

function add(data) {
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
	return Q.resolve(Object.keys(users).map(function(key) { return users[key] }))
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
			return user
		})
	} else {
		user = users[data.id || data]
	}
	if(user) {
		return Q.resolve(user)
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
