module.exports = function setup(app) {
	app.post('/games', middleware.auth.requireUserRole('admin'), updateGame)
	app.get('/games/:id?', getGame)
	app.del('/games/:id', middleware.auth.requireUserRole('admin'), deleteGame)

	app.get('/admin/games', middleware.auth.requireUserRole('admin'), showAdmin)
}

var storage = require('../storage')
  , middleware = require('../middleware')
  , l10n = require('../l10n')

function deleteGame(req, res) {
	storage.games.remove(req.params.id)
		.then(function() {
			res.send(201)
		})
}

function updateGame(req, res) {
	var game = req.body
	storage.games.store(game).then(function(game) {
		if(req.accepts('html')) {
			req.finc.msg = l10n.get('admin', 'GAMES UPDATE OK')
			req.finc.status = 'ok'
			return getGame(req, res)
		}
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
			if(req.accepts('html')) {
				var view
				if(Array.isArray(data)) {
					data = data.filter(function(game) {
						return game.visibility == 'visible'
					})
					view = 'games/list'
					data =
					{ games: data
					, 'static-text': 'bla'
					}
				} else {
					if(data.visibility == 'hidden') {
						return res.send(404)
					}
					view = 'games/item'
				}
				return res.render(view, data)
			}
			res.send(data)
		}, function() {
			res.send(404)
		}
	)
}

function showAdmin(req, res) {
	storage.games.getAll().then(function(games) {
		res.render('admin/games', { games: games })
	})
}
