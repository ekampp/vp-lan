var Model = require('./Model')
  , _ = require('underscore')
  , Q = require('q')
  , Seats = require('./Seats')
  , defineGetSetters = require('./utils').defineGetSetters

module.exports = Model.extend(
	{ resolveDependencies: resolveDependencies
	, save: save
	, private: [ '_id' ]
	, initialize: init
	, unseatUser: unseatUser
	}
)

defineGetSetters(module.exports.prototype, ['start', 'end', 'seats'])

function init(data) {
	this.seats = new Seats(this.seats)
}

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
	return this.seats.resolveDependencies()
		.then(function() {
			return this
		}.bind(this))
}

function unseatUser(user) {
	var seat = this.seats.find(function(seat) {
		return seat.occupant == user.id
	})
	if(!seat) {
		return Q.resolve()
	}
	seat.occupant = null
	return this.save()
}
