module.exports = function setup(app) {
	app.get('/users', auth, getUsers)
	app.post(/\/user(s?)/, bodyParser(), createUser)

	app.get('/user', auth, getUser)
	app.get('/users/:id', auth, getUser)

	app.put('/user', auth, updateUser)
	app.put('/users/:id', auth, updateUser)
}

var auth = require('../middleware/auth')
  , bodyParser = require('express').urlencoded
  , storage = require('../storage')

function createUser(req, res) {
	storage.users.add(req.body)
	res.send(200)
}
function getUser(req, res) {
	res.send(200)
}
function getUsers() {}
function updateUser() {}
