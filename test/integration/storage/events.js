describe('integration/storage/events.js', function() {
	var storage = require('../../../src/storage')
	  , db = require('../../../src/storage/db')

	helpers.common.setup(this)
	beforeEach(function() {
		return storage.events.reset()
	})
	describe('When adding a new event', function() {
		describe('and some events were already in the database', function() {
			beforeEach(function() {
				return db.collection('events')
					.invoke('insert',
						[ { id: 1 }
						, { id: 3 }
						]
					)
			})
			it('should set the id correctly', function() {
				return expect(storage.events.add({ name: 'inserted' }))
					.to.eventually.approximate({id: 4})
			})
		})
	})
})
