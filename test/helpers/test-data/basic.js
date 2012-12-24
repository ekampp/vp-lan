module.exports = setData

var Q = require('q')
  , storage = require('../../../src/storage')

function setData() {
	console.warn('Deprecated!! Use specific test-data instead')
	return require('./basic-events')()
}
