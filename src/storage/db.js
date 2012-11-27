module.exports =
{ collection: collection
, setConnection: setConnection
, nextId: nextId
}

var Q = require('q')
  , unresolved = []
  , conn

function nextId(coll) {
	var keys = [ ]
	  , condition = null
	  , initial = { max: 0 }

	function reduce(obj, prev) {
		prev.max = Math.max(prev.max, obj.id)
	}
	return collection(coll)
		.invoke('group', keys, condition, initial, reduce)
		.then(function(args) {
			return (args.length ? args[0].max : 0) + 1
		})
}

function collection(name) {
	if(conn) {
		return conn.collection(name)
	}

	var deferred = Q.defer()
	unresolved.push({ deferred: deferred, name: name })
	return deferred.promise
}

function setConnection(c) {
	conn = c
	if(c) {
		unresolved.forEach(function(obj) {
			obj.deferred.promise.resolve(conn.collection(obj.name))
		})
		unresolved = []
	}
}
