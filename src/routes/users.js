module.exports = function setup(app) {
	app.get('/users', auth, getUsers)
	app.post('/users', createUser)
	app.post('/user', createUser)

	app.get('/user', auth, getUser)
	app.get('/users/:id', auth, getUser)

	app.put('/user', auth, updateUser)
	app.put('/users/:id', auth, updateUser)
}

var auth = require('../middleware/auth')

function createUser() {}
function getUser() {}
function getUsers() {}
function updateUser() {}
