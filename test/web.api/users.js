describe('web.api/users.js', function() {
	var helper
	  , Q = require('q')
	  , request = require('request')

	helpers.common.setup(this)
	beforeEach(function() {
		helper = helpers.httpHelper.createHelper(settings, { skipAuth: true })
	})

	describe('When posting to `/login`', function() {
		beforeEach(function() {
			return helpers.storage.users.add({ username: 'a', password: '1' })
		})
		it('should return 401 when the creds does not match', function() {
			var data = { username: 'b', password: '2' }
			return expect(helper.post('/login', { data: data }).get(0).get('statusCode'))
				.to.eventually.equal(401)
		})
		describe('and the creds match', function() {
			var response
			beforeEach(function() {
				helper.options({ jar: request.jar() })
				return helper.post('/login', { data: { username: 'a', password: '1' }})
					.get(0).then(function(resp) {
						response = resp
					})
			})
			it('should return 302', function() {
				expect(response.statusCode)
					.to.equal(302)
			})
			it('should set a cookie for future requests', function() {
				return expect(helper.get('/user').get(0).get('statusCode'))
					.to.eventually.equal(200)
			})
		})
	})

	describe('When getting without login', function() {
		it('should return 401 for /users', assertStatus('get', '/users', 401))
		it('should return 401 for /user', assertStatus('get', '/user', 401))
		it('should return 401 for /users/:id', assertStatus('get', '/users/1', 401))
	})
	describe('When putting without login', function() {
		it('should return 401 for /user', assertStatus('put', '/user', 401))
		it('should return 401 for /users/:id', assertStatus('put', '/users/1', 401))
	})

	describe('When getting while logged in', function() {
		beforeEach(function() {
			helper.options({
				headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
			})
			return Q.all(
				[ helpers.storage.users.add({ username: 'a', password: '1', extra: 'c' })
				, helpers.storage.users.add({ username: 'b', password: '2' })
				]
			)
		})
		it('should return 200 for /users', assertStatus('get', '/users', 200))
		it('should return a list of users for /users', function() {
			var expected =
			    [ { username: 'a' }
			    , { username: 'b' }
			    ]
			return expect(helper.get('/users').get(1))
				.to.eventually.approximate(expected)
		})
		it('should not return password and mongo-id for /users', function() {
			var expected =
			    [ 'password'
			    , '_id'
			    ]
			return expect(helper.get('/users').get(1))
				.to.eventually.not.have.anyOfThePropertiesInAnyOfTheObjects(expected)
		})
		it('should not return password and mongo-id for /user', function() {
			return expect(helper.get('/user').get(1))
				.to.eventually.not.have.property('password')
				.and.not.have.property('_id')
		})
		it('should not return password and mongo-id for /user/:id', function() {
			return expect(helper.get('/users/a').get(1))
				.to.eventually.not.have.property('password')
				.and.not.have.property('_id')
		})
		it('should return 200 for /user', assertStatus('get', '/user', 200))
		it('should return the current user for /user', function() {
			var expected =
			    { username: 'a'
			    , extra: 'c'
			    }
			return expect(helper.get('/user').get(1))
				.to.eventually.approximate(expected)
		})
		it('should return 200 for /users/:id', assertStatus('get', '/users/b', 200))
		it('should return the specified user for /users/:id', function() {
			var expected =
			    { username: 'b'
			    }
			return expect(helper.get('/users/b').get(1))
				.to.eventually.approximate(expected)
		})
		it('should return 404 for an unknown user at /users/:id',
			assertStatus('get', '/users/c', 404))
	})

	describe('When posting without login and no username is given', function() {
		it('should return status 400', function() {
			return expect(helper.post('/users').get(0).get('statusCode'))
				.to.eventually.equal(400)
		})
	})
	describe('When posting without login', function() {
		var response
		  , cookie
		beforeEach(function() {
			cookie = request.jar()
			var options =
			    { data:
			      { username: 'a'
			      , password: '1'
			      }
			    , jar: cookie
			    }
			return helper.post('/users', options).then(function(args) {
				response = args[0]
			})
		})
		it('should redirect', function() {
			expect(response.statusCode).to.equal(302)
		})
		it('should allow subsequent requests', function() {
			return expect(helper.get('/user', { jar: cookie }).get(0).get('statusCode'))
				.to.eventually.equal(200)
		})
		describe('and getting /user', function() {
			it('should return status 200 for the new user', function() {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
				return expect(helper.get('/user', { headers: auth })
					.get(0).get('statusCode')
				).to.eventually.equal(200)
			})
			it('should set the basic role for the new user', function() {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
				return expect(helper.get('/user', { headers: auth })
					.get(1)
				).to.eventually.have.property('role', 'user')
			})
			it('should reject non-existing users', function() {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('b', '2')
				return expect(helper.get('/user', { headers: auth })
					.get(0).get('statusCode')
				).to.eventually.equal(401)
			})
		})
	})
	describe('When posting while logged in', function() {
		var response
		beforeEach(function() {
			return helpers.server.setData('basic')
				.then(function() {
					var opts =
					{ headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
					, data:
					  { username: 'b'
					  , password: '2'
					  }
					}
					return helper.post('/users', opts)
				})
				.then(function(args) {
					response = args[0]
				})
		})
		it('should return code 302', function() {
			expect(response.statusCode).to.equal(302)
		})
		it('should have updated the existing user', function() {
			return expect(helpers.storage.users.get('a')).to.be.rejected
		})
		it('should have updated the user', function() {
			var expected =
			    { username: 'b'
			    }
			return expect(helpers.storage.users.get(1))
				.to.eventually.approximate(expected)
		})
	})

	function assertStatus(method, url, status) {
		return function() {
			return helper[method](url).then(function(args) {
				var response = args[0]
				expect(response.statusCode).to.equal(status)
			})
		}
	}
})
