module.exports =
{ add: add
, get: get
, getAll: getAll
, update: update
, remove: remove
, auth: auth
, reset: reset
}

var Q = require('q')
  , _ = require('underscore')
  , db = require('./db')
  , nextId = 0
  , User = require('../models').User

function collection() {
	return db.collection('users')
}

function reset() {
	nextId = 0
	return collection().invoke('remove')
}

function updateNextId() {
	return db.nextId('users')
		.then(function(id) {
			nextId = id
		})
}

function add(data) {
	var allData = arguments
	if(!nextId) {
		return updateNextId()
			.then(function() {
				return add.apply(null, allData)
			})
	}
	if(arguments.length > 1) {
		return Q.all(Array.prototype.map.call(arguments, function(user) {
			return add(user)
		}))
	}
	if(!data.id) {
		data.id = nextId
	}
	if(!data.role) {
		data.role = 'user'
	}
	nextId = Math.max(data.id, nextId) + 1
	if(!data.username) {
		return Q.reject('no username')
	}
	data = ensureValidUserData(data)
	return get({ username: data.username })
		.then(function() {
			throw new Error('username taken')
		},
		function() {
			return collection()
				.invoke('insert', data)
				.then(function(data) {
					return new User(data[0]).resolveDependencies()
				})
		})
}

function remove(user) {
	var query = { username: user.username || user }
	return get(query).then(function(user) {
		return require('../storage').events.getAll()
			.then(function(events) {
				return Q.all(events.map(function(event) {
					return event.unseatUser(user)
				}))
			})
			.then(function() {
				return collection().invoke('remove', query)
			})
	})
}

function update(user, data) {
	var query
	  , sort = []
	  , data = ensureValidUserData(data)
	  , update = { $set: data }
	  , options = { new: true }
	  , duplicateUsernamePromise
	if(user.username) {
		query = { username: user.username }
		if(data.username && user.username == data.username) {
			duplicateUsernamePromise = Q.resolve()
		}
	} else {
		query = { id: user.id || user }
	}
	if('password' in data && !data.password) {
		delete data.password
	}
	if(!data.username && !duplicateUsernamePromise) {
		duplicateUsernamePromise = Q.resolve()
	}
	if(!duplicateUsernamePromise) {
		duplicateUsernamePromise = Q.all(
			[ get(query)
			, get({ username: data.username })
		])
	}
	return duplicateUsernamePromise
		.then(function(users) {
			if(users && users[0].id != users[1].id) {
				throw new Error('duplicate username')
			}
		} , function() {
		})
		.then(function() {
			return collection()
				.invoke(
					  'findAndModify'
					, query
					, sort
					, update
					, options
				)
				.get(0)
				.then(function(data) {
					return new User(data).resolveDependencies()
				})
		})
}

function getAll() {
	return collection()
		.invoke('find')
		.invoke('toArray')
		.then(function(u) {
			return Q.all(u.filter(function(u) {
				return u.role != 'super'
			}).map(function(user) {
				return new User(user).resolveDependencies()
			}))
		})
}

function get(data) {
	var query
	if(data.username) {
		query = { usernameIdx: data.username.toLowerCase() }
	} else {
		query = { id: +(data.id || data) }
	}
	return collection()
		.invoke('findOne', query)
		.then(function(user) {
			if(!user) {
				throw new Error('unknown user')
			}
			return new User(user).resolveDependencies()
		})
}

function auth(username, password) {
	return get({ username: username }).then(function(user) {
		if(user && user.password == password) {
			return user
		}
		throw new Error('unknown credentials')
	})
}

function ensureValidUserData(data) {
	var d = _(data).clone()
	if(d.username) {
		d.usernameIdx = d.username.toLowerCase()
	}
	return d
}
