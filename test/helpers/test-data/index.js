module.exports = setData

function setData(type) {
	var setter = require('./' + type)
	if(!setter) {
		throw new Error('Unknown data setter: ' + type)
	}
	return setter()
}
