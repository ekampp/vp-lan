module.exports =
{ middleware: middleware
, setup: setup
}

function setup(app) {
	app.use('/events', middleware('events'))
	app.use('/user', middleware('profile'))
	app.use('/users', middleware('users'))
}

function middleware(key) {
	return function(req, res, next) {
		req.currentPage = key
		next()
	}
}
