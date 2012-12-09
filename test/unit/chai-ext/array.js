describe('unit/chai-ext/array.js', function() {
	var arrayExt = require('../../helpers/chai/array')
	describe('When given a list of properties', function() {
		var props
		beforeEach(function() {
			props = [ 'a', 'b', 'c' ]
		})
		describe('and an array of objects', function() {
			var array
			beforeEach(function() {
				array = [ {}, {d:4}, {e:5} ]
			})
			describe('that contains none of the properties', function() {
				it('should compare to false', function() {
					expect(arrayExt.anyPropertyInAnyObj(array, props))
						.not.to.be.ok
				})
			})
			describe('that contain one of the properties', function() {
				beforeEach(function() {
					array[0].c = 3
				})
				it('should compare to true', function() {
					expect(arrayExt.anyPropertyInAnyObj(array, props))
						.to.be.ok
				})
			})
		})
	})
})
