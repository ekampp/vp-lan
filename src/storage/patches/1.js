module.exports =
{ id: 1
, task: 'Ensure all users have roles'
, act: act
}

function act(db) {
	db.collection('users').invoke(
	  'update'
	, { role: null }
	, { $set: { role: 'user' } }
	)
	return Q.resolve()
}
