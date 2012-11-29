module.exports =
{ get: get
, update: update
, reset: reset
}

var Q = require('Q')
  , db = require('./db')

function collection() {
	return db.collection('static')
}

function update(key, data) {
	var query = { key: key }
	  , sort = []
	  , update = { $set: data }
	  , options = { new: true }
	data.key = key
	return collection()
		.invoke('findAndModify', query, sort, update, options)
		.get(0)
}

function get(key) {
	return collection()
		.invoke('findOne', { key: key })
}

function reset() {
	return collection().invoke()
}
