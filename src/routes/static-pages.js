module.exports = function setup(app) {
	app.get('/static-pages', getStaticPages)
	app.post('/static-pages', updateStaticPage)
}

var storage = require('../storage')

function getStaticPages(req, res) {
	storage.static.getAll().then(function(statics) {
		if(req.accepts('html')) {
			res.render('admin/static', { pages: statics })
			return
		}
		res.send(statics)
	})
}

function updateStaticPage(req, res) {
	var body = req.body
	storage.static.update(body.url, body)
	res.send(200)
}

function prepareStatics(req, statics) {
	return statics.map(function(page) {
		page.current = page.url == req.query.current
	})
}
