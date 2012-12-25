module.exports =
{ store: store
, add: store
, update: store
, get: get
, getAll: getAll
, reset: reset
}

var Q = require('q')
  , db = require('./db')
  , nextId

function collection() {
	return db.collection('games')
}

function reset() {
	nextId = 0
	return collection().invoke('remove')
}

function updateNextId() {
	return db.nextId('games')
		.then(function(id) {
			nextId = id
		})
}

function getAll() {
	return collection()
		.invoke('find')
		.invoke('toArray')
}
function get(id) {
	var query = { id: +id }
	return collection()
		.invoke(
		  'findOne'
		, query
		)
		.then(function(game) {
			if(!game) {
				throw new Error('unknown game')
			}
			return game
		})
}

function store(/*...games*/) {
	var games = arguments
	  , game = games[0]
	  , addingNew
	if(!nextId) {
		return updateNextId()
			.then(function() {
				return store.apply(null, games)
			})
	}
	if(games.length > 1) {
		return Q.all(Array.prototype.map.call(games, function(game) {
			return store(game)
		}))
	}
	if(!game.id) {
		game.id = nextId
		addingNew = true
	}
	nextId = Math.max(game.id, nextId) + 1
	if(addingNew) {
		return collection()
			.invoke('insert', game)
			.get(0)
	} else {
		var query = { id: game.id }
		  , sort = []
		  , data = { $set: game }
		  , options = { new: true }
		return collection()
			.invoke('findAndModify', query, sort, data, options)
	}
}
