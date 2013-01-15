module.exports = function() {
	return Q.all(
	         [ users()
	         , storage.events.reset()
	         ]
	       ).then(setData)
}

var Q = require('q')
  , storage = require('../../../src/storage')
  , users = require('./basic-users')

function setData() {
	return storage.events.add(
	         { id: 1
	         , name: 'December 2012'
	         , start: '2012-12-07T19:00:00+01:00'
	         , end: '2012-12-09T14:00:00+01:00'
	         , tables:
	             '.| .|\n'
	           + '.| .|\n'
	           + '.| .|\n'
	           + '\n'
	           + '...\n'
	           + '---\n'
	           + '\n'
	           + '...\n'
	           + '---\n'
	         , seats:
	           [ { id: 1
	             , occupant: 2
	             }
	           , { id: 2
	             }
	           , { id: 3
	             }
	           ]
	         }
	       )
}
