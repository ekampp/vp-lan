module.exports =
{ createBasicHttpAuthHeader: createBasicHttpAuthHeader
, createHelper: createHelper
, setupDatabase: setupDatabase
, parse: parse
}

var request = require('request')
  , util = require('util')
  , btoa = require('btoa')

function parse(str) {
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
	if(!options.skipAuth) {
		options.headers = createBasicHttpAuthHeader(
		  defaults.auth.username
		, defaults.auth.password
		)
	}

	function statusError(callback, url) {
		return function statusError(err, response, body) {
			if(err) return callback(err)
			if(response.headers['content-type'].match(/application\/.*json.*/)) {
				try {
					body = parse(body)
				} catch(e) {
					return callback(e, response, body)
				}
			}
			callback(err, response, body)
		}
	}

	return { get: get
	       , put: put
	       , post: post
	       , head: head
	       , del: del
	       }

	function merge(a, b) {
		var out = {}
		Object.keys(a || {}).forEach(function(key) {
			out[key] = a[key]
		})
		Object.keys(b || {}).forEach(function(key) {
			out[key] = b[key]
		})
		return out
	}

	function get(url, opts, callback) {
		if(!callback) {
			callback = opts
			opts = null
		}
		opts = merge(options, opts)
		url = defaults.url + url
		opts.uri = url
		return request.get(opts, statusError(callback, url))
	}

	function head(url, opts, callback) {
		if(!callback) {
			callback = opts
			opts = null
		}
		opts = merge(options, opts)
		url = defaults.url + url
		opts.uri = url
		return request.head(opts, statusError(callback, url))
	}

	function del(url, opts, callback) {
		if(!callback) {
			callback = opts
			opts = null
		}
		opts = merge(options, opts)
		url = defaults.url + url
		opts.uri = url
		return request.del(opts, statusError(callback, url))
	}

	function put(url, opts, callback) {
		if(!callback) {
			callback = opts
			opts = null
		}
		url = defaults.url + url
		opts = merge(options, opts)
		opts.body = objToBody(opts.data)
		delete opts.data
		opts.uri = url
		return request.put(opts, statusError(callback, url))
	}
	function post(url, opts, callback) {
		if(!callback) {
			callback = opts
			opts = null
		}
		url = defaults.url + url
		opts = merge(options, opts)
		opts.form = opts.data
		delete opts.data
		opts.uri = url
		return request.post(opts, statusError(callback, url))
	}
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

function setupDatabase(db, done) {
	var options =
	    { headers: createBasicHttpAuthHeader(settings.auth.username, settings.auth.password)
	    }
	request.get(
	  settings.url+'/debug/setup/?action=' + db
	, options
	, onFetch
	)

	function onFetch(err, response, body) {
		if(response && response.statusCode >= 300) {
			return done(new Error(util.format('Unexpected HTTP response (%s)', response.statusCode)))
		}
		done(err)
	}
}
