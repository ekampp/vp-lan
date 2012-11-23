module.exports =
{ collection: collection
, setConnection: setConnection
}

var Q = require('q')
  , unresolved = []
  , conn

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
