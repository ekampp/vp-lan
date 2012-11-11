describe('web.api/users.js', function() {
	var helper
	helpers.common.setup(this)
	beforeEach(function() {
		helper = helpers.httpHelper.createHelper(settings, { skipAuth: true })
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

	describe('When posting without login', function() {
		var response
		beforeEach(function() {
			var options =
			    { data:
			      { username: 'a'
			      , password: '1'
			      }
			    }
			return helper.post('/users', options).then(function(args) {
				response = args[0]
			})
		})
		it('should return code 200', function() {
			expect(response.statusCode).to.equal(200)
		})
		describe('and getting /user', function() {
			it('should return status 200', function() {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
				return helper.get('/user', { headers: auth }).then(function(args) {
					var resp = args[0]
					expect(resp.statusCode).to.equal(200)
				})
			})
			it('should reject other users', function() {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('b', '2')
				return helper.get('/user', { headers: auth }, function(err, resp, body) {
					expect(resp.statusCode).to.equal(401)
				})
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
		it('should return code 200', function() {
			expect(response.statusCode).to.equal(200)
		})
		it('should have updated the existing user', function() {
			return expect(helpers.storage.users.get('a')).to.be.rejected
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
