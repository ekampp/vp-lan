describe('web.api/games.js', function() {
	var client

	helpers.common.setup(this)
	before(function() {
		client = helpers.httpHelper.createHelper(settings, { skipAuth: true })
	})

	describe('When posting without login', function() {
		it('should give status 403', function() {
			return expect(client.post('/games', { form: {} }).get(0))
				.to.eventually.have.property('statusCode', 403)
		})
	})

	describe('When posting to `/games`', function() {
		var response
		  , body
		before(function() {
			var data =
			    { title: 'abc'
			    , text: 'def ghi'
			    , image: 'http://a.bc/d.jpg'
			    }
			  , opts =
			    { headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
			    , form: data
			    }
			return helpers.storage.games.reset()
				.then(function() {
					return helpers.server.setData('basic-users')
				})
				.then(function() {
					return client.post('/games', opts)
				})
				.then(function(args) {
					response = args[0]
					body = args[1]
				})
		})
		it('should return status 200', function() {
			expect(response.statusCode).to.equal(200)
		})
		it('should return the object with an id', function() {
			expect(body).to.have.property('id', 1)
		})
		describe('When asking the server', function() {
			it('should have the game on `/games`', function() {
				return expect(client.get('/games').get(1))
					.to.eventually.approximate([ body ])
			})
			it('should have the game on `/games/:id`', function() {
				return expect(client.get('/games/1').get(1))
					.to.eventually.approximate(body)
			})
		})
	})
})