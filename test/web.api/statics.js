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
			      , key: 'k1'
			      , content: 'abc'
			      }
			    , { url: '/a'
			      , key: 'k2'
			      , content: 'def'
			      }
			    ]
			return expect(client.get('/static-pages').get(1))
				.to.eventually.approximate(data)
		})
	})
	describe('When putting content for a static page', function() {
		var data
		  , response
		  , body
		beforeEach(function() {
			data =
			{ url: '/'
			, content: 'new-content'
			}
			client.options({ headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1') })
			return client.put('/static-pages/k1', { json: data })
				.then(function(args) {
					response = args[0]
					body = args[1]
				})
		})
		it('should return status 200', function() {
			expect(response).to.have.property('statusCode', 200)
		})
		it('should return the new object', function() {
			expect(body).to.approximate(
			{ url: '/'
			, content: 'new-content'
			, key: 'k1'
			})
		})
	})
	describe('When posting content for a static page', function() {
		var data
		beforeEach(function() {
			data =
			{ url: '/'
			, key: 'k1'
			, content: 'new-abc'
			}
		})
		describe('that has no key', function() {
			it('should give status 400', function() {
				var opts =
				    { headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
				    , form: { url: '/', key: '', content: 'ghi' }
				    }
				return expect(client.post('/static-pages', opts).get(0))
					.to.eventually.have.property('statusCode', 400)
			})
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
				    , key: 'k1'
				    , content: 'new-abc'
				    }
				expect(body).to.approximate(expected)
			})
			it('should return the new content (also converted) when getting', function() {
				return expect(client.get('/').get(1))
					.to.eventually.approximate({ content: 'new-abc' })
			})
			it('should also return the content on the admin-page', function() {
				return expect(client.get('/static-pages/k1').get(1))
					.to.eventually.approximate({ content: 'new-abc' })
			})
		})
	})
})
