describe('web.api/seats.js', function() {
	var client

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
})
