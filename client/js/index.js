
function $$(sel, scope) {
	if(typeof(scope) == 'string') {
		scope = $$(scope)
	}
	return (scope||document).querySelector(sel)
}
;(function() {
	$.ajax.defer(require('q').defer)
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
	$.page()
	$.page.stop()
})()
