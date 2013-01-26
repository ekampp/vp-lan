module.exports =
{ id: 3
, task: 'Rename keys on all static pages'
, act: act
}

var Q = require('q')
  , keys =
    { '/': 'main'
    , '/games': 'games'
    , '/info': 'info'
    }

function act(db) {
	return db.collection('static')
		.invoke('find')
		.invoke('toArray')
		.then(function(pages) {
			return Q.all(pages.map(function(page) {
				var query = { _id: page._id }
				  , update = { $set: { key: keys[page.url] || page.url } }
				  , sort = []
				return db.collection('static').invoke(
				  'update'
				, query
				, update
				)
			}))
		})
}
