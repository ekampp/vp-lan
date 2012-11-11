require('mocha-as-promised')()
global.chai = require('chai')
global.expect = chai.expect
chai.use(require('chai-as-promised'))
require('./helpers/chai/compare').addMethod(chai)

global.helpers = require('./helpers')
global.settings =
{ server: require('../settings.json')
, auth:
  { username: 'abc'
  , password: 'def'
  }
}
settings.url = 'http://localhost:8081'
settings.server.port = 8081
