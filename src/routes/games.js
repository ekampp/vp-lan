module.exports = function setup(app) {
	app.post('/games', middleware.auth.requireUserRole('admin'), updateGame)
	app.get('/games/:id?', getGame)
}

var storage = require('../storage')
  , middleware = require('../middleware')

function updateGame(req, res) {
	var game = req.body
	storage.games.store(game).then(function(game) {
		res.send(200, game);
	})
	.done()
}

function getGame(req, res) {
	var promise
	if(req.params.id) {
		promise = storage.games.get(req.params.id)
	} else {
		promise = storage.games.getAll()
	}
	promise.then(
		function(data) {
			res.send(data)
		}, function() {
			res.send(404)
		}
	)
}
