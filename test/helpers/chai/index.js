module.exports =
{ addMethods: addMethods
}

var compare = require('./compare')
  , array = require('./array')

function addMethods(chai) {
	array.addMethods(chai)
	compare.addMethod(chai)
}
