describe('unit/event.js', function() {
	var Event = require('../../src/models/Event')
	  , Backbone = require('backbone')
	describe('When calling `stripCalculated()`', function() {
		var event
		beforeEach(function() {
			event = new Event(
			{ seats:
			  [ { a: 1
			    , 'occupant-name': 'a'
			    }
			  , { a: 2
			    }
			  ]
			}).stripCalculated()
		})
		it('should strip calculated values from all seats', function() {
			expect(event.seats[0]).not.to.have.property('occupant-name')
		})
		it('should not return a backbone model', function() {
			expect(event).not.to.be.an.instanceof(Backbone.Model)
		})
	})
})
