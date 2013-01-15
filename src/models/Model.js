var Backbone = require('backbone')
  , _ = require('underscore')

module.exports = Backbone.Model.extend(
{ toJSON: toJSON
, stripCalculated: stripCalculated
, private: []
, calculated: []
})

function toJSON() {
	var data = _(this.attributes).clone()
	delete data.private
	delete data.calculated
	this.private.forEach(function(key) {
		delete data[key]
	})
	return data
}

function stripCalculated() {
	var data = _(this.attributes).clone()
	delete data._id
	delete data.private
	delete data.calculated
	this.calculated.forEach(function(key) {
		delete data[key]
	})
	Object.keys(data).forEach(function(key) {
		var val = data[key]
		if(val instanceof Backbone.Collection) {
			data[key] = val.map(function(m) {
				return m.stripCalculated ? m.stripCalculated() : m
			})
		}
		if(val instanceof Backbone.Model) {
			data[key] = val.stripCalculated ? val.stripCalculated() : val
		}
	})
	return data
}
