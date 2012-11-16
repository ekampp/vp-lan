module.exports =
{ add: add
, get: get
, getAll: getAll
, update: update
, reset: reset
}

var Q = require('q')
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
	return Q.resolve(event)
}
function get(id) {
	var event = events[id]
	if(!event) {
		Q.reject()
	}
	return Q.resolve(event)
}
function getAll() {
	return Q.resolve(Object.keys(events).map(function(key) {return events[key]}))
}
function update() {}
function reset() {
	events = {}
	return Q.resolve()
}
