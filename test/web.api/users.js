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
		beforeEach(function(done) {
			var options =
			    { data:
			      { username: 'a'
			      , password: '1'
			      }
			    }
			helper.post('/users', options, function(err, resp, body) {
				response = resp
				done()
			})
		})
		it('should return code 200', function() {
			expect(response.statusCode).to.equal(200)
		})
		describe('and getting /user', function() {
			it('should return status 200', function(done) {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
				helper.get('/user', { headers: auth }, function(err, resp, body) {
					expect(resp.statusCode).to.equal(200)
					done()
				})
			})
			it('should reject other users', function(done) {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('b', '2')
				helper.get('/user', { headers: auth }, function(err, resp, body) {
					expect(resp.statusCode).to.equal(401)
					done()
				})
			})
		})
	})

	function assertStatus(method, url, status) {
		return function(done) {
			helper[method](url, function(err, response, body) {
				expect(response.statusCode).to.equal(status)
				done()
			})
		}
	}
})
