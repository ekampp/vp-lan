module.exports =
{ middleware: middleware
, render: render
}

var Q = require('q')
  , hogan = require('hogan.js')
  , fs = require('fs')
  , path = require('path')
  , format = require('util').format
  , _ = require('underscore')

  , views
  , markdown = new (require('showdown').converter)()
  , storage = require('../storage')

function middleware(app) {
	views = app.get('views')
	return function(req, res, next) {
		res.render = render.bind(null, req, res)
		next()
	}
}

function render(req, res, view /*, ...args*/) {
	var args = Array.prototype.slice.call(arguments, 3)
	  , callback = args.pop()
	  , options
	  , partials
	  , partialKeys
	if(typeof(callback) != 'function') {
		args.push(callback)
		callback = null
	}
	options = extendData(args.shift() || {})
	partials = args.shift()

	if(partials) {
		partialKeys = Object.keys(partials)
		partials = Q
			.all(partialKeys.map(function(key) {
				return Q.ninvoke
				         (fs
				       , 'readFile'
				       , path.join(views, partials[key] + '.mustache')
				       , 'utf8'
				       )
			}))
			.then(function(p) {
				var obj = {}
				partialKeys.forEach(function(key, idx) {
					obj[key] = p[idx]
				})
				return obj
			})
	} else {
		partials = Q.resolve()
	}

	Q.all(
	[ Q.ninvoke(fs, 'readFile', path.join(views, 'layout.mustache'), 'utf8')
	, Q.ninvoke(fs, 'readFile', path.join(views, view + '.mustache'), 'utf8')
	, partials
	, storage.static.getAll()
	])
		.then(function(files) {
			return files
				.filter(function(content) { return !!content })
				.map(function(content) {
					if(typeof(content) !== 'string') {
						return content
					}
					return hogan.compile(content)
				})
		})
		.then(function(templates) {
			var statics = templates.pop()
			  , data =
			    { body: templates[1].render(options, extendPartials(templates[2]))
			    , minify: minify
			    , 'user-json': req.user ? JSON.stringify(req.user) : 'null'
			    , 'static-menu-text': function(menu) {
			        return _(statics).find(function(item) {
			          return item.url == menu
			        }).name
			      }
			    }
			extendData(data)
			if(req.currentPage) {
				data['is-' + req.currentPage] = true
			}
			return templates[0].render(data)
		})
		.then(function(rendered) {
			if(callback) {
				return callback(null, rendered)
			}
			return res.send(rendered)
		})
		.done()

	function extendData(data) {
		data.l10n = l10n
		data.ml10n = ml10n
		if(req.finc.msg && req.finc.status) {
			data.message =
			{ status: req.finc.status
			, message: req.finc.msg
			}
		}
		data['is-logged-in'] = !!req.user
		data['is-admin'] = req.user && req.user.conformsToRole('admin')
		return data
	}
}

function extendPartials(partials) {
	partials = partials || {}
	partials.login = fs.readFileSync(path.join(views, 'partials/login.mustache'), 'utf8')
	return partials
}

function minify(files) {
	var isCSS = /\.css$/
	  , isJS = /\.js$/
	return files
		.split('\n')
		.map(function(file) {
			if(isCSS.test(file)) {
				return format('<link href=%s rel=stylesheet>', file)
			}
			if(isJS.test(file)) {
				return format('<script src=%s></script>', file)
			}
			return ''
		})
		.join('\n')
}

function l10n(str) {
	// let {} = str.split(
	var tokenIdx = str.indexOf(',')
	  , table = str.substr(0, tokenIdx).trim()
	  , key = str.substr(tokenIdx + 1).trim()
	  , strings = require('../../l10n/da/strings.json')
	if(!strings[table] || !strings[table][key]) {
		return key
	}
	return strings[table][key]
}

function ml10n(str) {
	return markdown.makeHtml(l10n(str))
}
