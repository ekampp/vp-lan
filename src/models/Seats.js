var Backbone = require('backbone')
  , _ = require('underscore')
  , Q = require('q')
  , Seat = require('./Seat')

module.exports = Backbone.Collection.extend(
	{ model: Seat
	, resolveDependencies: resolveDependencies
	}
)

function resolveDependencies() {
	return Q.all(this.map(function(seat) {
		return seat.resolveDependencies()
	}))
}
