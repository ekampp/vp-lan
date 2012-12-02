var Backbone = require('backbone')
  , _ = require('underscore')
  , Q = require('q')
  , Seats = require('./Seats')
  , defineGetSetters = require('./utils').defineGetSetters

module.exports = Backbone.Model.extend(
	{ resolveDependencies: resolveDependencies
	, save: save
	}
)

defineGetSetters(module.exports.prototype, ['start', 'end', 'seats'])

function save() {
	var data = this.attributes
	data.seats = data.seats.map(function(seat) {
		var attr = seat.attributes
		delete attr._id
		return attr
	})
	delete data._id
	return require('../storage').events.update(this.id, data)
}

function resolveDependencies() {
	this.seats = new Seats(this.seats)
	return this.seats.resolveDependencies()
		.then(function() {
			return this
		}.bind(this))
}
