module.exports = function() {
	return storage.static.reset().then(setData)
}

var Q = require('q')
  , storage = require('../../../src/storage')

function setData() {
	return storage.static.add(
	         { url: '/'
	         , content: 'abc'
	         }
	       , { url: '/a'
	         , content: 'def'
	         }
	       )
}
