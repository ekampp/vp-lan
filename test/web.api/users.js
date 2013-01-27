describe('web.api/users.js', function() {
	var helper
	  , client
	  , Q = require('q')
	  , request = require('request')

	helpers.common.setup(this)
	beforeEach(function() {
		client = helper = helpers.httpHelper.createHelper(settings, { skipAuth: true })
	})

	describe('When deleting `/user`', function() {
		beforeEach(function() {
			return helpers.server.setData('basic-users')
		})
		describe('and not logged in', function() {
			it('should return 401', function() {
				return expect(client.del('/user').get(0))
					.to.eventually.have.property('statusCode', 401)
			})
		})
		describe('and logged in', function() {
			var response
			  , body
			beforeEach(function() {
				client.options(
				{ headers: helpers.httpHelper.createBasicHttpAuthHeader('b', '2')
				})
				return client.del('/user').then(function(args) {
					response = args[0]
					body = args[1]
				})
			})
			it('should return code 200', function() {
				expect(response).to.have.property('statusCode', 201)
			})
			it('should delete the current user', function() {
				client.options(
				{ headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
				})
				return expect(client.get('/users/b').get(0))
					.to.eventually.have.property('statusCode', 404)
			})
		})
	})

	describe('When setting a duplicate username', function() {
		beforeEach(function() {
			return helpers.storage.users.reset().then(function() {
				return helpers.storage.users
					.add(
					  { username: 'a', password: '1' }
					, { username: 'b', password: '2' }
					)
			})
		})
		describe('by adding via posting to /users', function() {
			it('should reject an exact match', function() {
				var data = { username: 'a', password: '1' }
				return expect(client.post('/users', { form: data }).get(0))
					.to.eventually.have.property('statusCode', 400)
			})
			it('should reject a different casing', function() {
				var data = { username: 'A', password: '1' }
				return expect(client.post('/users', { form: data }).get(0))
					.to.eventually.have.property('statusCode', 400)
			})
		})
		describe('by updating via posting to /users', function() {
			beforeEach(function() {
				var headers = helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
				client.options({ headers: headers })
			})
			it('should reject an exact match', function() {
				var data = { username: 'b', password: '1' }
				return expect(client.post('/users', { form: data }).get(0))
					.to.eventually.have.property('statusCode', 400)
			})
			it('should reject a different casing', function() {
				var data = { username: 'B', password: '1' }
				return expect(client.post('/users', { form: data }).get(0))
					.to.eventually.have.property('statusCode', 400)
			})
		})
		describe('by updating via putting to /user', function() {
			beforeEach(function() {
				var headers = helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
				client.options({ headers: headers })
			})
			it('should reject an exact match', function() {
				var data = { username: 'b', password: '1' }
				return expect(client.put('/user', { form: data }).get(0))
					.to.eventually.have.property('statusCode', 400)
			})
			it('should reject a different casing', function() {
				var data = { username: 'B', password: '1' }
				return expect(client.put('/user', { form: data }).get(0))
					.to.eventually.have.property('statusCode', 400)
			})
		})
	})

	describe('When posting to `/login`', function() {
		beforeEach(function() {
			return helpers.storage.users.reset().then(function() {
				return helpers.storage.users.add({ username: 'a', password: '1' })
			})
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

	describe('While logged in, when getting', function() {
		beforeEach(function() {
			helper.options({
				headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
			})
			return helpers.storage.users.reset().then(function() {
				return Q.all(
					[ helpers.storage.users.add({ username: 'a', password: '1', extra: 'c' })
					, helpers.storage.users.add({ username: 'b', password: '2' })
					]
				)
			})
		})
		describe('from `/users`', function() {
			it('should return 200', assertStatus('get', '/users', 200))
			it('should return a list of users', function() {
				var expected =
				    [ { username: 'a' }
				    , { username: 'b' }
				    ]
				return expect(helper.get('/users').get(1))
					.to.eventually.approximate(expected)
			})
			it('should not return password and mongo-id', function() {
				var expected =
				    [ 'password'
				    , '_id'
				    ]
				return expect(helper.get('/users').get(1))
					.to.eventually.not.have.anyOfThePropertiesInAnyOfTheObjects(expected)
			})
		})
		describe('from `/user`', function() {
			it('should not return password and mongo-id', function() {
				return expect(helper.get('/user').get(1))
					.to.eventually.not.have.property('password')
					.and.not.have.property('_id')
			})
			it('should return 200', assertStatus('get', '/user', 200))
			it('should return the current user', function() {
				var expected =
				    { username: 'a'
				    , extra: 'c'
				    }
				return expect(helper.get('/user').get(1))
					.to.eventually.approximate(expected)
			})
		})
		describe('from `/users/:id`', function() {
			it('should not return password and mongo-id for /user/:id', function() {
				return expect(helper.get('/users/a').get(1))
					.to.eventually.not.have.property('password')
					.and.not.have.property('_id')
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
	})

	describe('When posting to `/users` without login', function() {
		describe('and no username is given', function() {
			it('should return status 400', function() {
				return expect(helper.post('/users', { password: 'abc' }).get(0).get('statusCode'))
					.to.eventually.equal(400)
			})
		})
		describe('and no password is given', function() {
			it('should return status 400', function() {
				return expect(helper.post('/users', { username: 'abc' }).get(0).get('statusCode'))
					.to.eventually.equal(400)
			})
		})
	})
	describe('When posting to `/users` without login', function() {
		var response
		  , cookie
		before(function() {
			cookie = request.jar()
			var options =
			    { data:
			      { username: 'a'
			      , password: '1'
			      }
			    , jar: cookie
			    }
			return helpers.storage.reset().then(function() {
				return helper.post('/users', options).then(function(args) {
					response = args[0]
				})
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
			describe('with the new user', function() {
				var response
				  , body
				before(function() {
					var auth = helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
					return helper.get('/user', { headers: auth })
						.then(function(args) {
							response = args[0]
							body = args[1]
						})
				})
				it('should return status 200 for the new user', function() {
					expect(response.statusCode).to.equal(200)
				})
				it('should set the basic role for the new user', function() {
					expect(body).to.have.property('role', 'user')
				})
			})
			it('should reject non-existing users', function() {
				var auth = helpers.httpHelper.createBasicHttpAuthHeader('b', '2')
				return expect(helper.get('/user', { headers: auth })
					.get(0).get('statusCode')
				).to.eventually.equal(401)
			})
		})
	})
	describe('When updating the role', function() {
		describe('to the current value', function() {
			var data
			beforeEach(function() {
				client.options({ headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1') })
				data = { role: 'admin' }
				return helpers.storage.users.reset().then(function() {
				         return helpers.storage.users.add(
				           { username: 'a'
				           , password: '1'
				           , role: 'admin'
				           }
				         )
				       })
			})
			describe('via put to `/user`', function() {
				var response
				beforeEach(function() {
					return client.put('/user', { json: data }).get(0)
						.then(function(resp) {
							response = resp
						})
				})
				it('should return status 200', function() {
					expect(response.statusCode).to.equal(200)
				})
			})
			describe('via put to `/users/:id`', function() {
				var response
				beforeEach(function() {
					return client.put('/users/a', { json: data }).get(0)
						.then(function(resp) {
							response = resp
						})
				})
				it('should return status 200', function() {
					expect(response.statusCode).to.equal(200)
				})
			})
			describe('via post to `/user`', function() {
				var response
				beforeEach(function() {
					return client.post('/user', { form: data }).get(0)
						.then(function(resp) {
							response = resp
						})
				})
				it('should return status 200', function() {
					expect(response.statusCode).to.equal(200)
				})
			})
			describe('via post to `/users/:id`', function() {
				var response
				beforeEach(function() {
					return client.post('/users/a', { form: data }).get(0)
						.then(function(resp) {
							response = resp
						})
				})
				it('should return status 200', function() {
					expect(response.statusCode).to.equal(200)
				})
			})
		})
		describe('of the current user', function() {
			var data
			beforeEach(function() {
				client.options({ headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1') })
				data = { role: 'user' }
				return helpers.storage.users.reset().then(function() {
				         return helpers.storage.users.add(
				           { username: 'a'
				           , password: '1'
				           , role: 'admin'
				           }
				         )
				       })
			})
			describe('via put to `/user`', function() {
				var response
				beforeEach(function() {
					return client.put('/user', { json: data }).get(0)
						.then(function(resp) {
							response = resp
						})
				})
				it('should return status 400', function() {
					expect(response.statusCode).to.equal(400)
				})
				it('should not update the user', function() {
					return expect(helpers.storage.users.get({ username: 'a' }))
						.to.eventually.have.property('role', 'admin')
				})
			})
			describe('via put to `/users/:id`', function() {
				var response
				beforeEach(function() {
					return client.put('/users/a', { json: data }).get(0)
						.then(function(resp) {
							response = resp
						})
				})
				it('should return status 400', function() {
					expect(response.statusCode).to.equal(400)
				})
				it('should not update the user', function() {
					return expect(helpers.storage.users.get({ username: 'a' }))
						.to.eventually.have.property('role', 'admin')
				})
			})
			describe('via post to `/user`', function() {
				var response
				beforeEach(function() {
					return client.post('/user', { form: data }).get(0)
						.then(function(resp) {
							response = resp
						})
				})
				it('should return status 400', function() {
					expect(response.statusCode).to.equal(400)
				})
				it('should not update the user', function() {
					return expect(helpers.storage.users.get({ username: 'a' }))
						.to.eventually.have.property('role', 'admin')
				})
			})
			describe('via post to `/users/:id`', function() {
				var response
				beforeEach(function() {
					return client.post('/users/a', { form: data }).get(0)
						.then(function(resp) {
							response = resp
						})
				})
				it('should return status 400', function() {
					expect(response.statusCode).to.equal(400)
				})
				it('should not update the user', function() {
					return expect(helpers.storage.users.get({ username: 'a' }))
						.to.eventually.have.property('role', 'admin')
				})
			})
		})
	})
	describe('When updating other user via posting to `/users/:id`', function() {
		beforeEach(function() {
			return helpers.storage.users.reset().then(function() {
				return helpers.storage.users.add(
				  { id: 1
				  , username: 'a'
				  , password: '1'
				  , role: 'admin'
				  }
				, { id: 2
				  , username: 'b'
				  , password: '2'
				  , role: 'user'
				  }
				, { id: 3
				  , username: 'c'
				  , password: '3'
				  , role: 'user'
				  }
				)
			})
		})
		describe('and current role is `user`', function() {
			var response
			beforeEach(function() {
				var data = { username: 'cc' }
				client.options({ headers: helpers.httpHelper.createBasicHttpAuthHeader('b', '2') })
				return client.post('/users/c', { data: data })
					.get(0)
					.then(function(resp) {
						response = resp
					})
			})
			it('should return 403', function() {
				expect(response.statusCode).to.equal(403)
			})
			it('should not update the user', function() {
				var expected =
				    { username: 'a'
				    }
				return expect(helpers.storage.users.get(1))
					.to.eventually.approximate(expected)
			})
		})
		describe('and current role is `admin`', function() {
			var response
			beforeEach(function() {
				var data = { username: 'bc' }
				client.options({ headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1') })
				return client.post('/users/b', { data: data })
					.get(0)
					.then(function(resp) {
						response = resp
					})
			})
			it('should return code 200', function() {
				expect(response.statusCode).to.equal(200)
			})
			it('should update the user', function() {
				var expected = { username: 'bc' }
				return expect(helpers.storage.users.get(2))
					.to.eventually.approximate(expected)
			})
			it('should find the user based on the new username', function() {
				var expected = { id: 2, username: 'bc' }
				return expect(helpers.storage.users.get({ username: 'bc' }))
					.to.eventually.approximate(expected)
			})
		})
	})
	describe('When posting to `/users` while logged in', function() {
		var response
		beforeEach(function() {
			return helpers.server.setData('basic-users')
				.then(function() {
					var opts =
					{ headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
					, data:
					  { username: 'aa'
					  , password: '11'
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
		it('should have updated the user', function() {
			var expected =
			    { username: 'aa'
			    }
			return expect(helpers.storage.users.get(1))
				.to.eventually.approximate(expected)
		})
		describe('and password is empty', function() {
			beforeEach(function() {
				return helpers.server.setData('basic-users')
					.then(function() {
						var opts =
						{ headers: helpers.httpHelper.createBasicHttpAuthHeader('a', '1')
						, data:
						  { username: 'b'
						  , password: ''
						  }
						}
						return helper.post('/users', opts)
					})
			})
			it('should not change the current password', function() {
				return expect(helpers.storage.users.get(1).get('password'))
					.to.eventually.equal('1')
			})
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
