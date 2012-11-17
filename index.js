var server = require('./src/server')

if(require.main === module) {
	server.start(require('./settings.json'))
	require('./test/helpers/server').setData('basic')
}

module.exports = server
