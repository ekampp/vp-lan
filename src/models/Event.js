var Backbone = require('backbone')
  , _ = require('underscore')
  , Q = require('q')
  , defineGetSetters = require('./utils').defineGetSetters

module.exports = Backbone.Model.extend(
	{ resolveDependencies: resolveDependencies
	}
)

defineGetSetters(module.exports.prototype, ['start', 'end', 'seats'])

function resolveDependencies() {
	return Q.resolve(this)
}
