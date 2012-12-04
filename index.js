module.exports =
{ start: start
, stop: stop
}

var server = require('./src/server')
  , mongo = require('q-mongodb')
  , Q = require('q')
  , path = require('path')

  , db
  , l10n = require('./src/l10n')
  , staticAnalysis = require('./src/static-analysis')
  , storage = require('./src/storage/db')

if(require.main === module) {
	var settings =
	    { web:
	      { port: process.env.PORT || 8080
	      , views: path.join(__dirname, 'views')
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
	  , l10nPromise = l10n.init()
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
	promises.push(l10nPromise)
	if(settings.web.views) {
		l10nPromise
			.then(function() {
				return staticAnalysis.l10n.unmetRefs(settings.web.views, l10n.get)
			})
			.then(function(unmetRefs) {
				if(0 == unmetRefs.length) {
					return
				}
				console.warn('There are l10n refs in use that are not translated:\n', unmetRefs)
			})
	}
	return Q.all(promises)
}

function stop() {
	return Q.all(
		[ server.stop()
		, db.database ? mongo.closeAll() : Q.resolve()
		]
	)
}
