var Model = require('./Model')
  , _ = require('underscore')
  , Q = require('q')
  , storage = { users: require('../storage/users') }
  , defineGetSetters = require('./utils').defineGetSetters

module.exports = Model.extend(
	{ resolveDependencies: resolveDependencies
	, private: [ '_id' ]
	, calculated: [ '!occupant', 'occupant-name' ]
	}
)

defineGetSetters(module.exports.prototype,
	  [ 'occupant'
	  , 'position'
	  , 'facing'
	  , 'occupant-name'
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
