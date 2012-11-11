var server = require('../../index')
  , storage = require('../../src/storage')
  , Q = require('q')
  , dataSetters =
    { basic: setDataBasic
    }

module.exports =
{ start: server.start
, stop: server.stop
, reset: reset
, setData: setData
}

function reset() {
	return storage.reset()
}

function setData(type) {
	var setter = dataSetters[type]
	if(!setter) {
		throw new Error('Unknown data setter: ' + type)
	}
	return reset().then(setter)
}

function setDataBasic() {
	storage.users.add(
	  { username: 'a'
	  , password: '1'
	  }
	)
	return Q.resolve()
}
