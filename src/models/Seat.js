var Backbone = require('backbone')
  , _ = require('underscore')
  , Q = require('q')
  , storage = { users: require('../storage/users') }
  , defineGetSetters = require('./utils').defineGetSetters

module.exports = Backbone.Model.extend(
	{ resolveDependencies: resolveDependencies
	}
)

defineGetSetters(module.exports.prototype,
	  [ 'occupant'
	  , 'position'
	  , 'facing'
	  ]
)

function resolveDependencies() {
	if(this.get('occupant')) {
		return storage.users.get(this.get('occupant'))
			.then(function(user) {
				this['!occupant'] = user
				this['occupant-name'] = user.get('username')
				return this
			}.bind(this))
	}
	return Q.resolve(this)
}
