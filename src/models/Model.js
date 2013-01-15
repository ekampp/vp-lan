var Backbone = require('backbone')
  , _ = require('underscore')

module.exports = Backbone.Model.extend(
{ toJSON: toJSON
, private: []
, calculated: []
})

function toJSON() {
	var data = _(this.attributes).clone()
	this.private.forEach(function(key) {
		delete this.attributes[key]
	}, this)
	return data
}
