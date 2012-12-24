module.exports = function() {
	return storage.users.reset().then(setData)
}

var Q = require('q')
  , storage = require('../../../src/storage')

function setData() {
	return storage.users.add(
	         { id: 1
	         , username: 'a'
	         , password: '1'
	         , role: 'admin'
	         }
	       , { id: 2
	         , username: 'b'
	         , password: '2'
	         , role: 'user'
	         }
	       )
}
