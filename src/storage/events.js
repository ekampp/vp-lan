module.exports =
{ add: add
, get: get
, getAll: getAll
, update: update
, reset: reset
}

var events =
    [ { id: 1
      , name: 'December 2012'
      , start: '2012-12-07T19:00:00'
      , end: '2012-12-09T14:00:00'
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
