module.exports =
{ middleware: middleware
, render: render
}

var Q = require('q')

function middleware(req, res, next) {
	res.render = render.bind(res, Q.nbind(res.render, res))
	next()
}

function render(_realRender /*, ...args*/) {
	var args = Array.prototype.slice.call(arguments, 1)
	  , res = this
	  , callback = args.pop()
	if(typeof(callback) != 'function') {
		args.push(callback)
		callback = null
	}
	_realRender.apply(this, args)
		.then(function(html) {
			return _realRender.call(this, 'layout', { body: html })
		})
		.nodeify(callback || function(err, html) {
			res.send(html)
		})
}
