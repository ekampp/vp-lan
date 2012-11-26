module.exports = setData

var Q = require('q')
  , storage = require('../../../src/storage')

function setData() {
	return Q.all(
	[ storage.users.add(
	    { id: 1
	    , username: 'a'
	    , password: '1'
	    }
	  , { id: 2
	    , username: 'b'
	    , password: '2'
	    }
	  )
	, storage.events.add(
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
	        , position: [ 0, 0 ]
	        , occupant: 2
	        , facing: 0
	        }
	      , { id: 2
	        , position: [ 0, 1 ]
	        , facing: 0
	        }
	      , { id: 3
	        , position: [ 0, 2 ]
	        , facing: 0
	        }
	      ]
	    }
	  )
	]
	)
}
