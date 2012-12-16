module.exports =
{ get: get
, getAll: getAll
, add: add
, update: update
, reset: reset
}

var Q = require('q')
  , db = require('./db')
  , md = new (require('showdown').converter)().makeHtml

function collection() {
	return db.collection('static')
}

function add(/* ...args*/) {
	var args = Array.prototype.slice.call(arguments)
	return Q.all(args.map(function(static) {
		return update(static.url, static)
	}))
}

function getAll() {
	return collection().invoke('find').invoke('toArray')
}

function update(key, data) {
	var query = { key: key }
	  , sort = []
	  , update = { $set: data }
	  , options = { new: true, upsert: true }
	data.key = key
	data.html = md(data.content)
	return collection()
		.invoke('findAndModify', query, sort, update, options)
		.get(0)
}

function get(key) {
	return collection()
		.invoke('findOne', { key: key })
}

function reset() {
	return collection().invoke('remove')
}
