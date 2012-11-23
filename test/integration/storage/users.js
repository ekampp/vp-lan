describe('integration/storage/users.js', function() {
	var storage = require('../../../src/storage')

	helpers.common.setup(this)
	beforeEach(function() {
		return storage.reset()
	})
	describe('When creating multiple users', function() {
		it('should be possible to mix and match between including ids', function() {
			return expect(
				storage.users.add({ id: 1, username: 'a', password: 'aa' })
				.then(function() {
					return storage.users.add({ username: 'b', password: 'bb' })
				})
				.then(storage.users.getAll)
			).to.eventually.approximate(
				[ { id: 1, username: 'a' }
				, { id: 2, username: 'b' }
				]
			)
		})
		it('should be possible to pass multiple users as params', function() {
			return expect(
				storage.users.add(
					  { id: 1, username: 'a', password: 'aa' }
					, { username: 'b', password: 'bb' }
				)
				.then(storage.users.getAll)
			).to.eventually.approximate(
				[ { id: 1, username: 'a' }
				, { id: 2, username: 'b' }
				]
			)
		})
	})
	describe('When creating a single user', function() {
		it('should be possible to get that user by id', function() {
			var user =
			    { id: 1
			    , username: 'a'
			    , password: 'b'
			    }
			return expect(
				storage.users.add(user).then(function() {
					return storage.users.get(1)
				})
			).to.eventually.approximate(
				{ id: 1
				, username: 'a'
				})
		})
		it('should be possible to get that user by username', function() {
			var user =
			    { id: 1
			    , username: 'a'
			    , password: 'b'
			    }
			return expect(
				storage.users.add(user).then(function() {
					return storage.users.get({ username: 'a' })
				})
			).to.eventually.approximate(
				{ id: 1
				, username: 'a'
				}
			)
		})
		it('should automatically attach an id if none are given', function() {
			var user =
			    { username: 'a'
			    , password: 'b'
			    }
			return expect(
				storage.users.add(user).then(function() {
					return storage.users.get({ username: 'a' })
				})
			).to.eventually.approximate(
				{ id: 1
				, username: 'a'
				}
			)
		})
	})
})
