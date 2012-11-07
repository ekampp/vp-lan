module.exports =
{ add: add
, get: get
, auth: auth
}

var users = {}
  , Q = require('q')

function add(data) {
	users[data.username] = data
	return Q.resolve(data)
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
			return true
		}
		throw new Error('unknown credentials')
	})
}
