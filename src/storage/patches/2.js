module.exports =
{ id: 2
, task: 'Ensure all users have usernameIdx'
, act: act
}

var Q = require('q')

function act(db) {
	return db.collection('users')
		.invoke('find')
		.invoke('toArray')
		.then(function(users) {
			return Q.all(users.map(function(user) {
				var query = { _id: user._id }
				  , update = { $set: { usernameIdx: user.username.toLowerCase() } }
				  , sort = []
				return db.collection('users').invoke(
				  'update'
				, query
				, update
				)
			}))
		})
}
