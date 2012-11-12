module.exports =
{ add: add
, get: get
, getAll: getAll
, update: update
, reset: reset
}

var events =
    [ { id: 1
      , start: '2012-12-05T19:00:00'
      , end: '2012-12-07T14:00:00'
      }
    ]
  , Q = require('q')

function add() {}
function get() {
	return Q.resolve(events[0])
}
function getAll() {
	return Q.resolve(events)
}
function update() {}
function reset() {
	return Q.resolve()
}
