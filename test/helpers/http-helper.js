module.exports =
{ createBasicHttpAuthHeader: createBasicHttpAuthHeader
, createHelper: createHelper
, parse: parse
}

var request = require('request')
  , util = require('util')
  , btoa = require('btoa')
  , Q = require('q')
  , querystring = require('qs')

function parse(str) {
	if(typeof str != 'string') {
		return str
	}
	try {
		return JSON.parse(str)
	} catch(e) {
		throw new Error('Invalid JSON: ' + str)
	}
}

function createBasicHttpAuthHeader(username, password) {
	return {
		Authorization: util.format(
		  'Basic %s'
		, btoa(util.format('%s:%s', username, password))
		)
	}
}

function createHelper(defaults, options) {
	if(!options) {
		options = {}
	}
	if(!options.headers) {
		options.headers = {}
	}
	if(!hasKey(options.headers, 'accept')) {
		options.headers.accept = 'application/json';
	}
	if(!options.skipAuth) {
		options.headers = merge(options.headers, createBasicHttpAuthHeader(
		  defaults.auth.username
		, defaults.auth.password
		))
	}

	return { get: get
	       , put: put
	       , post: post
	       , head: head
	       , del: del
	       , options: setOptions
	       }

	function setOptions(opts) {
		options = merge(options, opts)
	}

	function merge(a, b) {
		var out = {}
		Object.keys(a || {}).forEach(function(key) {
			out[key] = a[key]
		})
		Object.keys(b || {}).forEach(function(key) {
			var val = b[key]
			// We only want to do this for actual objects
			// Any falsy type is not an actual object (0, '', null, etc)
			if(val
			&& typeof(val) == 'object'
			&& a[key]
			&& typeof(a[key]) == 'object'
			) {
				val = merge(a[key], val)
			}
			out[key] = val
		})
		return out
	}

	function req(method, url, opts, callback) {
		if(!callback && typeof(opts) === 'function') {
			callback = opts
			opts = null
		}
		opts = merge(options, opts)
		if(opts.data) {
			if(method == 'post') {
				opts.form = opts.data
			} else {
				opts.body = objToBody(opts.data)
			}
			delete opts.data
		}
		if(!opts.headers) {
			opts.headers = {}
		}
		if(opts.form) {
			opts.headers['content-type'] = 'application/x-www-form-urlencoded'
			opts.body = querystring.stringify(opts.form)
			delete opts.form
		}
		url = defaults.url + url
		opts.uri = url

		var promise = Q.ninvoke(request, method.toLowerCase(), opts)
			.then(function(args) {
				var response = args[0]
				  , body = args[1]
				if(response.headers['content-type'] && response.headers['content-type'].match(/application\/.*json.*/)) {
					body = parse(body)
				}
				return [ response, body ]
			})
		if(callback) {
			promise.then(function(args) {
				args.unshift(null)
				callback.apply(null, args)
			}, callback)
		}
		return promise
	}

	function get(url, opts, callback) {
		return req('get', url, opts, callback)
	}
	function head(url, opts, callback) {
		return req('head', url, opts, callback)
	}
	function del(url, opts, callback) {
		return req('del', url, opts, callback)
	}
	function put(url, opts, callback) {
		return req('put', url, opts, callback)
	}
	function post(url, opts, callback) {
		return req('post', url, opts, callback)
	}
}

function hasKey(obj, key) {
	return Object.keys(obj)
		.some(function(k) { return k.toLowerCase() == key })
}

function objToBody(obj) {
	if(!obj) {
		return null;
	}
	return Object.keys(obj).map(function(key) {
		var val = obj[key]
		return util.format('%s=%s', key, val)
	}).join('&')
}
