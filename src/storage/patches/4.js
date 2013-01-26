module.exports =
{ id: 4
, task: 'Add static page for current event'
, act: act
}

var Q = require('q')

function act(db) {
	return db.collection('static')
		.invoke('findOne', { key: 'event' })
		.then(function(page) {
			// Bail; page is already set
			if(page) {
				return
			}
			return db.collection('static').invoke('insert',
			{ key: 'event'
			, url: '/event'
			, name: 'Tilmelding'
			, content: '15. - 17. februar\n----'
			, html: '<h2>15. - 17. februar</h2>'
			})
		})
}
