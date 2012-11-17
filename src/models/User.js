var Backbone = require('backbone')
  , _ = require('underscore')
  , Q = require('q')

module.exports = Backbone.Model.extend(
	{ resolveDependencies: resolveDependencies
	}
)

module.exports.prototype
	= defineGetSetters(module.exports.prototype, ['username','password'])

function resolveDependencies() {
	return Q.resolve(this)
}

function defineGetSetters(obj, properties) {
	properties.forEach(function(property) {
		obj.__defineSetter__(property, function(val) {
			this.set(property, val)
		})
		obj.__defineGetter__(property, function() {
			return this.get(property)
		})
	})
	return obj
}
