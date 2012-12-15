module.exports = function setup(app) {
	app.get('/static-pages', getStaticPages)
	app.post('/static-pages', updateStaticPage)
}

var storage = require('../storage')
  , l10n = require('../l10n')

function getStaticPages(req, res) {
	storage.static.getAll().then(function(statics) {
		if(req.accepts('html')) {
			var opts = { pages: statics }
			if(req.query.m == 'ok') {
				opts.message =
				{ status: 'ok'
				, message: l10n.get('admin', 'STATIC PAGE UPDATE OK')
				}
			}
			res.render('admin/static', opts)
			return
		}
		res.send(statics)
	})
}

function updateStaticPage(req, res) {
	var body = req.body
	storage.static.update(body.url, body).then(function(data) {
		if(req.accepts('html')) {
			res.redirect('/static-pages?m=ok')
			return
		}
		res.send(200, data)
	})
}

function prepareStatics(req, statics) {
	return statics.map(function(page) {
		page.current = page.url == req.query.current
	})
}
