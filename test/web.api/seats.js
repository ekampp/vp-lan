describe('web.api/seats.js', function() {
	var client
	  , _ = require('underscore')

	helpers.common.setup(this)
	beforeEach(function() {
		client = helpers.httpHelper.createHelper(settings)
		return helpers.server.setData('basic')
	})

	describe('When getting /seats/:event', function() {
		var data
		beforeEach(function() {
			return client.get('/seats/1').get(1).then(function(d) {
				data = d
			})
		})
		it('should return a list of all seats', function() {
			expect(data).to.approximate(
				[ { id: 1
				  , position: [ 0, 0 ]
				  , occupant: 2
				  , facing: 0
				  }
				, { id: 2
				  , position: [ 0, 1 ]
				  , facing: 0
				  }
				]
			)
		})
	})
	describe('When posting to /seats/:event', function() {
		describe('and the seat is not already taken', function() {
			var response
			  , body
			beforeEach(function() {
				var options = { data: { seat: 2 } }
				return client.post('/seats/1', options)
					.then(function(args) {
						response = args[0]
						body = args[1]
					})
			})
			it('should return code 200', function() {
				expect(response.statusCode).to.equal(200)
			})
			it('should return the now occupied seat', function() {
				var seat = { id: 2, occupant: 1 }
				expect(body).to.approximate(seat)
			})
			describe('and the user decides on a different seat', function() {
				var response
				  , body
				beforeEach(function() {
					var options = { data: { seat: 3 } }
					return client.post('/seats/1', options)
						.then(function(args) {
							response = args[0]
							body = args[1]
						})
				})
				it('should return code 200 and the new seat', function() {
					expect(response.statusCode).to.equal(200)
					expect(body).to.approximate({ id: 3, occupant: 1 })
				})
				it('should no longer occupy the old seat', function() {
					return client.get('/seats/1').get(1)
						.then(function(seats) {
							expect(_(seats).find(function(seat) { return seat.id == 2 }))
								.not.to.contain.keys('occupant')
						})
				})
			})
		})
		describe('and the seat is already taken', function() {
			it('should return code 400', function() {
				var options = { data: { seat: 1 } }
				return expect(client.post('/seats/1', options).get(0).get('statusCode'))
					.to.eventually.equal(400)
			})
		})
	})
})
