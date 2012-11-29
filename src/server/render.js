module.exports =
{ middleware: middleware
, render: render
}

var Q = require('q')
  , format = require('util').format

function middleware(req, res, next) {
	res.render = render.bind(null, req, res, Q.nbind(res.render, res))
	next()
}

function render(req, res, _realRender, view /*, ...args*/) {
	var args = Array.prototype.slice.call(arguments, 2)
	  , callback = args.pop()
	  , options
	if(typeof(callback) != 'function') {
		args.push(callback)
		callback = null
	}
	options = args.pop() || {}

	options.l10n = l10n

	_realRender.call(this, view, options)
		.then(function(html) {
			var data =
			    { body: html
			    , l10n: l10n
			    , minify: minify
			    }

			if(req.currentPage) {
				data['is-' + req.currentPage] = true
			}

			return _realRender.call(this, 'layout', data)
		})
		.nodeify(callback || function(err, html) {
			res.send(html)
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
