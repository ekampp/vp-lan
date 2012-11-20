module.exports =
{ connection: connection
, setConnection: setConnection
}

var Q = require('q')
  , unresolved = []
  , conn

function connection() {
	if(conn) {
		return Q.resolve(conn)
	}

	var deferred = Q.defer()
	unresolved.push(deferred)
	return deferred.promise
}
function setConnection(c) {
	conn = c
	if(c) {
		unresolved.forEach(function(deferred) {
			deferred.resolve(conn)
		})
		unresolved = []
	}
}
