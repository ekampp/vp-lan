describe('web.api/events.js', function() {
	var client

	helpers.common.setup(this)
	beforeEach(function() {
		client = helpers.httpHelper.createHelper(settings, { skipAuth: true })
		return helpers.server.setData('basic')
	})

	describe('When not logged in', function() {
		describe('and putting to /events/:id', function() {
			it('should return code 401', function() {
				return expect(client.put('/events/1', { json: {} })
					.get(0).get('statusCode')
				).to.eventually.equal(401)
			})
		})
		describe('and posting to /events', function() {
			it('should return code 401', function() {
				return expect(client.post('/events', { json: {} })
					.get(0).get('statusCode')
				).to.eventually.equal(401)
			})
		})
	})

	describe('When putting to /events/:id', function() {
		var response
		  , body
		  , expected
		beforeEach(function() {
			client = helpers.httpHelper.createHelper(settings)
		})
		beforeEach(function() {
			var data =
			    { end: '2012-12-09T16:00+01:00'
			    , seats:
			      [ { position: [ 0, 0 ]
			        , facing: 0
			        }
			      , { position: [ 0, 1 ]
			        , facing: 0
			        }
			      ]
			    }
			expected =
			{ start: '2012-12-07T19:00:00+01:00'
			, end: '2012-12-09T16:00+01:00'
			, seats:
			  [ { position: [ 0, 0 ]
			    , facing: 0
			    }
			  , { position: [ 0, 1 ]
			    , facing: 0
			    }
			  ]
			}
			return client.put('/events/1', { json: data })
				.then(function(args) {
					response = args[0]
					body = args[1]
				})
		})
		it('should return status 200', function() {
			expect(response.statusCode).to.equal(200)
		})
		it('should return the updated event', function() {
			expect(body).to.approximate(expected)
		})
		it('should update the event', function() {
			return expect(client.get('/events/1').get(1))
				.to.eventually.approximate(expected)
		})
	})
	describe('When posting to /events', function() {
		var response
		  , body
		beforeEach(function() {
			client = helpers.httpHelper.createHelper(settings)
		})
		beforeEach(function() {
			var data =
			    { start: '2012-12-05T12:00+01:00'
			    , end: '2012-12-07T15:00+01:00'
			    , seats:
			      [ { position: [ 0, 0 ]
			        , facing: 0
			        }
			      , { position: [ 0, 1 ]
			        , facing: 0
			        }
			      , { position: [ 0, 2 ]
			        , facing: 0
			        }
			      , { position: [ 1, 0 ]
			        , facing: 0
			        }
			      , { position: [ 1, 1 ]
			        , facing: 0
			        }
			      , { position: [ 1, 2 ]
			        , facing: 0
			        }
			      ]
			    }
			return client.post('/events', { data: data })
				.then(function(args) {
					response = args[0]
					body = args[1]
				})
		})
		it('should return code 200', function() {
			expect(response.statusCode).to.equal(200)
		})
		it('should create a new event', function() {
			var expected =
			    { start: '2012-12-05T12:00+01:00'
			    , end: '2012-12-07T15:00+01:00'
			    , seats:
			      [ { position: [ 0, 0 ]
			        , facing: 0
			        }
			      , { position: [ 0, 1 ]
			        , facing: 0
			        }
			      , { position: [ 0, 2 ]
			        , facing: 0
			        }
			      , { position: [ 1, 0 ]
			        , facing: 0
			        }
			      , { position: [ 1, 1 ]
			        , facing: 0
			        }
			      , { position: [ 1, 2 ]
			        , facing: 0
			        }
			      ]
			    }
			expect(body).to.contain.key('id')
			return expect(client.get('/events/' + body.id).get(1))
				.to.eventually.approximate(expected)
		})
	})
	describe('When getting /events', function() {
		it('returns a list of events', function() {
			var expected =
			    [ { id: 1
			      , start: '2012-12-07T19:00:00+01:00'
			      , end: '2012-12-09T14:00:00+01:00'
			      , seats:
			        [ /* Any seats will do. We will test
			           * the actual seats in another file
			           */
			        ]
			      }
			    ]
			return expect(client.get('/events').get(1))
				.to.eventually.approximate(expected)
		})
	})
	describe('When getting /events/:id', function() {
		it('returns a single event', function() {
			var expected =
			    { id: 1
			    , start: '2012-12-07T19:00:00+01:00'
			    , end: '2012-12-09T14:00:00+01:00'
			    , seats:
			      [ /* Any seats will do. We will test
			         * the actual seats in another file
			         */
			      ]
			    }
			return expect(client.get('/events/1').get(1))
				.to.eventually.approximate(expected)
		})
	})
})
