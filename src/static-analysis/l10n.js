module.exports =
{ findRefs: findRefs
, unusedStrings: unusedStrings
, unmetRefs: unmetRefs
}

var glob = require('glob')
  , path = require('path')
  , fs = require('fs')
  , format = require('util').format
  , Q = require('q')
  , _ = require('underscore')

  , refsPromise

function unmetRefs(dir, l10n) {
	return findRefs(dir)
		.then(function(refs) {
			return groupByKeys(refs)
				.filter(function(ref) {
					return l10n(ref.table, ref.key) === ref.key
				})
		})
}

function unusedStrings(dir, l10n) {
}

function findRefs(dir) {
	if(refsPromise) {
		return refsPromise
	}
	refsPromise = Q.nfcall(glob, '**/*.mustache', { cwd: dir })
		.then(function(files) {
			var promises = files
				.map(function(file) {
					return path.join(dir, file)
				})
				.map(readFile)
			return Q.all(promises)
		})
	return refsPromise
}

function groupByKeys(refs) {
	var keys = {}
	refs.forEach(function(ref) {
		ref.matches.forEach(function(match) {
			var uniq = format('[%s][%s]', match.table, match.key)
			  , arr = keys[uniq] || _({ files: [] }).extend(match)
			arr.files.push(ref.file)
			keys[uniq] = arr
		})
	})
	return Object.keys(keys)
		.map(function(key) {
			var ref = keys[key]
			ref.files = _.uniq(ref.files, true)
			return ref
		})
}

function readFile(filename) {
	return Q.ninvoke(fs, 'readFile', filename, 'utf8')
		.then(function(content) {
			return { file: filename
			       , content: content
			       , matches: matches(content)
			       }
		})
}

function matches(content) {
	var regex = /\{\{#m?l10n\}\}(.*?)\{\{\/m?l10n\}\}/g
	  , matches = content.match(regex)
	if(!matches) {
		return []
	}
	return matches
		.map(function(match) {
			return match.replace(regex, '$1')
		})
		.map(function(match) {
			var vars = match
			    .split(',')
			    .map(function(s) { return s.trim() })
			  , table = vars[0]
			  , key = vars[1]
			return { table: table
			       , key: key
			       }
		})
}
