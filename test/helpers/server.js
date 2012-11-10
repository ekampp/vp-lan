var server = require('../../index')
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

function reset(done) {
	done()
}

function setData(type) {
	var setter = dataSetters[type]
	if(!setter) {
		throw new Error('Unknown data setter: ' + type)
	}
	return setter()
}

function setDataBasic() {
	return Q.resolve()
}
