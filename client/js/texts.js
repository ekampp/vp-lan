;(function() {
	var promises = {}
	  , loadedTexts = {}
	$.ender({ texts: texts })

	function texts(/*...groups*/) {
		var groups = Array.prototype.slice.call(arguments)
		  , promises = require('q').all(groups.map(loadTexts)).then(createTextLoader)
		return promises
	}

	function loadTexts(group) {
		if(!promises[group]) {
			promises[group] = $.ajax('/texts/' + group).promise
		}
		return promises[group].then(function(res) {
			return { group: group, data: res.body }
		})
	}

	function createTextLoader(texts) {
		texts.forEach(function(text) {
			loadedTexts[text.group] = text.data
		})
		return function(group, key) {
			return (loadedTexts[group] && loadedTexts[group][key]) || key
		}
	}
})()
