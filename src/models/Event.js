var Backbone = require('backbone')
  , _ = require('underscore')
  , Q = require('q')
  , Seats = require('./Seats')
  , defineGetSetters = require('./utils').defineGetSetters

module.exports = Backbone.Model.extend(
	{ resolveDependencies: resolveDependencies
	}
)

defineGetSetters(module.exports.prototype, ['start', 'end', 'seats'])

function resolveDependencies() {
	this.seats = new Seats(this.seats)
	return this.seats.resolveDependencies()
		.then(function() {
			return this
		}.bind(this))
}
