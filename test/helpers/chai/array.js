module.exports =
{ anyPropertyInAnyObj: anyPropertyInAnyObj
, addMethods: addMethods
}

function b() {}

function addMethods(chai) {
	chai.Assertion.addMethod('anyOfThePropertiesInAnyOfTheObjects', function(expected) {
		var actual = this.__flags.object
		  , msg = JSON.stringify(actual)
		this.assert(
		  anyPropertyInAnyObj(actual, expected)
		, 'expected any element in ' + msg + ' to have the following properties: #{exp}'
		, 'expected no elements in ' + msg + ' to have the following properties: #{exp}'
		, expected
		)
	})
}

function anyPropertyInAnyObj(array, props) {
	return array.some(function(elm) {
		return props.some(function(prop) {
			return prop in elm
		})
	})
}
