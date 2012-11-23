module.exports =
{ add: add
, get: get
, getAll: getAll
, update: update
, auth: auth
, reset: reset
}

var Q = require('q')
  , db = require('./db')
  , nextId = 1
  , User = require('../models').User

function collection() {
	return db.collection('users')
}

function reset() {
	nextId = 1
	return collection().invoke('remove')
}

function add(data) {
	if(arguments.length > 1) {
		return Q.all(Array.prototype.map.call(arguments, function(user) {
			return add(user)
		}))
	}
	if(!data.username) {
		return Q.reject('no username')
	}
	if(!data.id) {
		data.id = nextId
	}
	nextId = Math.max(data.id, nextId) + 1
	return collection()
		.invoke('insert', data)
		.then(function(data) {
			return new User(data[0]).resolveDependencies()
		})
}

function update(user, data) {
	var query = { id: user.id }
	  , sort = []
	  , update = { $set: data }
	  , options = { new: true }
	return collection()
		.invoke(
			  'findAndModify'
			, query
			, sort
			, update
			, options
		)
		.then(function(data) {
			return new User(data[0]).resolveDependencies()
		})
}

function getAll() {
	return collection()
		.invoke('find')
		.invoke('toArray')
		.then(function(u) {
			return Q.all(u.map(function(user) {
				return new User(user).resolveDependencies()
			}))
		})
}

function get(data) {
	var query
	if(data.username) {
		query = { username: data.username }
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
