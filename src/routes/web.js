module.exports = function setup(app) {
	app.get('/', render('index'))
	app.get('/signup', render('users/form', { action: 'users', 'btn-text': 'Signup' }))
	app.get('/login', render('users/form', { action: 'login', 'btn-text': 'Login' }))
}

function render(view, data) {
	return function(req, res) {
		res.render(view, data)
	}
}
