
function $$(sel, scope) {
	if(typeof(scope) == 'string') {
		scope = $$(scope)
	}
	return (scope||document).querySelector(sel)
}
;(function() {
	$.up = $.closest
	$.ajax.defer(require('q').defer)
	$.ajax.defaults({ accept: 'application/json, text/plain;q=.9' })
	$._select = function(sel, scope) {
		if(typeof(sel) != 'string') {
			return sel.nodeName ? [sel] : sel
		}
		if(typeof(scope) == 'string') {
			scope = $$(scope)
		}
		return (scope||document).querySelectorAll(sel)
	}
	// Initialize page object
	$.page({ dispatch: true, popstate: false, click: false })
})()
