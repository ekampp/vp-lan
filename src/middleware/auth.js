module.exports = auth

var users = require('../storage').users
  , atob = require('atob')

function auth(req, res, next) {
	var data = req.header('Authorization')
	if(data) {
		data = atob(data.match(/.*? (.*)/)[1]).split(':')
		users.auth(data[0], data[1])
			.then(function() {
				return next()
			}, function() {
				res.send(401)
			})
		return
	}

	res.send(401)
}
