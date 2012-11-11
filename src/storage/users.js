module.exports =
{ add: add
, get: get
, update: update
, auth: auth
, reset: reset
}

var users = {}
  , Q = require('q')

function reset() {
	users = {}
	return Q.resolve()
}

function add(data) {
	users[data.username] = data
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

function get(username) {
	var user = users[username]
	if(user) {
		return Q.resolve(user)
	} else {
		return Q.reject(new Error('unknown user'))
	}
}

function auth(username, password) {
	return get(username).then(function(user) {
		if(user && user.password == password) {
			return user
		}
		throw new Error('unknown credentials')
	})
}
