module.exports =
{ run: run
}

var glob = require('glob')
  , Q = require('q')

function run(db) {
	return Q.all(
	[ db.collection('patches').invoke('findOne')
	, Q.nfcall(glob, '*.js', { cwd: __dirname })
	])
		.then(function(args) {
			var patches = args[0] || { current: 0 }
			  , files = args[1]
			  , promise = Q.resolve()
			  , highestId = patches.current
			files
				.map(function(file) {
					if(file == 'index.js') {
						return
					}
					return require('./' + file)
				})
				.filter(function(patch) {
					return patch && patch.id > patches.current
				})
				.sort(function(a,b) {
					return a.id-b.id
				})
				.forEach(function(patch) {
					promise.then(patch.act.bind(patch, db))
					highestId = patch.id
				})
			return promise.then(function() {
				return db.collection('patches')
					.invoke('update', { a: 1 }, { a: 1, current: highestId }, { upsert: true })
			})
		})
}
