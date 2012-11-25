module.exports =
{ add: add
, get: get
, getAll: getAll
, update: update
, reset: reset
}

var Q = require('q')
  , db = require('./db')
  , Event = require('../models').Event
  , nextId = 1

function collection() {
	return db.collection('events')
}

function add(event) {
	if(!event.id) {
		event.id = nextId
	}
	if(event.seats) {
		event.seats = event.seats.map(function(seat) {
			seat.position = seat.position.map(function(p) { return +p })
			seat.facing = +seat.facing
			return seat
		})
	}
	nextId = Math.max(event.id, nextId) + 1
	return collection()
		.invoke('insert', event)
		// insert always returns arrays
		.get(0)
		.then(function(data) {
			return new Event(data).resolveDependencies()
		})
}
function get(id) {
	return collection()
		.invoke('findOne', { id: +id })
		.then(function(event) {
			if(!event) {
				throw new Error('not found')
			}
			return new Event(event).resolveDependencies()
		})
}
function getAll() {
	return collection()
		.invoke('find')
		.invoke('toArray')
		.then(function(events) {
			return Q.all(events.map(function(event) {
				return new Event(event).resolveDependencies()
			}))
		})
}
function update() {}
function reset() {
	return collection().invoke('remove')
}
