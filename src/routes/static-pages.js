module.exports = function setup(app) {
	app.get('/static-pages', getStaticPages)
	app.post('/static-pages', middleware.auth.requireUserRole('admin'), updateStaticPage)

	app.get('/static-pages/:key', getStaticPage)
	app.put('/static-pages/:key', middleware.auth.requireUserRole('admin'), setStaticPage)
}

var storage = require('../storage')
  , l10n = require('../l10n')
  , middleware = require('../middleware')

function getStaticPage(req, res) {
	var key = req.params.key
	storage.static.get(key).then(function(data) {
		if(!data) {
			return res.send(404)
		}
		res.send(data)
	})
}

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

function setStaticPage(req, res) {
	var body = req.body
	  , key = req.params.key
	if(!body || typeof(body.content) != 'string' || !body.url || !body.url.trim()) {
		return res.send(400, 'content and url required')
	}
	storage.static.update(key, body).then(function(data) {
		res.send(200, data)
	})
}

function updateStaticPage(req, res) {
	var body = req.body
	if(!body.key || !body.key.trim()) {
		return res.send(400, 'key required')
	}
	storage.static.update(body.key, body).then(function(data) {
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
