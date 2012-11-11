module.exports = function setup(app) {
	app.get('/', function(req, res) {
		res.render('index')
	})
}
