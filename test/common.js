require('mocha-as-promised')()
global.chai = require('chai')
global.expect = chai.expect
chai.use(require('chai-as-promised'))
require('./helpers/chai/compare').addMethod(chai)

global.helpers = require('./helpers')
global.settings =
{ server:
  { web:
    { port: 8081
    }
  , database:
    { name: 'finc-vp-lan-test'
    , host: 'localhost'
    , port: 27017
    }
  }
, url: 'http://localhost:8081'
, auth:
  { username: 'a'
  , password: '1'
  }
}
