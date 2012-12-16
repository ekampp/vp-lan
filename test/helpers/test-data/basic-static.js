module.exports = setData

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
