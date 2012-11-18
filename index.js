var server = require('./src/server')

if(require.main === module) {
	var settings =
	    { port: process.env.PORT || 8080
	    }

	server.start(settings)
	require('./test/helpers/server').setData('basic')
}

module.exports = server
