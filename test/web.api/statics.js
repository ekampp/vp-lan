describe('web.api/statics.js', function() {
	var client
	  , Q = require('q')

	helpers.common.setup(this)
	beforeEach(function() {
		client = helpers.httpHelper.createHelper(settings, { skipAuth: true })
		return Q.all(
		       [ helpers.server.setData('basic-static')
		       , helpers.server.setData('basic-users')
		       ])
	})
	describe('When getting `/static-pages`', function() {
		it('should return a list of pages', function() {
			var data =
			    [ { url: '/'
			      , content: 'abc'
			      }
			    , { url: '/a'
			      , content: 'def'
			      }
			    ]
			return expect(client.get('/static-pages').get(1))
				.to.eventually.approximate(data)
		})
	})
	describe('When posting content for a static page', function() {
		var data
		beforeEach(function() {
			data =
			{ url: '/'
			, content: 'abc'
			}
		})
		describe('as a user', function() {
			beforeEach(function() {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('b', '2')
				client.options({ headers: auth })
			})
			it('should return status 401', function() {
				return expect(client.post('/static-pages', { form: data }).get(0))
					.to.eventually.have.property('statusCode', 403)
			})
		})
		describe('as an admin', function() {
			var response
			  , body
			beforeEach(function() {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
				client.options({ headers: auth })
				return client.post('/static-pages', { form: data })
					.then(function(args) {
						response = args[0]
						body = args[1]
					})
			})
			it('should return status 200', function() {
				expect(response).to.have.property('statusCode', 200)
			})
			it('should return the object', function() {
				var expected =
				    { url: '/'
				    , content: 'abc'
				    }
				expect(body).to.approximate(expected)
			})
			it('should return the new content (also converted) when getting', function() {
				return expect(client.get('/').get(1))
					.to.eventually.approximate({ content: 'abc' })
			})
		})
	})
})
