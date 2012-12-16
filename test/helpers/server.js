var server = require('../../index')
  , storage = require('../../src/storage')
  , Q = require('q')
  , dataSetters = require('./test-data')

module.exports =
{ start: server.start
, stop: server.stop
, reset: reset
, setData: setData
}

function reset() {
	return storage.reset()
}

function addData(type) {
	return dataSetters(type)
}

function setData(type) {
	return reset().then(addData.bind(null, type))
}
