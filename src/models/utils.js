module.exports =
{ defineGetSetters: defineGetSetters
}

function defineGetSetters(obj, properties) {
	properties.forEach(function(property) {
		obj.__defineSetter__(property, function(val) {
			this.set(property, val)
			if(val == null) {
				delete this.attributes[property]
			}
		})
		obj.__defineGetter__(property, function() {
			return this.get(property)
		})
	})
	return obj
}
