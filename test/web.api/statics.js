describe('web.api/statics.js', function() {
	var client

	helpers.common.setup(this)
	beforeEach(function() {
		client = helpers.httpHelper.createHelper(settings, { skipAuth: true })
	})
	describe('When getting `/static-pages`', function() {
		beforeEach(function() {
			helpers.storage.static.add(getStatic('/', 'abc'), getStatic('/a', 'def'))

			function getStatic(url, content) {
				return { url: url, content: content }
			}
		})
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
