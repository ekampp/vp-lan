describe('web.api/events.js', function() {
	var client

	helpers.common.setup(this)
	beforeEach(function() {
		client = helpers.httpHelper.createHelper(settings)
		return helpers.server.setData('basic')
	})

	describe('When getting /events', function() {
		it('returns a list of events', function() {
			var expected =
			    [ { id: 1
			      , start: '2012-12-07T19:00:00'
			      , end: '2012-12-09T14:00:00'
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
})
