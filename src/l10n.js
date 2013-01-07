module.exports =
{ init: init
, get: get
}

var Q = require('q')
  , json

// Some language storages, such as mongo, is not run synchroneously,
// so we need to call an init method to load languages before calling
// get from mustache, which is inherently sync.
function init() {
	json = require('../l10n/da/strings')
	return Q.resolve()
}

function get(table, key) {
	if(!json) {
		throw new Error('l10n.init() has not been called')
	}
	table = json[table]
	if(!key) {
		return table
	}
	return (table && table[key]) || key
}
