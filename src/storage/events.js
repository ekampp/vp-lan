module.exports =
{ add: add
, get: get
, getAll: getAll
, update: update
, reset: reset
}

var Q = require('q')
  , Event = require('../models').Event
  , events = {}
  , nextId = 1

function add(event) {
	if(!event.id) {
		event.id = nextId++
	}
	if(event.seats) {
		event.seats.find = function(func) {
			var itm
			if(!this.some(function(item) {
				itm = item
				return func(item)
			}))
			{
				itm = null
			}
			return itm
		}
	}
	events[event.id] = event
	return new Event(event).resolveDependencies()
}
function get(id) {
	var event = new Event(events[id])
	if(!event) {
		Q.reject('not found')
	}
	return event.resolveDependencies()
}
function getAll() {
	return Q.all(Object.keys(events).map(function(key) {
		return new Event(events[key]).resolveDependencies()
	}))
}
function update() {}
function reset() {
	events = {}
	return Q.resolve()
}
