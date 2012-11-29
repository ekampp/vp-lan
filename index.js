module.exports =
{ start: start
, stop: stop
}

var server = require('./src/server')
  , mongo = require('q-mongodb')
  , Q = require('q')
  , db
  , storage = require('./src/storage/db')

if(require.main === module) {
	var settings =
	    { web:
	      { port: process.env.PORT || 8080
	      }
	    , database: process.env.MONGO_URL || 'mongodb://localhost:27017/finc-vp-lan'
	    }
	start(settings)
		.then(function() {
			console.log('Web server running at port %s', settings.web.port)
		})
		.done()
}

function start(settings) {
	var promises = []
	if(settings.database) {
		promises.push(mongo.connect(settings.database).then(function(database) {
			db = database
			storage.setConnection(database)
			return Q.resolve()
		}))
	} else {
		return Q.reject('no database given')
	}
	promises.push(server.start(settings.web))
	return Q.all(promises)
}

function stop() {
	return Q.all(
		[ server.stop()
		, db.database ? mongo.closeAll() : Q.resolve()
		]
	)
}
