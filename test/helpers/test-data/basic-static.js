module.exports = function() {
	return storage.static.reset().then(setData)
}

var Q = require('q')
  , storage = require('../../../src/storage')

function setData() {
	return storage.static.add(
	         { url: '/'
	         , key: 'k1'
	         , content: 'abc'
	         }
	       , { url: '/a'
	         , key: 'k2'
	         , content: 'def'
	         }
	       )
}
