require('mocha-as-promised')()
global.chai = require('chai')
global.expect = chai.expect
chai.use(require('chai-as-promised'))
require('./helpers/chai').addMethods(chai)

global.helpers = require('./helpers')
global.settings =
{ server:
  { web:
    { port: 8081
    }
  , database: 'mongodb://localhost:27017/finc-vp-lan-test'
  }
, url: 'http://localhost:8081'
, auth:
  { username: 'a'
  , password: '1'
  }
}
