describe('web.api/users.js', function() {
	var helper
	helpers.common.setup(this)
	beforeEach(function(	) {
		helper = helpers.httpHelper.createHelper(settings)
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

	function assertStatus(method, url, status) {
		return function(done) {
			helper[method](url, function(err, response, body) {
				expect(response.statusCode).to.equal(status)
				done()
			})
		}
	}
})
