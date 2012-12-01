module.exports =
{ middleware: middleware
, render: render
}

var Q = require('q')
  , hogan = require('hogan.js')
  , fs = require('fs')
  , path = require('path')
  , format = require('util').format

  , views

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
	options = args.shift() || {}
	partials = args.shift()

	options.l10n = l10n

	if(partials) {
		partialKeys = Object.keys(partials)
		partials = Q
			.all(partialKeys.map(function(key) {
				return Q.ninvoke(fs, 'readFile', path.join(views, partials[key] + '.mustache'), 'utf8')
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
			var data =
			    { body: templates[1].render(options, templates[2])
			    , l10n: l10n
			    , minify: minify
			    }
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
	return require('../../l10n/da/strings.json')[table][key]
}
