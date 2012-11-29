module.exports =
{ middleware: middleware
, setup: setup
}

function setup(app) {
	app.use('/events', middleware('events'))
}

function middleware(key) {
	return function(req, res, next) {
		req.currentPage = key
		next()
	}
}
