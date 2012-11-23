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
	    , database:
	      { port: process.env.MONGO_NODE_DRIVER_PORT || 27017
	      , host: process.env.MONGO_NODE_DRIVER_HOST || 'localhost'
	      , name: process.env.DB_NAME || 'finc-vp-lan'
	      }
	    }
	start(settings)
		.then(function() {
			return require('./test/helpers/server').setData('basic')
		})
		.then(function() {
			console.log('Web server running at port %s', settings.web.port)
		})
		.done()
}

function start(settings) {
	var promises = []
	if(settings.database) {
		var dbPromise = mongo.db(
		      settings.database.name
		    , settings.database.host
		    , settings.database.port
		    )
		promises.push(dbPromise.then(function(database) {
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
