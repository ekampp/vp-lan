;(function(obj) {
	obj.create = create

	var createContainer = document.createElement('div')
	function create(html) {
		createContainer.innerHTML = html
		if(createContainer.childNodes.length > 1) {
			var docFrag = document.createDocumentFragment()
			do {
				docFrag.appendChild(createContainer.childNodes[0])
			} while(createContainer.childNodes.length)
			return docFrag
		}
		var e = createContainer.childNodes[0]
		createContainer.removeChild(e)
		return e
	}
})(Element)
