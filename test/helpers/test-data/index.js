module.exports = setData

var setters =
    { basic: require('./basic')
    }

function setData(type) {
	var setter = setters[type]
	if(!setter) {
		throw new Error('Unknown data setter: ' + type)
	}
	return setter()
}
