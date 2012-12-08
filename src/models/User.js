var Backbone = require('backbone')
  , _ = require('underscore')
  , Q = require('q')
  , defineGetSetters = require('./utils').defineGetSetters

module.exports = Backbone.Model.extend(
	{ resolveDependencies: resolveDependencies
	, conformsToRole: conformsToRole
	}
)

function conformsToRole(role) {
	if(role == 'user') {
		return true
	}
	if(this.role == 'super') {
		return true
	}
	if(role == 'admin' && this.role == 'admin') {
		return true
	}
	return false
}

defineGetSetters(module.exports.prototype, ['username','password', 'name', 'role'])

function resolveDependencies() {
	return Q.resolve(this)
}
