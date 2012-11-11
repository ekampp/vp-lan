var server = require('./src/server')

if(require.main === module) {
	server.start(require('./settings.json'))
}

module.exports = server
