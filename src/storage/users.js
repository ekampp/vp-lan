module.exports =
{ add: add
, get: get
, auth: auth
}

var users = {}

function add(data) {
	users[data.username] = data
	return data
}

function get(username) {
	return users[username]
}

function auth(username, password) {
	var user = get(username)
	return user && user.password == password
}
